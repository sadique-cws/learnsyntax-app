<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        $students = User::where('is_admin', false)
            ->with(['enrollments.course', 'enrollments.batch'])
            ->get();

        return inertia('admin/students/index', [
            'students' => $students,
        ]);
    }

    public function show(User $student)
    {
        $student->load([
            'enrollments.course',
            'enrollments.batch',
            'enrollments.payment.invoice',
            'enrollments.certificate',
            'examAttempts.exam',
            'assignmentSubmissions.assignment',
        ]);

        // Appending computed attributes for the view
        foreach ($student->enrollments as $enrollment) {
            $enrollment->append(['assignment_average', 'exam_score', 'overall_average']);
        }

        return inertia('admin/students/show', [
            'student' => $student,
            'available_batches' => Batch::with('course')->get()->groupBy('course_id'),
            'all_courses' => Course::where('is_active', true)->with('batches')->get(),
            'stats' => [
                'total_paid' => $student->enrollments->sum(fn ($e) => $e->payment ? $e->payment->amount : 0),
                'course_count' => $student->enrollments->count(),
                'avg_performance' => $student->enrollments->avg('overall_average') ?: 0,
            ],
        ]);
    }

    public function updateBatch(Request $request, Enrollment $enrollment)
    {
        $request->validate([
            'batch_id' => 'required|exists:batches,id',
        ]);

        $enrollment->update([
            'batch_id' => $request->batch_id,
        ]);

        return back()->with('success', 'Student batch updated successfully.');
    }

    public function generateCertificate(Enrollment $enrollment)
    {
        if (! $enrollment->isEligibleForCertificate()) {
            return back()->with('error', 'Student is not yet eligible for a certificate. Requires 60% average.');
        }

        Certificate::firstOrCreate(
            ['enrollment_id' => $enrollment->id],
            [
                'certificate_number' => 'LS-'.strtoupper(str()->random(8)),
                'issued_at' => now(),
            ]
        );

        return back()->with('success', 'Certificate generated successfully!');
    }

    public function update(Request $request, User $student)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$student->id,
            'phone' => 'nullable|string|max:20',
            'qualification' => 'nullable|string|max:255',
            'college' => 'nullable|string|max:255',
        ]);

        $student->update($request->all());

        return back()->with('success', 'Student profile updated successfully.');
    }

    public function manualEnroll(Request $request, User $student)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'batch_id' => 'required|exists:batches,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:cash,bank_transfer,other',
            'transaction_id' => 'nullable|string',
        ]);

        // Check if already enrolled
        if ($student->enrollments()->where('course_id', $request->course_id)->exists()) {
            return back()->with('error', 'Student is already enrolled in this course.');
        }

        $enrollment = $student->enrollments()->create([
            'course_id' => $request->course_id,
            'batch_id' => $request->batch_id,
            'status' => 'active',
        ]);

        $payment = $enrollment->payment()->create([
            'amount' => $request->amount,
            'status' => 'completed',
            'payment_method' => $request->payment_method,
            'transaction_id' => $request->transaction_id ?: 'CASH-'.strtoupper(str()->random(6)),
            'currency' => 'INR',
        ]);

        // Auto-generate invoice
        $taxableAmount = round($payment->amount / 1.18, 2);
        $gstAmount = round($payment->amount - $taxableAmount, 2);
        $splitGst = round($gstAmount / 2, 2);

        $payment->invoice()->create([
            'invoice_number' => 'INV-'.strtoupper(str()->random(8)),
            'amount' => $payment->amount,
            'taxable_amount' => $taxableAmount,
            'cgst' => $splitGst,
            'sgst' => $splitGst,
            'igst' => 0,
            'sac_code' => '9992',
            'status' => 'paid',
            'issued_at' => now(),
        ]);

        return back()->with('success', 'Student enrolled and payment recorded successfully!');
    }
}
