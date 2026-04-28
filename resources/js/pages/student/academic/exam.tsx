import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Trophy, CheckCircle2, AlertCircle, Play, FileText, Timer } from 'lucide-react';

export default function StudentExam({ enrollment, exam, attempt }: { enrollment: any, exam: any, attempt: any }) {
    const { post, processing } = useForm();

    const startExam = () => {
        post(`/my-course/${enrollment.id}/exam`);
    };

    return (
        <>
            <Head title={`Final Exam - ${enrollment.course.title}`} />
            
            <div className="w-full p-4 lg:p-6">
                <div className="mb-10 text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded text-[10px] font-black uppercase tracking-widest mb-4">
                        <Trophy className="size-3" /> Certification Pathway
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase leading-none mb-4">{enrollment.course.title}</h1>
                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-tight">Final Professional Assessment</p>
                </div>

                <div className="max-w-xl mx-auto">
                    {!attempt ? (
                        <Card className="border-border rounded overflow-hidden border border-primary/20 bg-card">
                            <CardContent className="p-6 md:p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded bg-muted/30 border border-border flex flex-col items-center text-center">
                                        <FileText className="size-6 text-primary mb-2" />
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Max Score</div>
                                        <div className="text-xl font-black">{exam.total_marks}</div>
                                    </div>
                                    <div className="p-4 rounded bg-muted/30 border border-border flex flex-col items-center text-center">
                                        <Timer className="size-6 text-primary mb-2" />
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Time Limit</div>
                                        <div className="text-xl font-black">60m</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-4 rounded bg-primary/5 text-primary border border-primary/10">
                                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                                        <p className="text-[10px] font-black uppercase leading-relaxed tracking-tight">
                                            Important: Passing requirement is 60% overall including assignments.
                                        </p>
                                    </div>
                                </div>

                                <Button 
                                    onClick={startExam} 
                                    disabled={processing}
                                    size="lg" 
                                    className="w-full h-14 rounded bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-xs transition-all"
                                >
                                    {processing ? 'Launching...' : 'Begin Assessment'}
                                    <Play className="ml-2 size-4 fill-current" />
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-border rounded overflow-hidden bg-green-500/[0.03] border border-green-500/20">
                            <CardContent className="p-10 text-center space-y-6">
                                <div className="size-16 rounded bg-green-500 flex items-center justify-center text-white mx-auto">
                                    <CheckCircle2 className="size-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Exam Completed</h2>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Submission Recorded Successfully</p>
                                </div>

                                <div className="p-6 rounded bg-card border border-green-500/20 inline-block min-w-[200px]">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2">Final Score</div>
                                    <div className="text-5xl font-black text-foreground">
                                        {attempt.marks_obtained} <span className="text-lg text-muted-foreground">/ {exam.total_marks}</span>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <Button asChild variant="outline" className="rounded h-11 px-8 font-black uppercase tracking-widest text-[10px] border-border bg-card">
                                        <Link href={`/my-course/${enrollment.id}/certificate`}>View Certificate Status</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

StudentExam.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'My Course', href: '#' }, { title: 'Final Exam', href: '#' }]}>
        {page}
    </AppLayout>
);
