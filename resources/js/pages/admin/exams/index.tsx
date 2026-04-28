import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Trophy, Settings, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded bg-primary/5 border border-primary/10 flex items-center justify-center font-black text-primary text-xs shrink-0 uppercase">
                        <Trophy className="size-4" />
                    </div>
                    <div>
                        <div className="font-bold text-sm text-foreground">{course.title}</div>
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-tight">
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
                <div className="px-2 py-0.5 bg-muted rounded text-[10px] font-black uppercase tracking-tight inline-block">
                    {course.exam ? `${course.exam.total_marks} Marks` : 'N/A'}
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Manage Exams" />
            
            <div className="w-full p-4 lg:p-6">
                <AdminDataTable 
                    title="Examination Board"
                    subtitle="Configure and manage certification exams for each course"
                    data={courses}
                    columns={columns}
                    searchPlaceholder="Search programs..."
                    actions={(course) => (
                        <div className="flex items-center justify-end gap-2">
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
                                    <Button variant="ghost" size="sm" className="h-8 px-3 rounded font-black uppercase text-[10px] tracking-widest hover:bg-primary/10 hover:text-primary transition-colors">
                                        <Settings className="size-3 mr-2" /> {course.exam ? 'Config' : 'Setup'}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded border border-border max-w-md">
                                    <form onSubmit={submit} className="space-y-6">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-black uppercase tracking-tight">Configure Exam</DialogTitle>
                                            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">For {course.title}</p>
                                        </DialogHeader>
                                        
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest">Exam Title</Label>
                                                <Input 
                                                    required 
                                                    className="rounded bg-card border-border h-10"
                                                    value={data.title}
                                                    onChange={e => setData('title', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest">Total Marks</Label>
                                                <Input 
                                                    type="number" 
                                                    required 
                                                    className="rounded bg-card border-border h-10"
                                                    value={data.total_marks}
                                                    onChange={e => setData('total_marks', parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>

                                        <Button type="submit" disabled={processing} className="w-full h-11 rounded font-black uppercase tracking-widest text-xs">
                                            {processing ? 'Configuring...' : 'Save Configuration'}
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            {course.exam && (
                                <Button asChild variant="outline" size="sm" className="h-8 px-3 rounded font-black uppercase text-[10px] tracking-widest border-border bg-card">
                                    <Link href={`/admin/academic/exams/${course.exam.id}/results`}>
                                        Results <ChevronRight className="size-3 ml-1" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                />
            </div>
        </>
    );
}

AdminExamIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Exams', href: '/admin/academic/exams' }]}>
        {page}
    </AppLayout>
);
