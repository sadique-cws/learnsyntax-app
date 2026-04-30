<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Question;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function index()
    {
        return inertia('admin/exams/index', [
            'courses' => Course::with(['exam' => fn ($q) => $q->withCount('questions')])->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'passcode' => 'nullable|string|max:20',
            'total_marks' => 'required|integer|min:1',
        ]);

        Exam::updateOrCreate(
            ['course_id' => $request->course_id],
            ['title' => $request->title, 'passcode' => $request->passcode, 'total_marks' => $request->total_marks]
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

    public function bulkStoreQuestions(Request $request, Exam $exam)
    {
        $request->validate([
            'questions' => 'required|array',
            'questions.*.question_text' => 'required|string',
            'questions.*.options' => 'nullable|array',
            'questions.*.correct_answer' => 'nullable|string',
            'questions.*.marks' => 'required|integer|min:1',
        ]);

        foreach ($request->questions as $q) {
            $exam->questions()->create($q);
        }

        return back()->with('success', count($request->questions).' questions imported successfully.');
    }

    public function destroyQuestion(Question $question)
    {
        $question->delete();

        return back()->with('success', 'Question deleted.');
    }

    public function updateResult(Request $request, ExamAttempt $attempt)
    {
        $request->validate([
            'marks_obtained' => 'required|integer|min:0|max:'.$attempt->exam->total_marks,
        ]);

        $attempt->update(['marks_obtained' => $request->marks_obtained]);

        return back()->with('success', 'Exam marks updated.');
    }
}
