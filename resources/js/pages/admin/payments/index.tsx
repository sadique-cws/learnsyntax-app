import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Receipt, User, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function AdminPaymentIndex({ payments }: { payments: any[] }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const formatDate = (date: string) => mounted ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

    const columns: Column<any>[] = [
        {
            key: 'transaction_id', label: 'Transaction', sortable: true,
            render: (payment) => (
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <CreditCard className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs font-mono font-medium text-foreground">{payment.transaction_id}</div>
                        <div className="text-[10px] text-muted-foreground capitalize">{payment.payment_method}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'user_name', label: 'Student',
            render: (payment) => (
                <div className="flex items-center gap-2">
                    <User className="size-3 text-muted-foreground/50" />
                    <span className="text-sm font-medium text-foreground">{payment.enrollment.user.name}</span>
                </div>
            )
        },
        {
            key: 'course_title', label: 'Course',
            render: (payment) => (
                <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{payment.enrollment.course.title}</div>
                    <div className="text-[10px] text-muted-foreground">{formatDate(payment.created_at)}</div>
                </div>
            )
        },
        {
            key: 'amount', label: 'Amount', sortable: true,
            render: (payment) => (
                <div>
                    <div className="text-sm font-medium text-foreground tabular-nums">₹{payment.amount}</div>
                    <span className={`text-[10px] font-medium ${payment.status === 'paid' ? 'text-emerald-600' : payment.status === 'failed' ? 'text-red-500' : 'text-amber-600'}`}>{payment.status}</span>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Payments" />
            <div className="w-full p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Payments</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{payments.length} transactions</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="h-8 px-3 rounded-sm text-xs shadow-none">
                        <Link href="/admin/payments/gst-report">GST Report</Link>
                    </Button>
                </div>
                <div className="rounded-sm border border-border overflow-hidden">
                    <AdminDataTable title="All Payments" data={payments} columns={columns} dateFilterKey="created_at"
                        filterableColumns={[{ key: 'status', label: 'Status', options: [{ label: 'Paid', value: 'paid' }, { label: 'Pending', value: 'pending' }, { label: 'Failed', value: 'failed' }] }]}
                        searchPlaceholder="Search transactions..."
                        actions={(payment) => (
                            <div className="flex items-center justify-end">
                                {payment.invoice ? (
                                    <Button asChild variant="ghost" size="sm" className="h-7 px-2 rounded-sm text-xs font-medium text-muted-foreground hover:text-foreground">
                                        <Link href={`/admin/invoices/${payment.invoice.id}`}><Receipt className="size-3 mr-1" /> {payment.invoice.invoice_number}</Link>
                                    </Button>
                                ) : (
                                    <Button onClick={() => router.post(`/admin/payments/${payment.id}/generate-invoice`)} variant="ghost" size="sm" className="h-7 px-2 rounded-sm text-xs font-medium text-primary hover:bg-primary/5">
                                        Generate Invoice
                                    </Button>
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>
        </>
    );
}

AdminPaymentIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Payments', href: '/admin/payments' }]}>{page}</AppLayout>
);
