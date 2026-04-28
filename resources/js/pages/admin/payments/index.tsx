import { Head } from '@inertiajs/react';
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
                    <div className="size-10 rounded bg-primary/5 border border-primary/10 flex items-center justify-center font-black text-primary text-xs shrink-0">
                        <CreditCard className="size-4" />
                    </div>
                    <div>
                        <div className="font-mono text-[10px] font-bold text-primary">{payment.transaction_id}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{payment.payment_method}</div>
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
                    <div className="text-sm font-bold text-foreground">{payment.enrollment.user.name}</div>
                </div>
            )
        },
        {
            key: 'course_title',
            label: 'Program',
            sortable: false,
            render: (payment) => (
                <div>
                    <div className="text-sm font-bold text-foreground">{payment.enrollment.course.title}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Paid on {formatDate(payment.created_at)}</div>
                </div>
            )
        },
        {
            key: 'amount',
            label: 'Amount',
            sortable: true,
            render: (payment) => (
                <div>
                    <div className="font-black text-sm">₹{payment.amount}</div>
                    <div className="text-[10px] text-green-600 font-black uppercase tracking-widest">{payment.status}</div>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Payments & Revenue" />
            
            <div className="w-full p-4 lg:p-6">
                <AdminDataTable 
                    title="Financial Ledger"
                    subtitle="Track all student transactions and generated invoices"
                    data={payments}
                    columns={columns}
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
                            <Button variant="outline" size="sm" className="rounded h-8 text-[10px] font-black uppercase tracking-widest px-3 border-border bg-card">
                                <Receipt className="size-3 mr-2" />
                                {payment.invoice?.invoice_number || 'No Invoice'}
                            </Button>
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
