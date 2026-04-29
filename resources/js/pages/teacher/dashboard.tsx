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
      <Head title="Instructor Dashboard" />
      <div className="w-full max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        
        {/* Welcome Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
             <Sparkles className="w-64 h-64 text-white animate-pulse" />
          </div>
          <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-20"></div>
          
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-6 backdrop-blur-md">
                <User className="size-3.5" />
                Instructor Portal
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
                Welcome back, {user?.name.split(' ')[0]}!
              </h1>
              <p className="text-indigo-200 text-base md:text-lg max-w-xl leading-relaxed">
                Here's what's happening with your courses and earnings today. Keep up the great work and continue inspiring your students.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
              <Link 
                href="/teacher/courses" 
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-950 px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-50 transition-all hover:scale-105 shadow-lg shadow-white/20"
              >
                <BookOpen className="size-4" />
                Manage Courses
              </Link>
              <Link 
                href="/teacher/wallet" 
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold backdrop-blur-md transition-all hover:scale-105"
              >
                <Wallet className="size-4" />
                View Wallet
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg shadow-blue-900/5 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden group hover:shadow-xl hover:shadow-blue-500/20 transition-all">
            <div className="absolute -right-6 -top-6 text-white/10 group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="size-32" />
            </div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20">
                  <BookOpen className="size-6 text-white" />
                </div>
                <div className="text-blue-100 font-medium text-sm flex items-center gap-1">
                  Active
                </div>
              </div>
              <div>
                <p className="text-blue-100 font-semibold mb-1">Total Courses</p>
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">{stats.courses}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-emerald-900/5 bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/20 transition-all">
            <div className="absolute -right-6 -top-6 text-white/10 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="size-32" />
            </div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20">
                  <TrendingUp className="size-6 text-white" />
                </div>
                <div className="text-emerald-100 font-medium text-sm flex items-center gap-1">
                  Lifetime
                </div>
              </div>
              <div>
                <p className="text-emerald-100 font-semibold mb-1">Total Sales</p>
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">₹{stats.total_sales.toLocaleString()}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-purple-900/5 bg-gradient-to-br from-purple-500 to-fuchsia-600 relative overflow-hidden group hover:shadow-xl hover:shadow-purple-500/20 transition-all">
            <div className="absolute -right-6 -top-6 text-white/10 group-hover:scale-110 transition-transform duration-500">
                <IndianRupee className="size-32" />
            </div>
            <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20">
                    <Wallet className="size-6 text-white" />
                    </div>
                    <div className="text-purple-100 font-medium text-sm flex items-center gap-1">
                    Available
                    </div>
                </div>
                <div>
                    <p className="text-purple-100 font-semibold mb-1">Wallet Balance</p>
                    <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">₹{stats.wallet_balance.toLocaleString()}</h3>
                </div>
              </div>
              <Link href="/teacher/wallet" className="mt-6 flex items-center justify-between text-white/80 hover:text-white font-medium text-sm group/link">
                <span>View Transactions</span>
                <ChevronRight className="size-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </>
  );
}

TeacherDashboard.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Instructor', href: '#' }, { title: 'Dashboard', href: '/teacher/dashboard' }]}>
        {page}
    </TeacherLayout>
);
