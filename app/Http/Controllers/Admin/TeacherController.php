<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = Teacher::with('user')->get();
        // Get users who are not teachers yet so admin can easily assign them
        $users = User::where('is_teacher', false)->get();
        
        return inertia('admin/teachers/index', [
            'teachers' => $teachers,
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id|unique:teachers,user_id',
            'commission_percent' => 'required|numeric|min:0|max:100',
        ]);

        $user = User::findOrFail($request->user_id);
        $user->update(['is_teacher' => true]);

        Teacher::create([
            'user_id' => $user->id,
            'commission_percent' => $request->commission_percent,
            'wallet_balance' => 0,
        ]);

        return redirect()->back()->with('success', 'Teacher added successfully.');
    }

    public function update(Request $request, Teacher $teacher)
    {
        $request->validate([
            'commission_percent' => 'required|numeric|min:0|max:100',
        ]);

        $teacher->update([
            'commission_percent' => $request->commission_percent,
        ]);

        return redirect()->back()->with('success', 'Commission updated successfully.');
    }
}
