import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

interface AllAssignmentsProps {
    assignments: any[];
}

export default function AllAssignments({ assignments = [] }: AllAssignmentsProps) {
    return (
        <>
            <Head title="My Assignments" />
            <div className="w-full p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">My Assignments</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Track and submit your course assignments</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="h-8 rounded-sm text-xs cursor-pointer shadow-none">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <ArrowLeft className="size-3.5" /> Back to Dashboard
                        </Link>
                    </Button>
                </div>

                <div className="rounded-sm border border-border bg-card overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/5">
                        <div className="flex items-center gap-1.5">
                            <BookOpen className="size-4 text-primary" />
                            <h2 className="text-sm font-semibold text-foreground">Academic Assignments</h2>
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground bg-muted/10 px-2 py-0.5 rounded-sm tabular-nums border border-border">
                            {assignments.length} Total
                        </span>
                    </div>
                    {assignments.length > 0 ? (
                        <div className="divide-y divide-border">
                            {assignments.map((assignment: any) => {
                                const submission = assignment.submissions?.[0];
                                const isSubmitted = !!submission;
                                const isGraded = submission?.grade !== null && submission?.grade !== undefined;

                                return (
                                    <div key={assignment.id} className="p-4 hover:bg-muted/5 transition-colors">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="min-w-0 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded-sm border border-primary/10 truncate max-w-[200px]">
                                                        {assignment.course_title}
                                                    </span>
                                                    {isGraded ? (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 uppercase">Graded</span>
                                                    ) : isSubmitted ? (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 uppercase">Submitted</span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100 uppercase">Pending</span>
                                                    )}
                                                </div>
                                                <div className="text-sm font-semibold text-foreground">{assignment.title}</div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="size-3.5" /> Due: {assignment.due_date || 'No date'}
                                                    </span>
                                                    <span className="text-[11px] text-primary font-bold">
                                                        {isGraded ? `Score: ${submission.grade}/${assignment.points}` : `Weight: ${assignment.points} pts`}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button asChild variant={isSubmitted ? "outline" : "default"} size="sm" className="h-8 px-4 rounded-sm text-xs font-medium shadow-none cursor-pointer">
                                                    <Link href={`/my-course/${assignment.enrollment_id}/assignments`}>
                                                        {isSubmitted ? 'View Submission' : 'Submit Now'}
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <BookOpen className="size-10 text-muted-foreground/20 mx-auto mb-3" />
                            <h3 className="text-sm font-medium text-foreground">No assignments yet</h3>
                            <p className="text-xs text-muted-foreground mt-1">Assignments will appear here once your courses begin.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
