import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
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

export default function AdminAssignmentShow({ assignment }: { assignment: any }) {
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
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <Head title={`Review: ${assignment.title}`} />
            
            {/* Top Navigation Bar - Google Classroom Style */}
            <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/academic/assignments" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ChevronLeft className="size-5" />
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold truncate max-w-[200px] leading-none">{assignment.title}</h1>
                        <span className="text-[10px] text-muted-foreground font-medium mt-1">{assignment.batch.name}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Student Selector */}
                    <div className="flex items-center gap-3 bg-muted/30 p-1 rounded-sm border border-border/50">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 rounded-sm" 
                            onClick={prevStudent}
                            disabled={selectedStudentIndex === 0}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <div className="flex items-center gap-2 px-2 min-w-[150px] justify-center">
                            <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                {currentSubmission.user.name.charAt(0)}
                            </div>
                            <span className="text-xs font-bold truncate max-w-[120px]">{currentSubmission.user.name}</span>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 rounded-sm" 
                            onClick={nextStudent}
                            disabled={selectedStudentIndex === submissions.length - 1}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-3 border-l border-border pl-6">
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] font-medium text-muted-foreground">Grade</span>
                             <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-foreground">{currentSubmission.marks_obtained || 0}</span>
                                <span className="text-xs text-muted-foreground/50">/ {assignment.max_marks}</span>
                             </div>
                        </div>
                        <Button className="h-9 px-6 rounded-sm bg-primary font-medium text-[10px] shadow-none">
                            Return
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area - Submission Preview */}
                <main className="flex-1 overflow-y-auto p-8 bg-muted/10">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Status Banner */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "px-3 py-1 rounded-sm text-[10px] font-medium",
                                    currentSubmission.status === 'graded' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                )}>
                                    {currentSubmission.status === 'graded' ? 'Marked' : 'Handed In'}
                                </div>
                                {currentSubmission.is_late && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-sm text-[10px] font-medium border border-red-100">
                                        <Clock className="size-3" /> Late Submission
                                    </div>
                                )}
                            </div>
                            <div className="text-[10px] font-medium text-muted-foreground">
                                Submitted on {currentSubmission.submitted_at ? new Date(currentSubmission.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                            </div>
                        </div>

                        {/* Text Response Section */}
                        {currentSubmission.content ? (
                            <div className="bg-background border border-border rounded-sm shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-border bg-muted/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                                        <FileText className="size-4 text-primary" />
                                        Written Response
                                    </div>
                                    <Button variant="ghost" size="icon" className="size-8 rounded-sm">
                                        <ExternalLink className="size-3.5" />
                                    </Button>
                                </div>
                                <div className="p-8 prose prose-sm max-w-none">
                                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-foreground/80">
                                        {currentSubmission.content}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center border border-dashed border-border rounded-sm bg-background">
                                <FileText className="size-12 text-muted-foreground/10 mx-auto mb-4" />
                                <p className="text-xs text-muted-foreground">No written response provided</p>
                            </div>
                        )}

                        {/* File Attachment Preview (Mock) */}
                        {currentSubmission.file_path && (
                            <div className="bg-background border border-border rounded-sm shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-border bg-muted/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                                        <Paperclip className="size-4 text-primary" />
                                        Attached Document
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="h-8 rounded-sm text-xs font-medium" asChild>
                                            <a href={`/storage/${currentSubmission.file_path}`} target="_blank">Download</a>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="size-8 rounded-sm">
                                            <MoreVertical className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="aspect-[16/10] bg-muted/30 flex items-center justify-center relative group">
                                    {currentSubmission.file_path.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                        <img 
                                            src={`/storage/${currentSubmission.file_path}`} 
                                            alt="Student Submission" 
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <FileText className="size-16 text-muted-foreground/20 mx-auto mb-4" />
                                            <p className="text-xs font-bold text-muted-foreground  tracking-tight">PDF Document Preview Not Available</p>
                                            <Button variant="primary" size="sm" className="mt-4 rounded-sm" asChild>
                                                <a href={`/storage/${currentSubmission.file_path}`} target="_blank">Open in New Tab</a>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar - Grading & Feedback */}
                <aside className="w-[350px] border-l border-border bg-background flex flex-col shrink-0 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Files List */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-semibold text-muted-foreground">Submitted Files</h3>
                            <div className="space-y-2">
                                {currentSubmission.file_path ? (
                                    <div className="flex items-center gap-3 p-3 border border-border rounded-sm hover:bg-muted/50 transition-colors cursor-pointer group">
                                        <div className="size-8 rounded-sm bg-primary/5 flex items-center justify-center text-primary">
                                            <Paperclip className="size-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate leading-tight group-hover:text-primary transition-colors">{currentSubmission.file_path.split('/').pop()}</p>
                                            <p className="text-[9px] text-muted-foreground font-medium  tracking-tight">Handed in {new Date(currentSubmission.submitted_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-muted-foreground italic font-medium">No files attached.</p>
                                )}
                            </div>
                        </section>

                        {/* Grading Form */}
                        <GradingForm submission={currentSubmission} maxMarks={assignment.max_marks} />

                        {/* Private Comments */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-semibold text-muted-foreground">Private Comments</h3>
                            <div className="space-y-4">
                                {currentSubmission.admin_comments && (
                                    <div className="bg-primary/5 border border-primary/10 rounded-sm p-4 relative group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="size-5 rounded-full bg-primary text-[9px] font-bold text-white flex items-center justify-center">A</div>
                                            <span className="text-[10px] font-medium text-primary">Instructor Feedback</span>
                                        </div>
                                        <p className="text-xs font-medium leading-relaxed text-foreground/80 italic">"{currentSubmission.admin_comments}"</p>
                                    </div>
                                )}
                                
                                <div className="space-y-2 pt-2">
                                    <div className="relative">
                                        <Textarea 
                                            placeholder="Add a private comment..." 
                                            className="min-h-[100px] rounded-sm border-border bg-muted/20 focus:bg-background text-xs resize-none p-3 pb-12"
                                        />
                                        <div className="absolute bottom-2 right-2 flex gap-2">
                                            <Button variant="ghost" size="icon" className="size-8 rounded-sm">
                                                <MoreVertical className="size-4" />
                                            </Button>
                                            <Button size="icon" className="size-8 rounded-sm bg-primary shadow-none">
                                                <Send className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground font-medium   px-1">Comments are only visible to the student.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="p-6 border-t border-border bg-muted/10 shrink-0">
                         <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-4">
                            <span>Status Overview</span>
                            <span className="text-primary">{submissions.filter((s: any) => s.status === 'graded').length} / {submissions.length} Marked</span>
                         </div>
                         <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                            <div 
                                className="bg-primary h-full transition-all duration-500" 
                                style={{ width: `${(submissions.filter((s: any) => s.status === 'graded').length / submissions.length) * 100}%` }}
                            />
                         </div>
                    </div>
                </aside>
            </div>
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
        patch(`/admin/academic/submissions/${submission.id}/grade`, {
            onSuccess: () => {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
            }
        });
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-muted-foreground">Marking</h3>
                {submission.is_late && (
                    <span className="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-sm border border-red-100">-10 Penalty Applied</span>
                )}
            </div>
            
            <form onSubmit={submit} className="space-y-6 bg-card border border-border rounded-sm p-5">
                <div className="space-y-3">
                    <Label className="text-xs font-medium text-muted-foreground">Score</Label>
                    <div className="flex items-center gap-3">
                        <Input 
                            type="number" 
                            className="h-12 rounded-sm border-border bg-muted/10 text-xl font-bold text-center w-24"
                            value={data.marks_obtained}
                            onChange={e => setData('marks_obtained', parseInt(e.target.value))}
                            max={maxMarks}
                        />
                        <div className="text-lg font-medium text-muted-foreground/30">/ {maxMarks}</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-xs font-medium text-muted-foreground">Grading Notes</Label>
                    <Textarea 
                        placeholder="Internal notes or public feedback..."
                        className="min-h-[80px] rounded-sm border-border bg-muted/10 text-xs"
                        value={data.admin_comments}
                        onChange={e => setData('admin_comments', e.target.value)}
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={processing}
                    className={cn(
                        "w-full h-10 rounded-sm font-medium text-xs transition-all shadow-none",
                        isSaved ? "bg-green-600 text-white" : "bg-primary"
                    )}
                >
                    {processing ? 'Saving...' : (isSaved ? <span className="flex items-center gap-2"><CheckCircle2 className="size-3.5" /> Grade Saved</span> : <span className="flex items-center gap-2"><Save className="size-3.5" /> Update Mark</span>)}
                </Button>
            </form>
        </section>
    );
}

// Remove the default layout wrapper as we are using a custom full-screen layout
AdminAssignmentShow.layout = (page: React.ReactNode) => page;
