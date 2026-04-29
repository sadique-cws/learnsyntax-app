import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, Briefcase, Wallet, GraduationCap, History, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

export default function AdminTeacherShow({ teacher }: any) {
  return (
    <>
      <Head title={`Instructor Profile: ${teacher.user.name}`} />
      
      <div className="w-full p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header / Back Nav */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
                <Button asChild variant="ghost" size="icon" className="size-10 rounded-xl text-muted-foreground hover:bg-muted border border-border/40">
                    <Link href="/admin/teachers">
                        <ArrowLeft className="size-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                        {teacher.user.name}
                    </h1>
                    <p className="text-xs font-medium text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Briefcase className="size-3" />
                        {teacher.user.email}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 shadow-sm">
                <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Wallet Earnings</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-500">₹{teacher.wallet_balance.toLocaleString()}</span>
                </div>
                <div className="h-8 w-px bg-border/60" />
                <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Platform Commission</span>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-500">{teacher.commission_percent}%</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Side - Courses & stats */}
            <div className="lg:col-span-1 space-y-8">
                <Card className="border border-border bg-card shadow-sm overflow-hidden rounded-2xl">
                    <CardHeader className="p-5 border-b border-border bg-muted/20 flex flex-row items-center gap-2">
                        <GraduationCap className="size-4 text-indigo-500" />
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Assigned Courses</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 divide-y divide-border">
                        {teacher.courses.length === 0 ? (
                            <div className="p-8 text-center text-xs text-muted-foreground italic">
                                No courses managed by this instructor yet.
                            </div>
                        ) : (
                            teacher.courses.map((course: any) => (
                                <div key={course.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                                    <div>
                                        <p className="font-bold text-xs text-foreground">{course.title}</p>
                                        <span className="text-[10px] font-medium text-muted-foreground mt-0.5 block">₹{course.price.toLocaleString()}</span>
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${course.is_active ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                                        {course.is_active ? 'Active' : 'Draft'}
                                    </span>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Right Side - Wallet transactions / requests */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Wallet History */}
                <Card className="border border-border bg-card shadow-sm overflow-hidden rounded-2xl">
                    <CardHeader className="p-5 border-b border-border bg-muted/20 flex flex-row items-center gap-2">
                        <History className="size-4 text-indigo-500" />
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Wallet Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 divide-y divide-border max-h-[400px] overflow-y-auto">
                        {teacher.wallet_transactions?.length === 0 ? (
                            <div className="p-12 text-center text-xs text-muted-foreground italic">
                                No credits or debits posted.
                            </div>
                        ) : (
                            teacher.wallet_transactions?.map((tx: any) => (
                                <div key={tx.id} className="p-4 flex items-center justify-between text-xs font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-7 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'}`}>
                                            <span className="font-black">{tx.type === 'credit' ? '+' : '-'}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{tx.description}</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(tx.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        ₹{tx.amount.toLocaleString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Payout Requests */}
                <Card className="border border-border bg-card shadow-sm overflow-hidden rounded-2xl">
                    <CardHeader className="p-5 border-b border-border bg-muted/20 flex flex-row items-center gap-2">
                        <Wallet className="size-4 text-indigo-500" />
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Settlement Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 divide-y divide-border">
                        {teacher.withdrawal_requests?.length === 0 ? (
                            <div className="p-12 text-center text-xs text-muted-foreground italic">
                                No payout requests filed.
                            </div>
                        ) : (
                            teacher.withdrawal_requests?.map((req: any) => (
                                <div key={req.id} className="p-4 flex flex-col gap-2 text-xs font-medium">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-foreground text-sm">₹{req.amount.toLocaleString()}</span>
                                        <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-md tracking-wide flex items-center gap-1
                                            ${req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : ''}
                                            ${req.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : ''}
                                            ${req.status === 'rejected' ? 'bg-red-500/10 text-red-600 border border-red-500/20' : ''}
                                        `}>
                                            {req.status === 'approved' && <CheckCircle2 className="size-3" />}
                                            {req.status === 'rejected' && <XCircle className="size-3" />}
                                            {req.status === 'pending' && <Clock className="size-3" />}
                                            {req.status}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground border-t border-border/40 pt-2 mt-1 flex justify-between items-center">
                                        <span>{req.bank_name} (Account: ••••{req.account_number.slice(-4)})</span>
                                        <span>{new Date(req.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
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
