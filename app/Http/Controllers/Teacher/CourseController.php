<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    public function index()
    {
        $teacher = auth()->user()->teacher;
        $courses = $teacher->courses()->get();
        
        return inertia('teacher/courses/index', [
            'courses' => $courses
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'image' => 'nullable|image',
        ]);

        $teacher = auth()->user()->teacher;

        $course = $teacher->courses()->create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . uniqid(),
            'price' => $request->price,
            'description' => $request->description,
            'is_active' => true,
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('courses', 'public');
            $course->update(['image_path' => $path]);
        }

        return redirect()->back()->with('success', 'Course created successfully. Content can be added later.');
    }

    public function update(Request $request, Course $course)
    {
        if ($course->teacher_id !== auth()->user()->teacher->id) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'image' => 'nullable|image',
        ]);

        $course->update([
            'title' => $request->title,
            'price' => $request->price,
            'description' => $request->description,
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('courses', 'public');
            $course->update(['image_path' => $path]);
        }

        return redirect()->back()->with('success', 'Course updated successfully.');
    }
}
