import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Plus, ChevronRight, GraduationCap, BookOpen } from 'lucide-react';
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
            label: 'Deployment Batch',
            sortable: true,
            render: (batch) => (
                <div className="flex items-center gap-2.5 py-1">
                    <div className="size-8 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center font-black text-primary text-[10px] shrink-0">
                        <GraduationCap className="size-3" />
                    </div>
                    <div>
                        <div className="font-black text-[12px] text-slate-900 leading-tight uppercase tracking-tight">{batch.name}</div>
                        <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-0.5 opacity-60">{batch.course.title}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'assignments_count',
            label: 'Protocol Status',
            sortable: false,
            render: (batch) => (
                <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 bg-primary/5 text-primary rounded-sm border border-primary/10 text-[9px] font-black uppercase tracking-widest">
                        {batch.assignments.length} Tasks Active
                    </div>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Assignment Protocols" />
            
            <div className="w-full p-4 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-border pb-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-1.5">
                            <BookOpen className="size-3" /> Academic Modules
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Curriculum & Tasks</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Synchronizing training batches with standardized task protocols.</p>
                    </div>
                </div>

                <div className="bg-background rounded-sm border border-border overflow-hidden">
                    <AdminDataTable 
                        title="Batch Task Registry"
                        subtitle="Orchestrating academic deliverables across active training sectors"
                        data={batches}
                        columns={columns}
                        searchPlaceholder="Filter batch by protocol metadata..."
                        actions={(batch) => (
                            <div className="flex items-center justify-end gap-1.5">
                                <Dialog open={isCreateOpen && data.batch_id === batch.id.toString()} onOpenChange={(open) => {
                                    setIsCreateOpen(open);
                                    if (open) setData('batch_id', batch.id.toString());
                                }}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-7 px-2.5 rounded-sm font-black text-[8px] uppercase tracking-widest border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 shadow-none">
                                            <Plus className="size-2.5 mr-1.5" /> Initialize Task
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-sm border border-border max-w-md p-0 overflow-hidden shadow-none">
                                        <DialogHeader className="p-4 bg-muted/20 border-b border-border">
                                            <DialogTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-600">Initialize Assignment</DialogTitle>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">Deploying to {batch.name}</p>
                                        </DialogHeader>
                                        
                                        <form onSubmit={submit} className="p-4 space-y-4">
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Protocol Title</Label>
                                                    <Input 
                                                        required 
                                                        placeholder="e.g. COMPILER_DESIGN_L1" 
                                                        className="h-9 rounded-sm border-border bg-muted/10 font-bold text-xs shadow-none uppercase"
                                                        value={data.title}
                                                        onChange={e => setData('title', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Task Instructions</Label>
                                                    <Textarea 
                                                        placeholder="Detailed execution protocol..." 
                                                        className="rounded-sm bg-muted/10 border-border min-h-[80px] font-bold text-xs shadow-none"
                                                        value={data.description}
                                                        onChange={e => setData('description', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Yield Cap (Marks)</Label>
                                                        <Input 
                                                            type="number" 
                                                            required 
                                                            className="h-9 rounded-sm border-border bg-muted/10 font-black text-xs shadow-none"
                                                            value={data.max_marks}
                                                            onChange={e => setData('max_marks', parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Termination Date</Label>
                                                        <Input 
                                                            type="date" 
                                                            className="h-9 rounded-sm border-border bg-muted/10 font-black text-xs shadow-none uppercase"
                                                            value={data.due_date}
                                                            onChange={e => setData('due_date', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-border flex flex-row gap-2">
                                                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="flex-1 h-9 rounded-sm font-black uppercase tracking-widest text-[9px] border border-border">Abort</Button>
                                                <Button type="submit" disabled={processing} className="flex-1 h-9 rounded-sm font-black uppercase tracking-widest text-[9px] bg-primary text-white hover:bg-primary/90 shadow-none">Commit Module</Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <div className="relative group/menu">
                                    <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-sm font-black text-[8px] uppercase tracking-widest border border-border bg-muted/5 hover:bg-muted/10 shadow-none">
                                        Inspect <ChevronRight className="size-2.5 ml-1" />
                                    </Button>
                                    <div className="absolute right-0 top-full mt-1 w-80 bg-card border border-border rounded-sm shadow-none opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible z-50 p-2 space-y-1">
                                        <div className="px-2 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 border-b border-border mb-1.5 flex justify-between items-center">
                                            <span>Active Curriculum Modules</span>
                                            <span className="text-primary/50">{batch.assignments.length} Units</span>
                                        </div>
                                        {batch.assignments.map((a: any) => (
                                            <Link 
                                                key={a.id} 
                                                href={`/admin/academic/assignments/${a.id}`}
                                                className="flex items-center justify-between p-2 rounded-sm hover:bg-primary/5 border border-transparent hover:border-primary/10 group/link"
                                            >
                                                <div className="flex-1 min-w-0 pr-3">
                                                    <div className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate">{a.title}</div>
                                                    <div className="flex items-center gap-2.5 mt-1.5">
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-black text-slate-700 leading-none">{a.handed_in_count}</span>
                                                            <span className="text-[6px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Yield</span>
                                                        </div>
                                                        <div className="w-px h-3 bg-border" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-black text-slate-700 leading-none">{batch.enrollments_count}</span>
                                                            <span className="text-[6px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Nodes</span>
                                                        </div>
                                                        <div className="w-px h-3 bg-border" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-black text-slate-700 leading-none">{a.marked_count}</span>
                                                            <span className="text-[6px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Verified</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="size-5 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/5 group-hover/link:bg-primary group-hover/link:text-white transition-all">
                                                    <ChevronRight className="size-3" />
                                                </div>
                                            </Link>
                                        ))}
                                        {batch.assignments.length === 0 && (
                                            <div className="p-4 text-[9px] font-black text-muted-foreground/30 text-center italic bg-muted/10 rounded-sm uppercase tracking-widest">
                                                Null_Curriculum_Set
                                            </div>
                                        )}
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

AdminAssignmentIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Core Registry', href: '#' }, { title: 'Assignment Protocols', href: '/admin/academic/assignments' }]}>
        {page}
    </AppLayout>
);
