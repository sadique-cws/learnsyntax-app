import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { CalendarDays, Clock3, IndianRupee, MapPin, Pencil, Plus, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import TeacherLayout from '@/layouts/teacher-layout';

function formatDateTime(value: string): string {
    return new Date(value).toLocaleString();
}

function toDatetimeLocal(value: string): string {
    if (!value) {
        return '';
    }

    return new Date(value).toISOString().slice(0, 16);
}

export default function TeacherWorkshopsIndex({ workshops = [] }: any) {
    const [mounted, setMounted] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        fee: '',
        image: null as File | null,
    });

    const {
        data: editData,
        setData: setEditData,
        post: postEdit,
        processing: processingEdit,
        reset: resetEdit,
    } = useForm({
        _method: 'PATCH',
        title: '',
        description: '',
        fee: '',
        image: null as File | null,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/teacher/workshops', {
            onSuccess: () => {
                reset();
                setShowAddForm(false);
            },
        });
    };

    const openEdit = (workshop: any) => {
        setSelectedWorkshop(workshop);
        setEditData({
            _method: 'PATCH',
            title: workshop.title ?? '',
            description: workshop.description ?? '',
            fee: workshop.fee?.toString?.() ?? '',
            image: null,
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedWorkshop) {
            return;
        }

        postEdit(`/teacher/workshops/${selectedWorkshop.id}`, {
            onSuccess: () => {
                resetEdit();
                setSelectedWorkshop(null);
            },
        });
    };

    return (
        <>
            <Head title="Workshop Studio" />
            <div className="w-full p-4 lg:p-6 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Workshop Studio</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Create workshops, set fees, and manage enrollments.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-muted/5">
                            <Users className="size-3.5 text-muted-foreground" />
                            <span className="text-xs font-semibold text-foreground tabular-nums">{workshops.length}</span>
                            <span className="text-[10px] text-muted-foreground">workshops</span>
                        </div>
                        <Button
                            onClick={() => setShowAddForm((open) => !open)}
                            size="sm"
                            className="h-8 rounded-sm shadow-none text-xs font-medium"
                        >
                            {showAddForm ? <X className="size-3.5 mr-1.5" /> : <Plus className="size-3.5 mr-1.5" />}
                            {showAddForm ? 'Close' : 'Add Workshop'}
                        </Button>
                    </div>
                </div>

                {showAddForm && (
                    <form onSubmit={submit} className="rounded-sm border border-border bg-card p-3 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-muted-foreground">Title</Label>
                                <Input value={data.title} onChange={(e) => setData('title', e.target.value)} className="h-8 rounded-sm text-sm" placeholder="Workshop title" />
                                {errors.title && <p className="text-[10px] text-red-500">{errors.title}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-muted-foreground">Fee</Label>
                                <Input type="number" value={data.fee} onChange={(e) => setData('fee', e.target.value)} className="h-8 rounded-sm text-sm" placeholder="0" />
                                {errors.fee && <p className="text-[10px] text-red-500">{errors.fee}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                            <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} className="rounded-sm text-sm resize-none" placeholder="Describe what students will learn" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground">Cover Image</Label>
                            <Input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)} className="h-8 pt-1.5 rounded-sm text-sm" />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Button type="button" variant="outline" size="sm" className="h-8 rounded-sm text-xs shadow-none" onClick={() => setShowAddForm(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} size="sm" className="h-8 rounded-sm text-xs shadow-none">
                                <Plus className="size-3 mr-1.5" /> Create Workshop
                            </Button>
                        </div>
                    </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {workshops.map((workshop: any) => (
                        (() => {
                            const firstBatch = Array.isArray(workshop.batches) ? workshop.batches[0] : null;

                            return (
                        <div key={workshop.id} className="rounded-sm border border-border bg-card overflow-hidden">
                            <div className="p-3 border-b border-border bg-muted/5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-semibold text-foreground truncate">{workshop.title}</h3>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{workshop.description || 'No description added yet.'}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => openEdit(workshop)}
                                        className="shrink-0 inline-flex items-center gap-1 rounded-sm border border-border bg-background px-2 py-1 text-[10px] font-medium text-foreground hover:bg-muted/30 transition-colors"
                                    >
                                        <Pencil className="size-3" /> Edit
                                    </button>
                                </div>
                            </div>

                            <div className="p-3 space-y-3">
                                <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                                    <span className="inline-flex items-center gap-1 rounded-sm border border-border px-2 py-1">
                                        <IndianRupee className="size-3" /> {Number(workshop.fee).toLocaleString('en-IN')}
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-sm border border-border px-2 py-1">
                                        <Clock3 className="size-3" /> {workshop.batches?.length || 0} batches
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-sm border border-border px-2 py-1">
                                        <Users className="size-3" /> {workshop.paid_enrollments_count || 0} enrolled
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="size-3.5 text-primary" />
                                        <span>{firstBatch ? (mounted ? formatDateTime(firstBatch.starts_at || firstBatch.start_date) : 'Loading date...') : 'No batch yet'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-3.5 text-primary" />
                                        <span>{firstBatch?.meta?.venue || 'Venue not set'}</span>
                                    </div>
                                </div>

                                {((Array.isArray(firstBatch?.meta?.topics) && firstBatch.meta.topics.length > 0) || (Array.isArray(workshop.topics) && workshop.topics.length > 0)) && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {(Array.isArray(firstBatch?.meta?.topics) && firstBatch.meta.topics.length > 0 ? firstBatch.meta.topics : workshop.topics).slice(0, 4).map((topic: string) => (
                                            <span key={topic} className="inline-flex items-center rounded-sm border border-border bg-muted/10 px-2 py-1 text-[10px] font-medium text-muted-foreground">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[10px] text-muted-foreground">Enrollment closes 1 hour before start</span>
                                    <Button asChild variant="outline" className="h-7 rounded-sm text-[10px] shadow-none">
                                        <Link href={`/teacher/workshops/${workshop.id}`}>Open</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                            );
                        })()
                    ))}

                    {workshops.length === 0 && !showAddForm && (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-sm bg-card">
                            <Users className="size-8 text-muted-foreground/20 mx-auto mb-3" />
                            <p className="text-sm font-medium text-foreground">No workshops yet</p>
                            <p className="text-xs text-muted-foreground mt-1">Create your first workshop to get started</p>
                        </div>
                    )}
                </div>
            </div>

            <Sheet open={!!selectedWorkshop} onOpenChange={(open) => !open && setSelectedWorkshop(null)}>
                <SheetContent className="sm:max-w-lg w-full border-l border-border p-0 flex flex-col">
                    {selectedWorkshop && (
                        <>
                            <SheetHeader className="px-4 py-3 border-b border-border bg-muted/5 shrink-0">
                                <SheetTitle className="text-sm font-semibold">Edit Workshop</SheetTitle>
                                <SheetDescription className="text-[10px]">Update the workshop details and enrollment window.</SheetDescription>
                            </SheetHeader>

                            <form onSubmit={submitEdit} className="p-4 space-y-3 overflow-y-auto">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Title</Label>
                                    <Input value={editData.title} onChange={(e) => setEditData('title', e.target.value)} className="h-8 rounded-sm text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Fee</Label>
                                    <Input type="number" value={editData.fee} onChange={(e) => setEditData('fee', e.target.value)} className="h-8 rounded-sm text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                                    <Textarea value={editData.description} onChange={(e) => setEditData('description', e.target.value)} rows={5} className="rounded-sm text-sm resize-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Cover Image</Label>
                                    <Input type="file" accept="image/*" onChange={(e) => setEditData('image', e.target.files ? e.target.files[0] : null)} className="h-8 pt-1.5 rounded-sm text-sm" />
                                </div>
                                <Button type="submit" disabled={processingEdit} size="sm" className="w-full h-8 rounded-sm text-xs shadow-none">
                                    Save Changes
                                </Button>
                            </form>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
}

TeacherWorkshopsIndex.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Dashboard', href: '/teacher/dashboard' }, { title: 'Workshops', href: '/teacher/workshops' }]}>
        {page}
    </TeacherLayout>
);
