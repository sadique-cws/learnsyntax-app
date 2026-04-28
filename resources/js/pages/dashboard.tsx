import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Receipt, Users, TrendingUp } from 'lucide-react';

export default function Dashboard({ enrollments = [], stats = null }: { enrollments?: any[], stats?: any }) {
    if (stats) {
        return (
            <>
                <Head title="System Overview" />
                <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                    <div className="mb-2">
                        <span className="text-[10px] font-medium text-primary mb-1 block">Administrative Panel</span>
                        <h1 className="text-3xl font-medium tracking-tight text-foreground leading-none">System Analytics</h1>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3">
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
            <div className="w-full flex flex-1 flex-col gap-8 p-4 lg:p-6">
                <div>
                    <span className="text-[10px] font-medium text-primary mb-1 block">Student Dashboard</span>
                    <h1 className="text-3xl font-medium tracking-tight text-foreground leading-none mb-2">My Learning Center</h1>
                    <p className="text-xs font-medium text-muted-foreground tracking-tight">Active enrollments and financial summary.</p>
                </div>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Book className="size-4 text-primary" />
                        <h2 className="text-sm font-medium text-foreground">Enrolled Programs</h2>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {enrollments.length > 0 ? enrollments.map((enrollment: any) => (
                            <Card key={enrollment.id} className="border-border rounded overflow-hidden hover:border-primary transition-colors bg-card">
                                <CardContent className="p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={cn(
                                            "text-[9px] font-medium px-2 py-0.5 rounded",
                                            enrollment.status === 'paid' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                        )}>
                                            {enrollment.status}
                                        </span>
                                        <span className="text-[10px] font-medium tracking-tight text-muted-foreground">{enrollment.batch?.type ?? 'Regular'}</span>
                                    </div>
                                    <h3 className="font-medium text-sm tracking-tight mb-1 line-clamp-1 group-hover:text-primary transition-colors">{enrollment.course.title}</h3>
                                    <p className="text-[10px] font-medium text-muted-foreground tracking-tight mb-6">{enrollment.batch?.name ?? 'Batch Pending'}</p>
                                    
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" size="sm" className="flex-1 rounded h-10 font-medium text-[10px] border-border hover:bg-muted">
                                            <Link href={`/courses/${enrollment.course.slug}`}>Details</Link>
                                        </Button>
                                        <Button asChild size="sm" className="flex-1 rounded h-10 font-medium text-[10px] bg-primary text-white">
                                            <Link href={`/my-course/${enrollment.id}/assignments`}>Access</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <div className="col-span-full py-16 text-center border border-dashed border-border bg-muted/10 rounded">
                                <p className="text-[10px] font-medium text-muted-foreground mb-4">No active enrollments found</p>
                                <Button asChild variant="default" className="rounded h-11 px-8 font-medium text-xs bg-primary">
                                    <Link href="/courses">Explore Programs</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Receipt className="size-4 text-primary" />
                        <h2 className="text-sm font-medium text-foreground">Billing Records</h2>
                    </div>
                    
                    <div className="space-y-2">
                        {enrollments.filter((e: any) => e.payment).length > 0 ? (
                            enrollments.filter((e: any) => e.payment).map((enrollment: any) => (
                                <div key={enrollment.payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border border-border rounded gap-4 hover:border-primary transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded bg-muted flex items-center justify-center border border-border shrink-0">
                                            <Receipt className="size-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-xs tracking-tight">{enrollment.payment.invoice?.invoice_number ?? 'Invoicing...'}</div>
                                            <div className="text-[9px] text-muted-foreground font-medium tracking-tight">{enrollment.course.title} • {enrollment.payment.payment_method}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 sm:justify-end justify-between sm:pt-0">
                                        <div className="sm:text-right">
                                            <div className="font-medium text-sm tracking-tight">₹{enrollment.payment.amount}</div>
                                            <div className="text-[9px] text-green-600 font-medium tracking-tight">{enrollment.payment.status}</div>
                                        </div>
                                        <Button variant="outline" size="sm" className="rounded h-9 px-4 font-medium text-[9px] border-border">
                                            Receipt
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center border border-border bg-muted/5 rounded">
                                <p className="text-[10px] font-medium text-muted-foreground">No billing history available</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}

function StatsCard({ title, value, icon: Icon, isPrimary = false }: { title: string, value: any, icon: any, isPrimary?: boolean }) {
    return (
        <Card className={cn("border-border rounded bg-card", isPrimary && "border-primary/20 bg-primary/[0.02]")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className={cn("size-4", isPrimary ? "text-primary" : "text-muted-foreground")} />
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-medium tracking-tight", isPrimary && "text-primary")}>{value}</div>
            </CardContent>
        </Card>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
    ],
};
