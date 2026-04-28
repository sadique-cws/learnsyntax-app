import { Head, useForm } from '@inertiajs/react';
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
            
            <div className="w-full p-4 lg:p-6 font-sans">
                <div className="mb-10 text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <Trophy className="size-3" /> Certification Pathway
                    </div>
                    <h1 className="text-4xl font-black tracking-tight uppercase leading-none mb-4">{enrollment.course.title}</h1>
                    <p className="text-muted-foreground font-medium">Complete the final 50-mark assessment to earn your professional certificate.</p>
                </div>

                <div className="max-w-2xl mx-auto">
                    {!attempt ? (
                        <Card className="border-border  rounded-[3rem] overflow-hidden border-2 border-primary/20">
                            <CardContent className="p-10 space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 rounded-[2rem] bg-muted/30 border border-border flex flex-col items-center text-center">
                                        <FileText className="size-8 text-primary mb-3" />
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Marks</div>
                                        <div className="text-2xl font-black">{exam.total_marks}</div>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-muted/30 border border-border flex flex-col items-center text-center">
                                        <Timer className="size-8 text-primary mb-3" />
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Time Limit</div>
                                        <div className="text-2xl font-black">60m</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 text-primary">
                                        <AlertCircle className="size-5 shrink-0" />
                                        <p className="text-xs font-bold leading-relaxed">
                                            Important: You must score at least 60% overall (Average of Weekly Assignments + Final Exam) to qualify for the certificate.
                                        </p>
                                    </div>
                                </div>

                                <Button 
                                    onClick={startExam} 
                                    disabled={processing}
                                    size="lg" 
                                    className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 font-black uppercase tracking-[0.2em] text-sm   transition-all active:scale-95"
                                >
                                    {processing ? 'Launching Assessment...' : 'Start Final Exam'}
                                    <Play className="ml-2 size-5 fill-current" />
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-border  rounded-[3rem] overflow-hidden bg-green-500/[0.03] border-2 border-green-500/20">
                            <CardContent className="p-12 text-center space-y-6">
                                <div className="size-20 rounded-[2rem] bg-green-500 flex items-center justify-center text-white mx-auto   animate-in zoom-in-50 duration-500">
                                    <CheckCircle2 className="size-12" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Exam Completed!</h2>
                                    <p className="text-muted-foreground font-medium max-w-sm mx-auto">Your performance has been recorded. Check your eligibility for the certificate below.</p>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-white border border-green-500/20  inline-block">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mb-2">Your Exam Score</div>
                                    <div className="text-6xl font-black text-foreground">
                                        {attempt.marks_obtained} <span className="text-xl text-muted-foreground">/ {exam.total_marks}</span>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <Button asChild variant="outline" className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px] border-2">
                                        <Link href={`/my-course/${enrollment.id}/certificate`}>Check Certificate Status</Link>
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
