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
                <Head title="Dashboard" />
                <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6 bg-background min-h-screen">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">Platform overview and analytics</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-sm border border-border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-muted-foreground">Total Revenue</span>
                                <IndianRupee className="size-4 text-muted-foreground/40" />
                            </div>
                            <div className="text-2xl font-semibold text-foreground tabular-nums">₹{stats.revenue.toLocaleString()}</div>
                            <div className="mt-3 h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[35%]" />
                            </div>
                        </div>

                        <div className="rounded-sm border border-border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-muted-foreground">New Users (This Week)</span>
                                <Users className="size-4 text-muted-foreground/40" />
                            </div>
                            <div className="text-2xl font-semibold text-foreground tabular-nums">{stats.signups_this_week ?? 0}</div>
                            <div className="flex gap-0.5 h-5 items-end mt-3">
                                {[20, 30, 20, 50, 40, 80, 60].map((h, i) => (
                                    <div key={i} className="flex-1 bg-primary/15 rounded-t-sm" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>

                        <div className="rounded-sm border border-border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-muted-foreground">Active Courses</span>
                                <BookOpen className="size-4 text-muted-foreground/40" />
                            </div>
                            <div className="text-2xl font-semibold text-foreground tabular-nums">{stats.courses}</div>
                            <p className="text-xs text-muted-foreground mt-3">{stats.enrollments} total enrollments</p>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Recent Users Table */}
                        <div className="lg:col-span-2 rounded-sm border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                                <h2 className="text-xs font-semibold text-foreground">Recent Users</h2>
                                <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs font-medium text-primary hover:bg-primary/5 rounded-sm">
                                    <Link href="/admin/students">View All</Link>
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/30">
                                            <th className="px-3 py-2 text-[11px] font-semibold text-muted-foreground">User</th>
                                            <th className="px-3 py-2 text-[11px] font-semibold text-muted-foreground">Role</th>
                                            <th className="px-3 py-2 text-[11px] font-semibold text-muted-foreground">Status</th>
                                            <th className="px-3 py-2 text-[11px] font-semibold text-muted-foreground text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {(stats.recent_users ?? []).map((user: any, i: number) => (
                                            <tr key={i} className="hover:bg-muted/5 transition-colors">
                                                <td className="px-3 py-2.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={cn(
                                                            "size-8 rounded-sm flex items-center justify-center text-xs font-semibold border",
                                                            user.color?.includes('indigo') ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                                                        )}>
                                                            {user.initials}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-foreground">{user.name}</div>
                                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-primary/5 text-primary text-[10px] font-medium border border-primary/10 capitalize">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={cn("size-1.5 rounded-full", user.active ? 'bg-emerald-500' : 'bg-slate-300')} />
                                                        <span className={cn("text-xs font-medium", user.active ? 'text-emerald-600' : 'text-muted-foreground')}>
                                                            {user.active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 text-right">
                                                    <Button asChild variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground/30 hover:text-foreground hover:bg-muted/50">
                                                        <Link href="/admin/students"><ArrowRight className="size-3.5" /></Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            <div className="rounded-sm border border-border overflow-hidden">
                                <div className="px-3 py-2 border-b border-border bg-muted/5">
                                    <h2 className="text-xs font-semibold text-foreground">System Health</h2>
                                </div>
                                <div className="p-3 space-y-4">
                                    <div>
                                        <div className="flex justify-between items-end mb-1.5">
                                            <span className="text-xs font-medium text-muted-foreground">Server Load</span>
                                            <span className="text-xs font-medium text-foreground tabular-nums">24%</span>
                                        </div>
                                        <div className="flex items-end gap-0.5 h-5">
                                            {Array.from({ length: 24 }).map((_, i) => (
                                                <div key={i} className="flex-1 bg-primary rounded-t-[1px]" style={{ height: `${Math.max(10, ((i * 31) % 90) + 10)}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-end mb-1.5">
                                            <span className="text-xs font-medium text-muted-foreground">Memory</span>
                                            <span className="text-xs font-medium text-foreground tabular-nums">5.2 GB</span>
                                        </div>
                                        <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[70%]" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <div className="p-2 rounded-sm bg-muted/5 border border-border">
                                            <div className="text-[10px] text-muted-foreground mb-0.5">DB Connections</div>
                                            <div className="text-sm font-semibold text-foreground tabular-nums">1,204</div>
                                        </div>
                                        <div className="p-2 rounded-sm bg-muted/5 border border-border">
                                            <div className="text-[10px] text-muted-foreground mb-0.5">Uptime</div>
                                            <div className="text-sm font-semibold text-foreground tabular-nums">24D 12H</div>
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
            <div className="w-full flex flex-1 flex-col gap-6 p-4 lg:p-6 bg-background">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        {is_student ? "My Learning" : "Get Started"}
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {is_student
                            ? "Track your courses, assignments, and certifications."
                            : "Browse courses to begin your learning journey."}
                    </p>
                </div>

                {/* Certificates Section */}
                {enrollments.some((e: any) => e.certificate) && (
                    <div className="rounded-sm border border-border overflow-hidden">
                        <div className="px-3 py-2 border-b border-border bg-muted/5 flex items-center gap-2">
                            <Trophy className="size-3.5 text-primary" />
                            <h2 className="text-xs font-semibold text-foreground">Your Certificates</h2>
                        </div>
                        <div className="p-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {enrollments.filter((e: any) => e.certificate).map((enrollment: any) => (
                                <div key={enrollment.id} className="flex items-center gap-3 p-3 rounded-sm border border-border hover:border-primary/30 transition-colors group">
                                    <div className="size-10 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary/10 transition-colors shrink-0">
                                        <Award className="size-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] text-muted-foreground truncate">{enrollment.certificate.certificate_number}</div>
                                        <div className="text-sm font-medium text-foreground truncate">{enrollment.course.title}</div>
                                    </div>
                                    <Button asChild size="sm" className="h-7 px-2 rounded-sm text-[10px] font-medium shadow-none shrink-0">
                                        <Link href={`/my-course/${enrollment.id}/certificate`}>View</Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Active Courses */}
                    <div className="lg:col-span-8 space-y-3">
                        <h2 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                            <div className="size-1.5 rounded-full bg-primary animate-pulse" /> Active Courses
                        </h2>
                        <div className="grid gap-3 md:grid-cols-2">
                            {enrollments.length > 0 ? enrollments.map((enrollment: any) => (
                                <div key={enrollment.id} className="rounded-sm border border-border p-4 hover:border-primary/30 transition-colors group">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={cn(
                                            "inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium border capitalize",
                                            enrollment.status === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                        )}>
                                            {enrollment.status}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">{enrollment.batch?.type ?? 'Standard'}</span>
                                    </div>
                                    <h3 className="text-sm font-medium text-foreground mb-1 group-hover:text-primary transition-colors">{enrollment.course.title}</h3>
                                    <p className="text-xs text-muted-foreground mb-4">{enrollment.batch?.name ?? 'Batch pending'}</p>
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" size="sm" className="flex-1 h-8 rounded-sm text-xs shadow-none">
                                            <Link href={`/courses/${enrollment.course.slug}`}>Details</Link>
                                        </Button>
                                        <Button asChild size="sm" className="flex-1 h-8 rounded-sm text-xs shadow-none">
                                            <Link href={`/my-course/${enrollment.id}/assignments`}>Continue <ArrowRight className="size-3 ml-1" /></Link>
                                        </Button>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-12 text-center border border-dashed border-border rounded-sm">
                                    <Book className="size-8 text-muted-foreground/20 mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground mb-4">No active courses</p>
                                    <Button asChild size="sm" className="h-8 px-4 rounded-sm text-xs shadow-none">
                                        <Link href="/courses">Browse Courses</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment History Sidebar */}
                    <div className="lg:col-span-4 space-y-3">
                        <h2 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                            <Receipt className="size-3.5" /> Payment History
                        </h2>
                        <div className="space-y-2">
                            {enrollments.filter((e: any) => e.payment).length > 0 ? (
                                enrollments.filter((e: any) => e.payment).map((enrollment: any) => (
                                    <div key={enrollment.payment.id} className="p-3 rounded-sm border border-border hover:border-primary/30 transition-colors">
                                        <div className="flex items-center gap-2.5 mb-2.5">
                                            <div className="size-8 rounded-sm bg-muted/30 flex items-center justify-center border border-border shrink-0">
                                                <Receipt className="size-4 text-muted-foreground/50" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-foreground truncate">{enrollment.course.title}</div>
                                                <div className="text-[10px] text-muted-foreground truncate">{enrollment.payment.invoice?.invoice_number || 'Pending'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2.5 border-t border-border">
                                            <div>
                                                <div className="text-sm font-medium text-foreground tabular-nums">₹{enrollment.payment.amount}</div>
                                                <div className="text-[10px] text-emerald-600 font-medium">Paid</div>
                                            </div>
                                            <Button asChild variant="outline" size="sm" className="h-7 px-2 rounded-sm text-[10px] shadow-none">
                                                <Link href={enrollment.payment.invoice ? `/admin/invoices/${enrollment.payment.invoice.id}` : '#'}>Receipt</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center border border-border rounded-sm">
                                    <p className="text-xs text-muted-foreground">No payment history</p>
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
