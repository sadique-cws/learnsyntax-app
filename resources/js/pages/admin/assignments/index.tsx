import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Plus, ChevronRight, GraduationCap, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function AdminAssignmentIndex({ batches }: { batches: any[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [viewBatch, setViewBatch] = useState<any>(null);
    const { data, setData, post, processing, reset } = useForm({
        batch_id: '', title: '', description: '', max_marks: 100, due_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/academic/assignments', { onSuccess: () => { setIsCreateOpen(false); reset(); } });
    };

    const columns: Column<any>[] = [
        {
            key: 'name', label: 'Batch', sortable: true,
            render: (batch) => (
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                        <GraduationCap className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{batch.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{batch.course.title}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'assignments_count', label: 'Assignments',
            render: (batch) => (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100 tabular-nums">
                    {batch.assignments.length} tasks
                </span>
            )
        }
    ];

    return (
        <>
            <Head title="Assignments" />
            <div className="w-full p-4 space-y-3">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">Assignments</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Manage assignments across training batches</p>
                </div>
                <div className="rounded-sm border border-border overflow-hidden">
                    <AdminDataTable title="Batch Assignments" data={batches} columns={columns} searchPlaceholder="Search batches..."
                        actions={(batch) => (
                            <div className="flex items-center justify-end gap-1">
                                <Dialog open={isCreateOpen && data.batch_id === batch.id.toString()} onOpenChange={(open) => { setIsCreateOpen(open); if (open) setData('batch_id', batch.id.toString()); }}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-7 px-2 rounded-sm text-xs font-medium text-primary hover:bg-primary/5">
                                            <Plus className="size-3 mr-1" /> Add
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-sm border border-border max-w-md p-0 overflow-hidden shadow-none">
                                        <DialogHeader className="px-4 py-3 border-b border-border">
                                            <DialogTitle className="text-sm font-semibold">New Assignment</DialogTitle>
                                            <p className="text-xs text-muted-foreground">Adding to {batch.name}</p>
                                        </DialogHeader>
                                        <form onSubmit={submit} className="p-4 space-y-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-muted-foreground">Title</Label>
                                                <Input required placeholder="Assignment title" className="h-9 rounded-sm text-sm shadow-none" value={data.title} onChange={e => setData('title', e.target.value)} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                                                <Textarea placeholder="Instructions..." className="rounded-sm min-h-[80px] text-sm shadow-none" value={data.description} onChange={e => setData('description', e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-xs font-medium text-muted-foreground">Max Marks</Label>
                                                    <Input type="number" required className="h-9 rounded-sm text-sm shadow-none" value={data.max_marks} onChange={e => setData('max_marks', parseInt(e.target.value))} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs font-medium text-muted-foreground">Due Date</Label>
                                                    <Input type="date" className="h-9 rounded-sm text-sm shadow-none" value={data.due_date} onChange={e => setData('due_date', e.target.value)} />
                                                </div>
                                            </div>
                                            <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2">
                                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1 h-9 rounded-sm text-xs shadow-none">Cancel</Button>
                                                <Button type="submit" disabled={processing} className="flex-1 h-9 rounded-sm text-xs shadow-none">Create</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    variant="ghost" size="sm"
                                    className="h-7 px-2.5 rounded-sm text-xs font-medium text-primary hover:bg-primary/5 border border-primary/10"
                                    onClick={() => setViewBatch(batch)}
                                >
                                    View
                                </Button>
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* View Assignments Modal */}
            <Dialog open={!!viewBatch} onOpenChange={(open) => { if (!open) setViewBatch(null); }}>
                <DialogContent className="rounded-sm border border-border max-w-lg p-0 overflow-hidden shadow-none">
                    <DialogHeader className="px-4 py-3 border-b border-border bg-muted/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-sm font-semibold">{viewBatch?.name}</DialogTitle>
                                <p className="text-xs text-muted-foreground mt-0.5">{viewBatch?.course?.title}</p>
                            </div>
                            <span className="text-xs font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-sm border border-primary/10 tabular-nums">
                                {viewBatch?.assignments?.length ?? 0} tasks
                            </span>
                        </div>
                    </DialogHeader>
                    <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
                        {viewBatch?.assignments?.length > 0 ? (
                            [...viewBatch.assignments]
                                .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                .map((a: any) => (
                                    <Link
                                        key={a.id}
                                        href={`/admin/academic/assignments/${a.id}`}
                                        className="flex items-center justify-between px-4 py-3 hover:bg-muted/5 transition-colors group"
                                    >
                                        <div className="min-w-0 pr-4">
                                            <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{a.title}</div>
                                            <div className="mt-1.5 flex items-center gap-3 flex-wrap">
                                                {a.due_date && (
                                                    <>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Clock className="size-3" />
                                                            <span className="tabular-nums">{new Date(a.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                                                        </div>
                                                        <div className="h-3 w-px bg-border" />
                                                    </>
                                                )}
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <FileText className="size-3" /> {a.handed_in_count} <span className="text-[10px]">in</span>
                                                </div>
                                                <div className="h-3 w-px bg-border" />
                                                <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                                                    <CheckCircle2 className="size-3 text-emerald-500" /> {a.marked_count} <span className="text-[10px]">graded</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="size-6 rounded-sm bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                            <ChevronRight className="size-3.5" />
                                        </div>
                                    </Link>
                                ))
                        ) : (
                            <div className="py-12 text-center">
                                <AlertCircle className="size-6 text-muted-foreground/20 mx-auto mb-2" strokeWidth={1.5} />
                                <p className="text-xs text-muted-foreground">No assignments found</p>
                            </div>
                        )}
                    </div>
                    <div className="px-4 py-2 border-t border-border bg-muted/5">
                        <span className="text-[10px] text-muted-foreground">{viewBatch?.assignments?.length ?? 0} assignments • sorted by newest first</span>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminAssignmentIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Assignments', href: '/admin/academic/assignments' }]}>
        {page}
    </AppLayout>
);
