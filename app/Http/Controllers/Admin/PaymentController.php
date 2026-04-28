<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with(['enrollment.user', 'enrollment.course', 'invoice'])
            ->latest()
            ->get()
            ->map(function ($p) {
                $p->searchable_student = $p->enrollment?->user?->name ?? 'Unknown';
                $p->searchable_course = $p->enrollment?->course?->title ?? 'Unknown';
                $p->searchable_amount = (string) $p->amount;

                return $p;
            });

        return inertia('admin/payments/index', [
            'payments' => $payments,
        ]);
    }

    public function gstReport()
    {
        \Log::info('GST Report accessed');
        $invoices = Invoice::with(['payment.enrollment.user', 'payment.enrollment.course'])
            ->whereNotNull('taxable_amount')
            ->latest()
            ->get()
            ->map(function ($i) {
                $i->searchable_student = $i->payment?->enrollment?->user?->name ?? 'Unknown Student';
                $i->searchable_course = $i->payment?->enrollment?->course?->title ?? 'Unknown Course';

                return $i;
            });

        return inertia('admin/payments/gst-report', [
            'invoices' => $invoices,
            'stats' => [
                'total_gst' => (float) $invoices->sum(fn ($i) => (float) $i->cgst + (float) $i->sgst + (float) $i->igst),
                'total_cgst' => (float) $invoices->sum('cgst'),
                'total_sgst' => (float) $invoices->sum('sgst'),
                'total_igst' => (float) $invoices->sum('igst'),
            ],
        ]);
    }

    public function showInvoice(Invoice $invoice)
    {
        $settings = Setting::first() ?: new Setting([
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
            'company' => $settings,
        ]);
    }

    public function generateInvoice(Payment $payment)
    {
        if ($payment->invoice) {
            return back()->with('error', 'Invoice already exists.');
        }

        $taxableAmount = round($payment->amount / 1.18, 2);
        $gstAmount = round($payment->amount - $taxableAmount, 2);
        $splitGst = round($gstAmount / 2, 2);

        $payment->invoice()->create([
            'invoice_number' => 'INV-'.strtoupper(Str::random(8)),
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

    public function exportGstr1()
    {
        \Log::info('GSTR-1 Export requested');
        
        $filename = 'GSTR1_Report_'.now()->format('Y_m_d').'.csv';

        return response()->streamDownload(function () {
            $invoices = Invoice::with(['payment.enrollment.user'])
                ->whereNotNull('taxable_amount')
                ->latest()
                ->get();

            $handle = fopen('php://output', 'w');

            // GSTR-1 Headers
            fputcsv($handle, [
                'Invoice Number',
                'Invoice Date',
                'Customer Name',
                'Customer GSTIN',
                'SAC Code',
                'Taxable Value',
                'CGST (9%)',
                'SGST (9%)',
                'IGST (18%)',
                'Total Amount',
                'Status',
            ]);

            foreach ($invoices as $invoice) {
                fputcsv($handle, [
                    $invoice->invoice_number,
                    $invoice->issued_at ? Carbon::parse($invoice->issued_at)->format('d-m-Y') : 'N/A',
                    $invoice->payment?->enrollment?->user?->name ?? 'Unknown',
                    $invoice->gst_number ?: 'Consumer',
                    $invoice->sac_code ?: '9992',
                    $invoice->taxable_amount,
                    $invoice->cgst,
                    $invoice->sgst,
                    $invoice->igst,
                    $invoice->amount,
                    $invoice->status,
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }
}
