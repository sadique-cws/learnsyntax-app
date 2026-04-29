import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Wallet, IndianRupee, Sparkles, TrendingUp, ChevronRight, User } from 'lucide-react';
import TeacherLayout from '@/layouts/teacher-layout';

export default function TeacherDashboard({ stats }: any) {
  const { auth } = usePage().props as any;
  const user = auth?.user;

  return (
    <>
      <Head title="Instructor Registry" />
      <div className="w-full p-4 lg:p-6 space-y-6">
        
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 shadow-none">
          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                <User className="size-3" /> Core Protocol
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-tight mb-2">
                Operational_Status: Online, {user?.name.split(' ')[0]}
              </h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] max-w-xl italic opacity-60">
                Synchronizing instructor assets, revenue streams, and academic delivery protocols for the current cycle.
              </p>
            </div>
            
            <div className="flex flex-row gap-2 w-full md:w-auto shrink-0">
              <Link 
                href="/teacher/courses" 
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 transition-all active:translate-y-px shadow-none"
              >
                <BookOpen className="size-3.5" />
                Asset Management
              </Link>
              <Link 
                href="/teacher/wallet" 
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-6 py-2.5 rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-slate-700 transition-all active:translate-y-px shadow-none"
              >
                <Wallet className="size-3.5" />
                Yield Report
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background rounded-xl border border-border p-6 shadow-none hover:border-primary/30 transition-colors group relative overflow-hidden">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <BookOpen className="size-20 text-primary" />
            </div>
            <div className="flex items-center justify-between mb-8">
                <div className="size-10 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
                    <BookOpen className="size-5 text-primary" />
                </div>
                <div className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded border border-primary/10">Active_Units</div>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic opacity-60">Academic Portfolio</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{stats.courses}</h3>
            </div>
          </div>

          <div className="bg-background rounded-xl border border-border p-6 shadow-none hover:border-emerald-500/30 transition-colors group relative overflow-hidden">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp className="size-20 text-emerald-500" />
            </div>
            <div className="flex items-center justify-between mb-8">
                <div className="size-10 rounded-lg bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10">
                    <TrendingUp className="size-5 text-emerald-500" />
                </div>
                <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">Market_Yield</div>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic opacity-60">Cumulative Sales</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">₹{stats.total_sales.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-background rounded-xl border border-border p-6 shadow-none hover:border-accent/30 transition-colors group relative overflow-hidden">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Wallet className="size-20 text-accent" />
            </div>
            <div className="flex items-center justify-between mb-8">
                <div className="size-10 rounded-lg bg-accent/5 flex items-center justify-center border border-accent/10">
                    <Wallet className="size-5 text-accent" />
                </div>
                <div className="text-[9px] font-black text-accent uppercase tracking-widest bg-accent/5 px-2 py-0.5 rounded border border-accent/10">Liquid_Capital</div>
            </div>
            <div className="space-y-4">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic opacity-60">Wallet Protocol</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">₹{stats.wallet_balance.toLocaleString()}</h3>
                </div>
                <Link href="/teacher/wallet" className="flex items-center justify-between text-accent hover:text-accent/80 font-black text-[9px] uppercase tracking-widest border-t border-border pt-4 mt-4 transition-all">
                    <span>Synchronize Ledger</span>
                    <ChevronRight className="size-3" />
                </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

TeacherDashboard.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Instructor Registry', href: '#' }, { title: 'Operational Dashboard', href: '/teacher/dashboard' }]}>
        {page}
    </TeacherLayout>
);
