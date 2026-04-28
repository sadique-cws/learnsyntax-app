import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, CreditCard, Receipt, Users, TrendingUp } from 'lucide-react';

export default function Dashboard({ enrollments = [], stats = null }: { enrollments?: any[], stats?: any }) {
    if (stats) {
        return (
            <>
                <Head title="Admin Dashboard" />
                <div className="flex flex-1 flex-col gap-6 p-4">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-2">Admin Overview</h1>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="border-border">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                                <Book className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.courses}</div>
                            </CardContent>
                        </Card>
                        <Card className="border-border">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                                <Users className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.enrollments}</div>
                            </CardContent>
                        </Card>
                        <Card className="border-border">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <TrendingUp className="size-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">${stats.revenue}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="My Dashboard" />
            <div className="w-full flex flex-1 flex-col gap-8 p-4 lg:p-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-1">My Dashboard</h1>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Welcome back! Here are your active courses and recent bills.</p>
                </div>

                {/* My Courses */}
                <section>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground mb-4 flex items-center gap-2">
                        <Book className="size-5 text-primary" />
                        My Courses
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {enrollments.length > 0 ? enrollments.map((enrollment: any) => (
                            <Card key={enrollment.id} className="border-border overflow-hidden hover:border-primary transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                                            enrollment.status === 'paid' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                        )}>
                                            {enrollment.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{enrollment.batch?.type ?? 'TBD'}</span>
                                    </div>
                                    <h3 className="font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors">{enrollment.course.title}</h3>
                                    <p className="text-xs text-muted-foreground mb-4">{enrollment.batch?.name ?? 'Batch assignment pending'}</p>
                                    <Button asChild variant="outline" size="sm" className="w-full rounded h-9 font-bold">
                                        <Link href={`/courses/${enrollment.course.slug}`}>Course Details</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )) : (
                            <div className="col-span-full py-12 text-center border border-border bg-muted/20 rounded">
                                <p className="text-sm font-medium text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                                <Button asChild variant="default" className="rounded h-10 px-6 font-bold tracking-widest uppercase text-xs">
                                    <Link href="/courses">Browse Courses</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </section>

                {/* My Bills */}
                <section>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground mb-4 flex items-center gap-2">
                        <Receipt className="size-5 text-primary" />
                        Billing & Invoices
                    </h2>
                    <div className="grid gap-4">
                        {enrollments.filter((e: any) => e.payment).map((enrollment: any) => (
                            <div key={enrollment.payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/20 border border-border rounded gap-4 hover:border-primary transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded bg-background flex items-center justify-center border border-border shrink-0">
                                        <Receipt className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{enrollment.payment.invoice?.invoice_number ?? 'Invoice Pending'}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase">{enrollment.course.title} • {enrollment.payment.payment_method}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 sm:justify-end justify-between pt-4 sm:pt-0 border-t border-border sm:border-0">
                                    <div className="sm:text-right">
                                        <div className="font-bold text-sm">${enrollment.payment.amount}</div>
                                        <div className="text-[10px] text-green-600 font-black tracking-widest uppercase">{enrollment.payment.status}</div>
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded h-8 font-bold text-xs">
                                        Download
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
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
