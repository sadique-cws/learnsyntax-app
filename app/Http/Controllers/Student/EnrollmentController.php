<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function store(\App\Models\Course $course)
    {
        $user = auth()->user();
        
        // Check if already enrolled
        $existing = \App\Models\Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();
            
        if ($existing) {
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
            return redirect()->route('dashboard');
        }

        return inertia('enrollments/show', [
            'enrollment' => $enrollment->load(['course.batches']),
        ]);
    }

    public function update(\Illuminate\Http\Request $request, \App\Models\Enrollment $enrollment)
    {
        $request->validate([
            'batch_id' => 'required|exists:batches,id',
            'payment_method' => 'required|string',
        ]);

        $enrollment->update([
            'batch_id' => $request->batch_id,
            'status' => 'paid',
        ]);

        $payment = \App\Models\Payment::create([
            'enrollment_id' => $enrollment->id,
            'amount' => $enrollment->course->price,
            'status' => 'completed',
            'transaction_id' => 'TXN-' . strtoupper(str()->random(10)),
            'payment_method' => $request->payment_method,
        ]);

        \App\Models\Invoice::create([
            'payment_id' => $payment->id,
            'invoice_number' => 'INV-' . date('Ymd') . '-' . $payment->id,
            'issue_date' => now(),
            'total_amount' => $payment->amount,
        ]);

        return redirect()->route('dashboard')->with('success', 'Successfully enrolled!');
    }
}
