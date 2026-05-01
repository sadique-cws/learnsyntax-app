import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Clock3, IndianRupee, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TeacherLayout from '@/layouts/teacher-layout';

function formatDateTime(value: string): string {
    return new Date(value).toLocaleString();
}

export default function TeacherWorkshopShow({ workshop }: any) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const topics = Array.isArray(workshop.topics)
        ? workshop.topics
        : typeof workshop.topics === 'string'
            ? workshop.topics.split(',').map((topic: string) => topic.trim()).filter(Boolean)
            : [];

    return (
        <>
            <Head title={workshop.title} />
            <div className="w-full p-4 lg:p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:bg-muted border border-border shrink-0 shadow-none">
                        <Link href="/teacher/workshops"><ArrowLeft className="size-3.5" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold text-foreground leading-none">{workshop.title}</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Workshop details and enrolled students</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="lg:col-span-2 space-y-3">
                        <div className="rounded-sm border border-border bg-card p-4 space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="rounded-sm border border-border p-3">
                                    <div className="text-[10px] text-muted-foreground">Fee</div>
                                    <div className="text-sm font-semibold text-foreground flex items-center gap-1 mt-1"><IndianRupee className="size-3.5" /> {Number(workshop.fee).toLocaleString('en-IN')}</div>
                                </div>
                                <div className="rounded-sm border border-border p-3">
                                    <div className="text-[10px] text-muted-foreground">Duration</div>
                                    <div className="text-sm font-semibold text-foreground flex items-center gap-1 mt-1"><Clock3 className="size-3.5" /> {workshop.duration_hours} hrs</div>
                                </div>
                                <div className="rounded-sm border border-border p-3">
                                    <div className="text-[10px] text-muted-foreground">Starts</div>
                                    <div className="text-xs font-semibold text-foreground mt-1">{mounted ? formatDateTime(workshop.starts_at) : 'Loading date...'}</div>
                                </div>
                                <div className="rounded-sm border border-border p-3">
                                    <div className="text-[10px] text-muted-foreground">Students</div>
                                    <div className="text-sm font-semibold text-foreground flex items-center gap-1 mt-1"><Users className="size-3.5" /> {workshop.paid_enrollments_count || 0}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs font-semibold text-foreground">Description</div>
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                    {workshop.description || 'No description added yet.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2"><MapPin className="size-3.5 text-primary" /> {workshop.venue || 'Venue not set'}</div>
                                <div className="flex items-center gap-2"><CalendarDays className="size-3.5 text-primary" /> Enrollment closes 1 hour before start</div>
                            </div>

                            {topics.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-xs font-semibold text-foreground">Topics</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {topics.map((topic: string) => (
                                            <span key={topic} className="inline-flex items-center rounded-sm border border-border bg-muted/10 px-2 py-1 text-[10px] font-medium text-muted-foreground">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="rounded-sm border border-border bg-card p-4 space-y-3">
                            <div className="text-xs font-semibold text-foreground">Enrolled Students</div>
                            <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
                                {workshop.enrollments?.length > 0 ? workshop.enrollments.map((enrollment: any) => (
                                    <div key={enrollment.id} className="flex items-center justify-between gap-3 rounded-sm border border-border px-3 py-2">
                                        <div className="min-w-0">
                                            <div className="text-xs font-medium text-foreground truncate">{enrollment.user?.name || 'Student'}</div>
                                            <div className="text-[10px] text-muted-foreground truncate">{enrollment.user?.email || 'No email'}</div>
                                        </div>
                                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-sm border border-border bg-muted/10 text-muted-foreground">
                                            {enrollment.status}
                                        </span>
                                    </div>
                                )) : (
                                    <div className="rounded-sm border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                                        No students enrolled yet
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

TeacherWorkshopShow.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Dashboard', href: '/teacher/dashboard' }, { title: 'Workshops', href: '/teacher/workshops' }, { title: 'Manage Workshop', href: '#' }]}>
        {page}
    </TeacherLayout>
);
