import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BookOpen, Calendar, CheckCircle2, Clock, Info } from 'lucide-react';

export default function StudentAssignments({ enrollment, assignments }: { enrollment: any, assignments: any[] }) {
    return (
        <>
            <Head title={`Assignments - ${enrollment.course.title}`} />
            
            <div className="w-full p-4 lg:p-6 font-sans">
                <div className="mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2 block">Weekly Performance</span>
                    <h1 className="text-3xl font-black tracking-tight uppercase leading-none">{enrollment.course.title}</h1>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {assignments.map((assignment) => {
                        const submission = assignment.submissions[0];
                        return (
                            <Card key={assignment.id} className="border-border shadow-none rounded-3xl overflow-hidden">
                                <CardContent className="p-0 flex flex-col md:flex-row">
                                    <div className="p-8 md:w-2/3 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                <BookOpen className="size-5" />
                                            </div>
                                            <h3 className="text-xl font-black uppercase tracking-tight leading-tight">{assignment.title}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                            {assignment.description || 'No description provided.'}
                                        </p>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                <Calendar className="size-3.5" />
                                                Due {new Date(assignment.due_date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
                                                <Info className="size-3.5" />
                                                Max {assignment.max_marks} Marks
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-8 md:w-1/3 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-border ${submission?.status === 'graded' ? 'bg-green-500/5' : 'bg-muted/30'}`}>
                                        {submission?.status === 'graded' ? (
                                            <>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2">Marks Obtained</div>
                                                <div className="text-4xl font-black text-green-600 mb-2">
                                                    {submission.marks_obtained} <span className="text-sm text-green-600/50">/ {assignment.max_marks}</span>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                                                    <CheckCircle2 className="size-3" /> Graded
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
                                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Grade</div>
                                                <p className="text-[9px] text-muted-foreground/60 mt-2 text-center font-medium">Work is being reviewed by the instructor.</p>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {assignments.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-border rounded-[3rem]">
                            <BookOpen className="size-12 text-muted-foreground mx-auto mb-4 opacity-10" />
                            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No weekly assignments posted yet</p>
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
