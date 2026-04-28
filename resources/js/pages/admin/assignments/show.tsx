import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { User, CheckCircle2, ChevronLeft, Save } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminAssignmentShow({ assignment }: { assignment: any }) {
    return (
        <>
            <Head title={`Grading: ${assignment.title}`} />
            
            <div className="w-full p-4 lg:p-6 font-sans">
                <div className="mb-8">
                    <Link href="/admin/academic/assignments" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-6">
                        <ChevronLeft className="size-4 mr-1" /> Back to Assignments
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2 block">{assignment.batch.name} • {assignment.batch.course.title}</span>
                            <h1 className="text-3xl font-black tracking-tight uppercase leading-none">{assignment.title}</h1>
                        </div>
                        <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-2xl border border-border/50">
                            <div className="text-right">
                                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Max Marks</div>
                                <div className="text-xl font-black text-foreground">{assignment.max_marks}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Student Submissions</h2>
                    {assignment.submissions.map((submission: any) => (
                        <GradingRow key={submission.id} submission={submission} maxMarks={assignment.max_marks} />
                    ))}
                </div>
            </div>
        </>
    );
}

function GradingRow({ submission, maxMarks }: { submission: any, maxMarks: number }) {
    const { data, setData, patch, processing } = useForm({
        marks_obtained: submission.marks_obtained || 0,
        admin_comments: submission.admin_comments || '',
    });

    const [isSaved, setIsSaved] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/academic/submissions/${submission.id}/grade`, {
            onSuccess: () => {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
            }
        });
    };

    return (
        <Card className="border-border  rounded-2xl overflow-hidden">
            <CardContent className="p-0">
                <form onSubmit={submit} className="flex flex-col md:flex-row items-center gap-6 p-6">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <User className="size-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="font-bold text-base mb-0.5">{submission.user.name}</h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{submission.user.email}</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-2 w-full md:w-32">
                            <Input 
                                type="number" 
                                className="h-10 rounded-xl text-center font-bold text-lg" 
                                value={data.marks_obtained}
                                onChange={e => setData('marks_obtained', parseInt(e.target.value))}
                                max={maxMarks}
                            />
                            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">/ {maxMarks}</span>
                        </div>
                        <Input 
                            placeholder="Add feedback..." 
                            className="h-10 rounded-xl md:w-64"
                            value={data.admin_comments}
                            onChange={e => setData('admin_comments', e.target.value)}
                        />
                        <Button 
                            type="submit" 
                            disabled={processing} 
                            variant={isSaved ? "outline" : "default"}
                            className={`h-10 px-6 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${isSaved ? 'border-green-600 text-green-600' : ''}`}
                        >
                            {processing ? '...' : (isSaved ? <CheckCircle2 className="size-4" /> : <Save className="size-4 mr-2" />)}
                            {isSaved ? 'Saved' : 'Save Marks'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

AdminAssignmentShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Assignments', href: '/admin/academic/assignments' }, { title: 'Grading', href: '#' }]}>
        {page}
    </AppLayout>
);
