<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\WalletTransaction;
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
