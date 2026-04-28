import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Plus, ChevronRight, GraduationCap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function AdminAssignmentIndex({ batches }: { batches: any[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        batch_id: '',
        title: '',
        description: '',
        max_marks: 100,
        due_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/academic/assignments', {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            }
        });
    };

    const columns: Column<any>[] = [
        {
            key: 'name',
            label: 'Batch & Program',
            sortable: true,
            render: (batch) => (
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded bg-primary/5 border border-primary/10 flex items-center justify-center font-medium text-primary text-xs shrink-0">
                        <GraduationCap className="size-4" />
                    </div>
                    <div>
                        <div className="font-medium text-sm text-foreground">{batch.name}</div>
                        <div className="text-[10px] text-muted-foreground font-medium tracking-tight">{batch.course.title}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'assignments_count',
            label: 'Status',
            sortable: false,
            render: (batch) => (
                <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 bg-muted rounded text-[10px] font-medium tracking-tight">
                        {batch.assignments.length} Assignments Active
                    </div>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Manage Assignments" />
            
            <div className="w-full p-4 lg:p-6">
                <AdminDataTable 
                    title="Curriculum & Tasks"
                    subtitle="Assign and track progress for each training batch"
                    data={batches}
                    columns={columns}
                    searchPlaceholder="Search batches..."
                    actions={(batch) => (
                        <div className="flex items-center justify-end gap-2">
                            <Dialog open={isCreateOpen && data.batch_id === batch.id.toString()} onOpenChange={(open) => {
                                setIsCreateOpen(open);
                                if (open) setData('batch_id', batch.id.toString());
                            }}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 px-3 rounded font-medium text-[10px]  hover:bg-primary/10 hover:text-primary transition-colors">
                                        <Plus className="size-3 mr-2" /> New Task
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded border border-border max-w-md">
                                    <form onSubmit={submit} className="space-y-6">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-medium tracking-tight">Create Assignment</DialogTitle>
                                            <p className="text-muted-foreground text-[10px] font-medium tracking-tight">Assigning to {batch.name}</p>
                                        </DialogHeader>
                                        
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-medium tracking-tight">Title</Label>
                                                <Input 
                                                    required 
                                                    placeholder="e.g. Weekly React Hooks Practice" 
                                                    className="rounded bg-card border-border h-10"
                                                    value={data.title}
                                                    onChange={e => setData('title', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-medium tracking-tight">Instructions</Label>
                                                <Textarea 
                                                    placeholder="What should students do?" 
                                                    className="rounded bg-card border-border min-h-[100px]"
                                                    value={data.description}
                                                    onChange={e => setData('description', e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-medium tracking-tight">Max Marks</Label>
                                                    <Input 
                                                        type="number" 
                                                        required 
                                                        className="rounded bg-card border-border h-10"
                                                        value={data.max_marks}
                                                        onChange={e => setData('max_marks', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-medium tracking-tight">Deadline</Label>
                                                    <Input 
                                                        type="date" 
                                                        className="rounded bg-card border-border h-10"
                                                        value={data.due_date}
                                                        onChange={e => setData('due_date', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Button type="submit" disabled={processing} className="w-full h-11 rounded font-medium  text-xs">
                                            {processing ? 'Processing...' : 'Issue Assignment'}
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <div className="relative group/menu">
                                <Button variant="outline" size="sm" className="h-8 px-3 rounded font-medium text-[10px]  border-border bg-card">
                                    Manage <ChevronRight className="size-3 ml-1" />
                                </Button>
                                <div className="absolute right-0 top-full mt-1 w-80 bg-card border border-border rounded-sm shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50 p-3 space-y-1">
                                    <div className="px-3 py-2 text-[10px] font-black   text-muted-foreground border-b border-border/50 mb-2 flex justify-between items-center">
                                        <span>Recent Curriculum Tasks</span>
                                        <span className="text-primary/50">{batch.assignments.length} Total</span>
                                    </div>
                                    {batch.assignments.map((a: any) => (
                                        <Link 
                                            key={a.id} 
                                            href={`/admin/academic/assignments/${a.id}`}
                                            className="flex items-center justify-between p-3 rounded-sm hover:bg-primary/[0.03] border border-transparent hover:border-primary/10 transition-all"
                                        >
                                            <div className="flex-1 min-w-0 pr-4">
                                                <div className="text-xs font-bold text-foreground truncate">{a.title}</div>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[14px] font-black text-foreground leading-none">{a.handed_in_count}</span>
                                                        <span className="text-[8px] font-bold text-muted-foreground  tracking-tight">Handed in</span>
                                                    </div>
                                                    <div className="w-px h-4 bg-border/50" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[14px] font-black text-foreground leading-none">{batch.enrollments_count}</span>
                                                        <span className="text-[8px] font-bold text-muted-foreground  tracking-tight">Assigned</span>
                                                    </div>
                                                    <div className="w-px h-4 bg-border/50" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[14px] font-black text-foreground leading-none">{a.marked_count}</span>
                                                        <span className="text-[8px] font-bold text-muted-foreground  tracking-tight">Marked</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="size-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover/link:bg-primary group-hover/link:text-white transition-colors">
                                                <ChevronRight className="size-4" />
                                            </div>
                                        </Link>
                                    ))}
                                    {batch.assignments.length === 0 && (
                                        <div className="p-6 text-[10px] font-black text-muted-foreground text-center italic   bg-muted/20 rounded-sm">
                                            No curriculum tasks created
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                />
            </div>
        </>
    );
}

AdminAssignmentIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Assignments', href: '/admin/academic/assignments' }]}>
        {page}
    </AppLayout>
);
