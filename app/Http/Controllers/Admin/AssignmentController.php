<?php

namespace App\Http\Controllers\Admin;

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
        return inertia('admin/assignments/index', [
            'batches' => Batch::with(['course', 'assignments'])->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'batch_id' => 'required|exists:batches,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'max_marks' => 'required|integer|min:1',
            'due_date' => 'nullable|date',
        ]);

        Assignment::create($request->all());

        return back()->with('success', 'Assignment created successfully.');
    }

    public function show(Assignment $assignment)
    {
        $assignment->load(['batch.course', 'submissions.user']);
        
        // Ensure all enrolled students have a submission record for grading
        $enrolledUserIds = Enrollment::where('batch_id', $assignment->batch_id)->pluck('user_id');
        
        foreach ($enrolledUserIds as $userId) {
            AssignmentSubmission::firstOrCreate([
                'assignment_id' => $assignment->id,
                'user_id' => $userId,
            ]);
        }

        return inertia('admin/assignments/show', [
            'assignment' => $assignment->load('submissions.user'),
        ]);
    }

    public function grade(Request $request, AssignmentSubmission $submission)
    {
        $request->validate([
            'marks_obtained' => 'required|integer|min:0|max:' . $submission->assignment->max_marks,
            'admin_comments' => 'nullable|string',
        ]);

        $submission->update([
            'marks_obtained' => $request->marks_obtained,
            'status' => 'graded',
            'admin_comments' => $request->admin_comments,
        ]);

        return back()->with('success', 'Marks updated successfully.');
    }
}
