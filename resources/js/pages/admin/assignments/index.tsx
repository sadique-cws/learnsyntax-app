import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BookOpen, Calendar, Plus, ChevronRight, GraduationCap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { Link } from '@inertiajs/react';

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

    return (
        <>
            <Head title="Manage Assignments" />
            
            <div className="w-full p-4 lg:p-6 font-sans">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight uppercase">Batch Assignments</h1>
                        <p className="text-muted-foreground text-sm font-medium">Create and manage weekly tasks for your students.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {batches.map((batch) => (
                        <Card key={batch.id} className="border-border shadow-none rounded-[2rem] overflow-hidden group">
                            <CardHeader className="bg-muted/30 p-6 border-b border-border/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                                        {batch.course.title}
                                    </span>
                                    <Dialog open={isCreateOpen && data.batch_id === batch.id.toString()} onOpenChange={(open) => {
                                        setIsCreateOpen(open);
                                        if (open) setData('batch_id', batch.id.toString());
                                    }}>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 rounded-lg font-bold text-xs uppercase">
                                                <Plus className="size-3.5 mr-1" /> Add Task
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="rounded-3xl border-border shadow-2xl p-0 overflow-hidden max-w-md">
                                            <DialogHeader className="bg-primary p-6 text-white text-left">
                                                <DialogTitle className="text-xl font-black uppercase tracking-tight">New Assignment</DialogTitle>
                                                <p className="text-white/70 text-xs font-medium">Assigning to {batch.name}</p>
                                            </DialogHeader>
                                            <form onSubmit={submit} className="p-6 space-y-5">
                                                <div className="grid gap-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Assignment Title</Label>
                                                    <Input 
                                                        required 
                                                        placeholder="e.g. Weekly React Hooks Practice" 
                                                        className="rounded-xl border-border h-11"
                                                        value={data.title}
                                                        onChange={e => setData('title', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Description</Label>
                                                    <Textarea 
                                                        placeholder="What should students do?" 
                                                        className="rounded-xl border-border min-h-[100px]"
                                                        value={data.description}
                                                        onChange={e => setData('description', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Max Marks</Label>
                                                        <Input 
                                                            type="number" 
                                                            required 
                                                            className="rounded-xl border-border h-11"
                                                            value={data.max_marks}
                                                            onChange={e => setData('max_marks', parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Due Date</Label>
                                                        <Input 
                                                            type="date" 
                                                            className="rounded-xl border-border h-11"
                                                            value={data.due_date}
                                                            onChange={e => setData('due_date', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <Button type="submit" disabled={processing} className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs">
                                                    {processing ? 'Creating...' : 'Create Assignment'}
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <CardTitle className="text-xl font-black uppercase tracking-tight">{batch.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {batch.assignments.map((assignment: any) => (
                                        <Link 
                                            key={assignment.id} 
                                            href={`/admin/academic/assignments/${assignment.id}`}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50 hover:border-primary transition-all group/item"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-background border border-border flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                                                    <BookOpen className="size-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm">{assignment.title}</div>
                                                    <div className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-2">
                                                        <Calendar className="size-3" /> Due {new Date(assignment.due_date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="size-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                                        </Link>
                                    ))}
                                    {batch.assignments.length === 0 && (
                                        <p className="text-center py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">No assignments yet</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
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
