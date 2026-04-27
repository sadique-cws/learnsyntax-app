<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
        return inertia('courses/show', [
            'course' => $course->load('batches')
        ]);
    }
}
