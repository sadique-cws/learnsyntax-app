import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Receipt, User, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function AdminPaymentIndex({ payments }: { payments: any[] }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    
    const formatDate = (date: string) => mounted ? new Date(date).toLocaleDateString() : '';

    const columns: Column<any>[] = [
        {
            key: 'transaction_id',
            label: 'Transaction',
            sortable: true,
            render: (payment) => (
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded bg-primary/5 border border-primary/10 flex items-center justify-center font-medium text-primary text-xs shrink-0">
                        <CreditCard className="size-4" />
                    </div>
                    <div>
                        <div className="font-mono text-[10px] font-medium text-primary">{payment.transaction_id}</div>
                        <div className="flex items-center gap-2">
                            <div className="text-[10px] text-muted-foreground font-medium tracking-tight">{payment.payment_method}</div>
                            {payment.invoice?.gst_number && (
                                <div className="text-[9px] bg-primary/10 text-primary px-1.5 rounded border border-primary/20 font-medium">GST: {payment.invoice.gst_number}</div>
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
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="size-4 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-medium text-foreground">{payment.enrollment.user.name}</div>
                </div>
            )
        },
        {
            key: 'course_title',
            label: 'Program',
            sortable: false,
            render: (payment) => (
                <div>
                    <div className="text-sm font-medium text-foreground">{payment.enrollment.course.title}</div>
                    <div className="text-[10px] text-muted-foreground font-medium tracking-tight">Paid on {formatDate(payment.created_at)}</div>
                </div>
            )
        },
        {
            key: 'sac_code',
            label: 'SAC Code',
            render: (payment) => (
                <div className="font-mono text-[10px] text-muted-foreground">{payment.invoice?.sac_code || '9992'}</div>
            )
        },
        {
            key: 'amount',
            label: 'Amount',
            sortable: true,
            render: (payment) => (
                <div>
                    <div className="font-medium text-sm">₹{payment.amount}</div>
                    <div className="text-[10px] text-green-600 font-medium tracking-tight uppercase tracking-widest text-[8px]">{payment.status}</div>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Payments & Revenue" />
            
            <div className="w-full p-4 lg:p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-medium tracking-tight">Financial Ledger</h1>
                        <p className="text-muted-foreground text-xs font-medium tracking-tight mt-1">Track all student transactions and generated invoices</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline" className="rounded h-10 px-6 font-medium text-xs border-border bg-card">
                            <Link href="/admin/payments/gst-report">GST Report</Link>
                        </Button>
                    </div>
                </div>

                <AdminDataTable 
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
                    searchPlaceholder="Search transactions..."
                    actions={(payment) => (
                        <div className="flex items-center justify-end">
                            {payment.invoice ? (
                                <Button asChild variant="outline" size="sm" className="rounded h-8 text-[10px] font-medium tracking-tight px-3 border-border bg-card">
                                    <Link href={`/admin/invoices/${payment.invoice.id}`}>
                                        <Receipt className="size-3 mr-2" />
                                        {payment.invoice.invoice_number}
                                    </Link>
                                </Button>
                            ) : (
                                <Button 
                                    onClick={() => router.post(`/admin/payments/${payment.id}/generate-invoice`)}
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded h-8 text-[10px] font-bold uppercase tracking-wider px-3 border-primary text-primary hover:bg-primary/5"
                                >
                                    Generate Invoice
                                </Button>
                            )}
                        </div>
                    )}
                />
            </div>
        </>
    );
}

AdminPaymentIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Payments & Revenue', href: '/admin/payments' }]}>
        {page}
    </AppLayout>
);
