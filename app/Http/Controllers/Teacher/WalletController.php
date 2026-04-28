<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function index()
    {
        $teacher = auth()->user()->teacher;
        $transactions = $teacher->walletTransactions()->latest()->get();
        
        return inertia('teacher/wallet/index', [
            'balance' => $teacher->wallet_balance,
            'transactions' => $transactions
        ]);
    }
}
