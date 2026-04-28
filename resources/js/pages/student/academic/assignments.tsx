import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BookOpen, Calendar, CheckCircle2, Clock, Info } from 'lucide-react';

export default function StudentAssignments({ enrollment, assignments }: { enrollment: any, assignments: any[] }) {
    return (
        <>
            <Head title={`Assignments - ${enrollment.course.title}`} />
            
            <div className="w-full p-4 lg:p-6">
                <div className="mb-8">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Program Curriculum</span>
                    <h1 className="text-3xl font-black tracking-tight uppercase leading-none">{enrollment.course.title}</h1>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {assignments.map((assignment) => {
                        const submission = assignment.submissions[0];
                        return (
                            <Card key={assignment.id} className="border-border rounded overflow-hidden">
                                <CardContent className="p-0 flex flex-col md:flex-row">
                                    <div className="p-6 md:w-2/3 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded bg-primary/5 flex items-center justify-center text-primary border border-primary/10 font-black">
                                                <BookOpen className="size-5" />
                                            </div>
                                            <h3 className="text-lg font-black uppercase tracking-tight leading-tight">{assignment.title}</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                                            {assignment.description || 'No instructions provided.'}
                                        </p>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                <Calendar className="size-3.5" />
                                                Due {new Date(assignment.due_date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
                                                <Info className="size-3.5" />
                                                Max {assignment.max_marks} Points
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-6 md:w-1/3 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-border ${submission?.status === 'graded' ? 'bg-green-500/5' : 'bg-muted/30'}`}>
                                        {submission?.status === 'graded' ? (
                                            <>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2">Result Score</div>
                                                <div className="text-4xl font-black text-green-600 mb-2">
                                                    {submission.marks_obtained} <span className="text-sm text-green-600/50">/ {assignment.max_marks}</span>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded text-[9px] font-black uppercase tracking-widest">
                                                    <CheckCircle2 className="size-3" /> Certified Grade
                                                </div>
                                                {submission.admin_comments && (
                                                    <p className="mt-4 text-[10px] text-center font-bold text-muted-foreground italic px-4">
                                                        "{submission.admin_comments}"
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="size-8 text-muted-foreground/40 mb-3" />
                                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Under Review</div>
                                                <p className="text-[9px] text-muted-foreground/60 mt-2 text-center font-bold uppercase tracking-tight">Grade Pending</p>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {assignments.length === 0 && (
                        <div className="py-20 text-center border border-dashed border-border rounded">
                            <BookOpen className="size-12 text-muted-foreground mx-auto mb-4 opacity-10" />
                            <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">No assignments published</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

StudentAssignments.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'My Course', href: '#' }, { title: 'Assignments', href: '#' }]}>
        {page}
    </AppLayout>
);

StudentAssignments.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'My Course', href: '#' }, { title: 'Assignments', href: '#' }]}>
        {page}
    </AppLayout>
);
