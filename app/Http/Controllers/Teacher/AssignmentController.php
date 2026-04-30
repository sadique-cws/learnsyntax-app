<?php
namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Batch;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function index()
    {
        $teacher = auth()->user()->teacher;
        if (!$teacher) {
            return redirect()->route('teacher.dashboard')->withErrors(['msg' => 'Access Restricted. Teacher profile incomplete.']);
        }

        $courseIds = $teacher->courses()->pluck('id');

        $batches = Batch::whereIn('course_id', $courseIds)
            ->with(['course', 'assignments' => function ($q) {
                $q->withCount([
                    'submissions as handed_in_count' => function ($q) {
                        $q->where('status', 'submitted');
                    },
                    'submissions as marked_count' => function ($q) {
                        $q->where('status', 'graded');
                    },
                ]);
            }])->withCount('enrollments')->get();

        return inertia('teacher/assignments/index', [
            'batches' => $batches,
        ]);
    }

    public function store(Request $request)
    {
        $teacher = auth()->user()->teacher;
        $courseIds = $teacher->courses()->pluck('id');

        $request->validate([
            'batch_id' => 'required|exists:batches,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'max_marks' => 'required|integer|min:1',
            'due_date' => 'nullable|date',
        ]);

        $batch = Batch::whereIn('course_id', $courseIds)->findOrFail($request->batch_id);

        $assignment = Assignment::create([
            'batch_id' => $batch->id,
            'title' => $request->title,
            'description' => $request->description,
            'max_marks' => $request->max_marks,
            'due_date' => $request->due_date,
        ]);

        // Notify Students
        $enrollments = $batch->enrollments()->with('user')->get();
        foreach ($enrollments as $enrollment) {
            \App\Jobs\SendNotificationJob::dispatch(
                $enrollment->user,
                ['mail', 'database'],
                'New Assignment: ' . $assignment->title,
                'emails.notification',
                [
                    'message' => "A new assignment has been issued for your batch: {$batch->name}. Due date: {$assignment->due_date}",
                    'link' => route('student.academic.assignments', $enrollment->id),
                    'button_text' => 'View Assignment'
                ]
            )->afterCommit();
        }

        return back()->with('success', 'Assignment issued successfully.');
    }

    public function show(Assignment $assignment)
    {
        $teacher = auth()->user()->teacher;
        $courseIds = $teacher->courses()->pluck('id');

        $batch = Batch::whereIn('course_id', $courseIds)->findOrFail($assignment->batch_id);

        // Ensure all enrolled students have a submission record for grading
        $enrolledUserIds = Enrollment::where('batch_id', $assignment->batch_id)->pluck('user_id');

        foreach ($enrolledUserIds as $userId) {
            AssignmentSubmission::firstOrCreate([
                'assignment_id' => $assignment->id,
                'user_id' => $userId,
            ]);
        }

        return inertia('teacher/assignments/show', [
            'assignment' => $assignment->load(['batch.course', 'submissions.user']),
        ]);
    }

    public function grade(Request $request, AssignmentSubmission $submission)
    {
        $teacher = auth()->user()->teacher;
        $courseIds = $teacher->courses()->pluck('id');
        
        $batch = Batch::whereIn('course_id', $courseIds)->findOrFail($submission->assignment->batch_id);

        $request->validate([
            'marks_obtained' => 'required|integer|min:0|max:'.$submission->assignment->max_marks,
            'admin_comments' => 'nullable|string',
        ]);

        $finalMarks = $request->marks_obtained;
        $isLate = $submission->is_late;
        $penaltyMessage = '';

        if ($isLate) {
            $finalMarks = max(0, $finalMarks - 10);
            $penaltyMessage = ' (10 marks late penalty applied)';
        }

        $submission->update([
            'marks_obtained' => $finalMarks,
            'status' => 'graded',
            'admin_comments' => $request->admin_comments,
        ]);

        return back()->with('success', 'Marks updated successfully.'.$penaltyMessage);
    }

    public function comment(Request $request, AssignmentSubmission $submission)
    {
        $teacher = auth()->user()->teacher;
        $courseIds = $teacher->courses()->pluck('id');
        
        $batch = Batch::whereIn('course_id', $courseIds)->findOrFail($submission->assignment->batch_id);

        $request->validate([
            'comment' => 'required|string',
        ]);

        $submission->update([
            'admin_comments' => $request->comment,
        ]);

        return back()->with('success', 'Feedback posted successfully.');
    }
}
