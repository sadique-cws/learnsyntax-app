import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Receipt, Users, TrendingUp, Trophy, Award, CheckCircle2, ArrowRight, IndianRupee, BookOpen, GraduationCap } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

function cn(...classes: any[]) { return classes.filter(Boolean).join(' '); }

export default function Dashboard({ enrollments = [], stats = null }: { enrollments?: any[], stats?: any }) {
    const is_student = !stats;

    if (stats) {
        return (
            <>
                <Head title="Admin Console" />
                <div className="flex flex-1 flex-col gap-5 p-4 lg:p-6 bg-background">
                    {/* Header */}
                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-foreground tracking-tight">Admin Console</h1>
                            <p className="text-xs text-muted-foreground mt-0.5 font-medium text-muted-foreground/60">Comprehensive platform overview and real-time analytics</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-sm border border-border/80 bg-background p-5 shadow-sm group hover:border-primary/30 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-bold text-muted-foreground ">Total Revenue</span>
                                <div className="size-8 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                    <IndianRupee className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground tabular-nums tracking-tight">₹{stats.revenue.toLocaleString()}</div>
                            <div className="mt-4 h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[35%] animate-pulse" />
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-3">+12.5% from last month</p>
                        </div>

                        <div className="rounded-sm border border-border/80 bg-background p-5 shadow-sm group hover:border-primary/30 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-bold text-muted-foreground ">Weekly Signups</span>
                                <div className="size-8 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                    <Users className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground tabular-nums tracking-tight">{stats.signups_this_week ?? 0}</div>
                            <div className="flex gap-1 h-6 items-end mt-4">
                                {[20, 30, 20, 50, 40, 80, 60, 40, 90, 70].map((h, i) => (
                                    <div key={i} className="flex-1 bg-primary/20 rounded-t-[1px] group-hover:bg-primary transition-colors" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>

                        <div className="rounded-sm border border-border/80 bg-background p-5 shadow-sm group hover:border-primary/30 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-bold text-muted-foreground ">Active Inventory</span>
                                <div className="size-8 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                    <BookOpen className="size-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground tabular-nums tracking-tight">{stats.courses}</div>
                            <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                                <span className="text-primary">{stats.enrollments}</span> Total Active Enrollments
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Users Table */}
                        <div className="lg:col-span-2 rounded-sm border border-border/80 bg-background overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-muted/5">
                                <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wider">User Activity Monitor</h2>
                                <Button asChild variant="outline" size="sm" className="h-7 px-3 text-[10px] font-bold uppercase tracking-tight shadow-none">
                                    <Link href="/admin/students">View All Directory</Link>
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border/60 bg-muted/20">
                                            <th className="px-4 py-2.5 text-[10px] font-bold text-muted-foreground ">Identify</th>
                                            <th className="px-4 py-2.5 text-[10px] font-bold text-muted-foreground  text-center">Authorization</th>
                                            <th className="px-4 py-2.5 text-[10px] font-bold text-muted-foreground ">Availability</th>
                                            <th className="px-4 py-2.5 text-[10px] font-bold text-muted-foreground  text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {(stats.recent_users ?? []).map((user: any, i: number) => (
                                            <tr key={i} className="hover:bg-muted/5 transition-colors group">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "size-9 rounded-sm flex items-center justify-center text-xs font-bold border shrink-0",
                                                            user.color?.includes('indigo') ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                                                        )}>
                                                            {user.initials}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-bold text-foreground truncate">{user.name}</div>
                                                            <div className="text-[10px] font-medium text-muted-foreground truncate">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-primary/5 text-primary text-[9px] font-bold border border-primary/10 uppercase tracking-tight">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn("size-2 rounded-full", user.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300')} />
                                                        <span className={cn("text-[11px] font-bold uppercase tracking-tight", user.active ? 'text-emerald-600' : 'text-muted-foreground/60')}>
                                                            {user.active ? 'Live' : 'Standby'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button asChild variant="ghost" size="icon" className="size-8 rounded-sm text-muted-foreground/40 hover:text-primary hover:bg-primary/5 transition-all">
                                                        <Link href="/admin/students"><ArrowRight className="size-4" /></Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="rounded-sm border border-border/80 bg-background overflow-hidden shadow-sm">
                                <div className="px-4 py-3 border-b border-border/80 bg-muted/5">
                                    <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wider">Node Performance</h2>
                                </div>
                                <div className="p-4 space-y-5">
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[10px] font-bold text-muted-foreground ">Network Load</span>
                                            <span className="text-xs font-bold text-foreground tabular-nums">24.8%</span>
                                        </div>
                                        <div className="flex items-end gap-[1px] h-8 bg-muted/10 rounded-sm p-1">
                                            {Array.from({ length: 32 }).map((_, i) => (
                                                <div key={i} className="flex-1 bg-primary/60 hover:bg-primary transition-colors rounded-[1px]" style={{ height: `${Math.max(15, ((i * 37) % 85) + 10)}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[10px] font-bold text-muted-foreground ">Storage Array</span>
                                            <span className="text-xs font-bold text-foreground tabular-nums text-muted-foreground/60"><span className="text-foreground font-bold">5.2 GB</span> / 10 GB</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[52%] transition-all duration-500" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div className="p-3 rounded-sm bg-muted/5 border border-border/60 hover:border-primary/20 transition-all">
                                            <div className="text-[9px] font-bold text-muted-foreground  mb-1 text-muted-foreground/60">DB Cluster</div>
                                            <div className="text-base font-bold text-foreground tabular-nums tracking-tight leading-none">1,204 <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-tighter">IOPS</span></div>
                                        </div>
                                        <div className="p-3 rounded-sm bg-muted/5 border border-border/60 hover:border-primary/20 transition-all">
                                            <div className="text-[9px] font-bold text-muted-foreground  mb-1 text-muted-foreground/60">Uptime</div>
                                            <div className="text-base font-bold text-foreground tabular-nums tracking-tight leading-none">24D <span className="text-[8px] text-muted-foreground/40 font-bold uppercase tracking-tighter">12H</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Student Dashboard
    return (
        <>
            <Head title={is_student ? "Learning Portal" : "Dashboard"} />
            <div className="w-full flex flex-1 flex-col gap-5 p-4 lg:p-6 bg-background">
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-foreground tracking-tight">
                            {is_student ? "Learning Portal" : "Welcome Back"}
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                            {is_student
                                ? "Manage your courses, assignments, and professional certifications."
                                : "Explore our catalog to start your learning journey today."}
                        </p>
                    </div>
                    {is_student && (
                        <div className="hidden md:flex items-center gap-4 text-xs font-semibold">
                            <div className="flex flex-col items-end">
                                <span className="text-muted-foreground/60 uppercase text-[9px] tracking-widest">Active Courses</span>
                                <span className="text-foreground">{enrollments.length}</span>
                            </div>
                            <div className="h-6 w-px bg-border/50" />
                            <div className="flex flex-col items-end">
                                <span className="text-muted-foreground/60 uppercase text-[9px] tracking-widest">Certificates</span>
                                <span className="text-foreground">{enrollments.filter((e: any) => e.certificate).length}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Certificates Section */}
                {enrollments.some((e: any) => e.certificate) && (
                    <div className="rounded-sm border border-border/60 bg-muted/5 overflow-hidden shadow-sm">
                        <div className="px-4 py-2.5 border-b border-border/60 flex items-center justify-between bg-card">
                            <div className="flex items-center gap-2">
                                <Trophy className="size-3.5 text-primary" />
                                <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wider">Professional Certifications</h2>
                            </div>
                        </div>
                        <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {enrollments.filter((e: any) => e.certificate).map((enrollment: any) => (
                                <div key={enrollment.id} className="flex items-center gap-3.5 p-3 rounded-sm bg-background border border-border/80 hover:border-primary/40 transition-all group">
                                    <div className="size-11 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary/10 transition-colors shrink-0">
                                        <Award className="size-6" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[9px] font-bold text-primary uppercase tracking-tighter mb-0.5">{enrollment.certificate.certificate_number}</div>
                                        <div className="text-[13px] font-bold text-foreground truncate leading-tight">{enrollment.course.title}</div>
                                        <div className="text-[10px] font-medium text-muted-foreground mt-0.5 italic">Verified by Learn Syntax</div>
                                    </div>
                                    <Button asChild variant="outline" size="sm" className="h-7 px-3 rounded-sm text-[10px] font-bold uppercase tracking-tight shadow-none shrink-0">
                                        <Link href={`/my-course/${enrollment.id}/certificate`}>View</Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Active Courses */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[11px] font-bold text-muted-foreground  flex items-center gap-2">
                                <div className="size-2 rounded-full bg-primary animate-pulse" /> My Active Learning
                            </h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {enrollments.length > 0 ? enrollments.map((enrollment: any) => (
                                <div key={enrollment.id} className="rounded-sm border border-border/80 bg-background p-5 hover:border-primary/40 transition-all group relative overflow-hidden flex flex-col shadow-sm">
                                    <div className="absolute top-0 right-0 p-2">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-tighter border",
                                            enrollment.status === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                        )}>
                                            {enrollment.status}
                                        </span>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <div className="text-[10px] font-bold text-primary  mb-1.5">{enrollment.batch?.type ?? 'Standard'} TRACK</div>
                                        <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{enrollment.course.title}</h3>
                                        <p className="text-xs font-medium text-muted-foreground mt-1">{enrollment.batch?.name ?? 'Batch assignment pending'}</p>
                                    </div>

                                    <div className="mt-auto space-y-4">
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-tight">
                                            <div className="flex items-center gap-1.5">
                                                <BookOpen className="size-3.5" strokeWidth={2} />
                                                <span>Curriculum</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Trophy className="size-3.5" strokeWidth={2} />
                                                <span>Certificate</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2.5">
                                            <Button asChild variant="outline" size="sm" className="flex-1 h-9 rounded-sm text-[11px] font-bold uppercase tracking-tight shadow-none border-border/80 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all">
                                                <Link href={`/my-course/${enrollment.id}/progress`}>Roadmap</Link>
                                            </Button>
                                            <Button asChild size="sm" className="flex-1 h-9 rounded-sm text-[11px] font-bold uppercase tracking-tight shadow-none bg-primary hover:bg-primary/90 transition-all">
                                                <Link href={`/my-course/${enrollment.id}/assignments`}>Continue</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-16 text-center border border-dashed border-border/80 rounded-sm bg-muted/5">
                                    <Book className="size-10 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
                                    <h3 className="text-sm font-bold text-foreground">No active enrollments</h3>
                                    <p className="text-xs text-muted-foreground mb-6 max-w-[240px] mx-auto mt-1">Start your career journey by browsing our curated industry courses.</p>
                                    <Button asChild size="sm" className="h-9 px-6 rounded-sm text-[11px] font-bold uppercase tracking-tight shadow-none">
                                        <Link href="/courses">Browse Catalog</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment History Sidebar */}
                    <div className="lg:col-span-4 space-y-4">
                        <h2 className="text-[11px] font-bold text-muted-foreground  flex items-center gap-2">
                            <Receipt className="size-4" /> Billing History
                        </h2>
                        <div className="space-y-3">
                            {enrollments.filter((e: any) => e.payment).length > 0 ? (
                                enrollments.filter((e: any) => e.payment).map((enrollment: any) => (
                                    <div key={enrollment.payment.id} className="p-4 rounded-sm border border-border/80 bg-background hover:border-primary/40 transition-all group shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="size-9 rounded-sm bg-muted/30 flex items-center justify-center border border-border/60 shrink-0 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                                                <Receipt className="size-4.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{enrollment.course.title}</div>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-0.5">{enrollment.payment.invoice?.invoice_number || 'INV-PENDING'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-border/60">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-foreground tabular-nums">₹{enrollment.payment.amount}</span>
                                                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Status: Paid</span>
                                            </div>
                                            <Button asChild variant="outline" size="sm" className="h-7 px-3 rounded-sm text-[10px] font-bold uppercase tracking-tight shadow-none">
                                                <Link href={enrollment.payment.invoice ? `/admin/invoices/${enrollment.payment.invoice.id}` : '#'}>Receipt</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center border border-border/80 rounded-sm bg-muted/5">
                                    <p className="text-[10px] font-bold text-muted-foreground ">No Transactions Found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function StatsCard({ title, value, icon: Icon, isPrimary = false }: { title: string, value: any, icon: any, isPrimary?: boolean }) {
    return (
        <Card className={cn("border-border rounded-sm bg-background shadow-none", isPrimary && "border-primary/20 bg-primary/5")}>
            <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className={cn("size-4", isPrimary ? "text-primary" : "text-muted-foreground/40")} />
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-semibold tabular-nums", isPrimary && "text-primary")}>{value}</div>
            </CardContent>
        </Card>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
        {page}
    </AppLayout>
);
