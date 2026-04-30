<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\CourseChapter;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::withCount('enrollments')->get();

        return inertia('admin/courses/index', [
            'courses' => $courses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
        ]);

        $validated['slug'] = str($request->title)->slug();

        Course::create($validated);

        return back()->with('success', 'Course created successfully.');
    }

    public function update(Request $request, Course $course)
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

    public function destroy(Course $course)
    {
        $course->delete();

        return back()->with('success', 'Course deleted successfully.');
    }

    public function curriculum(Course $course)
    {
        return inertia('admin/courses/curriculum', [
            'course' => $course->load(['modules.chapters']),
        ]);
    }

    public function storeModule(Request $request, Course $course)
    {
        $request->validate(['title' => 'required|string|max:255']);
        $course->modules()->create(['title' => $request->title, 'sort_order' => $course->modules()->count()]);
        return back();
    }

    public function updateModule(Request $request, CourseModule $module)
    {
        $request->validate(['title' => 'required|string|max:255']);
        $module->update(['title' => $request->title]);
        return back();
    }

    public function destroyModule(CourseModule $module)
    {
        $module->delete();
        return back();
    }

    public function storeChapter(Request $request, CourseModule $module)
    {
        $request->validate(['title' => 'required|string|max:255', 'description' => 'nullable|string']);
        $module->chapters()->create([
            'title' => $request->title, 
            'description' => $request->description,
            'sort_order' => $module->chapters()->count()
        ]);
        return back();
    }

    public function updateChapter(Request $request, CourseChapter $chapter)
    {
        $request->validate(['title' => 'required|string|max:255', 'description' => 'nullable|string']);
        $chapter->update(['title' => $request->title, 'description' => $request->description]);
        return back();
    }

    public function destroyChapter(CourseChapter $chapter)
    {
        $chapter->delete();
        return back();
    }
}
