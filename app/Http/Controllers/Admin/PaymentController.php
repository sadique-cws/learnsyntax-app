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

    public function gstReport()
    {
        $invoices = \App\Models\Invoice::with(['payment.enrollment.user', 'payment.enrollment.course'])
            ->whereNotNull('taxable_amount')
            ->latest()
            ->get();

        return inertia('admin/payments/gst-report', [
            'invoices' => $invoices,
            'stats' => [
                'total_gst' => $invoices->sum(fn($i) => $i->cgst + $i->sgst + $i->igst),
                'total_cgst' => $invoices->sum('cgst'),
                'total_sgst' => $invoices->sum('sgst'),
                'total_igst' => $invoices->sum('igst'),
            ]
        ]);
    }
}
