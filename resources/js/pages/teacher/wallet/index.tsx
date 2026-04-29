import React from 'react';
import { Head } from '@inertiajs/react';
import { Wallet, ArrowUpRight, ArrowDownRight, IndianRupee, History, Clock } from 'lucide-react';
import TeacherLayout from '@/layouts/teacher-layout';

export default function WalletPage({ balance, transactions }: any) {
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
                <p className="text-sm text-muted-foreground mt-1 font-medium">Manage your balance and review payout history.</p>
            </div>
            
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 md:p-8 shadow-xl shadow-indigo-900/10 min-w-[320px]">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <IndianRupee className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <p className="text-indigo-200 font-semibold text-sm tracking-wide uppercase mb-2">Available Balance</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white/70">₹</span>
                        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight">{balance.toLocaleString()}</h2>
                    </div>
                </div>
            </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mt-8">
            <div className="p-6 border-b border-border flex items-center gap-2 bg-muted/30">
                <History className="size-5 text-indigo-500" />
                <h3 className="text-lg font-bold text-foreground">Transaction History</h3>
            </div>
            
            <div className="divide-y divide-border">
                {transactions.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                        <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4 border border-border">
                            <Clock className="size-6 text-muted-foreground/50" />
                        </div>
                        <h4 className="text-base font-semibold text-foreground">No transactions yet</h4>
                        <p className="text-sm text-muted-foreground mt-1">When you make a sale, it will appear here.</p>
                    </div>
                ) : (
                    transactions.map((tx: any) => (
                        <div key={tx.id} className="flex justify-between items-center p-5 hover:bg-muted/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                    {tx.type === 'credit' ? <ArrowDownRight className="size-5" /> : <ArrowUpRight className="size-5" />}
                                </div>
                                <div>
                                    <p className="font-bold text-foreground group-hover:text-indigo-500 transition-colors">{tx.description}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Clock className="size-3 text-muted-foreground/80" />
                                        <p className="text-xs font-medium text-muted-foreground">{new Date(tx.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`font-black text-lg flex items-center gap-0.5 ${tx.type === 'credit' ? 'text-emerald-500' : 'text-red-500'}`}>
                                {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                            </div>
                        </div>
                    ))
                )}
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
