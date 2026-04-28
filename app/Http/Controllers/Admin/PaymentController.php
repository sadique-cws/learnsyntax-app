<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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
        $settings = \App\Models\Setting::first() ?: new \App\Models\Setting([
            'company_name' => 'Learn Syntax Academy',
            'company_address' => '123 Tech Park, Sector 62, Noida, UP - 201309',
            'company_gstin' => '09ABCDE1234F1Z5',
            'company_email' => 'billing@learnsyntax.com',
            'company_phone' => '+91 98765 43210',
            'company_state' => 'Uttar Pradesh',
            'company_state_code' => '09',
        ]);

        return inertia('admin/payments/invoice', [
            'invoice' => $invoice->load(['payment.enrollment.user', 'payment.enrollment.course']),
            'company' => $settings
        ]);
    }

    public function generateInvoice(\App\Models\Payment $payment)
    {
        if ($payment->invoice) {
            return back()->with('error', 'Invoice already exists.');
        }

        $taxableAmount = round($payment->amount / 1.18, 2);
        $gstAmount = round($payment->amount - $taxableAmount, 2);
        $splitGst = round($gstAmount / 2, 2);

        $payment->invoice()->create([
            'invoice_number' => 'INV-' . strtoupper(Str::random(8)),
            'amount' => $payment->amount,
            'taxable_amount' => $taxableAmount,
            'cgst' => $splitGst,
            'sgst' => $splitGst,
            'igst' => 0,
            'sac_code' => '9992',
            'status' => 'paid',
            'issued_at' => now(),
        ]);

        return back()->with('success', 'Invoice generated successfully.');
    }
}
