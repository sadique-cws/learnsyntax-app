<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Course;
use App\Models\ExamAttempt;
use App\Models\User;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function index()
    {
        return inertia('admin/exams/index', [
            'courses' => Course::with('exam')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'total_marks' => 'required|integer|min:1',
        ]);

        Exam::updateOrCreate(
            ['course_id' => $request->course_id],
            ['title' => $request->title, 'total_marks' => $request->total_marks]
        );

        return back()->with('success', 'Exam configured successfully.');
    }

    public function results(Exam $exam)
    {
        return inertia('admin/exams/results', [
            'exam' => $exam->load(['course', 'attempts.user']),
        ]);
    }

    public function updateResult(Request $request, ExamAttempt $attempt)
    {
        $request->validate([
            'marks_obtained' => 'required|integer|min:0|max:' . $attempt->exam->total_marks,
        ]);

        $attempt->update(['marks_obtained' => $request->marks_obtained]);

        return back()->with('success', 'Exam marks updated.');
    }
}
