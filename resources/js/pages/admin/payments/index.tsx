import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Receipt, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminPaymentIndex({ payments }: { payments: any[] }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    
    const formatDate = (date: string) => mounted ? new Date(date).toLocaleDateString() : '';
    return (
        <>
            <Head title="Payments & Revenue" />
            
            <div className="w-full p-4 lg:p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">Payments & Revenue</h1>
                    <p className="text-muted-foreground text-sm">Track all student transactions and generated invoices.</p>
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden ">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Transaction</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Course</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="p-4">
                                            <div className="font-mono text-[10px] font-bold text-primary">{payment.transaction_id}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase">{payment.payment_method}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                                                    <User className="size-4 text-muted-foreground" />
                                                </div>
                                                <div className="text-sm font-medium">{payment.enrollment.user.name}</div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium">{payment.enrollment.course.title}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase">Enrolled on {formatDate(payment.created_at)}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-sm">${payment.amount}</div>
                                            <div className="text-[10px] text-green-600 font-bold uppercase">{payment.status}</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="outline" size="sm" className="rounded-lg h-8 text-xs ">
                                                <Receipt className="size-3.5 mr-2" />
                                                {payment.invoice?.invoice_number}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
