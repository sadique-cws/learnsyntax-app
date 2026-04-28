import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { ClipboardList, Trophy, Settings, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { Link } from '@inertiajs/react';

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

    return (
        <>
            <Head title="Manage Exams" />
            
            <div className="w-full p-4 lg:p-6 font-sans">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight uppercase">Final Exams</h1>
                        <p className="text-muted-foreground text-sm font-medium">Configure and manage certification exams for each course.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {courses.map((course) => (
                        <Card key={course.id} className="border-border  rounded-[2rem] overflow-hidden">
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                            <Trophy className="size-8 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight leading-none mb-1">{course.title}</h3>
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                                                {course.exam ? `Status: ${course.exam.total_marks} Marks Final Exam` : 'Exam Not Configured'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
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
                                                <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest border-2">
                                                    <Settings className="size-3.5 mr-2" /> {course.exam ? 'Edit Config' : 'Setup Exam'}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="rounded-3xl border-border  p-0 overflow-hidden max-w-md">
                                                <DialogHeader className="bg-primary p-6 text-white text-left">
                                                    <DialogTitle className="text-xl font-black uppercase tracking-tight">Configure Exam</DialogTitle>
                                                    <p className="text-white/70 text-xs font-medium">For {course.title}</p>
                                                </DialogHeader>
                                                <form onSubmit={submit} className="p-6 space-y-5">
                                                    <div className="grid gap-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Exam Title</Label>
                                                        <Input 
                                                            required 
                                                            className="rounded-xl border-border h-11"
                                                            value={data.title}
                                                            onChange={e => setData('title', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Total Marks</Label>
                                                        <Input 
                                                            type="number" 
                                                            required 
                                                            className="rounded-xl border-border h-11"
                                                            value={data.total_marks}
                                                            onChange={e => setData('total_marks', parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                    <Button type="submit" disabled={processing} className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs">
                                                        {processing ? 'Configuring...' : 'Save Configuration'}
                                                    </Button>
                                                </form>
                                            </DialogContent>
                                        </Dialog>

                                        {course.exam && (
                                            <Button asChild variant="default" size="sm" className="h-10 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest">
                                                <Link href={`/admin/academic/exams/${course.exam.id}/results`}>
                                                    View Results <ChevronRight className="size-3.5 ml-1" />
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
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
