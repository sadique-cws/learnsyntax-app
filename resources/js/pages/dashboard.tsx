import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Receipt, Users, TrendingUp, Trophy, Award, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
export default function Dashboard({ enrollments = [], stats = null }: { enrollments?: any[], stats?: any }) {
    const is_student = !stats;

    if (stats) {
        return (
            <>
                <Head title="Platform Overview" />
                <div className="flex flex-1 flex-col gap-5 p-4 lg:p-6 bg-background min-h-screen">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-5 mb-2">
                        <div>
                            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                                <TrendingUp className="size-3" /> System Analytics
                            </div>
                            <h1 className="text-2xl font-black text-foreground tracking-tighter uppercase leading-none">Global Registry</h1>
                            <p className="text-[11px] font-bold text-muted-foreground/60 mt-1 uppercase tracking-wider italic">Real-time protocol monitoring and synchronization.</p>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button variant="outline" className="flex-1 sm:flex-none text-slate-500 border-border hover:bg-muted h-9 rounded-lg font-black text-[10px] uppercase tracking-widest px-4 shadow-none">
                                Export Protocol
                            </Button>
                            <Button className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white h-9 rounded-lg font-black text-[10px] uppercase tracking-widest px-4 shadow-none">
                                Synchronize
                            </Button>
                        </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="border-border shadow-none bg-card rounded-xl">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-[10px] font-black text-muted-foreground/60 tracking-[0.2em] uppercase">Net Liquidity</h3>
                                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">+0.0%</span>
                                </div>
                                <div className="text-2xl font-black tracking-tighter text-slate-900 leading-none mb-4">₹{stats.revenue.toLocaleString()}</div>
                                <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[35%]" />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-border shadow-none bg-card rounded-xl">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-[10px] font-black text-muted-foreground/60 tracking-[0.2em] uppercase">Registry Ingress</h3>
                                    <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">WEEK_01</span>
                                </div>
                                <div className="text-2xl font-black tracking-tighter text-slate-900 leading-none mb-4">{stats.signups_this_week ?? 0}</div>
                                <div className="flex gap-0.5 h-6 items-end">
                                    {[20, 30, 20, 50, 40, 80, 60].map((h, i) => (
                                        <div key={i} className="flex-1 bg-primary/20 rounded-t-sm" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border shadow-none bg-card rounded-xl">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-[10px] font-black text-muted-foreground/60 tracking-[0.2em] uppercase">Active Modules</h3>
                                    <span className="text-[9px] font-black text-green-600 flex items-center gap-1.5 uppercase tracking-widest">
                                        <div className="size-1.5 bg-green-500 rounded-full animate-pulse" />
                                        Protocol_Online
                                    </span>
                                </div>
                                <div className="text-2xl font-black tracking-tighter text-slate-900 leading-none mb-4">{stats.courses}</div>
                                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Syncing <span className="text-foreground">{stats.enrollments}</span> active identities</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="lg:col-span-2">
                            <Card className="border-border shadow-none bg-card rounded-xl overflow-hidden h-full">
                                <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-muted/20 border-b border-border">
                                    <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Identity Log</CardTitle>
                                    <Button asChild variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/10">
                                        <Link href="/admin/students">Audit All</Link>
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 bg-muted/5 border-b border-border">
                                                <tr>
                                                    <th className="px-4 py-2">Profile</th>
                                                    <th className="px-4 py-2">Permission</th>
                                                    <th className="px-4 py-2">Status</th>
                                                    <th className="px-4 py-2 text-right">Cmd</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {(stats.recent_users ?? []).map((user: any, i: number) => (
                                                    <tr key={i} className="hover:bg-muted/10 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`size-8 rounded-lg flex items-center justify-center font-black text-[9px] border border-border/50 ${user.color.includes('indigo') ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'}`}>
                                                                    {user.initials}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-[13px] text-slate-900 leading-tight">{user.name}</div>
                                                                    <div className="text-[10px] text-muted-foreground font-medium lowercase italic">{user.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className={`size-1.5 rounded-full ${user.active ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                                <span className={`text-[10px] font-black uppercase tracking-widest ${user.active ? 'text-green-600' : 'text-slate-400'}`}>
                                                                    {user.active ? 'Valid' : 'Terminated'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <Button asChild variant="ghost" size="icon" className="size-7 rounded-md text-slate-300 hover:text-indigo-600 hover:bg-indigo-50">
                                                                <Link href={`/admin/students`}><ArrowRight className="size-3.5" /></Link>
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
                        
                        <div className="space-y-5 lg:col-span-1">
                            <Card className="border-border shadow-none bg-card rounded-xl">
                                <CardHeader className="py-3 px-4 border-b border-border">
                                    <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Node Status</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-5">
                                    <div>
                                        <div className="flex justify-between items-end mb-1.5">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Processor Load</span>
                                            <span className="text-[10px] font-black text-slate-900">24%</span>
                                        </div>
                                        <div className="flex items-end gap-0.5 h-6">
                                            {Array.from({ length: 24 }).map((_, i) => (
                                                <div key={i} className="flex-1 bg-primary rounded-t-[1px]" style={{ height: `${Math.max(10, Math.random() * 100)}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="pt-2">
                                        <div className="flex justify-between items-end mb-1.5">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Virtual Memory</span>
                                            <span className="text-[10px] font-black text-slate-900">5.2 GB</span>
                                        </div>
                                        <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[70%]" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div className="p-2 rounded-lg bg-muted/5 border border-border">
                                            <div className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest mb-0.5">DB Sockets</div>
                                            <div className="text-sm font-black text-slate-900">1,204</div>
                                        </div>
                                        <div className="p-2 rounded-lg bg-muted/5 border border-border">
                                            <div className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest mb-0.5">Uptime</div>
                                            <div className="text-sm font-black text-slate-900">24D 12H</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900 text-white border-none shadow-none rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-12 -mt-12" />
                                <CardContent className="p-4 relative">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="size-6 rounded bg-primary/20 flex items-center justify-center">
                                            <Shield className="size-3.5 text-primary" />
                                        </div>
                                        <h3 className="font-black text-[10px] uppercase tracking-widest">Security Audit</h3>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed mb-4 uppercase tracking-wider">
                                        Zero-day protocol active. firewall operational. no breaches detected.
                                    </p>
                                    <Button className="w-full bg-white/5 hover:bg-white/10 text-white font-black text-[9px] uppercase tracking-[0.2em] h-8 rounded-lg border border-white/10">
                                        Access Logs
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </>
        );
    }    return (
        <>
            <Head title={is_student ? "Learning Portal" : "Onboarding Hub"} />
            <div className="w-full flex flex-1 flex-col gap-8 p-4 lg:p-6 bg-background">
                <div className="border-b border-border pb-6">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">{is_student ? "Subscriber Node" : "Initial Protocol"}</span>
                    <h1 className="text-3xl font-black text-slate-900 leading-none mb-3 uppercase tracking-tighter">
                        {is_student ? "Learning Center" : "Initialize Access"}
                    </h1>
                    <p className="text-[11px] font-bold text-muted-foreground/60 max-w-2xl uppercase tracking-wider leading-relaxed italic">
                        {is_student 
                            ? "Audit active modules, synchronize assignment protocols, and manage professional registry certifications."
                            : "Access not initialized. Browse professional certification directories to begin synchronization."}
                    </p>
                </div>

                {/* Academic Achievement / Certificates */}
                {enrollments.some((e: any) => e.certificate) && (
                    <section className="bg-muted/10 border border-border rounded-xl p-4 lg:p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-none border border-primary/20">
                                    <Trophy className="size-4.5" />
                                </div>
                                <div>
                                    <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">Registry Credentials</h2>
                                    <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.15em] mt-1.5">Verified professional certifications</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {enrollments.filter((e: any) => e.certificate).map((enrollment: any) => (
                                <Card key={enrollment.id} className="border-border rounded-lg shadow-none bg-background hover:border-primary/50 transition-colors group">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="size-10 rounded-lg bg-muted/30 flex items-center justify-center text-primary border border-border/50 group-hover:bg-primary/5 transition-colors">
                                                <Award className="size-5" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest truncate">{enrollment.certificate.certificate_number}</div>
                                                <h3 className="font-black text-[11px] text-slate-900 tracking-tight truncate uppercase">{enrollment.course.title}</h3>
                                            </div>
                                        </div>
                                        <Button asChild size="sm" className="w-full rounded-md h-8 font-black uppercase tracking-widest text-[9px] bg-primary text-white shadow-none">
                                            <Link href={`/my-course/${enrollment.id}/certificate`}>Access Credential</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Active Programs */}
                    <div className="lg:col-span-8 space-y-5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Active Protocols</h2>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                            {enrollments.length > 0 ? enrollments.map((enrollment: any) => (
                                <Card key={enrollment.id} className="border-border rounded-xl shadow-none hover:border-primary/50 transition-all bg-card relative overflow-hidden group">
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={cn(
                                                "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border",
                                                enrollment.status === 'paid' ? "bg-green-50 text-green-600 border-green-100" : "bg-orange-50 text-orange-600 border-orange-100"
                                            )}>
                                                {enrollment.status}
                                            </span>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{enrollment.batch?.type ?? 'Standard'}</span>
                                        </div>
                                        <h3 className="font-black text-base text-slate-900 leading-tight mb-1 uppercase tracking-tighter group-hover:text-primary transition-colors">{enrollment.course.title}</h3>
                                        <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-6 italic">{enrollment.batch?.name ?? 'Registry Pending'}</p>
                                        
                                        <div className="flex gap-2">
                                            <Button asChild variant="ghost" size="sm" className="flex-1 rounded-lg h-9 font-black uppercase tracking-widest text-[9px] border border-border hover:bg-muted transition-all">
                                                <Link href={`/courses/${enrollment.course.slug}`}>Metadata</Link>
                                            </Button>
                                            <Button asChild size="sm" className="flex-1 rounded-lg h-9 font-black uppercase tracking-widest text-[9px] bg-primary text-white shadow-none">
                                                <Link href={`/my-course/${enrollment.id}/assignments`} className="flex items-center justify-center gap-2">
                                                    Portal <ArrowRight className="size-3" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="col-span-full py-16 text-center border border-dashed border-border bg-muted/5 rounded-xl">
                                    <Book className="size-10 text-muted-foreground/20 mx-auto mb-3" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-5 italic">No active registries detected</p>
                                    <Button asChild className="rounded-lg h-10 px-6 font-black uppercase tracking-widest text-[10px] bg-primary shadow-none">
                                        <Link href="/courses">Browse Catalog</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Billing & Activity */}
                    <div className="lg:col-span-4 space-y-6">
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Receipt className="size-4 text-slate-400" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Financial Ledger</h2>
                            </div>
                            
                            <div className="space-y-3">
                                {enrollments.filter((e: any) => e.payment).length > 0 ? (
                                    enrollments.filter((e: any) => e.payment).map((enrollment: any) => (
                                        <div key={enrollment.payment.id} className="p-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="size-9 rounded-lg bg-muted/30 flex items-center justify-center border border-border shrink-0">
                                                    <Receipt className="size-4.5 text-muted-foreground/60" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="font-black text-[11px] text-slate-900 truncate uppercase tracking-tight leading-tight">{enrollment.course.title}</div>
                                                    <div className="text-[9px] text-muted-foreground/60 font-black uppercase tracking-widest truncate mt-0.5">{enrollment.payment.invoice?.invoice_number || 'TX_PENDING'}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                                <div>
                                                    <div className="font-black text-sm text-slate-900">₹{enrollment.payment.amount}</div>
                                                    <div className="text-[8px] text-green-600 font-black uppercase tracking-widest">Protocol_Success</div>
                                                </div>
                                                <Button asChild variant="outline" size="sm" className="rounded-md h-7 px-3 font-black uppercase tracking-widest text-[8px] border-border hover:bg-muted shadow-none">
                                                    <Link href={enrollment.payment.invoice ? `/admin/invoices/${enrollment.payment.invoice.id}` : '#'}>Receipt</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center border border-border bg-muted/5 rounded-xl">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Registry history null</p>
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
