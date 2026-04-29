import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BookOpen, Calendar, CheckCircle2, Clock, Info, FileUp, AlertCircle, FileText, Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

function cn(...classes: any[]) { return classes.filter(Boolean).join(' '); }

export default function StudentAssignments({ enrollment, assignments }: { enrollment: any, assignments: any[] }) {
    return (
        <>
            <Head title={`Assignments - ${enrollment.course.title}`} />
            <div className="w-full p-4 lg:p-6 space-y-4">
                <div>
                    <span className="text-[10px] font-medium text-primary block mb-0.5">Course Assignments</span>
                    <h1 className="text-lg font-semibold text-foreground">{enrollment.course.title}</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Manage your coursework and academic submissions.</p>
                </div>

                <div className="space-y-3">
                    {assignments.map((assignment) => {
                        const submission = assignment.submissions[0];
                        const dueDate = new Date(assignment.due_date);
                        const isLate = assignment.due_date && new Date() > dueDate;

                        return (
                            <div key={assignment.id} className="border border-border rounded-sm overflow-hidden hover:border-primary/40 transition-colors">
                                <div className="flex flex-col md:flex-row">
                                    {/* Assignment Info */}
                                    <div className="p-4 md:flex-1 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="size-9 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0 mt-0.5">
                                                <BookOpen className="size-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-foreground">{assignment.title}</h3>
                                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                                    <div className={cn("flex items-center gap-1 text-[10px] font-medium", isLate && !submission ? "text-red-600" : "text-muted-foreground")}>
                                                        <Calendar className="size-3" />
                                                        Due {dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] font-medium text-primary/70">
                                                        <Info className="size-3" />
                                                        Max {assignment.max_marks} Points
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-sm border border-border/50">
                                            {assignment.description || 'No specific instructions provided for this assignment.'}
                                        </p>

                                        {isLate && !submission && (
                                            <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-100 rounded-sm text-red-700">
                                                <AlertCircle className="size-3.5 shrink-0" />
                                                <p className="text-[10px] font-medium">Late Submission: 10 marks will be automatically deducted from your final score.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Panel */}
                                    <div className={cn("p-4 md:w-52 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-border gap-3", submission?.status === 'graded' ? 'bg-emerald-50/50' : 'bg-muted/20')}>
                                        {submission?.status === 'graded' ? (
                                            <div className="text-center space-y-2">
                                                <div className="text-[10px] font-medium text-emerald-600">Result</div>
                                                <div className="text-3xl font-semibold text-emerald-600 leading-none tabular-nums">
                                                    {submission.marks_obtained}
                                                    <span className="text-sm text-emerald-600/40 ml-1">/ {assignment.max_marks}</span>
                                                </div>
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 text-white rounded-sm text-[10px] font-medium">
                                                    <CheckCircle2 className="size-3" /> Graded
                                                </div>
                                                {submission.admin_comments && (
                                                    <p className="text-[10px] text-emerald-700/60 italic leading-relaxed pt-2 border-t border-emerald-200">
                                                        "{submission.admin_comments}"
                                                    </p>
                                                )}
                                            </div>
                                        ) : submission?.status === 'submitted' ? (
                                            <div className="text-center space-y-2">
                                                <div className="size-10 rounded-sm bg-orange-50 flex items-center justify-center text-orange-500 mx-auto border border-orange-100">
                                                    <Clock className="size-4" />
                                                </div>
                                                <div className="text-[10px] font-medium text-orange-600">Under Review</div>
                                                <p className="text-[10px] text-muted-foreground">Submitted {new Date(submission.submitted_at).toLocaleDateString()}</p>
                                                <SubmissionModal enrollment={enrollment} assignment={assignment} submission={submission} />
                                            </div>
                                        ) : (
                                            <div className="text-center space-y-2">
                                                <div className="size-10 rounded-sm bg-muted/40 flex items-center justify-center text-muted-foreground/30 mx-auto border border-dashed border-border">
                                                    <FileText className="size-5" />
                                                </div>
                                                <div className="text-[10px] font-medium text-muted-foreground">Not Submitted</div>
                                                <SubmissionModal enrollment={enrollment} assignment={assignment} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {assignments.length === 0 && (
                        <div className="py-16 text-center border border-dashed border-border rounded-sm bg-muted/5">
                            <BookOpen className="size-10 text-muted-foreground/10 mx-auto mb-3" />
                            <p className="text-xs text-muted-foreground">No assignments published for this batch</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function SubmissionModal({ enrollment, assignment, submission = null }: { enrollment: any, assignment: any, submission?: any }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        content: submission?.content || '',
        file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/my-course/${enrollment.id}/assignments/${assignment.id}`, {
            onSuccess: () => setOpen(false),
            forceFormData: true,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="w-full rounded-sm h-8 font-medium text-xs shadow-none">
                    {submission ? 'Update Submission' : 'Submit Now'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px] rounded-sm p-0 overflow-hidden border-border shadow-md">
                <DialogHeader className="px-4 py-3 border-b border-border bg-muted/5">
                    <DialogTitle className="text-sm font-semibold">{assignment.title}</DialogTitle>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Write your answer below or upload a supporting document (PDF, JPG, PNG).</p>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="p-4 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                <FileText className="size-3 text-primary" /> Written Response
                            </Label>
                            <Textarea
                                className="min-h-[160px] rounded-sm border-border text-sm leading-relaxed p-3"
                                placeholder="Type your assignment answer here..."
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                            />
                            {errors.content && <div className="text-[10px] text-red-600">{errors.content}</div>}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                <Paperclip className="size-3 text-primary" /> Attachment (PDF / Image)
                            </Label>
                            <div className="relative group">
                                <Input type="file" className="h-10 opacity-0 absolute inset-0 cursor-pointer z-10" onChange={e => setData('file', e.target.files?.[0] || null)} accept=".pdf,image/*" />
                                <div className="h-10 border border-dashed border-border group-hover:border-primary/50 rounded-sm flex items-center px-3 transition-all bg-muted/10">
                                    <FileUp className="size-3.5 text-muted-foreground mr-2 group-hover:text-primary" />
                                    <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">
                                        {data.file ? data.file.name : 'Click to select or drag and drop file'}
                                    </span>
                                </div>
                            </div>
                            <p className="text-[9px] text-muted-foreground/60">Max size: 10MB • PDF, JPG, PNG supported</p>
                            {errors.file && <div className="text-[10px] text-red-600">{errors.file}</div>}
                        </div>

                        {assignment.due_date && new Date() > new Date(assignment.due_date) && !submission && (
                            <div className="p-2.5 bg-red-50 border border-red-100 rounded-sm flex items-start gap-2">
                                <AlertCircle className="size-3.5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-red-600 font-medium">This assignment is past its due date. A 10-point deduction will be applied automatically.</p>
                            </div>
                        )}
                    </div>

                    <div className="px-4 py-3 bg-muted/20 border-t border-border flex justify-end gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)} className="rounded-sm h-8 text-xs shadow-none">Cancel</Button>
                        <Button disabled={processing} size="sm" className="rounded-sm h-8 text-xs shadow-none">
                            {processing ? 'Processing...' : <span className="flex items-center gap-1.5">Submit Assignment <Send className="size-3" /></span>}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

StudentAssignments.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'My Course', href: '#' }, { title: 'Assignments', href: '#' }]}>
        {page}
    </AppLayout>
);
