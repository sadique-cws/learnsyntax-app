import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Wallet, ArrowUpRight, ArrowDownRight, IndianRupee, History, Clock, Landmark, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TeacherLayout from '@/layouts/teacher-layout';

export default function WalletPage({ balance, transactions, withdrawalRequests = [] }: any) {
  return (
    <>
      <Head title="My Earnings Wallet" />
      <div className="w-full max-w-5xl mx-auto p-4 lg:p-8 space-y-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                    <Wallet className="size-8 text-indigo-500" />
                    Earnings Wallet
                </h1>
                <p className="text-sm text-muted-foreground mt-1 font-medium">Manage your balance, review sales, and withdraw earnings.</p>
            </div>
            
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-900/10 min-w-[340px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <IndianRupee className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                    <p className="text-indigo-200 font-semibold text-xs tracking-wider uppercase mb-1">Available Balance</p>
                    <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-2xl font-bold text-white/70">₹</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{balance.toLocaleString()}</h2>
                    </div>
                        <Button asChild className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur rounded-xl text-xs font-bold h-10">
                            <Link href="/teacher/wallet/withdraw">
                                <Landmark className="size-3.5 mr-2" />
                                Request Withdrawal
                            </Link>
                        </Button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Transactions Section */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-fit">
                <div className="p-5 border-b border-border flex items-center gap-2 bg-muted/30">
                    <History className="size-4 text-indigo-500" />
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Sales & Credits</h3>
                </div>
                
                <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                    {transactions.length === 0 ? (
                        <div className="p-12 flex flex-col items-center justify-center text-center text-muted-foreground">
                            <Clock className="size-8 mb-3 text-muted-foreground/30" />
                            <p className="text-sm font-semibold text-foreground">No sales history yet</p>
                        </div>
                    ) : (
                        transactions.map((tx: any) => (
                            <div key={tx.id} className="flex justify-between items-center p-4 hover:bg-muted/50 transition-colors group text-sm">
                                <div className="flex items-center gap-3">
                                    <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                        {tx.type === 'credit' ? <ArrowDownRight className="size-4" /> : <ArrowUpRight className="size-4" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground group-hover:text-indigo-500 transition-colors">{tx.description}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(tx.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className={`font-extrabold ${tx.type === 'credit' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Payout Requests Tracker */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-fit">
                <div className="p-5 border-b border-border flex items-center gap-2 bg-muted/30">
                    <Landmark className="size-4 text-indigo-500" />
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Payout Status</h3>
                </div>
                
                <div className="divide-y divide-border">
                    {withdrawalRequests.length === 0 ? (
                        <div className="p-12 flex flex-col items-center justify-center text-center text-muted-foreground">
                            <AlertCircle className="size-8 mb-3 text-muted-foreground/30" />
                            <p className="text-xs font-semibold text-foreground">No payout requests made</p>
                        </div>
                    ) : (
                        withdrawalRequests.map((req: any) => (
                            <div key={req.id} className="p-4 flex flex-col gap-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-foreground">₹{req.amount.toLocaleString()}</span>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md tracking-wide flex items-center gap-1
                                        ${req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : ''}
                                        ${req.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : ''}
                                        ${req.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : ''}
                                    `}>
                                        {req.status === 'approved' && <CheckCircle2 className="size-3" />}
                                        {req.status === 'rejected' && <XCircle className="size-3" />}
                                        {req.status === 'pending' && <Clock className="size-3" />}
                                        {req.status}
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground border-t border-border/50 pt-2 mt-1 flex justify-between items-center">
                                    <span>{req.bank_name} (••••{req.account_number.slice(-4)})</span>
                                    <span>{new Date(req.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
      </div>
    </>
  );
}

WalletPage.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Instructor', href: '/teacher/dashboard' }, { title: 'Earnings Wallet', href: '/teacher/wallet' }]}>
        {page}
    </TeacherLayout>
);
