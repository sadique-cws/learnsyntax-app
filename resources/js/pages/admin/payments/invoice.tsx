import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Download, Printer, ChevronLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function InvoicePage({ invoice, company }: { invoice: any, company: any }) {
    const handlePrint = () => {
        window.print();
    };

    // Helper to format amount in words (Simple version)
    const amountInWords = (num: number) => {
        return "Indian Rupee " + num.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace('₹', '') + " Only";
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 print:p-0 print:bg-white">
            <Head title={`Invoice ${invoice.invoice_number}`} />
            
            <div className="max-w-[850px] mx-auto print:max-w-none">
                {/* Action Bar */}
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <Link href="/admin/payments" className="flex items-center text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                        <ChevronLeft className="size-4 mr-1" /> Back to Ledger
                    </Link>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handlePrint} className="rounded border-slate-300 bg-white">
                            <Printer className="size-4 mr-2" /> Print
                        </Button>
                        <Button onClick={handlePrint} className="rounded shadow-lg shadow-primary/20">
                            <Download className="size-4 mr-2" /> Download PDF
                        </Button>
                    </div>
                </div>

                {/* Main Invoice Container (The Tally Style) */}
                <div className="bg-white border-[1px] border-black text-[11px] leading-tight text-black font-serif overflow-hidden">
                    
                    {/* Header Section */}
                    <div className="flex justify-center py-1 border-b border-black">
                        <h1 className="text-sm font-bold uppercase">Tax Invoice</h1>
                    </div>

                    {/* Meta Section */}
                    <div className="grid grid-cols-2 border-b border-black">
                        <div className="p-2 border-r border-black flex flex-col justify-between min-h-[120px]">
                            <div className="flex gap-3">
                                {company.logo_path && (
                                    <img src={`/storage/${company.logo_path}`} className="size-16 object-contain shrink-0" />
                                )}
                                <div>
                                    <div className="font-bold mb-1 text-sm">{company.company_name}</div>
                                    <div className="whitespace-pre-line text-[10px]">{company.company_address}</div>
                                </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-black/5 border-dashed">
                                <div className="flex justify-between">
                                    <span>GSTIN/UIN: <span className="font-bold">{company.company_gstin}</span></span>
                                    <span>State: <span className="font-bold">{company.company_state}</span> ({company.company_state_code})</span>
                                </div>
                                <div className="flex justify-between mt-0.5">
                                    <span>E-Mail: <span className="font-bold italic lowercase">{company.company_email}</span></span>
                                    <span>Contact: <span className="font-bold">{company.company_phone}</span></span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="p-2 border-r border-black border-b">
                                <div className="text-[9px] text-slate-600">Invoice No.</div>
                                <div className="font-bold text-sm tracking-tight">{invoice.invoice_number}</div>
                            </div>
                            <div className="p-2 border-b border-black">
                                <div className="text-[9px] text-slate-600">Dated</div>
                                <div className="font-bold">{new Date(invoice.issued_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                            </div>
                            <div className="p-2 border-r border-black">
                                <div className="text-[9px] text-slate-600">Mode/Terms of Payment</div>
                                <div className="font-bold uppercase tracking-wide">{invoice.payment.payment_method || 'Online'}</div>
                            </div>
                            <div className="p-2">
                                <div className="text-[9px] text-slate-600">Reference / Order ID</div>
                                <div className="font-bold font-mono text-[9px]">{invoice.payment.transaction_id}</div>
                            </div>
                        </div>
                    </div>

                    {/* Consignee / Buyer Section */}
                    <div className="grid grid-cols-2 border-b border-black min-h-[80px]">
                        <div className="p-2 border-r border-black">
                            <div className="text-[9px] text-slate-600 italic">Consignee (Ship to)</div>
                            <div className="font-bold mt-1 uppercase text-sm">{invoice.payment.enrollment.user.name}</div>
                            <div className="font-bold">{invoice.payment.enrollment.user.email}</div>
                            <div>Phone: {invoice.payment.enrollment.user.phone}</div>
                        </div>
                        <div className="p-2">
                            <div className="text-[9px] text-slate-600 italic">Buyer (Bill to)</div>
                            <div className="font-bold mt-1 uppercase text-sm">{invoice.payment.enrollment.user.name}</div>
                            <div className="font-bold italic">{invoice.payment.enrollment.user.email}</div>
                            {invoice.gst_number && (
                                <div className="mt-2 pt-1 border-t border-black/5 border-dashed">
                                    <div>GSTIN/UIN: <span className="font-bold">{invoice.gst_number}</span></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-black font-bold text-[10px] bg-slate-50 print:bg-white">
                                <th className="border-r border-black py-1.5 px-1 w-8 text-center">SI No.</th>
                                <th className="border-r border-black py-1.5 px-2 text-left">Description of Goods</th>
                                <th className="border-r border-black py-1.5 px-1 w-20 text-center">HSN/SAC</th>
                                <th className="border-r border-black py-1.5 px-1 w-16 text-center">Qty</th>
                                <th className="border-r border-black py-1.5 px-1 w-20 text-center">Rate</th>
                                <th className="border-r border-black py-1.5 px-1 w-12 text-center">per</th>
                                <th className="py-1.5 px-2 text-right w-24">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-black align-top min-h-[200px]">
                                <td className="border-r border-black py-4 px-1 text-center">1</td>
                                <td className="border-r border-black py-4 px-2 h-[200px]">
                                    <div className="font-bold text-sm mb-1 uppercase">{invoice.payment.enrollment.course.title}</div>
                                    <div className="text-[10px] text-slate-600 italic font-medium">Educational Services - Online Course Access</div>
                                    
                                    <div className="mt-12 flex justify-end font-bold text-[10px]">
                                        <div className="flex flex-col items-end gap-1">
                                            <span>CGST @ 9%</span>
                                            <span>SGST @ 9%</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-r border-black py-4 px-1 text-center font-bold text-sm tracking-widest">{invoice.sac_code || '9992'}</td>
                                <td className="border-r border-black py-4 px-1 text-center font-bold">1 No</td>
                                <td className="border-r border-black py-4 px-1 text-center font-bold">{invoice.taxable_amount}</td>
                                <td className="border-r border-black py-4 px-1 text-center font-bold">No</td>
                                <td className="py-4 px-2 text-right font-black text-sm">
                                    <div>{invoice.taxable_amount}</div>
                                    <div className="mt-12 space-y-1">
                                        <div>{invoice.cgst}</div>
                                        <div>{invoice.sgst}</div>
                                    </div>
                                </td>
                            </tr>
                            {/* Totals Row */}
                            <tr className="border-b border-black font-black h-10 bg-slate-50/50 print:bg-white text-sm">
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black text-right px-4 uppercase tracking-widest">Total</td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black text-center">1 No</td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black"></td>
                                <td className="px-4 text-right bg-slate-100/50 print:bg-white">₹ {invoice.amount}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Summary Sections */}
                    <div className="p-3 border-b border-black bg-slate-50/20 print:bg-white">
                        <div className="text-[9px] text-slate-500 mb-1 font-bold uppercase tracking-widest">Amount Chargeable (in words)</div>
                        <div className="font-bold text-sm tracking-tight uppercase">{amountInWords(parseFloat(invoice.amount))}</div>
                    </div>

                    {/* Tax Breakup Table */}
                    <div className="border-b border-black">
                        <table className="w-full border-collapse text-[9px]">
                            <thead>
                                <tr className="border-b border-black font-bold bg-slate-50/50 print:bg-white uppercase tracking-tighter">
                                    <th className="border-r border-black py-1 px-2 text-left" rowSpan={2}>HSN/SAC</th>
                                    <th className="border-r border-black py-1 px-2 text-center" rowSpan={2}>Taxable Value</th>
                                    <th className="border-b border-black py-1 px-2 text-center" colSpan={2}>Central Tax</th>
                                    <th className="border-b border-black py-1 px-2 text-center" colSpan={2}>State Tax</th>
                                    <th className="py-1 px-2 text-center" rowSpan={2}>Total Tax Amount</th>
                                </tr>
                                <tr className="border-b border-black font-bold">
                                    <th className="border-r border-black py-1 px-1 text-center">Rate</th>
                                    <th className="border-r border-black py-1 px-1 text-center">Amount</th>
                                    <th className="border-r border-black py-1 px-1 text-center">Rate</th>
                                    <th className="border-r border-black py-1 px-1 text-center">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-black text-center font-medium">
                                    <td className="border-r border-black py-1.5 px-2 text-left">{invoice.sac_code || '9992'}</td>
                                    <td className="border-r border-black py-1.5 px-2 font-black">{invoice.taxable_amount}</td>
                                    <td className="border-r border-black py-1.5 px-1">9%</td>
                                    <td className="border-r border-black py-1.5 px-1 font-black">{invoice.cgst}</td>
                                    <td className="border-r border-black py-1.5 px-1">9%</td>
                                    <td className="border-r border-black py-1.5 px-1 font-black">{invoice.sgst}</td>
                                    <td className="py-1.5 px-2 font-black">{parseFloat(invoice.cgst) + parseFloat(invoice.sgst)}</td>
                                </tr>
                                <tr className="font-black text-center bg-slate-50/50 print:bg-white uppercase tracking-tighter h-8">
                                    <td className="border-r border-black py-1 px-4 text-right">Total</td>
                                    <td className="border-r border-black py-1 px-2">{invoice.taxable_amount}</td>
                                    <td className="border-r border-black py-1 px-1"></td>
                                    <td className="border-r border-black py-1 px-1">{invoice.cgst}</td>
                                    <td className="border-r border-black py-1 px-1"></td>
                                    <td className="border-r border-black py-1 px-1">{invoice.sgst}</td>
                                    <td className="py-1 px-2">{parseFloat(invoice.cgst) + parseFloat(invoice.sgst)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Declaration & Signature */}
                    <div className="grid grid-cols-2 h-32">
                        <div className="p-3 border-r border-black bg-slate-50/10 print:bg-white">
                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Declaration</div>
                            <div className="text-[9px] leading-relaxed italic font-serif">{company.declaration}</div>
                        </div>
                        <div className="p-3 flex flex-col justify-between items-end">
                            <div className="text-[9px] italic font-medium">for <span className="font-black uppercase tracking-wider">{company.company_name}</span></div>
                            <div className="flex flex-col items-center">
                                {company.authority_signature_path && (
                                    <img src={`/storage/${company.authority_signature_path}`} className="h-12 w-auto object-contain mb-1" />
                                )}
                                <div className="text-[9px] font-black uppercase tracking-[0.2em] pt-1 border-t border-black/20 w-32 text-center">Authorised Signatory</div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-center py-1 border-t border-black bg-slate-50 print:bg-white">
                        <div className="text-[9px] text-slate-500 italic">This is a Computer Generated Invoice</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
