<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = \App\Models\Payment::with(['enrollment.user', 'enrollment.course', 'invoice'])
            ->latest()
            ->get();
            
        return inertia('admin/payments/index', [
            'payments' => $payments
        ]);
    }
}
