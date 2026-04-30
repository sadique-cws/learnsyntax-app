<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::where('is_active', true)->get();

        return inertia('courses/index', [
            'courses' => $courses,
        ]);
    }

    public function show(Course $course)
    {
        $user = auth()->user();
        $enrollment = null;

        if ($user) {
            $enrollment = Enrollment::where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->first();
        }

        return inertia('courses/show', [
            'course' => $course->load(['batches', 'modules.chapters']),
            'is_enrolled' => $enrollment !== null,
            'enrollment_status' => $enrollment?->status,
            'enrollment_id' => $enrollment?->id,
        ]);
    }
}
