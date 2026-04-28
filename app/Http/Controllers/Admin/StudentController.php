<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Enrollment;
use App\Models\Batch;
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
            'assignmentSubmissions.assignment'
        ]);
        
        // Appending computed attributes for the view
        foreach ($student->enrollments as $enrollment) {
            $enrollment->append(['assignment_average', 'exam_score', 'overall_average']);
        }

        return inertia('admin/students/show', [
            'student' => $student,
            'available_batches' => Batch::with('course')->get()->groupBy('course_id'),
            'stats' => [
                'total_paid' => $student->enrollments->sum(fn($e) => $e->payment ? $e->payment->amount : 0),
                'course_count' => $student->enrollments->count(),
                'avg_performance' => $student->enrollments->avg('overall_average') ?: 0,
            ]
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
        if (!$enrollment->isEligibleForCertificate()) {
            return back()->with('error', 'Student is not yet eligible for a certificate. Requires 60% average.');
        }

        \App\Models\Certificate::firstOrCreate(
            ['enrollment_id' => $enrollment->id],
            [
                'certificate_number' => 'LS-' . strtoupper(str()->random(8)),
                'issued_at' => now()
            ]
        );

        return back()->with('success', 'Certificate generated successfully!');
    }
}
