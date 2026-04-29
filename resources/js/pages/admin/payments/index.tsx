import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Receipt, User, CreditCard, Banknote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function AdminPaymentIndex({ payments }: { payments: any[] }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    
    const formatDate = (date: string) => mounted ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

    const columns: Column<any>[] = [
        {
            key: 'transaction_id',
            label: 'Transaction',
            sortable: true,
            render: (payment) => (
                <div className="flex items-center gap-2.5 py-1">
                    <div className="size-8 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center font-black text-primary text-[10px] shrink-0">
                        <CreditCard className="size-3" />
                    </div>
                    <div>
                        <div className="font-black text-[11px] text-primary uppercase tracking-wider">{payment.transaction_id}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{payment.payment_method}</div>
                            {payment.invoice?.gst_number && (
                                <div className="text-[8px] bg-primary/10 text-primary px-1 py-0.5 rounded-sm border border-primary/20 font-black uppercase tracking-widest leading-none">GST: {payment.invoice.gst_number}</div>
                            )}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'user_name',
            label: 'Student',
            sortable: false,
            render: (payment) => (
                <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-sm bg-muted/50 border border-border flex items-center justify-center">
                        <User className="size-3 text-muted-foreground" />
                    </div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-900">{payment.enrollment.user.name}</div>
                </div>
            )
        },
        {
            key: 'course_title',
            label: 'Program',
            sortable: false,
            render: (payment) => (
                <div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-900">{payment.enrollment.course.title}</div>
                    <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-0.5 opacity-60">Paid on {formatDate(payment.created_at)}</div>
                </div>
            )
        },
        {
            key: 'sac_code',
            label: 'SAC Code',
            render: (payment) => (
                <div className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">{payment.invoice?.sac_code || '9992'}</div>
            )
        },
        {
            key: 'amount',
            label: 'Amount',
            sortable: true,
            render: (payment) => (
                <div>
                    <div className="font-black text-[12px] text-slate-900">₹{payment.amount}</div>
                    <div className="text-[9px] text-green-600 font-black uppercase tracking-widest mt-0.5">{payment.status}</div>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Payments & Revenue" />
            
            <div className="w-full p-4 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-border pb-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-1.5">
                            <Banknote className="size-3" /> Core Registry
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Financial Ledger</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Track transactions, reconcile payments, and generate tax invoices.</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button asChild variant="outline" className="rounded-sm h-9 px-4 font-black uppercase tracking-widest text-[10px] border border-border bg-muted/5 hover:bg-muted/10 shadow-none w-full md:w-auto">
                            <Link href="/admin/payments/gst-report">GST Output</Link>
                        </Button>
                    </div>
                </div>

                <div className="bg-background rounded-sm border border-border shadow-none overflow-hidden">
                    <AdminDataTable 
                        title="Transaction Board"
                        subtitle="Centralized view of all processed payments"
                        data={payments}
                        columns={columns}
                        dateFilterKey="created_at"
                        filterableColumns={[
                            {
                                key: 'status',
                                label: 'Payment Status',
                                options: [
                                    { label: 'Paid', value: 'paid' },
                                    { label: 'Pending', value: 'pending' },
                                    { label: 'Failed', value: 'failed' },
                                ]
                            }
                        ]}
                        searchPlaceholder="Filter transactions by metadata..."
                        actions={(payment) => (
                            <div className="flex items-center justify-end">
                                {payment.invoice ? (
                                    <Button asChild variant="outline" size="sm" className="rounded-sm h-7 text-[9px] font-black uppercase tracking-widest px-2.5 border border-border bg-muted/5 hover:bg-muted/10 shadow-none">
                                        <Link href={`/admin/invoices/${payment.invoice.id}`} className="flex items-center">
                                            <Receipt className="size-2.5 mr-1.5" />
                                            {payment.invoice.invoice_number}
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={() => router.post(`/admin/payments/${payment.id}/generate-invoice`)}
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-sm h-7 text-[9px] font-black uppercase tracking-widest px-2.5 border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 shadow-none"
                                    >
                                        Deploy Invoice
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
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Payments & Revenue', href: '/admin/payments' }]}>
        {page}
    </AppLayout>
);
