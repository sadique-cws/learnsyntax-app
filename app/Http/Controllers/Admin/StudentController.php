<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Enrollment;
use App\Models\Batch;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        $students = User::where('is_admin', false)
            ->with(['enrollments.course', 'enrollments.batch'])
            ->get();

        return inertia('admin/students/index', [
            'students' => $students,
        ]);
    }

    public function show(User $student)
    {
        $student->load(['enrollments.course', 'enrollments.batch', 'enrollments.payment']);
        
        return inertia('admin/students/show', [
            'student' => $student,
            'available_batches' => Batch::with('course')->get()->groupBy('course_id'),
        ]);
    }

    public function updateBatch(Request $request, Enrollment $enrollment)
    {
        $request->validate([
            'batch_id' => 'required|exists:batches,id',
        ]);

        $enrollment->update([
            'batch_id' => $request->batch_id,
        ]);

        return back()->with('success', 'Student batch updated successfully.');
    }
}
