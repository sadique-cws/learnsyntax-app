<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Certificate;
use Illuminate\Http\Request;

class AcademicController extends Controller
{
    public function assignments(Enrollment $enrollment)
    {
        $this->authorizeAccess($enrollment);

        $assignments = Assignment::where('batch_id', $enrollment->batch_id)
            ->with(['submissions' => function($q) {
                $q->where('user_id', auth()->id());
            }])
            ->get();

        return inertia('student/academic/assignments', [
            'enrollment' => $enrollment->load('course'),
            'assignments' => $assignments,
        ]);
    }

    public function exam(Enrollment $enrollment)
    {
        $this->authorizeAccess($enrollment);

        $exam = Exam::where('course_id', $enrollment->course_id)->first();
        if (!$exam) {
            return back()->with('error', 'Exam not scheduled yet.');
        }

        $attempt = ExamAttempt::where('exam_id', $exam->id)
            ->where('user_id', auth()->id())
            ->first();

        return inertia('student/academic/exam', [
            'enrollment' => $enrollment->load('course'),
            'exam' => $exam,
            'attempt' => $attempt,
        ]);
    }

    public function submitExam(Request $request, Enrollment $enrollment)
    {
        $this->authorizeAccess($enrollment);

        $exam = Exam::where('course_id', $enrollment->course_id)->firstOrFail();
        
        // Simulating 50 marks final exam logic
        // In a real app, you'd calculate this based on answers
        $marks = rand(25, 50); // Simulating an attempt

        ExamAttempt::updateOrCreate(
            ['exam_id' => $exam->id, 'user_id' => auth()->id()],
            ['marks_obtained' => $marks, 'completed_at' => now()]
        );

        return redirect()->route('student.academic.exam', $enrollment)->with('success', 'Exam submitted successfully!');
    }

    public function certificate(Enrollment $enrollment)
    {
        $this->authorizeAccess($enrollment);

        if (!$enrollment->isEligibleForCertificate()) {
            return back()->with('error', 'You need an average of at least 60% in assignments and exam to download the certificate.');
        }

        $certificate = Certificate::firstOrCreate(
            ['enrollment_id' => $enrollment->id],
            [
                'certificate_number' => 'LS-' . strtoupper(str()->random(8)),
                'issued_at' => now()
            ]
        );

        return inertia('student/academic/certificate', [
            'enrollment' => $enrollment->load(['course', 'user']),
            'certificate' => $certificate,
        ]);
    }

    protected function authorizeAccess(Enrollment $enrollment)
    {
        if ($enrollment->user_id !== auth()->id()) {
            abort(403);
        }
    }
}
