import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Wallet, ArrowUpRight, ArrowDownRight, IndianRupee, History, Clock, Landmark, AlertCircle, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import TeacherLayout from '@/layouts/teacher-layout';

export default function WalletPage({ balance, actual_balance, transactions, withdrawalRequests = [] }: any) {
  
  const pendingSum = withdrawalRequests
    .filter((req: any) => req.status === 'pending')
    .reduce((acc: number, cur: any) => acc + parseFloat(cur.amount), 0);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Head title="Earnings & Settlements Wallet" />
      
      <div className="w-full max-w-6xl mx-auto p-4 lg:p-8 space-y-8 font-sans select-none">
        
        {/* Action Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card p-6 rounded-2xl border border-border shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div>
                <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                    <Wallet className="size-6 text-indigo-500" />
                    Teacher Wallet
                </h1>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Payout clearances automatically refresh upon request validation.</p>
            </div>
            
            <Button asChild className="w-full md:w-auto shrink-0 shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white border-0 h-11 px-6 rounded-xl font-bold text-xs transition-all">
                <Link href="/teacher/wallet/withdraw">
                    <Landmark className="size-4 mr-2" />
                    Withdraw Funds
                </Link>
            </Button>
        </div>

        {/* Capital Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-indigo-950 text-white border-transparent rounded-2xl shadow-md relative overflow-hidden p-6">
                <div className="absolute -right-6 -bottom-6 opacity-10 text-white pointer-events-none">
                    <Wallet className="w-32 h-32" />
                </div>
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest block mb-1">Available To Payout</span>
                <span className="text-3xl font-black tracking-tight text-white flex items-baseline gap-0.5">
                    <span className="text-lg font-medium">₹</span>{balance.toLocaleString()}
                </span>
            </Card>

            <Card className="bg-card text-foreground border border-border rounded-2xl shadow-sm p-6">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Hold / Pending Locks</span>
                <span className="text-2xl font-extrabold tracking-tight text-amber-600 dark:text-amber-500 flex items-baseline gap-0.5">
                    <span className="text-sm font-medium">₹</span>{pendingSum.toLocaleString()}
                </span>
            </Card>

            <Card className="bg-card text-foreground border border-border rounded-2xl shadow-sm p-6">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Gross Total Earnings</span>
                <span className="text-2xl font-extrabold tracking-tight text-foreground flex items-baseline gap-0.5">
                    <span className="text-sm font-medium">₹</span>{actual_balance.toLocaleString()}
                </span>
            </Card>
        </div>

        {/* Bottom Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Credits/Debits Ledger */}
            <Card className="lg:col-span-2 border border-border rounded-2xl bg-card shadow-sm overflow-hidden flex flex-col h-fit">
                <CardHeader className="p-5 bg-muted/20 border-b border-border">
                    <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                        <History className="size-4 text-indigo-500" />
                        Account Ledger
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-border max-h-[400px] overflow-y-auto">
                    {transactions.length === 0 ? (
                        <div className="p-16 text-center text-muted-foreground">
                            <Clock className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-xs font-bold text-foreground">No ledger statements verified yet.</p>
                        </div>
                    ) : (
                        transactions.map((tx: any) => (
                            <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-muted/20 transition-colors text-xs">
                                <div className="flex items-center gap-3">
                                    <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                        {tx.type === 'credit' ? <ArrowDownRight className="size-4" /> : <ArrowUpRight className="size-4" />}
                                    </div>
                                    <div className="font-medium">
                                        <p className="text-foreground font-bold">{tx.description}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(tx.created_at)}</p>
                                    </div>
                                </div>
                                <div className={`font-black text-sm ${tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {tx.type === 'credit' ? '+' : '-'} ₹{parseFloat(tx.amount).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Payout Pipeline */}
            <Card className="border border-border rounded-2xl bg-card shadow-sm overflow-hidden flex flex-col h-fit">
                <CardHeader className="p-5 bg-muted/20 border-b border-border">
                    <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                        <ShieldCheck className="size-4 text-indigo-500" />
                        Settlement Pipeline
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-border">
                    {withdrawalRequests.length === 0 ? (
                        <div className="p-16 text-center text-muted-foreground">
                            <AlertCircle className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-xs font-bold text-foreground">No payouts requested.</p>
                        </div>
                    ) : (
                        withdrawalRequests.map((req: any) => (
                            <div key={req.id} className="p-4 flex flex-col gap-2 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="font-extrabold text-foreground text-sm">₹{parseFloat(req.amount).toLocaleString()}</span>
                                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1 border
                                        ${req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : ''}
                                        ${req.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : ''}
                                        ${req.status === 'rejected' ? 'bg-red-500/10 text-red-600 border-red-500/20' : ''}
                                    `}>
                                        {req.status === 'approved' && <CheckCircle2 className="size-3" />}
                                        {req.status === 'rejected' && <XCircle className="size-3" />}
                                        {req.status === 'pending' && <Clock className="size-3" />}
                                        {req.status}
                                    </span>
                                </div>
                                <div className="text-[10px] text-muted-foreground border-t border-border/40 pt-2 mt-1 flex flex-col gap-1">
                                    <div className="flex justify-between items-center">
                                        <span>Bank:</span>
                                        <span className="font-bold text-foreground">{req.bank_name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Requested:</span>
                                        <span className="font-bold text-foreground">{formatDate(req.created_at)}</span>
                                    </div>
                                    {req.admin_notes && (
                                        <div className="mt-1 p-2 rounded bg-red-500/5 border border-red-500/10 text-red-500 text-[9px]">
                                            <strong>Note:</strong> {req.admin_notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>

      </div>
    </>
  );
}

WalletPage.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Instructor', href: '/teacher/dashboard' }, { title: 'Wallet', href: '/teacher/wallet' }]}>
        {page}
    </TeacherLayout>
);
