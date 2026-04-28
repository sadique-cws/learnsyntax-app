import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Download, Printer, ChevronLeft, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InvoicePage({ invoice, company }: { invoice: any, company: any }) {
    const student = invoice.payment.enrollment.user;
    const course = invoice.payment.enrollment.course;
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 selection:bg-primary/20">
            <Head title={`Invoice ${invoice.invoice_number}`} />
            
            {/* Top Bar - Hidden on print */}
            <div className="max-w-[800px] mx-auto mb-8 flex justify-between items-center print:hidden">
                <Button variant="ghost" onClick={() => window.history.back()} className="text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="size-4 mr-1" /> Back
                </Button>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handlePrint} className="rounded-xl border-border bg-card">
                        <Printer className="size-4 mr-2" /> Print Invoice
                    </Button>
                    <Button onClick={handlePrint} className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-white">
                        <Download className="size-4 mr-2" /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Invoice Container */}
            <div className="max-w-[800px] mx-auto bg-white shadow-2xl shadow-slate-200 border border-slate-200 rounded-[2rem] overflow-hidden print:shadow-none print:border-none print:rounded-none">
                {/* Header Section */}
                <div className="p-12 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-black">LS</div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900">{company.name}</h1>
                        </div>
                        <div className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">
                            {company.address}<br />
                            GSTIN: <span className="font-bold text-slate-900">{company.gstin}</span><br />
                            Email: {company.email}<br />
                            Phone: {company.phone}
                        </div>
                    </div>
                    <div className="text-right flex flex-col justify-end">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Tax Invoice</div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-900">#{invoice.invoice_number}</h2>
                        <div className="text-sm font-medium text-slate-500 mt-2">
                            Date: {new Date(invoice.issued_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Billing Details */}
                <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-3">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Billed To</div>
                        <div className="space-y-1">
                            <div className="text-lg font-black text-slate-900">{student.name}</div>
                            <div className="text-xs text-slate-500 font-medium">
                                Email: {student.email}<br />
                                {student.phone && <>Phone: {student.phone}<br /></>}
                                {invoice.gst_number && (
                                    <div className="mt-2 py-1 px-3 bg-primary/5 border border-primary/10 rounded-lg inline-block">
                                        <span className="text-primary font-bold">GSTIN: {invoice.gst_number}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3 md:text-right">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Place of Supply</div>
                        <div className="text-sm font-bold text-slate-900">Uttar Pradesh (09)</div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-12 pb-12">
                    <div className="border border-slate-100 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 border-b border-slate-100">
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4 text-center">SAC Code</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                <tr>
                                    <td className="px-6 py-6">
                                        <div className="font-bold text-slate-900">{course.title}</div>
                                        <div className="text-xs text-slate-500 font-medium mt-1">Professional Certification Course Enrollment</div>
                                    </td>
                                    <td className="px-6 py-6 text-center font-mono text-slate-400">9992</td>
                                    <td className="px-6 py-6 text-right font-bold text-slate-900">₹{invoice.taxable_amount}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="px-12 pb-12 flex justify-end">
                    <div className="w-full max-w-xs space-y-3">
                        <div className="flex justify-between text-sm font-medium text-slate-500">
                            <span>Taxable Value</span>
                            <span className="text-slate-900">₹{invoice.taxable_amount}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium text-slate-500">
                            <span>CGST (9%)</span>
                            <span className="text-slate-900">₹{invoice.cgst}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium text-slate-500">
                            <span>SGST (9%)</span>
                            <span className="text-slate-900">₹{invoice.sgst}</span>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">Total (Incl. Tax)</span>
                            <span className="text-3xl font-black text-primary">₹{invoice.amount}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="px-12 py-8 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-green-600">
                        <ShieldCheck className="size-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Digitally Verified Invoice</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium text-center md:text-right italic">
                        This is a computer generated invoice and does not require a physical signature.
                    </div>
                </div>
            </div>

            {/* Extra Info */}
            <div className="max-w-[800px] mx-auto mt-8 text-center text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em] print:hidden">
                Thank you for choosing Learn Syntax Academy
            </div>
        </div>
    );
}
