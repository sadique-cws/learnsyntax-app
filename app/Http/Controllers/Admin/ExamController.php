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

    public function questions(Exam $exam)
    {
        return inertia('admin/exams/questions', [
            'exam' => $exam->load(['course', 'questions']),
        ]);
    }

    public function storeQuestion(Request $request, Exam $exam)
    {
        $request->validate([
            'question_text' => 'required|string',
            'options' => 'nullable|array',
            'correct_answer' => 'nullable|string',
            'marks' => 'required|integer|min:1',
        ]);

        $exam->questions()->create($request->all());

        return back()->with('success', 'Question added successfully.');
    }

    public function destroyQuestion(\App\Models\Question $question)
    {
        $question->delete();
        return back()->with('success', 'Question deleted.');
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
