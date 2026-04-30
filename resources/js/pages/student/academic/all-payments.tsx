import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { CreditCard, FileText, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

interface AllPaymentsProps {
    payments: any[];
}

export default function AllPayments({ payments = [] }: AllPaymentsProps) {
    return (
        <>
            <Head title="My Payments" />
            <div className="w-full p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Billing & Transactions</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Manage your course enrollments and invoices</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="h-8 rounded-sm text-xs cursor-pointer shadow-none">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <ArrowLeft className="size-3.5" /> Back to Dashboard
                        </Link>
                    </Button>
                </div>

                <div className="rounded-sm border border-border bg-card overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/5">
                        <div className="flex items-center gap-1.5">
                            <CreditCard className="size-4 text-primary" />
                            <h2 className="text-sm font-semibold text-foreground">Transaction History</h2>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm tabular-nums border border-emerald-100">
                            {payments.length} Payments
                        </span>
                    </div>
                    
                    {payments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border bg-muted/5">
                                        <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Course</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {payments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-muted/5 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="text-sm font-semibold text-foreground">{payment.enrollment?.course?.title || 'Course Enrollment'}</div>
                                                <div className="text-[10px] text-muted-foreground">ID: {payment.transaction_id || payment.id}</div>
                                            </td>
                                            <td className="px-4 py-4 text-xs text-muted-foreground tabular-nums">
                                                {new Date(payment.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-bold text-foreground tabular-nums">
                                                ₹{parseFloat(payment.amount).toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-bold border uppercase",
                                                    ['paid', 'completed'].includes(payment.status) 
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                                        : "bg-amber-50 text-amber-600 border-amber-100"
                                                )}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                {payment.invoice ? (
                                                    <Button asChild variant="outline" size="sm" className="h-7 px-3 rounded-sm text-[10px] font-medium shadow-none border-border hover:bg-muted cursor-pointer">
                                                        <a href={`/admin/invoices/${payment.invoice.id}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                                                            <Download className="size-3" /> Invoice
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    <span className="text-[10px] text-muted-foreground">Processing...</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <CreditCard className="size-12 text-muted-foreground/15 mx-auto mb-3" />
                            <h3 className="text-sm font-semibold text-foreground">No transactions found</h3>
                            <p className="text-xs text-muted-foreground mt-1">Your payment history will appear here once you enroll in a course.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

AllPayments.layout = (page: React.ReactNode) => (
    <AppLayout>
        {page}
    </AppLayout>
);
