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
            'users' => $users,
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

    public function show(Teacher $teacher)
    {
        $teacher->load(['user', 'courses', 'walletTransactions', 'withdrawalRequests']);

        return inertia('admin/teachers/show', [
            'teacher' => $teacher,
        ]);
    }

    public function withdrawals()
    {
        $withdrawals = \App\Models\WithdrawalRequest::with('teacher.user')->latest()->get();

        return inertia('admin/withdrawals/index', [
            'withdrawals' => $withdrawals,
        ]);
    }

    public function updateWithdrawalStatus(Request $request, \App\Models\WithdrawalRequest $withdrawal)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        // If approving, deduct from balance!
        if ($request->status === 'approved' && $withdrawal->status === 'pending') {
            $teacher = $withdrawal->teacher;
            if ($teacher->wallet_balance < $withdrawal->amount) {
                return back()->withErrors(['amount' => 'Insufficient balance in teacher wallet.']);
            }
            
            $teacher->decrement('wallet_balance', $withdrawal->amount);

            \App\Models\WalletTransaction::create([
                'teacher_id' => $teacher->id,
                'amount' => $withdrawal->amount,
                'type' => 'debit',
                'description' => 'Payout request approved.',
            ]);
        }

        $withdrawal->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
        ]);

        return redirect()->back()->with('success', 'Withdrawal status updated successfully.');
    }

    public function loginAs(Teacher $teacher)
    {
        auth()->login($teacher->user);
        return redirect()->route('teacher.dashboard');
    }
}
