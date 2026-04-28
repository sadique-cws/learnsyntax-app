<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\Invoice;

class EnrollmentController extends Controller
{
    protected $razorpay;

    public function __construct()
    {
        $this->razorpay = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));
    }

    public function store(\App\Models\Course $course)
    {
        $user = auth()->user();
        
        $existing = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();
            
        if ($existing) {
            if ($existing->status === 'paid' && !$existing->batch_id) {
                return redirect()->route('student.enrollments.batch', $existing);
            }
            return redirect()->route('student.enrollments.show', $existing);
        }

        $enrollment = Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'pending',
        ]);

        return redirect()->route('student.enrollments.show', $enrollment);
    }

    public function show(Enrollment $enrollment)
    {
        if ($enrollment->status === 'paid') {
            if (!$enrollment->batch_id) {
                return redirect()->route('student.enrollments.batch', $enrollment);
            }
            return redirect()->route('dashboard');
        }

        // Create Razorpay Order
        $orderData = [
            'receipt'         => 'rcpt_' . $enrollment->id,
            'amount'          => $enrollment->course->price * 100, // in paise
            'currency'        => 'INR',
        ];

        $razorpayOrder = $this->razorpay->order->create($orderData);

        return inertia('enrollments/show', [
            'enrollment' => $enrollment->load(['course']),
            'razorpay_key' => config('services.razorpay.key'),
            'razorpay_order' => $razorpayOrder->toArray(),
        ]);
    }

    public function processPayment(Request $request, Enrollment $enrollment)
    {
        $request->validate([
            'razorpay_payment_id' => 'required',
            'razorpay_order_id' => 'required',
            'razorpay_signature' => 'required',
        ]);

        // Verify signature
        try {
            $attributes = [
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature
            ];
            $this->razorpay->utility->verifyPaymentSignature($attributes);
        } catch (\Exception $e) {
            return back()->with('error', 'Payment verification failed: ' . $e->getMessage());
        }

        $enrollment->update(['status' => 'paid']);

        $payment = Payment::create([
            'enrollment_id' => $enrollment->id,
            'amount' => $enrollment->course->price,
            'status' => 'completed',
            'razorpay_order_id' => $request->razorpay_order_id,
            'razorpay_payment_id' => $request->razorpay_payment_id,
            'currency' => 'INR',
        ]);

        // Calculate GST (18%)
        $totalAmount = $payment->amount;
        $taxRate = 0.18;
        $taxableAmount = round($totalAmount / (1 + $taxRate), 2);
        $totalGst = $totalAmount - $taxableAmount;
        $halfGst = round($totalGst / 2, 2);

        Invoice::create([
            'payment_id' => $payment->id,
            'invoice_number' => 'INV-' . date('Ymd') . '-' . $payment->id,
            'issued_at' => now(),
            'amount' => $totalAmount,
            'taxable_amount' => $taxableAmount,
            'cgst' => $halfGst,
            'sgst' => $halfGst,
            'igst' => 0,
            'gst_number' => $request->gst_number, // Capture GSTIN if provided
        ]);

        return redirect()->route('student.enrollments.batch', $enrollment);
    }

    public function batchSelection(Enrollment $enrollment)
    {
        if ($enrollment->status !== 'paid') {
            return redirect()->route('student.enrollments.show', $enrollment);
        }

        if ($enrollment->batch_id) {
            return redirect()->route('dashboard');
        }

        return inertia('enrollments/batch', [
            'enrollment' => $enrollment->load(['course.batches']),
        ]);
    }

    public function selectBatch(Request $request, Enrollment $enrollment)
    {
        $request->validate([
            'batch_id' => 'required|exists:batches,id',
        ]);

        $enrollment->update([
            'batch_id' => $request->batch_id,
        ]);

        return redirect()->route('dashboard')->with('success', 'Batch selected successfully! You can now access your course.');
    }
}
