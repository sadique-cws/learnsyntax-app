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
                    <div className="grid grid-cols-2 border-b border-black h-24">
                        <div className="p-2 border-r border-black flex flex-col justify-between">
                            <div>
                                <div className="font-bold mb-1">{company.company_name}</div>
                                <div className="whitespace-pre-line">{company.company_address}</div>
                            </div>
                            <div className="mt-2">
                                <div>GSTIN/UIN: <span className="font-bold">{company.company_gstin}</span></div>
                                <div>State Name: <span className="font-bold">{company.company_state}</span>, Code: <span className="font-bold">{company.company_state_code}</span></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="p-2 border-r border-black border-b">
                                <div className="text-[9px] text-slate-600">Invoice No.</div>
                                <div className="font-bold">{invoice.invoice_number}</div>
                            </div>
                            <div className="p-2 border-b border-black">
                                <div className="text-[9px] text-slate-600">Dated</div>
                                <div className="font-bold">{new Date(invoice.issued_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</div>
                            </div>
                            <div className="p-2 border-r border-black">
                                <div className="text-[9px] text-slate-600">Mode/Terms of Payment</div>
                                <div className="font-bold uppercase">{invoice.payment.payment_method || 'Online'}</div>
                            </div>
                            <div className="p-2">
                                <div className="text-[9px] text-slate-600">Other References</div>
                                <div className="font-bold">{invoice.payment.transaction_id}</div>
                            </div>
                        </div>
                    </div>

                    {/* Consignee / Buyer Section */}
                    <div className="grid grid-cols-2 border-b border-black">
                        <div className="p-2 border-r border-black">
                            <div className="text-[9px] text-slate-600 italic">Consignee (Ship to)</div>
                            <div className="font-bold mt-1 uppercase">{invoice.payment.enrollment.user.name}</div>
                            <div>{invoice.payment.enrollment.user.email}</div>
                            <div>{invoice.payment.enrollment.user.phone}</div>
                        </div>
                        <div className="p-2">
                            <div className="text-[9px] text-slate-600 italic">Buyer (Bill to)</div>
                            <div className="font-bold mt-1 uppercase">{invoice.payment.enrollment.user.name}</div>
                            <div>{invoice.payment.enrollment.user.email}</div>
                            {invoice.gst_number && (
                                <div className="mt-2">
                                    <div>GSTIN/UIN: <span className="font-bold">{invoice.gst_number}</span></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-black font-bold">
                                <th className="border-r border-black py-1 px-1 w-8 text-center">SI No.</th>
                                <th className="border-r border-black py-1 px-2 text-left">Description of Goods</th>
                                <th className="border-r border-black py-1 px-1 w-16 text-center">HSN/SAC</th>
                                <th className="border-r border-black py-1 px-1 w-16 text-center">Quantity</th>
                                <th className="border-r border-black py-1 px-1 w-16 text-center">Rate</th>
                                <th className="border-r border-black py-1 px-1 w-12 text-center">per</th>
                                <th className="border-r border-black py-1 px-1 w-16 text-center">Disc. %</th>
                                <th className="py-1 px-2 text-right w-24">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="min-h-[250px]">
                            <tr className="border-b border-black align-top">
                                <td className="border-r border-black py-2 px-1 text-center">1</td>
                                <td className="border-r border-black py-2 px-2 min-h-[150px]">
                                    <div className="font-bold">{invoice.payment.enrollment.course.title}</div>
                                    <div className="mt-1 text-[10px] text-slate-500 italic font-normal">Learning access for 1 year</div>
                                    
                                    <div className="mt-8 flex justify-end font-bold italic">
                                        <div className="w-24 flex flex-col items-end">
                                            <span>CGST</span>
                                            <span>SGST</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-r border-black py-2 px-1 text-center font-bold">{invoice.sac_code || '9992'}</td>
                                <td className="border-r border-black py-2 px-1 text-center font-bold">1 No</td>
                                <td className="border-r border-black py-2 px-1 text-center font-bold">{invoice.taxable_amount}</td>
                                <td className="border-r border-black py-2 px-1 text-center font-bold">No</td>
                                <td className="border-r border-black py-2 px-1 text-center"></td>
                                <td className="py-2 px-2 text-right font-bold">
                                    <div>{invoice.taxable_amount}</div>
                                    <div className="mt-8">
                                        <div>{invoice.cgst}</div>
                                        <div>{invoice.sgst}</div>
                                    </div>
                                </td>
                            </tr>
                            {/* Totals Row */}
                            <tr className="border-b border-black font-bold h-8">
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black text-right px-2">Total</td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black text-center">1 No</td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black"></td>
                                <td className="px-2 text-right bg-slate-50">₹ {invoice.amount}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Summary Sections */}
                    <div className="p-2 border-b border-black">
                        <div className="text-[9px] text-slate-600 mb-1 italic">Amount Chargeable (in words)</div>
                        <div className="font-bold text-sm">{amountInWords(parseFloat(invoice.amount))}</div>
                    </div>

                    {/* Tax Breakup Table */}
                    <div className="border-b border-black">
                        <table className="w-full border-collapse text-[10px]">
                            <thead>
                                <tr className="border-b border-black font-bold">
                                    <th className="border-r border-black py-1 px-2 text-left" rowSpan={2}>HSN/SAC</th>
                                    <th className="border-r border-black py-1 px-2 text-center" rowSpan={2}>Taxable Value</th>
                                    <th className="border-b border-black py-1 px-2 text-center" colSpan={2}>Central Tax</th>
                                    <th className="border-b border-black py-1 px-2 text-center" colSpan={2}>State Tax</th>
                                    <th className="py-1 px-2 text-center" rowSpan={2}>Total Tax Amount</th>
                                </tr>
                                <tr className="border-b border-black font-bold">
                                    <th className="border-r border-black py-1 px-2 text-center">Rate</th>
                                    <th className="border-r border-black py-1 px-2 text-center">Amount</th>
                                    <th className="border-r border-black py-1 px-2 text-center">Rate</th>
                                    <th className="border-r border-black py-1 px-2 text-center">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-black text-center">
                                    <td className="border-r border-black py-1 px-2 text-left">{invoice.sac_code || '9992'}</td>
                                    <td className="border-r border-black py-1 px-2 font-bold">{invoice.taxable_amount}</td>
                                    <td className="border-r border-black py-1 px-2">9%</td>
                                    <td className="border-r border-black py-1 px-2 font-bold">{invoice.cgst}</td>
                                    <td className="border-r border-black py-1 px-2">9%</td>
                                    <td className="border-r border-black py-1 px-2 font-bold">{invoice.sgst}</td>
                                    <td className="py-1 px-2 font-bold">{parseFloat(invoice.cgst) + parseFloat(invoice.sgst)}</td>
                                </tr>
                                <tr className="font-bold text-center">
                                    <td className="border-r border-black py-1 px-2 text-right uppercase">Total</td>
                                    <td className="border-r border-black py-1 px-2">{invoice.taxable_amount}</td>
                                    <td className="border-r border-black py-1 px-2"></td>
                                    <td className="border-r border-black py-1 px-2">{invoice.cgst}</td>
                                    <td className="border-r border-black py-1 px-2"></td>
                                    <td className="border-r border-black py-1 px-2">{invoice.sgst}</td>
                                    <td className="py-1 px-2">{parseFloat(invoice.cgst) + parseFloat(invoice.sgst)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Declaration & Signature */}
                    <div className="grid grid-cols-2 h-24">
                        <div className="p-2 border-r border-black">
                            <div className="text-[9px] text-slate-600 italic">Declaration</div>
                            <div className="text-[9px] mt-1 italic">{company.declaration}</div>
                        </div>
                        <div className="p-2 flex flex-col justify-between items-end">
                            <div className="text-[9px] italic">for <span className="font-bold uppercase">{company.company_name}</span></div>
                            <div className="text-[9px] font-bold mt-8 uppercase">Authorised Signatory</div>
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
