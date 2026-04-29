<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;

class WalletController extends Controller
{
    public function index()
    {
        $teacher = auth()->user()->teacher;
        $transactions = $teacher->walletTransactions()->latest()->get();
        $withdrawalRequests = $teacher->withdrawalRequests()->latest()->get();

        $pendingAmount = $teacher->withdrawalRequests()->where('status', 'pending')->sum('amount');
        $availableBalance = $teacher->wallet_balance - $pendingAmount;

        return inertia('teacher/wallet/index', [
            'balance' => $availableBalance,
            'actual_balance' => $teacher->wallet_balance,
            'transactions' => $transactions,
            'withdrawalRequests' => $withdrawalRequests,
        ]);
    }

    public function withdraw()
    {
        $teacher = auth()->user()->teacher;
        
        $pendingAmount = $teacher->withdrawalRequests()->where('status', 'pending')->sum('amount');
        $availableBalance = $teacher->wallet_balance - $pendingAmount;

        return inertia('teacher/wallet/withdraw', [
            'balance' => $availableBalance,
        ]);
    }

    public function storeRequest(\Illuminate\Http\Request $request)
    {
        $teacher = auth()->user()->teacher;
        
        $pendingAmount = $teacher->withdrawalRequests()->where('status', 'pending')->sum('amount');
        $availableBalance = $teacher->wallet_balance - $pendingAmount;

        $request->validate([
            'amount' => 'required|numeric|min:500|max:'.$availableBalance,
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'ifsc_code' => 'required|string|max:255',
            'account_holder_name' => 'required|string|max:255',
        ]);

        $teacher->withdrawalRequests()->create([
            'amount' => $request->amount,
            'bank_name' => $request->bank_name,
            'account_number' => $request->account_number,
            'ifsc_code' => $request->ifsc_code,
            'account_holder_name' => $request->account_holder_name,
            'status' => 'pending',
        ]);

        return redirect()->route('teacher.wallet')->with('success', 'Withdrawal request submitted successfully.');
    }
}
