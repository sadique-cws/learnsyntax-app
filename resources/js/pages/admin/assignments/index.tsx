import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Plus, ChevronRight, GraduationCap, ChevronDown, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function AdminAssignmentIndex({ batches }: { batches: any[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-7 px-2.5 rounded-sm text-xs font-bold text-primary hover:bg-primary/5 border border-primary/10">
                                            View <ChevronDown className="size-3 ml-1" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-80 p-0 rounded-sm border border-border shadow-xl overflow-hidden">
                                        <div className="px-4 py-3 border-b border-border bg-muted/10 flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Available Tasks</span>
                                                <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter mt-0.5">{batch.name}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-sm border border-primary/10 tabular-nums">
                                                {batch.assignments.length}
                                            </span>
                                        </div>
                                        <div className="max-h-[360px] overflow-y-auto p-1.5 bg-white">
                                            {[...batch.assignments].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((a: any) => (
                                                <DropdownMenuItem key={a.id} asChild className="p-0 focus:bg-transparent">
                                                    <Link href={`/admin/academic/assignments/${a.id}`} className="flex items-center justify-between p-3.5 rounded-sm hover:bg-muted/30 group/link transition-all mb-1 last:mb-0 border border-transparent hover:border-border/60">
                                                        <div className="flex-1 min-w-0 pr-4">
                                                            <div className="text-[13px] font-bold text-foreground truncate group-hover/link:text-primary transition-colors leading-tight">{a.title}</div>
                                                            <div className="mt-2.5 flex items-center gap-3">
                                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                                                    <FileText className="size-3 text-primary/40" /> {a.handed_in_count} <span className="opacity-50">In</span>
                                                                </div>
                                                                <div className="h-2.5 w-px bg-border/60" />
                                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
                                                                    <CheckCircle2 className="size-3 text-emerald-500/50" /> {a.marked_count} <span className="opacity-50">Graded</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="size-6 rounded-sm bg-muted flex items-center justify-center text-muted-foreground group-hover/link:bg-primary group-hover/link:text-white transition-all">
                                                            <ChevronRight className="size-3.5" />
                                                        </div>
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                            {batch.assignments.length === 0 && (
                                                <div className="py-12 text-center flex flex-col items-center justify-center gap-2 opacity-40">
                                                    <div className="size-10 rounded-full bg-muted/20 flex items-center justify-center mb-1">
                                                        <AlertCircle className="size-5 text-muted-foreground/30" strokeWidth={1.5} />
                                                    </div>
                                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No assignments found</div>
                                                </div>
                                            )}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    />
                </div>
            </div>
        </>
    );
}

AdminAssignmentIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Assignments', href: '/admin/academic/assignments' }]}>
        {page}
    </AppLayout>
);
