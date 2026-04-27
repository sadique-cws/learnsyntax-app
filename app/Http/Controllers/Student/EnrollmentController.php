<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function store(\App\Models\Course $course)
    {
        $user = auth()->user();
        
        $existing = \App\Models\Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();
            
        if ($existing) {
            if ($existing->status === 'paid' && !$existing->batch_id) {
                return redirect()->route('student.enrollments.batch', $existing);
            }
            return redirect()->route('student.enrollments.show', $existing);
        }

        $enrollment = \App\Models\Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'pending',
        ]);

        return redirect()->route('student.enrollments.show', $enrollment);
    }

    public function show(\App\Models\Enrollment $enrollment)
    {
        if ($enrollment->status === 'paid') {
            if (!$enrollment->batch_id) {
                return redirect()->route('student.enrollments.batch', $enrollment);
            }
            return redirect()->route('dashboard');
        }

        return inertia('enrollments/show', [
            'enrollment' => $enrollment->load(['course']),
            'razorpay_key' => env('RAZORPAY_KEY', 'rzp_test_placeholder'),
        ]);
    }

    public function processPayment(Request $request, \App\Models\Enrollment $enrollment)
    {
        // In a real app, verify Razorpay signature here
        // For now, we simulate success
        
        $enrollment->update([
            'status' => 'paid',
        ]);

        $payment = \App\Models\Payment::create([
            'enrollment_id' => $enrollment->id,
            'amount' => $enrollment->course->price,
            'status' => 'completed',
            'transaction_id' => $request->razorpay_payment_id ?? 'SIM-' . strtoupper(str()->random(10)),
            'payment_method' => 'razorpay',
        ]);

        \App\Models\Invoice::create([
            'payment_id' => $payment->id,
            'invoice_number' => 'INV-' . date('Ymd') . '-' . $payment->id,
            'issue_date' => now(),
            'total_amount' => $payment->amount,
        ]);

        return redirect()->route('student.enrollments.batch', $enrollment);
    }

    public function batchSelection(\App\Models\Enrollment $enrollment)
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

    public function selectBatch(Request $request, \App\Models\Enrollment $enrollment)
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
