import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TeacherLayout from '@/layouts/teacher-layout';
import { Plus, ChevronRight, GraduationCap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function TeacherAssignmentIndex({ batches }: { batches: any[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        batch_id: '', title: '', description: '', max_marks: 100, due_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/teacher/assignments', { onSuccess: () => { setIsCreateOpen(false); reset(); } });
    };

    const columns: Column<any>[] = [
        {
            key: 'name', label: 'Batch', sortable: true,
            render: (batch) => (
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
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
            <Head title="Batch Assignments" />
            <div className="w-full p-4 space-y-3 select-none">
                <div>
                    <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <GraduationCap className="size-5 text-indigo-500" />
                        Assignments Manager
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Create tasks and manage academic outcomes efficiently.</p>
                </div>
                
                <div className="rounded-sm border border-border overflow-hidden bg-card">
                    <AdminDataTable title="Assigned Tasks" data={batches} columns={columns} searchPlaceholder="Search modules..."
                        actions={(batch) => (
                            <div className="flex items-center justify-end gap-1">
                                <Dialog open={isCreateOpen && data.batch_id === batch.id.toString()} onOpenChange={(open) => { setIsCreateOpen(open); if (open) setData('batch_id', batch.id.toString()); }}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-7 px-2 rounded-sm text-xs font-medium text-primary hover:bg-primary/5">
                                            <Plus className="size-3 mr-1" /> Issue Task
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-sm border border-border max-w-md p-0 overflow-hidden shadow-none">
                                        <DialogHeader className="px-4 py-3 border-b border-border bg-muted/5">
                                            <DialogTitle className="text-sm font-semibold">Issue Assignment</DialogTitle>
                                            <p className="text-xs text-muted-foreground">Configuring for {batch.name}</p>
                                        </DialogHeader>
                                        <form onSubmit={submit} className="p-4 space-y-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-muted-foreground">Title</Label>
                                                <Input required placeholder="Assignment title" className="h-9 rounded-sm text-sm shadow-none focus-visible:ring-indigo-500" value={data.title} onChange={e => setData('title', e.target.value)} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-muted-foreground">Instructions</Label>
                                                <Textarea placeholder="Provide context for students..." className="rounded-sm min-h-[80px] text-sm shadow-none focus-visible:ring-indigo-500" value={data.description} onChange={e => setData('description', e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-xs font-medium text-muted-foreground">Max Marks</Label>
                                                    <Input type="number" required className="h-9 rounded-sm text-sm shadow-none focus-visible:ring-indigo-500" value={data.max_marks} onChange={e => setData('max_marks', parseInt(e.target.value))} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs font-medium text-muted-foreground">Deadline</Label>
                                                    <Input type="date" className="h-9 rounded-sm text-sm shadow-none focus-visible:ring-indigo-500" value={data.due_date} onChange={e => setData('due_date', e.target.value)} />
                                                </div>
                                            </div>
                                            <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2">
                                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1 h-9 rounded-sm text-xs shadow-none">Dismiss</Button>
                                                <Button type="submit" disabled={processing} className="flex-1 h-9 rounded-sm text-xs shadow-none bg-indigo-600 hover:bg-indigo-700 text-white">Deploy</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                
                                <div className="relative group/menu">
                                    <Button variant="ghost" size="sm" className="h-7 px-2 rounded-sm text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50">
                                        View <ChevronRight className="size-3 ml-0.5" />
                                    </Button>
                                    <div className="absolute right-0 top-full mt-1 w-72 bg-background border border-border rounded-sm opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible z-50 p-1 shadow-md transition-all duration-200">
                                        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground/60 border-b border-border mb-1 flex justify-between items-center bg-muted/5">
                                            <span className="uppercase tracking-wider">Issued Tasks</span>
                                            <span className="tabular-nums bg-muted px-1.5 py-0.5 rounded-sm">{batch.assignments.length}</span>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {batch.assignments.map((a: any) => (
                                                <Link key={a.id} href={`/teacher/assignments/${a.id}`} className="flex items-center justify-between p-2.5 rounded-sm hover:bg-muted/80 group/link transition-colors mb-0.5 last:mb-0">
                                                    <div className="flex-1 min-w-0 pr-3 text-left">
                                                        <div className="text-xs font-medium text-foreground truncate">{a.title}</div>
                                                        <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2">
                                                            <span>{a.handed_in_count} submitted</span>
                                                            <span className="size-1 rounded-full bg-border" />
                                                            <span>{a.marked_count} graded</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="size-3 text-muted-foreground/30 group-hover/link:text-foreground transition-transform group-hover/link:translate-x-0.5" />
                                                </Link>
                                            ))}
                                            {batch.assignments.length === 0 && (
                                                <div className="py-8 text-center">
                                                    <div className="text-[10px] font-medium text-muted-foreground/40 ">No issued tasks</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </div>
            </div>
        </>
    );
}

TeacherAssignmentIndex.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Instructor', href: '/teacher/dashboard' }, { title: 'Assignments', href: '/teacher/assignments' }]}>
        {page}
    </TeacherLayout>
);
