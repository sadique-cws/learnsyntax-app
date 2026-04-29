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
            label: 'Deployment Batch',
            sortable: true,
            render: (batch) => (
                <div className="flex items-center gap-2.5 py-1">
                    <div className="size-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center font-black text-primary text-[10px] shrink-0">
                        <GraduationCap className="size-3.5" />
                    </div>
                    <div>
                        <div className="font-black text-[13px] text-slate-900 leading-tight uppercase tracking-tight">{batch.name}</div>
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5 opacity-60">{batch.course.title}</div>
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
                    <div className="px-2 py-0.5 bg-primary/5 text-primary rounded border border-primary/10 text-[9px] font-black uppercase tracking-widest">
                        {batch.assignments.length} Tasks Active
                    </div>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Assignment Protocols" />
            
            <div className="w-full p-4 lg:p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                            <BookOpen className="size-3" /> Academic Modules
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Curriculum & Tasks</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1.5 italic">Synchronizing training batches with standardized task protocols.</p>
                    </div>
                </div>

                <div className="bg-background rounded-xl border border-border overflow-hidden">
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
                                        <Button variant="ghost" size="sm" className="h-7 px-2.5 rounded-lg font-black text-[8px] uppercase tracking-widest border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all shadow-none">
                                            <Plus className="size-2.5 mr-1.5" /> Initialize Task
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-xl border border-border max-w-md p-0 overflow-hidden shadow-none">
                                        <DialogHeader className="p-5 bg-muted/20 border-b border-border">
                                            <DialogTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-600">Initialize Assignment</DialogTitle>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">Deploying to {batch.name}</p>
                                        </DialogHeader>
                                        
                                        <form onSubmit={submit} className="p-5 space-y-5">
                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Protocol Title</Label>
                                                    <Input 
                                                        required 
                                                        placeholder="e.g. COMPILER_DESIGN_L1" 
                                                        className="h-10 rounded-lg border-border bg-muted/10 font-bold text-sm focus-visible:ring-primary/20 shadow-none uppercase"
                                                        value={data.title}
                                                        onChange={e => setData('title', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Task Instructions</Label>
                                                    <Textarea 
                                                        placeholder="Detailed execution protocol..." 
                                                        className="rounded-lg bg-muted/10 border-border min-h-[100px] font-bold text-sm focus-visible:ring-primary/20 shadow-none"
                                                        value={data.description}
                                                        onChange={e => setData('description', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Yield Cap (Marks)</Label>
                                                        <Input 
                                                            type="number" 
                                                            required 
                                                            className="h-10 rounded-lg border-border bg-muted/10 font-black text-sm focus-visible:ring-primary/20 shadow-none"
                                                            value={data.max_marks}
                                                            onChange={e => setData('max_marks', parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Termination Date</Label>
                                                        <Input 
                                                            type="date" 
                                                            className="h-10 rounded-lg border-border bg-muted/10 font-black text-sm focus-visible:ring-primary/20 shadow-none uppercase"
                                                            value={data.due_date}
                                                            onChange={e => setData('due_date', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-border flex flex-row gap-2">
                                                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="flex-1 h-11 rounded-lg font-black uppercase tracking-widest text-[9px] border border-border">Abort</Button>
                                                <Button type="submit" disabled={processing} className="flex-1 h-11 rounded-lg font-black uppercase tracking-widest text-[9px] bg-primary text-white hover:bg-primary/90 shadow-none">Commit Module</Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <div className="relative group/menu">
                                    <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-lg font-black text-[8px] uppercase tracking-widest border border-border bg-muted/5 hover:bg-muted/10 transition-all shadow-none">
                                        Inspect <ChevronRight className="size-2.5 ml-1" />
                                    </Button>
                                    <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-none opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50 p-3 space-y-1">
                                        <div className="px-3 py-2 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 border-b border-border/50 mb-2 flex justify-between items-center">
                                            <span>Active Curriculum Modules</span>
                                            <span className="text-primary/50">{batch.assignments.length} Units</span>
                                        </div>
                                        {batch.assignments.map((a: any) => (
                                            <Link 
                                                key={a.id} 
                                                href={`/admin/academic/assignments/${a.id}`}
                                                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all group/link"
                                            >
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">{a.title}</div>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-[12px] font-black text-slate-700 leading-none">{a.handed_in_count}</span>
                                                            <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Yield</span>
                                                        </div>
                                                        <div className="w-px h-3.5 bg-border" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[12px] font-black text-slate-700 leading-none">{batch.enrollments_count}</span>
                                                            <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Nodes</span>
                                                        </div>
                                                        <div className="w-px h-3.5 bg-border" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[12px] font-black text-slate-700 leading-none">{a.marked_count}</span>
                                                            <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Verified</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="size-6 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/5 group-hover/link:bg-primary group-hover/link:text-white transition-all">
                                                    <ChevronRight className="size-3" />
                                                </div>
                                            </Link>
                                        ))}
                                        {batch.assignments.length === 0 && (
                                            <div className="p-6 text-[9px] font-black text-muted-foreground/30 text-center italic bg-muted/10 rounded-lg uppercase tracking-widest">
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
