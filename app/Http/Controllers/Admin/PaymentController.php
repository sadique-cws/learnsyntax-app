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

    public function showInvoice(\App\Models\Invoice $invoice)
    {
        return inertia('admin/payments/invoice', [
            'invoice' => $invoice->load(['payment.enrollment.user', 'payment.enrollment.course']),
            'company' => [
                'name' => 'Learn Syntax Academy',
                'address' => '123 Tech Park, Sector 62, Noida, UP - 201309',
                'gstin' => '09ABCDE1234F1Z5',
                'email' => 'billing@learnsyntax.com',
                'phone' => '+91 98765 43210',
            ]
        ]);
    }
}
