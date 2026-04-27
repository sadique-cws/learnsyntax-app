<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = \App\Models\Course::withCount('enrollments')->get();
        return inertia('admin/courses/index', [
            'courses' => $courses
        ]);
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
        ]);

        $validated['slug'] = str($request->title)->slug();

        \App\Models\Course::create($validated);

        return back()->with('success', 'Course created successfully.');
    }

    public function update(\Illuminate\Http\Request $request, \App\Models\Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'required|boolean',
        ]);

        $course->update($validated);

        return back()->with('success', 'Course updated successfully.');
    }

    public function destroy(\App\Models\Course $course)
    {
        $course->delete();
        return back()->with('success', 'Course deleted successfully.');
    }
}
