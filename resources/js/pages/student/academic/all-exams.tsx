import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

interface AllExamsProps {
    exams: any[];
}

export default function AllExams({ exams = [] }: AllExamsProps) {
    return (
        <>
            <Head title="My Exams" />
            <div className="w-full p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Available Exams</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Participate in live assessments and certifications</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="h-8 rounded-sm text-xs cursor-pointer shadow-none">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <ArrowLeft className="size-3.5" /> Back to Dashboard
                        </Link>
                    </Button>
                </div>

                {exams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {exams.map((exam: any) => (
                            <div key={exam.id} className="rounded-sm border border-border bg-card overflow-hidden flex flex-col">
                                <div className="px-4 py-3 border-b border-border bg-muted/5 flex items-center justify-between">
                                    <span className={cn(
                                        "text-[10px] font-bold px-1.5 py-0.5 rounded-sm border uppercase",
                                        exam.user_attempt 
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                            : "bg-orange-50 text-orange-600 border-orange-100"
                                    )}>
                                        {exam.user_attempt ? 'Completed' : 'Live Now'}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Assessment</span>
                                </div>
                                <div className="p-4 flex-1 space-y-4">
                                    <div>
                                        <div className="text-[10px] font-bold text-primary mb-1 uppercase">{exam.course_title}</div>
                                        <h3 className="text-base font-bold text-foreground leading-tight">{exam.title}</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-2.5 rounded-sm bg-muted/10 border border-border">
                                            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                <Clock className="size-3" />
                                                <span className="text-[10px] font-bold uppercase">Duration</span>
                                            </div>
                                            <div className="text-sm font-black text-foreground tabular-nums">{exam.duration} mins</div>
                                        </div>
                                        <div className="p-2.5 rounded-sm bg-muted/10 border border-border">
                                            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                <Trophy className="size-3" />
                                                <span className="text-[10px] font-bold uppercase">Max Marks</span>
                                            </div>
                                            <div className="text-sm font-black text-foreground tabular-nums">{exam.total_marks} pts</div>
                                        </div>
                                    </div>

                                    {exam.user_attempt ? (
                                        <div className="flex items-center justify-between p-3 rounded-sm bg-emerald-50/50 border border-emerald-100">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="size-4 text-emerald-600" />
                                                <div className="text-xs font-bold text-emerald-900">Score Obtained</div>
                                            </div>
                                            <div className="text-sm font-black text-emerald-600 tabular-nums">
                                                {exam.user_attempt.marks_obtained} / {exam.total_marks}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 p-3 rounded-sm bg-amber-50/50 border border-amber-100 text-amber-700">
                                            <AlertCircle className="size-4 shrink-0" />
                                            <p className="text-[10px] font-medium leading-tight">
                                                Ensure you have a stable internet connection before starting. Passcode may be required.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 pt-0">
                                    <Button asChild size="lg" className={cn(
                                        "w-full h-10 rounded-sm text-sm font-bold shadow-none cursor-pointer",
                                        exam.user_attempt 
                                            ? "bg-muted text-muted-foreground border-border hover:bg-muted/80" 
                                            : "bg-orange-500 hover:bg-orange-600 text-white border-orange-600"
                                    )}>
                                        <Link href={`/my-course/${exam.enrollment_id}/exam`}>
                                            {exam.user_attempt ? 'View Results' : 'Start Examination'}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-sm border border-border bg-card p-12 text-center">
                        <Trophy className="size-12 text-muted-foreground/15 mx-auto mb-3" />
                        <h3 className="text-base font-semibold text-foreground">No active exams</h3>
                        <p className="text-xs text-muted-foreground mt-1 max-w-[300px] mx-auto">
                            There are currently no live examinations for your enrolled courses. Check back later or contact your instructor.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
