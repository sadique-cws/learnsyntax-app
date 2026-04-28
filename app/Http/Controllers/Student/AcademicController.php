<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\ExamAttempt;
use Illuminate\Http\Request;

class AcademicController extends Controller
{
    public function assignments(Enrollment $enrollment)
    {
        $this->authorizeAccess($enrollment);

        $assignments = Assignment::where('batch_id', $enrollment->batch_id)
            ->with(['submissions' => function ($q) {
                $q->where('user_id', auth()->id());
            }])
            ->get();

        return inertia('student/academic/assignments', [
            'enrollment' => $enrollment->load('course'),
            'assignments' => $assignments,
        ]);
    }

    public function submitAssignment(Request $request, Enrollment $enrollment, Assignment $assignment)
    {
        $this->authorizeAccess($enrollment);

        $request->validate([
            'content' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240', // 10MB max
        ]);

        $submission = AssignmentSubmission::updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'user_id' => auth()->id(),
            ],
            [
                'content' => $request->content,
                'submitted_at' => now(),
                'status' => 'submitted',
            ]
        );

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('submissions', 'public');
            $submission->update(['file_path' => $path]);
        }

        return back()->with('success', 'Assignment submitted successfully!');
    }

    public function exam(Enrollment $enrollment)
    {
        $this->authorizeAccess($enrollment);

        $exam = Exam::where('course_id', $enrollment->course_id)->first();
        if (! $exam) {
            return back()->with('error', 'Exam not scheduled yet.');
        }

        $attempt = ExamAttempt::where('exam_id', $exam->id)
            ->where('user_id', auth()->id())
            ->first();

        // Check if student has verified passcode in session for this exam
        $isVerified = session("exam_verified_{$exam->id}", false);

        return inertia('student/academic/exam', [
            'enrollment' => $enrollment->load('course'),
            'exam' => $exam,
            'attempt' => $attempt,
            'isVerified' => $isVerified,
        ]);
    }

    public function verifyPasscode(Request $request, Enrollment $enrollment)
    {
        $this->authorizeAccess($enrollment);

        $exam = Exam::where('course_id', $enrollment->course_id)->firstOrFail();

        if (ExamAttempt::where('exam_id', $exam->id)->where('user_id', auth()->id())->exists()) {
            return back()->with('error', 'You have already attempted this exam.');
        }

        $request->validate(['passcode' => 'required|string']);

        if ($exam->passcode && $request->passcode !== $exam->passcode) {
            return back()->with('error', 'Invalid passcode. Please check with your coordinator.');
        }

        session(["exam_verified_{$exam->id}" => true]);

        return back()->with('success', 'Passcode verified! You can now start the exam.');
    }

    public function submitExam(Request $request, Enrollment $enrollment)
    {
        $this->authorizeAccess($enrollment);

        $exam = Exam::where('course_id', $enrollment->course_id)->firstOrFail();

        if (ExamAttempt::where('exam_id', $exam->id)->where('user_id', auth()->id())->exists()) {
            return back()->with('error', 'You have already submitted this exam.');
        }

        if ($exam->passcode && ! session("exam_verified_{$exam->id}")) {
            return back()->with('error', 'Passcode verification required.');
        }

        // Simulating final exam logic
        $marks = rand(25, $exam->total_marks);

        ExamAttempt::create([
            'exam_id' => $exam->id,
            'user_id' => auth()->id(),
            'marks_obtained' => $marks,
            'completed_at' => now(),
        ]);

        // Clear verification session
        session()->forget("exam_verified_{$exam->id}");

        return redirect()->route('student.academic.exam', $enrollment)->with('success', 'Final Exam submitted successfully!');
    }

    public function certificate(Enrollment $enrollment)
    {
        $this->authorizeAccess($enrollment);

        if (! $enrollment->isEligibleForCertificate()) {
            return back()->with('error', 'You need an average of at least 60% in assignments and exam to download the certificate.');
        }

        $certificate = Certificate::firstOrCreate(
            ['enrollment_id' => $enrollment->id],
            [
                'certificate_number' => 'LS-'.strtoupper(str()->random(8)),
                'issued_at' => now(),
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
