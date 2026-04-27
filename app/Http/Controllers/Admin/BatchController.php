<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BatchController extends Controller
{
    public function index()
    {
        $batches = \App\Models\Batch::with('course')->get();
        $courses = \App\Models\Course::all();
        return inertia('admin/batches/index', [
            'batches' => $batches,
            'courses' => $courses
        ]);
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'name' => 'required|string|max:255',
            'type' => 'required|in:online,offline',
            'start_date' => 'required|date',
            'capacity' => 'required|integer|min:1',
        ]);

        \App\Models\Batch::create($validated);

        return back()->with('success', 'Batch created successfully.');
    }

    public function update(\Illuminate\Http\Request $request, \App\Models\Batch $batch)
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

    public function destroy(\App\Models\Batch $batch)
    {
        $batch->delete();
        return back()->with('success', 'Batch deleted successfully.');
    }
}
