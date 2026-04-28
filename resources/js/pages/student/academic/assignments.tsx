import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BookOpen, Calendar, CheckCircle2, Clock, Info, FileUp, AlertCircle, FileText, Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default function StudentAssignments({ enrollment, assignments }: { enrollment: any, assignments: any[] }) {
    return (
        <>
            <Head title={`Assignments - ${enrollment.course.title}`} />
            
            <div className="w-full p-4 lg:p-6">
                <div className="mb-10">
                    <span className="text-[10px] font-black   text-primary mb-2 block">Program Curriculum</span>
                    <h1 className="text-4xl font-medium  text-foreground leading-none">{enrollment.course.title}</h1>
                    <p className="text-xs font-medium text-muted-foreground  mt-2">Manage your coursework and academic submissions.</p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {assignments.map((assignment) => {
                        const submission = assignment.submissions[0];
                        const dueDate = new Date(assignment.due_date);
                        const isLate = assignment.due_date && new Date() > dueDate;
                        
                        return (
                            <Card key={assignment.id} className="border-border rounded-sm shadow-none overflow-hidden hover:border-primary/50 transition-all">
                                <CardContent className="p-0 flex flex-col md:flex-row">
                                    <div className="p-8 md:w-2/3 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                                <BookOpen className="size-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold  text-foreground">{assignment.title}</h3>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <div className={cn(
                                                        "flex items-center gap-1.5 text-[10px] font-black  ",
                                                        isLate && !submission ? "text-red-600" : "text-muted-foreground"
                                                    )}>
                                                        <Calendar className="size-3.5" />
                                                        Due {dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black   text-primary/70">
                                                        <Info className="size-3.5" />
                                                        Max {assignment.max_marks} Points
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed bg-muted/20 p-4 rounded-sm border border-border/50">
                                            {assignment.description || 'No specific instructions provided for this assignment.'}
                                        </p>

                                        {isLate && !submission && (
                                            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-sm text-red-700">
                                                <AlertCircle className="size-4 shrink-0" />
                                                <p className="text-[10px] font-black  tracking-tight">Late Submission: 10 marks will be automatically deducted from your final score.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className={cn(
                                        "p-8 md:w-1/3 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-border",
                                        submission?.status === 'graded' ? 'bg-green-500/[0.02]' : 'bg-muted/[0.05]'
                                    )}>
                                        {submission?.status === 'graded' ? (
                                            <div className="text-center space-y-4">
                                                <div className="text-[10px] font-black   text-green-600">Performance Result</div>
                                                <div className="text-5xl font-medium tracking-tighter text-green-600 leading-none">
                                                    {submission.marks_obtained} <span className="text-lg text-green-600/30">/ {assignment.max_marks}</span>
                                                </div>
                                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white rounded-sm text-[10px] font-black  ">
                                                    <CheckCircle2 className="size-3.5" /> Certified
                                                </div>
                                                {submission.admin_comments && (
                                                    <div className="mt-4 pt-4 border-t border-green-600/10">
                                                        <p className="text-[11px] font-bold text-green-800/60 italic px-4 leading-relaxed">
                                                            "{submission.admin_comments}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : submission?.status === 'submitted' ? (
                                            <div className="text-center space-y-3">
                                                <div className="size-12 rounded-sm bg-orange-100 flex items-center justify-center text-orange-600 mx-auto">
                                                    <Clock className="size-6" />
                                                </div>
                                                <div className="text-[10px] font-black   text-orange-600">Review Pending</div>
                                                <p className="text-[11px] text-muted-foreground font-bold  tracking-tight">Submitted on {new Date(submission.submitted_at).toLocaleDateString()}</p>
                                                <SubmissionModal enrollment={enrollment} assignment={assignment} submission={submission} />
                                            </div>
                                        ) : (
                                            <div className="text-center space-y-6">
                                                <div className="size-16 rounded-sm bg-primary/5 flex items-center justify-center text-primary/30 mx-auto border border-dashed border-primary/20">
                                                    <FileText className="size-8" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-black   text-muted-foreground">Not Submitted</div>
                                                    <p className="text-[11px] text-muted-foreground/60 font-medium  tracking-tight">Pending Action</p>
                                                </div>
                                                <SubmissionModal enrollment={enrollment} assignment={assignment} />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {assignments.length === 0 && (
                        <div className="py-24 text-center border border-dashed border-border rounded-sm bg-muted/[0.02]">
                            <BookOpen className="size-16 text-muted-foreground/10 mx-auto mb-6" />
                            <p className="text-muted-foreground font-black   text-[11px]">No assignments published for this batch</p>
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
                <Button className="w-full rounded-sm h-11 font-black   text-[10px] bg-primary shadow-lg shadow-primary/10">
                    {submission ? 'Update Submission' : 'Submit Now'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-sm p-0 overflow-hidden border-none shadow-2xl">
                <form onSubmit={submit}>
                    <div className="p-8 bg-primary text-white">
                        <h2 className="text-2xl font-bold  ">{assignment.title}</h2>
                        <p className="text-primary-foreground/70 text-xs font-medium  mt-1">
                            Write your answer below or upload a supporting document (PDF, JPG, PNG).
                        </p>
                    </div>
                    
                    <div className="p-8 space-y-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black   text-muted-foreground flex items-center gap-2">
                                <FileText className="size-3.5 text-primary" />
                                Written Response
                            </Label>
                            <Textarea 
                                className="min-h-[200px] rounded-sm border-border bg-muted/10 focus:bg-background text-sm leading-relaxed transition-all p-4"
                                placeholder="Type your assignment answer here..."
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                            />
                            {errors.content && <div className="text-[10px] font-bold text-red-600  tracking-tight">{errors.content}</div>}
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black   text-muted-foreground flex items-center gap-2">
                                <Paperclip className="size-3.5 text-primary" />
                                Attachment (PDF / Image)
                            </Label>
                            <div className="relative group">
                                <Input 
                                    type="file"
                                    className="h-12 opacity-0 absolute inset-0 cursor-pointer z-10"
                                    onChange={e => setData('file', e.target.files?.[0] || null)}
                                    accept=".pdf,image/*"
                                />
                                <div className="h-12 border border-dashed border-border group-hover:border-primary/50 group-hover:bg-primary/[0.02] rounded-sm flex items-center px-4 transition-all bg-muted/10">
                                    <FileUp className="size-4 text-muted-foreground mr-3 group-hover:text-primary" />
                                    <span className="text-xs font-bold text-muted-foreground group-hover:text-primary">
                                        {data.file ? data.file.name : 'Click to select or drag and drop file'}
                                    </span>
                                </div>
                            </div>
                            <p className="text-[9px] font-bold text-muted-foreground/60  tracking-tight">Max size: 10MB • PDF, JPG, PNG supported</p>
                            {errors.file && <div className="text-[10px] font-bold text-red-600  tracking-tight">{errors.file}</div>}
                        </div>

                        {assignment.due_date && new Date() > new Date(assignment.due_date) && !submission && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-sm">
                                <div className="flex items-center gap-2 text-red-700 mb-1">
                                    <AlertCircle className="size-4" />
                                    <span className="text-[10px] font-black  ">Late Deduction Warning</span>
                                </div>
                                <p className="text-[10px] text-red-600/80 font-bold tracking-tight">This assignment is past its due date. A 10-point deduction will be applied to your grade automatically.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-8 bg-muted/30 border-t border-border flex justify-end gap-3">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => setOpen(false)}
                            className="rounded-sm font-black   text-[10px] h-11 px-6"
                        >
                            Cancel
                        </Button>
                        <Button 
                            disabled={processing}
                            className="rounded-sm font-black   text-[10px] h-11 px-8 bg-primary shadow-lg shadow-primary/10"
                        >
                            {processing ? 'Processing...' : (
                                <span className="flex items-center gap-2">
                                    Submit Assignment <Send className="size-3.5" />
                                </span>
                            )}
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
