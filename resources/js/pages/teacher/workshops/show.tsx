import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, IndianRupee, MapPin, Users, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TeacherLayout from '@/layouts/teacher-layout';

function formatDateTime(value: string): string {
    return new Date(value).toLocaleString();
}

export default function TeacherWorkshopShow({ workshop }: any) {
    const [mounted, setMounted] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        type: 'online',
        start_date: '',
        capacity: 1,
        duration_hours: '',
        topics: '',
        venue: '',
        starts_at: '',
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const submitBatch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(`/teacher/workshops/${workshop.id}/batches`, {
            onSuccess: () => {
                reset();
            },
        });
    };

    const topics = Array.isArray(workshop.topics)
        ? workshop.topics
        : typeof workshop.topics === 'string'
            ? workshop.topics.split(',').map((topic: string) => topic.trim()).filter(Boolean)
            : [];

    const batches = Array.isArray(workshop.batches) ? workshop.batches : [];
    const firstBatch = batches[0] ?? null;
    const firstBatchTopics = firstBatch?.meta?.topics ?? [];

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
                                    <div className="text-[10px] text-muted-foreground">Batches</div>
                                    <div className="text-sm font-semibold text-foreground flex items-center gap-1 mt-1"><Layers className="size-3.5" /> {batches.length}</div>
                                </div>
                                <div className="rounded-sm border border-border p-3">
                                    <div className="text-[10px] text-muted-foreground">Next Batch</div>
                                    <div className="text-xs font-semibold text-foreground mt-1">{firstBatch ? (mounted ? formatDateTime(firstBatch.starts_at || firstBatch.start_date) : 'Loading date...') : 'No batch yet'}</div>
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
                                <div className="flex items-center gap-2"><MapPin className="size-3.5 text-primary" /> {firstBatch?.meta?.venue || 'Venue not set yet'}</div>
                                <div className="flex items-center gap-2"><CalendarDays className="size-3.5 text-primary" /> {firstBatch ? 'Batch schedule only' : 'Create a batch to set schedule'}</div>
                            </div>

                            {(firstBatchTopics.length > 0 || topics.length > 0) && (
                                <div className="space-y-2">
                                    <div className="text-xs font-semibold text-foreground">Topics</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(firstBatchTopics.length > 0 ? firstBatchTopics : topics).map((topic: string) => (
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
                        <div className="rounded-sm border border-border bg-card p-4 space-y-3">
                            <div className="text-xs font-semibold text-foreground">Batches</div>
                            <div className="space-y-2 max-h-[220px] overflow-auto pr-1">
                                {batches.length > 0 ? batches.map((batch: any) => (
                                    <div key={batch.id} className="rounded-sm border border-border px-3 py-2 space-y-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-xs font-medium text-foreground truncate">{batch.name}</div>
                                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-sm border border-border bg-muted/10 text-muted-foreground">
                                                {batch.type}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground flex items-center justify-between gap-3">
                                            <span>{batch.starts_at ? formatDateTime(batch.starts_at) : (batch.meta?.starts_at ? formatDateTime(batch.meta.starts_at) : formatDateTime(batch.start_date))}</span>
                                            <span>{batch.enrollments?.length || 0}/{batch.capacity}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="rounded-sm border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                                        No batches created yet
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Create Batch Form - same as course page */}
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="px-3 py-2 border-b border-border bg-muted/5 flex items-center justify-between">
                                <span className="text-xs font-semibold flex items-center gap-1.5">New Batch</span>
                            </div>
                            <div className="p-3">
                                <form onSubmit={submitBatch} className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-muted-foreground">Batch Name</Label>
                                        <Input
                                            name="name"
                                            placeholder="E.g., Morning Batch"
                                            className="h-8 rounded-sm text-sm"
                                            required
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-muted-foreground">Mode</Label>
                                        <select
                                            name="type"
                                            className="h-8 rounded-sm text-xs w-full border border-border bg-background px-2"
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value)}
                                        >
                                            <option value="online">Online</option>
                                            <option value="offline">In-Person</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-muted-foreground">Starts At</Label>
                                            <Input
                                                type="datetime-local"
                                                name="starts_at"
                                                className="h-8 rounded-sm text-xs"
                                                required
                                                value={data.starts_at}
                                                onChange={e => setData('starts_at', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-muted-foreground">Capacity</Label>
                                            <Input
                                                type="number"
                                                name="capacity"
                                                className="h-8 rounded-sm text-xs"
                                                min="1"
                                                required
                                                value={data.capacity}
                                                onChange={e => setData('capacity', Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-muted-foreground">Duration (hours)</Label>
                                            <Input
                                                type="number"
                                                step="0.5"
                                                name="duration_hours"
                                                className="h-8 rounded-sm text-xs"
                                                min="0.5"
                                                required
                                                value={data.duration_hours}
                                                onChange={e => setData('duration_hours', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-muted-foreground">Topics</Label>
                                            <Input
                                                name="topics"
                                                placeholder="React, Laravel, APIs"
                                                className="h-8 rounded-sm text-sm"
                                                value={data.topics}
                                                onChange={e => setData('topics', e.target.value)}
                                            />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-muted-foreground">Venue</Label>
                                            <Input
                                                name="venue"
                                                placeholder="Online / Offline location"
                                                className="h-8 rounded-sm text-sm"
                                                value={data.venue}
                                                onChange={e => setData('venue', e.target.value)}
                                            />
                                    </div>
                                    <Button type="submit" size="sm" disabled={processing} className="w-full h-8 rounded-sm text-xs shadow-none">Publish Batch</Button>
                                </form>
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
