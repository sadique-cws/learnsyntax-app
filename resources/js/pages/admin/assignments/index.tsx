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
                                        <Button variant="ghost" size="sm" className="h-7 px-2 rounded-sm text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50">
                                            View <ChevronDown className="size-3 ml-0.5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-72 p-1 rounded-sm border border-border shadow-xl">
                                        <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground/60 border-b border-border mb-1 flex justify-between items-center bg-muted/5">
                                            <span className="">Available Tasks</span>
                                            <span className="tabular-nums bg-muted px-1.5 py-0.5 rounded-sm border border-border/40">{batch.assignments.length}</span>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {batch.assignments.map((a: any) => (
                                                <DropdownMenuItem key={a.id} asChild className="p-0 focus:bg-transparent">
                                                    <Link href={`/admin/academic/assignments/${a.id}`} className="flex items-center justify-between p-3 rounded-sm hover:bg-muted group/link transition-all mb-0.5 last:mb-0 border border-transparent hover:border-border/50">
                                                        <div className="flex-1 min-w-0 pr-4">
                                                            <div className="text-[12px] font-bold text-foreground truncate group-hover/link:text-primary transition-colors">{a.title}</div>
                                                            <div className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-2 font-medium">
                                                                <span className="flex items-center gap-1"><FileText className="size-3" /> {a.handed_in_count} in</span>
                                                                <span className="size-1 rounded-full bg-border" />
                                                                <span className="flex items-center gap-1 text-emerald-600/80"><CheckCircle2 className="size-3" /> {a.marked_count} graded</span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="size-3 text-muted-foreground/30 group-hover/link:text-foreground transition-transform group-hover/link:translate-x-0.5" />
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                            {batch.assignments.length === 0 && (
                                                <div className="py-10 text-center flex flex-col items-center justify-center gap-2 opacity-50">
                                                    <AlertCircle className="size-5 text-muted-foreground/30" strokeWidth={1.5} />
                                                    <div className="text-[10px] font-bold text-muted-foreground ">No assignments found</div>
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
