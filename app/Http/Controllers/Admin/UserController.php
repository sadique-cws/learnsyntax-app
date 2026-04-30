<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LoginStreak;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['enrollments.course', 'enrollments.batch', 'latestLoginStreak'])
            ->latest()
            ->get();

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'is_admin' => 'required|boolean',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'is_admin' => $request->is_admin,
        ]);

        return back()->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete yourself');
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully');
    }

    public function topStrikers()
    {
        $strikers = User::whereHas('latestLoginStreak')
            ->with('latestLoginStreak')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'streak' => $user->latestLoginStreak->current_streak,
                    'longest' => $user->latestLoginStreak->longest_streak,
                    'last_login' => $user->latestLoginStreak->login_date,
                ];
            })
            ->sortByDesc('streak')
            ->values();

        return Inertia::render('admin/reports/top-strikers', [
            'strikers' => $strikers,
        ]);
    }
}
