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
            <div className="w-full p-4 lg:p-6 space-y-4">

                {/* Welcome Bar */}
                <div className="flex items-center justify-between px-4 py-3 rounded-sm border border-border bg-muted/20">
                    <div>
                        <h1 className="text-sm font-semibold text-foreground">Welcome back, {user?.name?.split(' ')[0]}</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Here's your teaching overview</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Button asChild size="sm" className="h-7 px-3 rounded-sm text-xs shadow-none font-medium">
                            <Link href="/teacher/courses">
                                <BookOpen className="size-3 mr-1.5" /> Manage Courses
                            </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="h-7 px-3 rounded-sm text-xs shadow-none font-medium">
                            <Link href="/teacher/wallet">
                                <Wallet className="size-3 mr-1.5" /> Wallet
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-sm border border-border p-4 bg-background">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-muted-foreground">Active Courses</span>
                            <div className="size-7 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center">
                                <BookOpen className="size-3.5 text-primary" />
                            </div>
                        </div>
                        <div className="text-2xl font-semibold text-foreground tabular-nums">{stats.courses}</div>
                        <div className="mt-2.5 h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${Math.min(100, stats.courses * 10)}%` }} />
                        </div>
                    </div>

                    <div className="rounded-sm border border-border p-4 bg-background">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-muted-foreground">Total Sales</span>
                            <div className="size-7 rounded-sm bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <TrendingUp className="size-3.5 text-emerald-600" />
                            </div>
                        </div>
                        <div className="text-2xl font-semibold text-foreground tabular-nums">₹{stats.total_sales.toLocaleString()}</div>
                        <div className="flex gap-0.5 h-4 items-end mt-2.5">
                            {[20, 40, 30, 60, 50, 80, 65].map((h, i) => (
                                <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-[1px]" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>

                    <div className="rounded-sm border border-border p-4 bg-background">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-muted-foreground">Wallet Balance</span>
                            <div className="size-7 rounded-sm bg-muted/30 border border-border flex items-center justify-center">
                                <IndianRupee className="size-3.5 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="text-2xl font-semibold text-foreground tabular-nums">₹{stats.wallet_balance.toLocaleString()}</div>
                        <Link href="/teacher/wallet" className="flex items-center gap-1 text-[10px] font-medium text-primary hover:underline mt-2.5 transition-colors">
                            View ledger <ChevronRight className="size-3" />
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-sm border border-border overflow-hidden">
                    <div className="px-3 py-2 bg-muted/5 border-b border-border">
                        <h2 className="text-xs font-semibold text-foreground">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
                        {[
                            { href: '/teacher/courses', icon: BookOpen, label: 'Courses', desc: 'Manage course parameters' },
                            { href: '/teacher/assignments', icon: GraduationCap, label: 'Assignments', desc: 'Issue & grade tasks' },
                            { href: '/teacher/wallet', icon: Wallet, label: 'Earnings', desc: 'Track wallet payouts' },
                            { href: '/teacher/kyc', icon: CheckCircle2, label: 'Verification', desc: 'KYC status management' },
                        ].map(({ href, icon: Icon, label, desc }) => (
                            <Link key={href} href={href} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group">
                                <div className="size-8 rounded-sm bg-muted/30 border border-border flex items-center justify-center shrink-0">
                                    <Icon className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-foreground">{label}</div>
                                    <div className="text-[10px] text-muted-foreground">{desc}</div>
                                </div>
                                <ArrowRight className="size-3 text-muted-foreground/30 group-hover:text-foreground transition-colors" />
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
