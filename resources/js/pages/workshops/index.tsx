import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CalendarDays, Clock3, MapPin, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { useState } from 'react';

function formatDateTime(value: string): string {
    return new Date(value).toLocaleString();
}

export default function WorkshopsIndex({ workshops = [] }: { workshops: any[] }) {
    const [search, setSearch] = useState('');

    const filteredWorkshops = workshops.filter((workshop) =>
        workshop.title.toLowerCase().includes(search.toLowerCase()) ||
        (workshop.description || '').toLowerCase().includes(search.toLowerCase()) ||
        (workshop.venue || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <PublicLayout>
            <Head title="Workshops" />
            <div className="w-full p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold mb-2">
                            Live Workshops
                        </div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Learn with live workshops</h1>
                        <p className="text-sm font-medium text-muted-foreground/60 max-w-xl">
                            Short hands-on sessions with one-hour-before-start enrollment cutoff.
                        </p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                        <input
                            type="text"
                            placeholder="Filter workshops..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 h-10 rounded-sm border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-sm font-bold text-foreground placeholder:text-muted-foreground/30 shadow-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredWorkshops.map((workshop, idx) => {
                        const topics = Array.isArray(workshop.topics) ? workshop.topics.slice(0, 3) : [];

                        return (
                            <Link key={workshop.id} href={`/workshops/${workshop.slug}`} className="group block focus:outline-none">
                                <div className="flex flex-col border border-border/80 bg-background rounded-sm overflow-hidden transition-all hover:border-primary/40 group-hover:shadow-md h-full relative">
                                    <div className="absolute top-3 right-3 z-10">
                                        <div className="px-2 py-0.5 bg-background/90 backdrop-blur-sm border border-border rounded-sm text-[11px] font-bold text-foreground shadow-sm">
                                            ₹{Number(workshop.fee).toLocaleString('en-IN')}
                                        </div>
                                    </div>

                                    <div className="relative aspect-[16/10] bg-muted border-b border-border/60 overflow-hidden flex items-center justify-center">
                                        <CalendarDays className="size-10 text-primary/30" />
                                    </div>

                                    <div className="p-4 flex flex-col flex-1 space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-primary mb-2">
                                                <Clock3 className="size-3" />
                                                <span>{workshop.duration_hours} Hours</span>
                                            </div>
                                            <h3 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                {workshop.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground/60 mt-2 line-clamp-2">
                                                {workshop.description || 'Live workshop sessions for practical learning.'}
                                            </p>
                                        </div>

                                        <div className="mt-auto space-y-4">
                                            <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarDays className="size-3.5" strokeWidth={2.5} />
                                                    <span>{new Date(workshop.starts_at).toLocaleDateString('en-IN')}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="size-3.5" strokeWidth={2.5} />
                                                    <span>{workshop.paid_enrollments_count || 0}</span>
                                                </div>
                                            </div>

                                            {topics.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {topics.map((topic: string) => (
                                                        <span key={topic} className="inline-flex items-center rounded-sm border border-border bg-muted/10 px-2 py-1 text-[10px] font-medium text-muted-foreground">
                                                            {topic}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between gap-2 pt-4 border-t border-border/60">
                                                <span className="text-[11px] font-bold text-foreground group-hover:text-primary transition-all flex items-center gap-1">
                                                    View Workshop <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                                                </span>
                                                <div className="text-[9px] font-bold text-muted-foreground/40">
                                                    {workshop.venue || 'Online'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {filteredWorkshops.length === 0 && (
                    <div className="py-24 text-center border border-dashed border-border/80 rounded-sm bg-muted/5">
                        <div className="size-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4 border border-border/60">
                            <Search className="size-8 text-muted-foreground/20" />
                        </div>
                        <h3 className="text-base font-bold text-foreground">No workshops found</h3>
                        <p className="text-xs font-medium text-muted-foreground mt-1">Try adjusting your search criteria to find available sessions.</p>
                        <Button variant="outline" size="sm" className="mt-6 h-9 px-6 rounded-sm text-[11px] font-bold uppercase tracking-tight" onClick={() => setSearch('')}>
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
