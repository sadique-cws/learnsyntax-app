<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationJob;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Razorpay\Api\Api;

class WorkshopEnrollmentController extends Controller
{
    protected Api $razorpay;

    public function __construct()
    {
        $this->razorpay = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));
    }

    public function index()
    {
        $workshops = Course::query()
            ->ofType('workshop')
            ->where('is_active', true)
            ->with(['batches' => function ($query) {
                $query->orderBy('starts_at')->orderBy('start_date');
            }])
            ->withCount([
                'enrollments as paid_enrollments_count' => function ($query) {
                    $query->where('status', 'paid');
                },
                'batches',
            ])
            ->latest()
            ->get();

        return inertia('workshops/index', [
            'workshops' => $workshops,
        ]);
    }

    public function show(Course $workshop)
    {
        abort_unless($workshop->type === 'workshop', 404);

        $user = auth()->user();
        $enrollment = null;

        if ($user) {
            $enrollment = Enrollment::where('user_id', $user->id)
                ->where('course_id', $workshop->id)
                ->with('batch')
                ->first();
        }

        $displayBatch = $workshop->batches->first();
        $deadline = $enrollment?->batch?->starts_at?->copy()->subHour() ?? $displayBatch?->starts_at?->copy()->subHour();
        $razorpayOrder = null;

        if ($user && $enrollment && $enrollment->status === 'pending' && $workshop->price > 0) {
            $razorpayOrder = $this->createRazorpayOrder((float) $workshop->price, 'wk_'.$workshop->id.'_'.$enrollment->id);
        }

        return inertia('workshops/show', [
            'workshop' => $workshop->load(['teacher.user', 'batches' => function ($query) {
                $query->orderBy('starts_at')->orderBy('start_date')->withCount(['enrollments as paid_enrollments_count' => function ($paidQuery) {
                    $paidQuery->where('status', 'paid');
                }]);
            }]),
            'enrollment' => $enrollment,
            'is_enrolled' => $enrollment?->status === 'paid',
            'can_enroll' => true,
            'enrollment_deadline' => $deadline?->toDateTimeString(),
            'razorpay_key' => config('services.razorpay.key'),
            'razorpay_order' => $razorpayOrder,
        ]);
    }

    public function store(Request $request, Course $workshop)
    {
        $user = auth()->user();
        abort_unless($workshop->type === 'workshop', 404);

        $request->validate([
            'batch_id' => ['required', Rule::exists('batches', 'id')->where('course_id', $workshop->id)],
        ]);

        $batch = $workshop->batches()->findOrFail($request->batch_id);

        $deadline = $batch->starts_at?->copy()->subHour();

        if ($deadline && now()->greaterThan($deadline)) {
            return back()->with('error', 'Batch enrollment closes one hour before the start time.');
        }

        if ($batch->capacity && $batch->enrollments()->where('status', 'paid')->count() >= $batch->capacity) {
            return back()->with('error', 'This batch is fully booked.');
        }

        $existing = Enrollment::where('user_id', $user->id)
            ->where('course_id', $workshop->id)
            ->first();

        if ($existing) {
            return redirect()->route('student.workshops.show', ['workshop' => $workshop->slug])->with('success', $existing->status === 'paid' ? 'You are already enrolled in this workshop.' : 'Complete your payment to confirm your workshop enrollment.');
        }

        if ((float) $workshop->price <= 0) {
            $enrollment = Enrollment::create([
                'course_id' => $workshop->id,
                'batch_id' => $batch->id,
                'user_id' => $user->id,
                'status' => 'paid',
            ]);

            Payment::create([
                'enrollment_id' => $enrollment->id,
                'amount' => 0,
                'currency' => 'INR',
                'status' => 'completed',
                'payment_method' => 'free',
                'transaction_id' => 'FREE-'.$enrollment->id,
            ]);

            $this->sendWorkshopNotifications($enrollment);

            return redirect()->route('student.workshops.show', ['workshop' => $workshop->slug])->with('success', 'You are enrolled in the workshop successfully.');
        }

        Enrollment::create([
            'course_id' => $workshop->id,
            'batch_id' => $batch->id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        return redirect()->route('student.workshops.show', ['workshop' => $workshop->slug])->with('success', 'Batch added to checkout. Please complete the payment to confirm your enrollment.');
    }

    public function processPayment(Request $request, Course $workshop)
    {
        $request->validate([
            'razorpay_payment_id' => 'required|string',
            'razorpay_order_id' => 'required|string',
            'razorpay_signature' => 'required|string',
            'batch_id' => 'required|exists:batches,id',
            'gst_number' => 'nullable|string|max:20',
        ]);

        $enrollment = Enrollment::where('user_id', auth()->id())
            ->where('course_id', $workshop->id)
            ->where('batch_id', $request->batch_id)
            ->firstOrFail();

        if ($enrollment->status === 'paid') {
            return redirect()->route('student.workshops.show', ['workshop' => $workshop->slug])->with('success', 'Your workshop enrollment is already confirmed.');
        }

        if (! $this->shouldSkipRazorpayVerification()) {
            try {
                $this->razorpay->utility->verifyPaymentSignature([
                    'razorpay_order_id' => $request->razorpay_order_id,
                    'razorpay_payment_id' => $request->razorpay_payment_id,
                    'razorpay_signature' => $request->razorpay_signature,
                ]);
            } catch (\Exception $e) {
                return back()->with('error', 'Payment verification failed: '.$e->getMessage());
            }
        }

        $enrollment->update(['status' => 'paid']);
        $enrollment->user->update(['is_student' => true]);

        $payment = Payment::create([
            'enrollment_id' => $enrollment->id,
            'amount' => $workshop->price,
            'status' => 'completed',
            'razorpay_order_id' => $request->razorpay_order_id,
            'razorpay_payment_id' => $request->razorpay_payment_id,
            'currency' => 'INR',
            'payment_method' => 'razorpay',
            'transaction_id' => $request->razorpay_payment_id,
        ]);

        $taxRate = 0.18;
        $taxableAmount = round($payment->amount / (1 + $taxRate), 2);
        $totalGst = round($payment->amount - $taxableAmount, 2);
        $halfGst = round($totalGst / 2, 2);

        Invoice::create([
            'payment_id' => $payment->id,
            'invoice_number' => 'INV-'.date('Ymd').'-'.$payment->id,
            'issued_at' => now(),
            'amount' => $payment->amount,
            'taxable_amount' => $taxableAmount,
            'cgst' => $halfGst,
            'sgst' => $halfGst,
            'igst' => 0,
            'gst_number' => $request->gst_number,
            'sac_code' => '9992',
            'status' => 'paid',
        ]);

        $teacher = $workshop->teacher;

        if ($teacher) {
            $commissionAmount = ($workshop->price * $teacher->commission_percent) / 100;

            WalletTransaction::create([
                'teacher_id' => $teacher->id,
                'amount' => $commissionAmount,
                'type' => 'credit',
                'description' => 'Commission from workshop enrollment: '.$workshop->title,
            ]);

            $teacher->increment('wallet_balance', $commissionAmount);
        }

        $this->sendWorkshopNotifications($enrollment);

        return redirect()->route('student.workshops.show', ['workshop' => $workshop->slug])->with('success', 'Workshop payment completed successfully.');
    }

    private function sendWorkshopNotifications(Enrollment $enrollment): void
    {
        $course = $enrollment->course()->with('teacher.user')->first() ?? $enrollment->course;

        SendNotificationJob::dispatch(
            $enrollment->user,
            ['mail', 'database'],
            'Workshop Enrolled Successfully!',
            'emails.course-purchase',
            [
                'name' => $enrollment->user->name,
                'course_name' => $course->title,
                'price' => '₹'.$course->price,
                'body' => 'Thank you for enrolling in '.$course->title.'. Your workshop seat is confirmed.',
                'link' => route('student.academic.workshops'),
                'button_text' => 'View My Workshops',
            ]
        )->afterCommit();

        $teacher = $course->teacher;

        if ($teacher && $teacher->user) {
            SendNotificationJob::dispatch(
                $teacher->user,
                ['mail', 'database'],
                'New Workshop Enrollment',
                'emails.notification',
                [
                    'body' => $enrollment->user->name.' enrolled in '.$course->title.'.',
                    'link' => route('teacher.workshops.show', $course),
                    'button_text' => 'View Workshop',
                ]
            )->afterCommit();
        }
    }

    private function createRazorpayOrder(float $amount, string $receipt): array
    {
        if ($this->shouldSkipRazorpayVerification()) {
            return [
                'id' => 'order_'.Str::random(16),
                'amount' => (int) round($amount * 100),
                'currency' => 'INR',
                'receipt' => $receipt,
            ];
        }

        return $this->razorpay->order->create([
            'receipt' => $receipt,
            'amount' => (int) round($amount * 100),
            'currency' => 'INR',
        ])->toArray();
    }

    private function shouldSkipRazorpayVerification(): bool
    {
        return app()->environment('testing')
            || blank(config('services.razorpay.key'))
            || blank(config('services.razorpay.secret'));
    }
}
