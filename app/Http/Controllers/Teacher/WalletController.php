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
            'balance'            => $availableBalance,
            'actual_balance'     => $teacher->wallet_balance,
            'transactions'       => $transactions,
            'withdrawalRequests' => $withdrawalRequests,
            'kyc_status'         => $teacher->kyc_status,
        ]);
    }

    public function withdraw()
    {
        $teacher = auth()->user()->teacher;

        // If KYC not approved, redirect to KYC page
        if (! $teacher->isKycApproved()) {
            return redirect()->route('teacher.kyc')
                ->with('warning', 'Please complete your KYC verification before requesting a withdrawal.');
        }

        $pendingAmount = $teacher->withdrawalRequests()->where('status', 'pending')->sum('amount');
        $availableBalance = $teacher->wallet_balance - $pendingAmount;

        return inertia('teacher/wallet/withdraw', [
            'balance' => $availableBalance,
            // Pre-fill bank details from KYC
            'bank_details' => [
                'bank_name'           => $teacher->bank_name,
                'account_holder_name' => $teacher->account_holder_name,
                'account_number'      => $teacher->account_number,
                'ifsc_code'           => $teacher->ifsc_code,
            ],
        ]);
    }

    public function storeRequest(\Illuminate\Http\Request $request)
    {
        $teacher = auth()->user()->teacher;

        if (! $teacher->isKycApproved()) {
            return redirect()->route('teacher.kyc')
                ->with('warning', 'KYC approval required before withdrawal.');
        }

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
            'amount'               => $request->amount,
            'bank_name'            => $request->bank_name,
            'account_number'       => $request->account_number,
            'ifsc_code'            => $request->ifsc_code,
            'account_holder_name'  => $request->account_holder_name,
            'status'               => 'pending',
        ]);

        return redirect()->route('teacher.wallet')
            ->with('success', 'Withdrawal request submitted successfully.');
    }
}
