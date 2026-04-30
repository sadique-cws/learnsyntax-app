import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TeacherLayout from '@/layouts/teacher-layout';
import { 
    User, 
    CheckCircle2, 
    ChevronLeft, 
    ChevronRight, 
    Save, 
    FileText, 
    Paperclip, 
    ExternalLink,
    MoreVertical,
    Clock,
    AlertCircle,
    MessageSquare,
    Send
} from 'lucide-react';
import { useState, useMemo } from 'react';

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default function TeacherAssignmentShow({ assignment }: { assignment: any }) {
    const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);
    const submissions = assignment.submissions;
    const currentSubmission = submissions[selectedStudentIndex];

    const nextStudent = () => {
        if (selectedStudentIndex < submissions.length - 1) {
            setSelectedStudentIndex(prev => prev + 1);
        }
    };

    const prevStudent = () => {
        if (selectedStudentIndex > 0) {
            setSelectedStudentIndex(prev => prev - 1);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-56px)] bg-background overflow-hidden select-none font-sans">
            <Head title={`Grade: ${assignment.title}`} />
            
            {/* Top Navigation Bar */}
            <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="icon" className="size-8 rounded-sm">
                        <Link href="/teacher/assignments">
                            <ChevronLeft className="size-5" />
                        </Link>
                    </Button>
                    <div className="flex flex-col min-w-0">
                        <h1 className="text-xs font-bold truncate max-w-[200px] text-foreground">{assignment.title}</h1>
                        <span className="text-[10px] text-muted-foreground mt-0.5">{assignment.batch.name}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Student Selector */}
                    {submissions.length > 0 ? (
                        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-sm border border-border">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-7 rounded-sm" 
                                onClick={prevStudent}
                                disabled={selectedStudentIndex === 0}
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            <div className="flex items-center gap-2 px-2 min-w-[130px] justify-center">
                                <div className="size-5 rounded-sm bg-indigo-600 flex items-center justify-center text-[9px] font-bold text-white">
                                    {currentSubmission.user.name.charAt(0)}
                                </div>
                                <span className="text-xs font-bold truncate max-w-[100px]">{currentSubmission.user.name}</span>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-7 rounded-sm" 
                                onClick={nextStudent}
                                disabled={selectedStudentIndex === submissions.length - 1}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    ) : (
                        <span className="text-[10px] text-muted-foreground">No students enrolled</span>
                    )}

                    {currentSubmission && (
                        <div className="flex items-center gap-3 border-l border-border pl-4">
                            <div className="flex items-center gap-2">
                                 <span className="text-[10px] font-medium text-muted-foreground">Grade:</span>
                                 <div className="flex items-baseline gap-0.5 font-bold text-foreground">
                                    <span className="text-sm">{currentSubmission.marks_obtained || 0}</span>
                                    <span className="text-[10px] text-muted-foreground/60">/ {assignment.max_marks}</span>
                                 </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {currentSubmission ? (
                <div className="flex flex-1 overflow-hidden">
                    {/* Submission Preview */}
                    <main className="flex-1 overflow-y-auto p-6 bg-muted/10">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {/* Status Banner */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-wide border",
                                        currentSubmission.status === 'graded' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                                        currentSubmission.submitted_at ? "bg-amber-50 text-amber-600 border-amber-100" :
                                        "bg-slate-50 text-slate-500 border-slate-100"
                                    )}>
                                        {currentSubmission.status === 'graded' ? 'Graded' : 
                                         currentSubmission.submitted_at ? 'Submitted' : 'Not Submitted'}
                                    </span>
                                    {currentSubmission.is_late && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-sm text-[10px] font-bold">
                                            <Clock className="size-3" /> Late Ingress
                                        </span>
                                    )}
                                </div>
                                {currentSubmission.submitted_at && (
                                    <span className="text-[10px] text-muted-foreground">
                                        Submitted: {new Date(currentSubmission.submitted_at).toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            {/* Content Section */}
                            {currentSubmission.content ? (
                                <div className="bg-card border border-border rounded-sm shadow-none overflow-hidden">
                                    <div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
                                            <FileText className="size-3.5 text-indigo-500" />
                                            Response Content
                                        </div>
                                    </div>
                                    <div className="p-6 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                        {currentSubmission.content}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-16 text-center border border-dashed border-border rounded-sm bg-card">
                                    <FileText className="size-10 text-muted-foreground/20 mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground font-bold">No written answer included.</p>
                                </div>
                            )}

                            {/* Attachment */}
                            {currentSubmission.file_path && (
                                <div className="bg-card border border-border rounded-sm shadow-none overflow-hidden">
                                    <div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
                                            <Paperclip className="size-3.5 text-indigo-500" />
                                            Attached Assets
                                        </div>
                                        <Button variant="outline" size="sm" className="h-7 px-2 rounded-sm text-xs font-medium" asChild>
                                            <a href={`/storage/${currentSubmission.file_path}`} target="_blank">Open File</a>
                                        </Button>
                                    </div>
                                    <div className="bg-muted/5 flex items-center justify-center p-6 min-h-[120px]">
                                        <FileText className="size-12 text-muted-foreground/30 mr-3" />
                                        <div>
                                            <div className="text-xs font-bold text-foreground">{currentSubmission.file_path.split('/').pop()}</div>
                                            <div className="text-[9px] text-muted-foreground mt-0.5">External assessment payload</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Grading & Comments Sidebar */}
                    <aside className="w-[320px] border-l border-border bg-card flex flex-col shrink-0 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Marking Form */}
                            <GradingForm submission={currentSubmission} maxMarks={assignment.max_marks} />

                            {/* Teacher Feedback Comments */}
                            <CommentSection submission={currentSubmission} />
                        </div>

                        <div className="p-4 border-t border-border bg-muted/5 shrink-0">
                             <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground mb-2">
                                <span>Pipeline Evaluation</span>
                                <span>{submissions.filter((s: any) => s.status === 'graded').length} / {submissions.length} done</span>
                             </div>
                             <div className="w-full bg-border/40 h-1 rounded-full overflow-hidden">
                                <div 
                                    className="bg-indigo-600 h-full transition-all duration-500" 
                                    style={{ width: `${(submissions.filter((s: any) => s.status === 'graded').length / submissions.length) * 100}%` }}
                                />
                             </div>
                        </div>
                    </aside>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                    <User className="size-12 text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-bold">Zero student assessments indexed.</p>
                </div>
            )}
        </div>
    );
}

function GradingForm({ submission, maxMarks }: { submission: any, maxMarks: number }) {
    const { data, setData, patch, processing } = useForm({
        marks_obtained: submission.marks_obtained || 0,
        admin_comments: submission.admin_comments || '',
    });

    const [isSaved, setIsSaved] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/teacher/submissions/${submission.id}/grade`, {
            onSuccess: () => {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
            }
        });
    };

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground ">Evaluate marks</span>
                {submission.is_late && (
                    <span className="text-[8px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">-10 Penalty</span>
                )}
            </div>
            
            <form onSubmit={submit} className="space-y-4 bg-muted/20 border border-border rounded-sm p-4">
                <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-muted-foreground">Marks Awarded</Label>
                    <div className="flex items-center gap-2">
                        <Input 
                            type="number" 
                            className="h-10 rounded-sm border-border bg-background text-lg font-bold text-center w-20 focus-visible:ring-indigo-500"
                            value={data.marks_obtained}
                            onChange={e => setData('marks_obtained', parseInt(e.target.value))}
                            max={maxMarks}
                        />
                        <div className="text-sm font-medium text-muted-foreground/50">/ {maxMarks}</div>
                    </div>
                </div>

                <Button 
                    type="submit" 
                    disabled={processing || !submission.submitted_at}
                    className={cn(
                        "w-full h-9 rounded-sm font-medium text-xs shadow-none",
                        isSaved ? "bg-emerald-600 hover:bg-emerald-600 text-white" : 
                        (!submission.submitted_at ? "bg-muted text-muted-foreground" : "bg-indigo-600 hover:bg-indigo-700 text-white")
                    )}
                >
                    {processing ? 'Saving...' : (isSaved ? 'Marks Saved' : (!submission.submitted_at ? 'Not Submitted' : 'Save Grade'))}
                </Button>
            </form>
        </section>
    );
}

function CommentSection({ submission }: { submission: any }) {
    const { data, setData, post, processing, reset } = useForm({
        comment: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/teacher/submissions/${submission.id}/comment`, {
            onSuccess: () => {
                reset();
            }
        });
    };

    return (
        <section className="space-y-3 pt-2">
            <span className="text-[10px] font-bold text-muted-foreground ">Feedback Loop</span>
            
            <div className="space-y-3">
                {submission.admin_comments && (
                    <div className="bg-indigo-50/40 border border-indigo-100 rounded-sm p-3 text-xs text-foreground/90">
                        <span className="block font-bold text-indigo-600 text-[10px] mb-1">Instructor:</span>
                        "{submission.admin_comments}"
                    </div>
                )}
                
                <form onSubmit={submit} className="space-y-2">
                    <Textarea 
                        placeholder="Issue feedback notes..." 
                        className="min-h-[80px] rounded-sm border-border bg-muted/10 focus:bg-background text-xs p-3 focus-visible:ring-indigo-500"
                        value={data.comment}
                        onChange={e => setData('comment', e.target.value)}
                    />
                    <Button type="submit" disabled={processing || !data.comment.trim()} className="w-full h-8 rounded-sm bg-slate-900 hover:bg-slate-800 text-white text-xs shadow-none">
                        Post Comment
                    </Button>
                </form>
            </div>
        </section>
    );
}

TeacherAssignmentShow.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Instructor', href: '/teacher/dashboard' }, { title: 'Assignments', href: '/teacher/assignments' }, { title: 'Grading Workspace', href: '#' }]}>
        {page}
    </TeacherLayout>
);
