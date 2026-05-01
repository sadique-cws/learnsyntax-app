import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CalendarDays, Clock3, IndianRupee, MapPin, Receipt, Search, LayoutGrid, List } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

interface MyWorkshopsProps {
    workshopEnrollments: any[];
}

function formatDateTime(value: string): string {
    return new Date(value).toLocaleString();
}

export default function MyWorkshops({ workshopEnrollments = [] }: MyWorkshopsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredWorkshops = useMemo(() => {
        return workshopEnrollments.filter((enrollment) => {
            const workshop = enrollment.course;
            const matchesSearch = workshop.title.toLowerCase().includes(searchQuery.toLowerCase())
                || (workshop.venue || '').toLowerCase().includes(searchQuery.toLowerCase());
            const isCompleted = new Date(workshop.starts_at) < new Date();
            const matchesFilter = filterStatus === 'all'
                || (filterStatus === 'upcoming' && !isCompleted)
                || (filterStatus === 'completed' && isCompleted);

            return matchesSearch && matchesFilter;
        });
    }, [workshopEnrollments, searchQuery, filterStatus]);

    return (
        <>
            <Head title="My Workshops" />
            <div className="w-full p-4 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">My Workshops</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Only workshops you enrolled in will appear here</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className={cn('h-8 px-2 rounded-sm', viewMode === 'grid' && 'bg-muted')} onClick={() => setViewMode('grid')}>
                            <LayoutGrid className="size-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" className={cn('h-8 px-2 rounded-sm', viewMode === 'list' && 'bg-muted')} onClick={() => setViewMode('list')}>
                            <List className="size-3.5" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Search workshops..."
                            className="pl-9 h-9 rounded-sm border-border bg-card text-sm shadow-none focus-visible:ring-1"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex p-0.5 bg-muted/50 border border-border rounded-sm">
                            {(['all', 'upcoming', 'completed'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        'px-3 py-1 text-[10px] font-bold uppercase rounded-sm transition-all',
                                        filterStatus === status ? 'bg-card text-foreground shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {filteredWorkshops.length > 0 ? (
                    <div className={cn('grid gap-4', viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1')}>
                        {filteredWorkshops.map((enrollment) => {
                            const workshop = enrollment.course;
                            const completed = new Date(workshop.starts_at) < new Date();

                            return (
                                <div key={enrollment.id} className={cn('rounded-sm border border-border bg-card overflow-hidden flex flex-col transition-all hover:border-primary/20', viewMode === 'list' && 'md:flex-row')}>
                                    <div className={cn('relative bg-muted/20 border-b border-border aspect-video md:aspect-auto', viewMode === 'list' ? 'md:w-48 md:border-b-0 md:border-r' : 'w-full')}>
                                        <div className="w-full h-full flex items-center justify-center">
                                            <CalendarDays className="size-8 text-muted-foreground/20" />
                                        </div>
                                        <div className="absolute top-2 right-2">
                                            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-sm border uppercase', completed ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-primary/5 text-primary border-primary/10')}>
                                                {completed ? 'Completed' : 'Upcoming'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Workshop</span>
                                                    <span className="text-[10px] text-muted-foreground font-medium tabular-nums">{workshop.duration_hours} hrs</span>
                                                </div>
                                                <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-1">{workshop.title}</h3>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-2.5 rounded-sm bg-muted/10 border border-border">
                                                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1"><IndianRupee className="size-3" /><span className="text-[10px] font-bold uppercase">Fee</span></div>
                                                    <div className="text-sm font-black text-foreground tabular-nums">₹{parseFloat(enrollment.payment?.amount || workshop.fee).toLocaleString('en-IN')}</div>
                                                </div>
                                                <div className="p-2.5 rounded-sm bg-muted/10 border border-border">
                                                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1"><Clock3 className="size-3" /><span className="text-[10px] font-bold uppercase">Starts</span></div>
                                                    <div className="text-xs font-semibold text-foreground">{new Date(workshop.starts_at).toLocaleDateString('en-IN')}</div>
                                                </div>
                                            </div>

                                            <div className="space-y-1 text-[11px] text-muted-foreground">
                                                <div className="flex items-center gap-2"><MapPin className="size-3.5 text-primary" /> {workshop.venue || 'Venue not set'}</div>
                                                <div className="flex items-center gap-2"><Receipt className="size-3.5 text-primary" /> Payment {enrollment.payment?.status || 'completed'}</div>
                                            </div>
                                        </div>

                                        <div className={cn('flex items-center gap-2 pt-4', viewMode === 'list' && 'md:pt-0 md:justify-end')}>
                                            <Button asChild size="sm" className="flex-1 h-8 rounded-sm text-[11px] font-bold shadow-none cursor-pointer">
                                                <Link href={`/workshops/${workshop.slug}`}>View Workshop</Link>
                                            </Button>
                                            {enrollment.payment?.invoice && (
                                                <Button asChild variant="outline" size="sm" className="h-8 px-2 rounded-sm shadow-none cursor-pointer">
                                                    <Link href={`/academic/invoices/${enrollment.payment.invoice.id}`}>Invoice</Link>
                                                </Button>
                                            )}
                                            <Button asChild variant="outline" size="sm" className="h-8 px-2 rounded-sm shadow-none cursor-pointer">
                                                <Link href={`/workshops/${workshop.slug}`}>
                                                    <ArrowRight className="size-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-sm border border-border bg-card p-12 text-center">
                        <CalendarDays className="size-12 text-muted-foreground/15 mx-auto mb-4" />
                        <h3 className="text-base font-semibold text-foreground">No workshops found</h3>
                        <p className="text-xs text-muted-foreground mt-1 max-w-[320px] mx-auto">
                            {searchQuery ? `We couldn't find any workshops matching "${searchQuery}"` : 'You have not enrolled in any workshops yet.'}
                        </p>
                        {!searchQuery && (
                            <Button asChild variant="outline" size="sm" className="mt-4 rounded-sm h-8 text-xs shadow-none cursor-pointer">
                                <Link href="/workshops">Explore Workshops</Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

MyWorkshops.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'My Workshops', href: '#' }]}>
        {page}
    </AppLayout>
);