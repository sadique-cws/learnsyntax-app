<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enrollment;

class CourseController extends Controller
{
    public function index()
    {
        $courses = \App\Models\Course::where('is_active', true)->get();
        return inertia('courses/index', [
            'courses' => $courses
        ]);
    }

    public function show(\App\Models\Course $course)
    {
        $user = auth()->user();
        $enrollment = null;

        if ($user) {
            $enrollment = Enrollment::where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->first();
        }

        return inertia('courses/show', [
            'course' => $course->load('batches'),
            'is_enrolled' => $enrollment !== null,
            'enrollment_status' => $enrollment?->status,
            'enrollment_id' => $enrollment?->id,
        ]);
    }
}
