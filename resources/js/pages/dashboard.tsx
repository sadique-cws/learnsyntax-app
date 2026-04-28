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
                <Head title="System Overview" />
                <div className="flex flex-1 flex-col gap-8 p-4 lg:p-6 bg-muted/5">
                    <div className="mb-2">
                        <span className="text-[10px] font-black text-primary   mb-2 block">Administrative Panel</span>
                        <h1 className="text-3xl font-medium  text-foreground leading-none">System Analytics</h1>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-3">
                        <StatsCard title="Active Courses" value={stats.courses} icon={Book} />
                        <StatsCard title="Total Students" value={stats.enrollments} icon={Users} />
                        <StatsCard title="Net Revenue" value={`₹${stats.revenue}`} icon={TrendingUp} isPrimary />
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
