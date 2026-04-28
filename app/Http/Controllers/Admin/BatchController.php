<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Course;
use Illuminate\Http\Request;

class BatchController extends Controller
{
    public function index()
    {
        $batches = Batch::with('course')->get();
        $courses = Course::all();

        return inertia('admin/batches/index', [
            'batches' => $batches,
            'courses' => $courses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'name' => 'required|string|max:255',
            'type' => 'required|in:online,offline',
            'start_date' => 'required|date',
            'capacity' => 'required|integer|min:1',
        ]);

        Batch::create($validated);

        return back()->with('success', 'Batch created successfully.');
    }

    public function update(Request $request, Batch $batch)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:online,offline',
            'start_date' => 'required|date',
            'capacity' => 'required|integer|min:1',
            'is_active' => 'required|boolean',
        ]);

        $batch->update($validated);

        return back()->with('success', 'Batch updated successfully.');
    }

    public function destroy(Batch $batch)
    {
        $batch->delete();

        return back()->with('success', 'Batch deleted successfully.');
    }
}
