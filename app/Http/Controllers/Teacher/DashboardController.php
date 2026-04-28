<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $teacher = auth()->user()->teacher;
        $coursesCount = $teacher->courses()->count();
        $walletBalance = $teacher->wallet_balance;
        $totalSales = \App\Models\WalletTransaction::where('teacher_id', $teacher->id)->where('type', 'credit')->sum('amount');

        return inertia('teacher/dashboard', [
            'stats' => [
                'courses' => $coursesCount,
                'wallet_balance' => $walletBalance,
                'total_sales' => $totalSales,
            ]
        ]);
    }
}
