import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Trophy, CheckCircle2, AlertCircle, Play, FileText, Timer, ShieldCheck, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StudentExamProps {
    enrollment: any;
    exam: any;
    attempt: any;
    isVerified: boolean;
}

export default function StudentExam({ enrollment, exam, attempt, isVerified }: StudentExamProps) {
    const [isStarted, setIsStarted] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        passcode: '',
        answers: {} as Record<number, string>
    });

    const handleVerifyPasscode = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/my-course/${enrollment.id}/exam/verify`);
    };

    const handleSubmitExam = (e: React.FormEvent) => {
        e.preventDefault();
        if (confirm('Are you sure you want to submit your exam? This action cannot be undone.')) {
            post(`/my-course/${enrollment.id}/exam`);
        }
    };

    const handleOptionSelect = (questionId: number, option: string) => {
        setData('answers', {
            ...data.answers,
            [questionId]: option
        });
    };

    return (
        <>
            <Head title={`Final Exam - ${enrollment.course.title}`} />
            <div className="w-full p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
                <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">Certification Pathway</span>
                    <h1 className="text-xl font-bold text-foreground">{enrollment.course.title}</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Final Professional Assessment & Verification</p>
                </div>

                {!attempt ? (
                    <>
                        {/* Phase 1: Passcode Verification (if required) */}
                        {exam.passcode && !isVerified ? (
                            <div className="max-w-md mx-auto mt-12 border border-border rounded-sm bg-card overflow-hidden shadow-sm">
                                <div className="px-6 py-4 border-b border-border bg-muted/5 flex items-center gap-3">
                                    <div className="size-8 rounded-sm bg-primary/10 flex items-center justify-center">
                                        <ShieldCheck className="size-4 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-foreground">Secure Access Required</h2>
                                        <p className="text-[10px] text-muted-foreground">Enter your exam passcode to continue</p>
                                    </div>
                                </div>
                                <form onSubmit={handleVerifyPasscode} className="p-6 space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Exam Passcode</label>
                                        <input 
                                            type="text" 
                                            value={data.passcode}
                                            onChange={e => setData('passcode', e.target.value)}
                                            placeholder="Enter passcode"
                                            className="w-full h-10 px-3 rounded-sm border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        {errors.passcode && <p className="text-[10px] text-destructive font-medium">{errors.passcode}</p>}
                                    </div>
                                    <Button disabled={processing} className="w-full h-10 rounded-sm font-bold shadow-none">
                                        {processing ? 'Verifying...' : 'Verify & Continue'}
                                    </Button>
                                </form>
                            </div>
                        ) : !isStarted ? (
                            /* Phase 2: Start Screen */
                            <div className="max-w-2xl mx-auto mt-8 border border-border rounded-sm bg-card overflow-hidden">
                                <div className="px-6 py-4 border-b border-border bg-muted/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="size-4 text-primary" />
                                        <span className="text-sm font-bold">Examination Instructions</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-100">Ready to Start</span>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 rounded-sm bg-muted/10 border border-border text-center">
                                            <FileText className="size-5 text-primary mx-auto mb-2" />
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase">Questions</div>
                                            <div className="text-lg font-black text-foreground">{exam.questions?.length || 0}</div>
                                        </div>
                                        <div className="p-4 rounded-sm bg-muted/10 border border-border text-center">
                                            <Timer className="size-5 text-primary mx-auto mb-2" />
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase">Time Limit</div>
                                            <div className="text-lg font-black text-foreground">{exam.duration}m</div>
                                        </div>
                                        <div className="p-4 rounded-sm bg-muted/10 border border-border text-center">
                                            <Trophy className="size-5 text-primary mx-auto mb-2" />
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase">Max Marks</div>
                                            <div className="text-lg font-black text-foreground">{exam.total_marks}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                                            <AlertCircle className="size-3.5 text-amber-500" /> Important Guidelines
                                        </h4>
                                        <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-4">
                                            <li>Once started, the timer cannot be paused.</li>
                                            <li>Ensure you have a stable internet connection.</li>
                                            <li>Do not refresh the page or navigate away during the exam.</li>
                                            <li>Total of {exam.questions?.length || 0} multiple choice questions.</li>
                                        </ul>
                                    </div>

                                    <Button
                                        onClick={() => setIsStarted(true)}
                                        className="w-full h-11 rounded-sm shadow-none font-bold text-sm bg-primary hover:bg-primary/90"
                                    >
                                        Start Assessment <ArrowRight className="ml-2 size-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            /* Phase 3: Actual Exam UI */
                            <form onSubmit={handleSubmitExam} className="space-y-6">
                                <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border border-border rounded-sm mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Timer className="size-4 text-primary" />
                                            <span className="text-sm font-black tabular-nums">{exam.duration}:00</span>
                                        </div>
                                        <div className="h-4 w-px bg-border" />
                                        <div className="text-xs font-medium text-muted-foreground">
                                            Answered: {Object.keys(data.answers).length} / {exam.questions.length}
                                        </div>
                                    </div>
                                    <Button disabled={processing} type="submit" className="h-9 px-6 rounded-sm font-bold shadow-none">
                                        {processing ? 'Submitting...' : 'Finish Exam'}
                                    </Button>
                                </div>

                                <div className="space-y-6 pb-20">
                                    {exam.questions.map((question: any, idx: number) => (
                                        <div key={question.id} className="p-6 rounded-sm border border-border bg-card space-y-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex gap-3">
                                                    <span className="flex-shrink-0 size-6 rounded-sm bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                                                        {idx + 1}
                                                    </span>
                                                    <div className="text-sm font-semibold text-foreground leading-relaxed pt-0.5">
                                                        {question.question_text}
                                                    </div>
                                                </div>
                                                <span className="flex-shrink-0 text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-sm border border-primary/10">
                                                    {question.marks} Pts
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9">
                                                {Object.entries(question.options || {}).map(([key, value]: [string, any]) => (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => handleOptionSelect(question.id, key)}
                                                        className={cn(
                                                            "flex items-center gap-3 p-3 rounded-sm border transition-all text-left group",
                                                            data.answers[question.id] === key 
                                                                ? "bg-primary/5 border-primary ring-1 ring-primary" 
                                                                : "bg-muted/10 border-border hover:bg-muted/20 hover:border-muted-foreground/30"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "size-5 rounded-full border flex items-center justify-center text-[10px] font-bold transition-colors shrink-0",
                                                            data.answers[question.id] === key 
                                                                ? "bg-primary border-primary text-white" 
                                                                : "bg-background border-border group-hover:border-muted-foreground/50"
                                                        )}>
                                                            {key.toUpperCase()}
                                                        </div>
                                                        <span className="text-xs font-medium text-foreground">{value}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </form>
                        )}
                    </>
                ) : (
                    /* Phase 4: Results Screen */
                    <div className="max-w-md mx-auto mt-12 border border-emerald-200 rounded-sm bg-emerald-50/50 overflow-hidden">
                        <div className="p-8 text-center space-y-6">
                            <div className="size-16 rounded-sm bg-emerald-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20">
                                <CheckCircle2 className="size-8" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground">Examination Completed</h2>
                                <p className="text-xs text-muted-foreground mt-1">Your assessment has been successfully recorded</p>
                            </div>

                            <div className="p-6 rounded-sm bg-background border border-emerald-200 space-y-4">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Final Score</div>
                                    <div className="text-4xl font-black text-foreground tabular-nums">
                                        {attempt.marks_obtained}
                                        <span className="text-sm text-muted-foreground font-medium ml-1.5">/ {exam.total_marks}</span>
                                    </div>
                                </div>
                                <div className="h-px bg-emerald-100" />
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground font-medium">Status</span>
                                    <span className={cn(
                                        "font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider text-[10px]",
                                        (attempt.marks_obtained / exam.total_marks) >= 0.6 
                                            ? "bg-emerald-100 text-emerald-700" 
                                            : "bg-amber-100 text-amber-700"
                                    )}>
                                        {(attempt.marks_obtained / exam.total_marks) >= 0.6 ? 'PASSED' : 'GRADED'}
                                    </span>
                                </div>
                            </div>

                            <Button asChild variant="outline" className="w-full h-10 rounded-sm font-bold shadow-none border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                <Link href="/dashboard">Back to Learning Portal</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

StudentExam.layout = (page: React.ReactNode) => (
    <AppLayout>
        {page}
    </AppLayout>
);
