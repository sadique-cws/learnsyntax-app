import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, GraduationCap, History, Wallet, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

export default function AdminTeacherShow({ teacher }: any) {
  return (
    <>
      <Head title={`Teacher: ${teacher.user.name}`} />

      <div className="w-full p-4 space-y-4">
        {/* Back + Header */}
        <Link href="/admin/teachers" className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-3" /> Back to Teachers
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-sm border border-border">
            <div>
                <h1 className="text-lg font-semibold text-foreground">{teacher.user.name}</h1>
                <p className="text-xs text-muted-foreground mt-0.5">{teacher.user.email}</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-[10px] text-muted-foreground">Wallet Balance</div>
                    <div className="text-sm font-semibold text-emerald-600 tabular-nums">₹{teacher.wallet_balance.toLocaleString()}</div>
                </div>
                <div className="h-6 w-px bg-border" />
                <div className="text-right">
                    <div className="text-[10px] text-muted-foreground">Commission</div>
                    <div className="text-sm font-semibold text-foreground tabular-nums">{teacher.commission_percent}%</div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Courses */}
            <div className="rounded-sm border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/5">
                    <GraduationCap className="size-3.5 text-muted-foreground/50" />
                    <h2 className="text-xs font-semibold text-foreground">Assigned Courses</h2>
                </div>
                <div className="divide-y divide-border">
                    {teacher.courses.length === 0 ? (
                        <div className="py-8 text-center text-xs text-muted-foreground">No courses assigned</div>
                    ) : teacher.courses.map((course: any) => (
                        <div key={course.id} className="px-3 py-2.5 flex items-center justify-between hover:bg-muted/5 transition-colors">
                            <div>
                                <div className="text-sm font-medium text-foreground">{course.title}</div>
                                <div className="text-xs text-muted-foreground tabular-nums">₹{course.price.toLocaleString()}</div>
                            </div>
                            <span className={cn(
                                "inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium border",
                                course.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                            )}>
                                {course.is_active ? 'Active' : 'Draft'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Wallet Transactions + Payout Requests */}
            <div className="lg:col-span-2 space-y-4">
                <div className="rounded-sm border border-border overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/5">
                        <History className="size-3.5 text-muted-foreground/50" />
                        <h2 className="text-xs font-semibold text-foreground">Wallet Transactions</h2>
                    </div>
                    <div className="divide-y divide-border max-h-[350px] overflow-y-auto">
                        {teacher.wallet_transactions?.length === 0 ? (
                            <div className="py-8 text-center text-xs text-muted-foreground">No transactions</div>
                        ) : teacher.wallet_transactions?.map((tx: any) => (
                            <div key={tx.id} className="px-3 py-2.5 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2.5">
                                    <div className={cn(
                                        "size-6 rounded-sm flex items-center justify-center text-xs font-semibold border shrink-0",
                                        tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                                    )}>
                                        {tx.type === 'credit' ? '+' : '-'}
                                    </div>
                                    <div>
                                        <div className="font-medium text-foreground">{tx.description}</div>
                                        <div className="text-[10px] text-muted-foreground">{new Date(tx.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                                    </div>
                                </div>
                                <span className={cn("font-medium tabular-nums", tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600')}>
                                    ₹{tx.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-sm border border-border overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/5">
                        <Wallet className="size-3.5 text-muted-foreground/50" />
                        <h2 className="text-xs font-semibold text-foreground">Payout Requests</h2>
                    </div>
                    <div className="divide-y divide-border">
                        {teacher.withdrawal_requests?.length === 0 ? (
                            <div className="py-8 text-center text-xs text-muted-foreground">No payout requests</div>
                        ) : teacher.withdrawal_requests?.map((req: any) => (
                            <div key={req.id} className="px-3 py-2.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-foreground tabular-nums">₹{req.amount.toLocaleString()}</span>
                                    <span className={cn(
                                        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-medium border capitalize",
                                        req.status === 'approved' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                                        req.status === 'pending' && 'bg-amber-50 text-amber-600 border-amber-100',
                                        req.status === 'rejected' && 'bg-red-50 text-red-600 border-red-100'
                                    )}>
                                        {req.status === 'approved' && <CheckCircle2 className="size-2.5" />}
                                        {req.status === 'rejected' && <XCircle className="size-2.5" />}
                                        {req.status === 'pending' && <Clock className="size-2.5" />}
                                        {req.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1.5 pt-1.5 border-t border-border">
                                    <span>{req.bank_name} (••••{req.account_number.slice(-4)})</span>
                                    <span>{new Date(req.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}

AdminTeacherShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Teachers', href: '/admin/teachers' }, { title: 'Profile', href: '#' }]}>
        {page}
    </AppLayout>
);
