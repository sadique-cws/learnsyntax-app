import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Trophy, CheckCircle2, AlertCircle, Play, FileText, Timer } from 'lucide-react';

export default function StudentExam({ enrollment, exam, attempt }: { enrollment: any, exam: any, attempt: any }) {
    const { post, processing } = useForm();
    const startExam = () => { post(`/my-course/${enrollment.id}/exam`); };

    return (
        <>
            <Head title={`Final Exam - ${enrollment.course.title}`} />
            <div className="w-full p-4 lg:p-6 space-y-4">
                <div>
                    <span className="text-[10px] font-medium text-primary block mb-0.5">Certification Pathway</span>
                    <h1 className="text-lg font-semibold text-foreground">{enrollment.course.title}</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Final Professional Assessment</p>
                </div>

                <div className="max-w-md">
                    {!attempt ? (
                        <div className="border border-border rounded-sm overflow-hidden">
                            {/* Info Header */}
                            <div className="px-4 py-3 border-b border-border bg-muted/5 flex items-center gap-2">
                                <Trophy className="size-3.5 text-primary" />
                                <span className="text-xs font-semibold">Exam Details</span>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-sm bg-muted/20 border border-border flex flex-col items-center text-center">
                                        <FileText className="size-4 text-primary mb-1.5" />
                                        <div className="text-[10px] font-medium text-muted-foreground mb-0.5">Max Score</div>
                                        <div className="text-lg font-semibold tabular-nums">{exam.total_marks}</div>
                                    </div>
                                    <div className="p-3 rounded-sm bg-muted/20 border border-border flex flex-col items-center text-center">
                                        <Timer className="size-4 text-primary mb-1.5" />
                                        <div className="text-[10px] font-medium text-muted-foreground mb-0.5">Time Limit</div>
                                        <div className="text-lg font-semibold">60m</div>
                                    </div>
                                </div>

                                {/* Warning */}
                                <div className="flex items-start gap-2.5 p-3 rounded-sm bg-primary/5 border border-primary/15">
                                    <AlertCircle className="size-3.5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-[10px] font-medium text-primary/80 leading-relaxed">
                                        Passing requirement is 60% overall including assignments and this exam.
                                    </p>
                                </div>

                                <Button
                                    onClick={startExam}
                                    disabled={processing}
                                    className="w-full h-9 rounded-sm shadow-none font-medium text-sm"
                                >
                                    {processing ? 'Starting...' : <>Begin Assessment <Play className="ml-1.5 size-3.5 fill-current" /></>}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-emerald-200 rounded-sm bg-emerald-50/50 overflow-hidden">
                            <div className="p-6 text-center space-y-4">
                                <div className="size-12 rounded-sm bg-emerald-500 flex items-center justify-center text-white mx-auto">
                                    <CheckCircle2 className="size-6" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-foreground">Exam Submitted</h2>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">Your answers have been recorded</p>
                                </div>

                                <div className="inline-block p-4 rounded-sm bg-background border border-emerald-200 min-w-[160px]">
                                    <div className="text-[10px] font-medium text-emerald-600 mb-1">Your Score</div>
                                    <div className="text-3xl font-semibold text-foreground tabular-nums">
                                        {attempt.marks_obtained}
                                        <span className="text-sm text-muted-foreground ml-1">/ {exam.total_marks}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
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
