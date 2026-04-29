import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Receipt, Users, TrendingUp, Trophy, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
export default function Dashboard({ enrollments = [], stats = null }: { enrollments?: any[], stats?: any }) {
    if (stats) {
        return (
            <>
                <Head title="Platform Overview" />
                <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6 bg-muted/10 min-h-screen">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                        <div>
                            <h1 className="text-[22px] font-semibold text-foreground leading-tight tracking-tight">Platform Overview</h1>
                            <p className="text-sm text-muted-foreground mt-1">Real-time performance metrics and user operations.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button variant="outline" className="flex-1 sm:flex-none text-primary border-primary/20 hover:bg-primary/5 hover:text-primary h-10 font-medium px-4">
                                <TrendingUp className="size-4 mr-2" /> EXPORT DATA
                            </Button>
                            <Button className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground h-10 font-medium px-4 shadow-md shadow-primary/20">
                                REFRESH
                            </Button>
                        </div>
                    </div>
                    
                    <div className="grid gap-5 md:grid-cols-3">
                        <Card className="border-border shadow-sm">
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Total Revenue</h3>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-sm">+12.4%</span>
                                </div>
                                <div className="text-3xl font-bold tracking-tight mb-4">₹{stats.revenue.toLocaleString()}</div>
                                <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[65%]" />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-border shadow-sm">
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">New Signups</h3>
                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">This Week</span>
                                </div>
                                <div className="text-3xl font-bold tracking-tight mb-4">{stats.enrollments}</div>
                                <div className="flex gap-1 h-6 items-end">
                                    <div className="w-full bg-primary/10 h-[40%] rounded-sm" />
                                    <div className="w-full bg-primary/20 h-[50%] rounded-sm" />
                                    <div className="w-full bg-primary/10 h-[40%] rounded-sm" />
                                    <div className="w-full bg-primary/30 h-[70%] rounded-sm" />
                                    <div className="w-full bg-primary/20 h-[60%] rounded-sm" />
                                    <div className="w-full bg-primary h-[100%] rounded-sm" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border shadow-sm">
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Server Health</h3>
                                    <span className="text-[10px] font-bold text-green-600 flex items-center gap-1.5 uppercase">
                                        <div className="size-1.5 bg-green-500 rounded-full animate-pulse" />
                                        Operational
                                    </span>
                                </div>
                                <div className="text-3xl font-bold tracking-tight mb-4">99.98%</div>
                                <p className="text-xs text-muted-foreground">Average latency: <span className="font-bold text-foreground">42ms</span></p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
                        <div className="lg:col-span-2">
                            <Card className="border-border shadow-sm h-full">
                                <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b border-border/50">
                                    <CardTitle className="text-sm font-semibold">Recent User Activity</CardTitle>
                                    <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-primary hover:text-primary/80">VIEW ALL</Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/20 border-b border-border/50">
                                                <tr>
                                                    <th className="px-5 py-3 font-semibold">User</th>
                                                    <th className="px-5 py-3 font-semibold">Role</th>
                                                    <th className="px-5 py-3 font-semibold">Status</th>
                                                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/50">
                                                {[
                                                    { name: 'Alex Stanford', email: 'alex.s@syntax.edu', initials: 'AS', role: 'TEACHER', active: true, color: 'bg-purple-100 text-purple-700' },
                                                    { name: 'Maria Kova', email: 'm.kova@dev.io', initials: 'MK', role: 'STUDENT', active: true, color: 'bg-slate-100 text-slate-700' },
                                                    { name: 'James Roland', email: 'james.r@syntax.edu', initials: 'JR', role: 'TEACHER', active: false, color: 'bg-slate-100 text-slate-700' },
                                                    { name: 'Li Lin', email: 'li.lin@cloud.net', initials: 'LL', role: 'STUDENT', active: true, color: 'bg-slate-100 text-slate-700' },
                                                ].map((user, i) => (
                                                    <tr key={i} className="hover:bg-muted/10 transition-colors">
                                                        <td className="px-5 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`size-8 rounded-sm flex items-center justify-center font-bold text-xs ${user.color}`}>
                                                                    {user.initials}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-foreground">{user.name}</div>
                                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-1 rounded-sm">
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className={`size-1.5 rounded-full ${user.active ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                                                                <span className={`text-xs font-medium ${user.active ? 'text-green-600' : 'text-muted-foreground'}`}>
                                                                    {user.active ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3 text-right">
                                                            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                                                                <span className="tracking-widest leading-none font-bold">...</span>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div className="space-y-6 lg:col-span-1">
                            <Card className="border-border shadow-sm">
                                <CardHeader className="py-4 px-5 border-b border-border/50">
                                    <CardTitle className="text-sm font-semibold">System Health</CardTitle>
                                </CardHeader>
                                <CardContent className="p-5 space-y-6">
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-medium text-muted-foreground">CPU Load</span>
                                            <span className="text-xs font-bold">24%</span>
                                        </div>
                                        <div className="flex items-end gap-0.5 h-6">
                                            {Array.from({ length: 24 }).map((_, i) => (
                                                <div key={i} className="flex-1 bg-primary rounded-t-sm" style={{ height: `${Math.max(10, Math.random() * 100)}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-medium text-muted-foreground">Memory Usage</span>
                                            <span className="text-xs font-bold">5.2 GB</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[70%]" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">DB Connections</div>
                                            <div className="text-lg font-bold">1,204</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Uptime</div>
                                            <div className="text-lg font-bold">24d 12h</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#1C1F2E] text-white border-transparent shadow-md">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <TrendingUp className="size-4 text-purple-400" />
                                        <h3 className="font-semibold text-sm">Security Alerts</h3>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed mb-5">
                                        No critical vulnerabilities detected in the last 24 hours. Automated firewall rules updated.
                                    </p>
                                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs h-9">
                                        AUDIT LOGS
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="My Learning Portal" />
            <div className="w-full flex flex-1 flex-col gap-10 p-4 lg:p-6">
                <div>
                    <span className="text-[10px] font-black text-primary   mb-2 block">Student Dashboard</span>
                    <h1 className="text-4xl font-medium  text-foreground leading-none mb-3">My Learning Center</h1>
                    <p className="text-xs font-medium text-muted-foreground  max-w-2xl">Access your academic programs, track assignment progress, and manage your professional certifications from a single interface.</p>
                </div>

                {/* Academic Achievement / Certificates */}
                {enrollments.some((e: any) => e.certificate) && (
                    <section className="bg-primary/5 border border-primary/10 rounded-sm p-6  lg:p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-sm bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <Trophy className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold  text-foreground">Academic Achievements</h2>
                                    <p className="text-[10px] font-bold text-muted-foreground  ">Your earned professional certifications</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {enrollments.filter((e: any) => e.certificate).map((enrollment: any) => (
                                <Card key={enrollment.id} className="border-border rounded-sm shadow-none bg-background hover:border-primary transition-colors group">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="size-12 rounded-sm bg-muted/50 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                                                <Award className="size-6" />
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black   text-muted-foreground/60">{enrollment.certificate.certificate_number}</div>
                                                <h3 className="font-bold text-sm tracking-tight">{enrollment.course.title}</h3>
                                            </div>
                                        </div>
                                        <Button asChild size="sm" className="w-full rounded-sm h-9 font-black   text-[9px] bg-primary text-white">
                                            <Link href={`/my-course/${enrollment.id}/certificate`}>View Certificate</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Active Programs */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Book className="size-4 text-primary" />
                                <h2 className="text-xs font-black   text-muted-foreground">Enrolled Programs</h2>
                            </div>
                        </div>
                        
                        <div className="grid gap-6 md:grid-cols-2">
                            {enrollments.length > 0 ? enrollments.map((enrollment: any) => (
                                <Card key={enrollment.id} className="border-border rounded-sm shadow-none hover:border-primary transition-all bg-background relative overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={cn(
                                                "text-[9px] font-black   px-2 py-0.5 rounded-sm",
                                                enrollment.status === 'paid' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                            )}>
                                                {enrollment.status}
                                            </span>
                                            <span className="text-[10px] font-black   text-muted-foreground/60">{enrollment.batch?.type ?? 'Regular'}</span>
                                        </div>
                                        <h3 className="font-bold text-lg  mb-1">{enrollment.course.title}</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground   mb-6">{enrollment.batch?.name ?? 'Batch Pending'}</p>
                                        
                                        <div className="flex gap-3">
                                            <Button asChild variant="outline" size="sm" className="flex-1 rounded-sm h-10 font-black   text-[9px] border-border hover:bg-muted transition-colors">
                                                <Link href={`/courses/${enrollment.course.slug}`}>Course Info</Link>
                                            </Button>
                                            <Button asChild size="sm" className="flex-1 rounded-sm h-10 font-black   text-[9px] bg-primary text-white shadow-lg shadow-primary/10">
                                                <Link href={`/my-course/${enrollment.id}/assignments`} className="flex items-center gap-2">
                                                    Enter Portal <ArrowRight className="size-3" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="col-span-full py-20 text-center border border-dashed border-border bg-muted/5 rounded-sm">
                                    <Book className="size-12 text-muted-foreground/20 mx-auto mb-4" />
                                    <p className="text-[10px] font-black   text-muted-foreground/60 mb-6">No active enrollments found</p>
                                    <Button asChild className="rounded-sm h-11 px-8 font-black   text-[10px] bg-primary">
                                        <Link href="/courses">Browse Programs</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Billing & Activity */}
                    <div className="lg:col-span-4 space-y-8">
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Receipt className="size-4 text-primary" />
                                <h2 className="text-xs font-black   text-muted-foreground">Financial Ledger</h2>
                            </div>
                            
                            <div className="space-y-4">
                                {enrollments.filter((e: any) => e.payment).length > 0 ? (
                                    enrollments.filter((e: any) => e.payment).map((enrollment: any) => (
                                        <div key={enrollment.payment.id} className="p-4 bg-background border border-border rounded-sm hover:border-primary transition-colors">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="size-10 rounded-sm bg-muted/50 flex items-center justify-center border border-border shrink-0">
                                                    <Receipt className="size-5 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="font-bold text-xs truncate  tracking-tight">{enrollment.course.title}</div>
                                                    <div className="text-[10px] text-muted-foreground font-medium truncate">{enrollment.payment.invoice?.invoice_number || 'Processing...'}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                                <div>
                                                    <div className="font-bold text-sm">₹{enrollment.payment.amount}</div>
                                                    <div className="text-[9px] text-green-600 font-black  ">SUCCESSFUL</div>
                                                </div>
                                                <Button asChild variant="outline" size="sm" className="rounded-sm h-8 px-4 font-black   text-[8px] border-border hover:bg-muted">
                                                    <Link href={enrollment.payment.invoice ? `/admin/invoices/${enrollment.payment.invoice.id}` : '#'}>Receipt</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center border border-border bg-muted/5 rounded-sm">
                                        <p className="text-[10px] font-black   text-muted-foreground/40">No billing history</p>
                                    </div>
                                )}
                            </div>
                        </section>
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
                <CardTitle className="text-[10px] font-black   text-muted-foreground/60">{title}</CardTitle>
                <Icon className={cn("size-4", isPrimary ? "text-primary" : "text-muted-foreground/60")} />
            </CardHeader>
            <CardContent>
                <div className={cn("text-3xl font-medium tracking-tight", isPrimary && "text-primary")}>{value}</div>
            </CardContent>
        </Card>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
        {page}
    </AppLayout>
);
