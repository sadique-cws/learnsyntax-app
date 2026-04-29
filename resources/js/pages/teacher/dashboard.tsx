import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, Wallet, IndianRupee, TrendingUp, ChevronRight, ArrowRight, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TeacherLayout from '@/layouts/teacher-layout';

export default function TeacherDashboard({ stats }: any) {
    const { auth } = usePage().props as any;
    const user = auth?.user;

    return (
        <>
            <Head title="Teacher Dashboard" />
            <div className="w-full p-4 lg:p-6 space-y-5 bg-background min-h-[calc(100vh-64px)]">

                {/* Welcome Bar */}
                <div className="flex items-end justify-between px-5 py-4 rounded-sm border border-border/80 bg-muted/5 shadow-sm">
                    <div>
                        <h1 className="text-xl font-bold text-foreground tracking-tight">Instructor Hub</h1>
                        <p className="text-xs font-medium text-muted-foreground mt-0.5 opacity-70">
                            Welcome back, {user?.name}. You have <span className="text-primary font-bold">{stats.courses}</span> active courses.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild size="sm" className="h-8 px-4 rounded-sm text-[11px] font-bold uppercase tracking-tight shadow-none bg-primary hover:bg-primary/90 transition-all">
                            <Link href="/teacher/courses">
                                <BookOpen className="size-3.5 mr-2" /> Course Manager
                            </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="h-8 px-4 rounded-sm text-[11px] font-bold uppercase tracking-tight shadow-none border-border/80 hover:bg-muted/50 transition-all">
                            <Link href="/teacher/wallet">
                                <Wallet className="size-3.5 mr-2" /> My Wallet
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-sm border border-border/80 bg-background p-5 shadow-sm group hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Portfolio</span>
                            <div className="size-8 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                                <BookOpen className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-foreground tabular-nums tracking-tight">{stats.courses}</div>
                        <div className="mt-4 h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${Math.min(100, stats.courses * 10)}%` }} />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-3 italic">Published Courses</p>
                    </div>

                    <div className="rounded-sm border border-border/80 bg-background p-5 shadow-sm group hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Gross Earnings</span>
                            <div className="size-8 rounded-sm bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                                <TrendingUp className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-foreground tabular-nums tracking-tight">₹{stats.total_sales.toLocaleString()}</div>
                        <div className="flex gap-1 h-6 items-end mt-4">
                            {[20, 40, 30, 60, 50, 80, 65, 45, 90, 70].map((h, i) => (
                                <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-[1px] group-hover:bg-emerald-500 transition-colors" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>

                    <div className="rounded-sm border border-border/80 bg-background p-5 shadow-sm group hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Available Balance</span>
                            <div className="size-8 rounded-sm bg-muted/30 border border-border/60 flex items-center justify-center text-muted-foreground">
                                <IndianRupee className="size-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-foreground tabular-nums tracking-tight">₹{stats.wallet_balance.toLocaleString()}</div>
                        <Link href="/teacher/wallet" className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-tight hover:translate-x-1 transition-all mt-4">
                            Settle Wallet <ChevronRight className="size-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-sm border border-border/80 bg-background overflow-hidden shadow-sm">
                    <div className="px-5 py-3.5 bg-muted/5 border-b border-border/80 flex items-center justify-between">
                        <h2 className="text-[11px] font-bold text-foreground uppercase tracking-widest">Platform Command Center</h2>
                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">Quick Access</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60">
                        {[
                            { href: '/teacher/courses', icon: BookOpen, label: 'Course Studio', desc: 'Manage curriculum & students' },
                            { href: '/teacher/wallet', icon: Wallet, label: 'Finance Hub', desc: 'Earnings & payout history' },
                            { href: '/teacher/kyc', icon: CheckCircle2, label: 'Trust Center', desc: 'KYC & Profile verification' },
                        ].map(({ href, icon: Icon, label, desc }) => (
                            <Link key={href} href={href} className="flex items-center gap-4 px-6 py-5 hover:bg-muted/30 transition-all group relative overflow-hidden">
                                <div className="size-10 rounded-sm bg-muted/30 border border-border/60 flex items-center justify-center shrink-0 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                                    <Icon className="size-5 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors leading-none mb-1.5">{label}</div>
                                    <div className="text-[10px] font-medium text-muted-foreground leading-tight">{desc}</div>
                                </div>
                                <ArrowRight className="size-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" strokeWidth={2} />
                                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
}

TeacherDashboard.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Dashboard', href: '/teacher/dashboard' }]}>
        {page}
    </TeacherLayout>
);
