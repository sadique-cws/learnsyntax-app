import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Trophy, Settings, ChevronRight, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function AdminExamIndex({ courses }: { courses: any[] }) {
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        course_id: '',
        title: '',
        total_marks: 50,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/academic/exams', {
            onSuccess: () => {
                setIsConfigOpen(false);
                reset();
            }
        });
    };

    const columns: Column<any>[] = [
        {
            key: 'title',
            label: 'Program & Exam',
            sortable: true,
            render: (course) => (
                <div className="flex items-center gap-2.5 py-1">
                    <div className="size-8 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Trophy className="size-3 opacity-70" />
                    </div>
                    <div>
                        <div className="font-black text-[12px] text-slate-900 leading-tight uppercase tracking-tight">{course.title}</div>
                        <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-0.5 opacity-60">
                            {course.exam ? course.exam.title : 'Setup Pending'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'total_marks',
            label: 'Weightage',
            sortable: false,
            render: (course) => (
                <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 bg-primary/5 text-primary rounded-sm border border-primary/10 text-[9px] font-black uppercase tracking-widest">
                        {course.exam ? course.exam.total_marks : '0'} Marks Cap
                    </div>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Manage Exams" />
            
            <div className="w-full p-4 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-border pb-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-1.5">
                            <BookOpen className="size-3" /> Core Registry
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Examination Protocols</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Configure and manage certification benchmarks for active modules.</p>
                    </div>
                </div>

                <div className="bg-background rounded-sm border border-border shadow-none overflow-hidden">
                    <AdminDataTable 
                        title="Examination Board"
                        subtitle="Orchestrating test benchmarks and grading criteria"
                        data={courses}
                        columns={columns}
                        searchPlaceholder="Filter programs by metadata..."
                        actions={(course) => (
                            <div className="flex items-center justify-end gap-1.5">
                                <Dialog open={isConfigOpen && data.course_id === course.id.toString()} onOpenChange={(open) => {
                                    setIsConfigOpen(open);
                                    if (open) {
                                        setData({
                                            course_id: course.id.toString(),
                                            title: course.exam?.title || 'Final Certification Exam',
                                            total_marks: course.exam?.total_marks || 50
                                        });
                                    }
                                }}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-7 px-2.5 rounded-sm font-black text-[8px] uppercase tracking-widest border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 shadow-none">
                                            <Settings className="size-2.5 mr-1.5" /> {course.exam ? 'Config' : 'Setup'}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-sm border border-border max-w-md p-0 overflow-hidden shadow-none">
                                        <DialogHeader className="p-4 bg-muted/20 border-b border-border">
                                            <DialogTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-600">Configure Protocol</DialogTitle>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">Deploying to {course.title}</p>
                                        </DialogHeader>
                                        
                                        <form onSubmit={submit} className="p-4 space-y-4">
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Protocol Title</Label>
                                                    <Input 
                                                        required 
                                                        className="h-9 rounded-sm border-border bg-muted/10 font-bold text-xs shadow-none uppercase"
                                                        value={data.title}
                                                        onChange={e => setData('title', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Maximum Yield</Label>
                                                    <Input 
                                                        type="number" 
                                                        required 
                                                        className="h-9 rounded-sm border-border bg-muted/10 font-black text-xs shadow-none"
                                                        value={data.total_marks}
                                                        onChange={e => setData('total_marks', parseInt(e.target.value))}
                                                    />
                                                </div>
                                            </div>

                                            <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2">
                                                <Button type="button" variant="ghost" onClick={() => setIsConfigOpen(false)} className="flex-1 h-9 rounded-sm font-black uppercase tracking-widest text-[9px] border border-border">Abort</Button>
                                                <Button type="submit" disabled={processing} className="flex-1 h-9 rounded-sm font-black uppercase tracking-widest text-[9px] bg-primary text-white hover:bg-primary/90 shadow-none">Commit Logic</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                {course.exam && (
                                    <>
                                        <Button asChild variant="outline" size="sm" className="h-7 px-2.5 rounded-sm font-black text-[8px] uppercase tracking-widest border border-border bg-muted/5 hover:bg-muted/10 shadow-none">
                                            <Link href={`/admin/academic/exams/${course.exam.id}/questions`}>
                                                Questions
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" size="sm" className="h-7 px-2.5 rounded-sm font-black text-[8px] uppercase tracking-widest border border-border bg-muted/5 hover:bg-muted/10 shadow-none">
                                            <Link href={`/admin/academic/exams/${course.exam.id}/results`}>
                                                Results <ChevronRight className="size-2.5 ml-1" />
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>
        </>
    );
}

AdminExamIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Exams', href: '/admin/academic/exams' }]}>
        {page}
    </AppLayout>
);
