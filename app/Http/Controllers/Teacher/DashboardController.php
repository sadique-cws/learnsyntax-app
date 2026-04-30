<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\WalletTransaction;
use App\Models\Batch;
use App\Models\DailyLearningLog;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $teacher = auth()->user()->teacher;
        $coursesCount = $teacher->courses()->count();
        $walletBalance = $teacher->wallet_balance;
        $totalSales = WalletTransaction::where('teacher_id', $teacher->id)->where('type', 'credit')->sum('amount');

        return inertia('teacher/dashboard', [
            'stats' => [
                'courses' => $coursesCount,
                'wallet_balance' => $walletBalance,
                'total_sales' => $totalSales,
            ],
        ]);
    }

    public function progressIndex()
    {
        $teacher = auth()->user()->teacher;
        $batches = Batch::whereIn('course_id', $teacher->courses()->pluck('id'))
            ->with(['course'])
            ->get();

        return inertia('teacher/progress/index', [
            'batches' => $batches,
        ]);
    }

    public function progress(Batch $batch)
    {
        $batch->load(['course.modules.chapters.learningLogs' => function($query) use ($batch) {
            $query->where('batch_id', $batch->id);
        }]);

        return inertia('teacher/progress/show', [
            'batch' => $batch,
        ]);
    }

    public function storeLog(Request $request, Batch $batch)
    {
        $request->validate([
            'course_chapter_id' => 'required|exists:course_chapters,id',
            'date' => 'required|date',
            'remarks' => 'required|string',
            'status' => 'required|string|in:delivered,pending,skipped',
            'video_url' => 'nullable|url',
        ]);

        DailyLearningLog::updateOrCreate(
            ['batch_id' => $batch->id, 'course_chapter_id' => $request->course_chapter_id],
            [
                'teacher_id' => auth()->user()->teacher->id,
                'date' => $request->date,
                'remarks' => $request->remarks,
                'status' => $request->status,
                'video_url' => $request->video_url,
            ]
        );

        return back()->with('success', 'Progress logged successfully.');
    }

    public function students(Request $request)
    {
        $teacher = auth()->user()->teacher;
        $courses = $teacher->courses()->get();
        
        $query = \App\Models\Enrollment::whereIn('course_id', $courses->pluck('id'))
            ->where('status', 'paid')
            ->with(['user', 'course', 'batch']);
            
        if ($request->has('course_id') && $request->course_id != '') {
            $query->where('course_id', $request->course_id);
        }
        
        $enrollments = $query->get()->map(function($enrollment) {
            return [
                'id' => $enrollment->id,
                'student_name' => $enrollment->user->name,
                'student_email' => $enrollment->user->email,
                'course_title' => $enrollment->course->title,
                'course_id' => $enrollment->course_id,
                'batch_name' => $enrollment->batch ? $enrollment->batch->name : 'Not Assigned',
                'status' => $enrollment->status,
                'overall_average' => $enrollment->overall_average,
                'enroll_date' => $enrollment->created_at->toFormattedDateString(),
            ];
        });

        return inertia('teacher/students/index', [
            'enrollments' => $enrollments,
            'courses' => $courses,
            'filters' => $request->only(['course_id']),
        ]);
    }
}
