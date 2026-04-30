import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Book, Receipt, Users, Award, CheckCircle2, ArrowRight, IndianRupee, BookOpen, GraduationCap, Trophy } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

export default function Dashboard({ enrollments = [], stats = null }: { enrollments?: any[], stats?: any }) {
    const is_student = !stats;

    if (stats) {
        return (
            <>
                <Head title="Admin Console" />
                <div className="w-full p-4 space-y-3">
                    {/* Header */}
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Admin Console</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Platform overview and analytics</p>
                    </div>

                    {/* Stats Row */}
                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-sm border border-border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-muted-foreground">Total Revenue</span>
                                <div className="size-7 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                    <IndianRupee className="size-3.5" />
                                </div>
                            </div>
                            <div className="text-2xl font-semibold text-foreground tabular-nums">₹{stats.revenue.toLocaleString()}</div>
                            <div className="mt-3 h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[35%]" />
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2">+12.5% from last month</p>
                        </div>

                        <div className="rounded-sm border border-border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-muted-foreground">Weekly Signups</span>
                                <div className="size-7 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                    <Users className="size-3.5" />
                                </div>
                            </div>
                            <div className="text-2xl font-semibold text-foreground tabular-nums">{stats.signups_this_week ?? 0}</div>
                            <div className="flex gap-0.5 h-5 items-end mt-3">
                                {[20, 30, 20, 50, 40, 80, 60, 40, 90, 70].map((h, i) => (
                                    <div key={i} className="flex-1 bg-primary/20 rounded-t-[1px] hover:bg-primary transition-colors" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>

                        <div className="rounded-sm border border-border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-muted-foreground">Active Courses</span>
                                <div className="size-7 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                    <BookOpen className="size-3.5" />
                                </div>
                            </div>
                            <div className="text-2xl font-semibold text-foreground tabular-nums">{stats.courses}</div>
                            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                                <span className="text-primary font-medium">{stats.enrollments}</span> total enrollments
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {/* Recent Users */}
                        <div className="lg:col-span-2 rounded-sm border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                                <h2 className="text-xs font-semibold text-foreground">Recent Users</h2>
                                <Button asChild variant="outline" size="sm" className="h-7 px-3 text-xs font-medium shadow-none cursor-pointer">
                                    <Link href="/admin/students">View All</Link>
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/30">
                                            <th className="px-3 py-2 text-[11px] font-semibold text-muted-foreground">User</th>
                                            <th className="px-3 py-2 text-[11px] font-semibold text-muted-foreground text-center">Role</th>
                                            <th className="px-3 py-2 text-[11px] font-semibold text-muted-foreground">Status</th>
                                            <th className="px-3 py-2 text-[11px] font-semibold text-muted-foreground text-right w-px"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {(stats.recent_users ?? []).map((user: any, i: number) => (
                                            <tr key={i} className="hover:bg-muted/5 transition-colors">
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="size-8 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-medium text-slate-500 shrink-0">
                                                            {user.initials}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-medium text-foreground truncate">{user.name}</div>
                                                            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-primary/5 text-primary text-[10px] font-medium border border-primary/10">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={cn("size-1.5 rounded-full", user.active ? 'bg-emerald-500' : 'bg-slate-300')} />
                                                        <span className={cn("text-xs font-medium", user.active ? 'text-emerald-600' : 'text-muted-foreground')}>
                                                            {user.active ? 'Online' : 'Offline'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <Button asChild variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-primary cursor-pointer">
                                                        <Link href="/admin/students"><ArrowRight className="size-3.5" /></Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-3 py-1.5 border-t border-border bg-muted/5">
                                <span className="text-[10px] text-muted-foreground">{(stats.recent_users ?? []).length} recent users</span>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="px-3 py-2 border-b border-border bg-muted/5">
                                <h2 className="text-xs font-semibold text-foreground">System Overview</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span className="text-xs font-medium text-muted-foreground">Server Load</span>
                                        <span className="text-xs font-medium text-foreground tabular-nums">24.8%</span>
                                    </div>
                                    <div className="flex items-end gap-[1px] h-7 bg-muted/10 rounded-sm p-0.5">
                                        {Array.from({ length: 32 }).map((_, i) => (
                                            <div key={i} className="flex-1 bg-primary/50 hover:bg-primary transition-colors rounded-[1px]" style={{ height: `${Math.max(15, ((i * 37) % 85) + 10)}%` }} />
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span className="text-xs font-medium text-muted-foreground">Storage</span>
                                        <span className="text-xs text-muted-foreground tabular-nums"><span className="font-medium text-foreground">5.2 GB</span> / 10 GB</span>
                                    </div>
                                    <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[52%]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-1">
                                    <div className="p-3 rounded-sm bg-muted/5 border border-border">
                                        <div className="text-[10px] text-muted-foreground mb-1">Database</div>
                                        <div className="text-sm font-semibold text-foreground tabular-nums leading-none">1,204 <span className="text-[10px] text-emerald-500 font-medium">IOPS</span></div>
                                    </div>
                                    <div className="p-3 rounded-sm bg-muted/5 border border-border">
                                        <div className="text-[10px] text-muted-foreground mb-1">Uptime</div>
                                        <div className="text-sm font-semibold text-foreground tabular-nums leading-none">24D <span className="text-[10px] text-muted-foreground">12H</span></div>
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
            <Head title="Learning Portal" />
            <div className="w-full p-4 space-y-3">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Learning Portal</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Manage your courses, assignments, and certifications</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-muted/5">
                            <BookOpen className="size-3.5 text-muted-foreground" />
                            <span className="text-xs font-semibold text-foreground tabular-nums">{enrollments.length}</span>
                            <span className="text-[10px] text-muted-foreground">courses</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-muted/5">
                            <Trophy className="size-3.5 text-muted-foreground" />
                            <span className="text-xs font-semibold text-foreground tabular-nums">{enrollments.filter((e: any) => e.certificate).length}</span>
                            <span className="text-[10px] text-muted-foreground">certs</span>
                        </div>
                    </div>
                </div>

                {/* Certificates */}
                {enrollments.some((e: any) => e.certificate) && (
                    <div className="rounded-sm border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                            <div className="flex items-center gap-1.5">
                                <Award className="size-3.5 text-primary" />
                                <h2 className="text-xs font-semibold text-foreground">Certifications</h2>
                            </div>
                            <span className="text-[10px] text-muted-foreground tabular-nums">{enrollments.filter((e: any) => e.certificate).length} earned</span>
                        </div>
                        <div className="divide-y divide-border">
                            {enrollments.filter((e: any) => e.certificate).map((enrollment: any) => (
                                <div key={enrollment.id} className="flex items-center justify-between px-3 py-3 hover:bg-muted/5 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="size-8 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0">
                                            <Award className="size-4" strokeWidth={1.5} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-foreground truncate">{enrollment.course.title}</div>
                                            <div className="text-xs text-muted-foreground">{enrollment.certificate.certificate_number}</div>
                                        </div>
                                    </div>
                                    <Button asChild variant="outline" size="sm" className="h-7 px-3 rounded-sm text-xs font-medium shadow-none shrink-0 cursor-pointer">
                                        <Link href={`/my-course/${enrollment.id}/certificate`}>View</Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    {/* Active Courses */}
                    <div className="lg:col-span-8">
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                                <h2 className="text-xs font-semibold text-foreground">My Courses</h2>
                                <span className="text-[10px] text-muted-foreground tabular-nums">{enrollments.length} enrolled</span>
                            </div>
                            
                            {enrollments.length > 0 ? (
                                <div className="divide-y divide-border">
                                    {enrollments.map((enrollment: any) => (
                                        <div key={enrollment.id} className="p-4 hover:bg-muted/5 transition-colors">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] text-primary font-medium">{enrollment.batch?.type ?? 'Standard'}</span>
                                                        <span className={cn(
                                                            "inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium border",
                                                            enrollment.status === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                                        )}>
                                                            {enrollment.status}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-sm font-semibold text-foreground leading-snug">{enrollment.course.title}</h3>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{enrollment.batch?.name ?? 'Batch assignment pending'}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button asChild variant="outline" size="sm" className="flex-1 h-8 rounded-sm text-xs font-medium shadow-none cursor-pointer">
                                                    <Link href={`/my-course/${enrollment.id}/progress`}>Roadmap</Link>
                                                </Button>
                                                <Button asChild size="sm" className="flex-1 h-8 rounded-sm text-xs font-medium shadow-none cursor-pointer">
                                                    <Link href={`/my-course/${enrollment.id}/assignments`}>Continue</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <Book className="size-8 text-muted-foreground/15 mx-auto mb-2" strokeWidth={1} />
                                    <h3 className="text-sm font-medium text-foreground">No active enrollments</h3>
                                    <p className="text-xs text-muted-foreground mt-1 mb-4">Browse our courses to start learning</p>
                                    <Button asChild size="sm" className="h-8 px-4 rounded-sm text-xs font-medium shadow-none cursor-pointer">
                                        <Link href="/courses">Browse Catalog</Link>
                                    </Button>
                                </div>
                            )}

                            <div className="px-3 py-1.5 border-t border-border bg-muted/5">
                                <span className="text-[10px] text-muted-foreground">{enrollments.length} active enrollments</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    <div className="lg:col-span-4">
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                                <div className="flex items-center gap-1.5">
                                    <Receipt className="size-3.5 text-muted-foreground" />
                                    <h2 className="text-xs font-semibold text-foreground">Billing</h2>
                                </div>
                            </div>
                            {enrollments.filter((e: any) => e.payment).length > 0 ? (
                                <div className="divide-y divide-border">
                                    {enrollments.filter((e: any) => e.payment).map((enrollment: any) => (
                                        <div key={enrollment.payment.id} className="p-3 hover:bg-muted/5 transition-colors">
                                            <div className="flex items-center gap-2.5 mb-2.5">
                                                <div className="size-7 rounded-sm bg-muted/30 flex items-center justify-center border border-border shrink-0">
                                                    <Receipt className="size-3.5 text-muted-foreground" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-medium text-foreground truncate">{enrollment.course.title}</div>
                                                    <div className="text-[10px] text-muted-foreground">{enrollment.payment.invoice?.invoice_number || 'INV-PENDING'}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                                <div>
                                                    <span className="text-sm font-semibold text-foreground tabular-nums">₹{enrollment.payment.amount}</span>
                                                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">Paid</span>
                                                </div>
                                                <Button asChild variant="outline" size="sm" className="h-6 px-2 rounded-sm text-[10px] font-medium shadow-none cursor-pointer">
                                                    <Link href={enrollment.payment.invoice ? `/admin/invoices/${enrollment.payment.invoice.id}` : '#'}>Receipt</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <p className="text-xs text-muted-foreground/50">No transactions</p>
                                </div>
                            )}
                            <div className="px-3 py-1.5 border-t border-border bg-muted/5">
                                <span className="text-[10px] text-muted-foreground">{enrollments.filter((e: any) => e.payment).length} payments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
        {page}
    </AppLayout>
);
