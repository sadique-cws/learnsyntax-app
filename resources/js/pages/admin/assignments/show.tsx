import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    User, 
    CheckCircle2, 
    ChevronLeft, 
    ChevronRight, 
    Save, 
    FileText, 
    Paperclip, 
    ExternalLink,
    Clock,
    AlertCircle,
    MessageSquare,
    Send,
    Download,
    Eye,
    BookOpen,
    Users
} from 'lucide-react';
import { useState, useMemo, useEffect, useCallback } from 'react';

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default function AdminAssignmentShow({ assignment }: { assignment: any }) {
    const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);
    const submissions = assignment.submissions;
    const currentSubmission = submissions[selectedStudentIndex];

    const nextStudent = useCallback(() => {
        if (selectedStudentIndex < submissions.length - 1) {
            setSelectedStudentIndex(prev => prev + 1);
        }
    }, [selectedStudentIndex, submissions.length]);

    const prevStudent = useCallback(() => {
        if (selectedStudentIndex > 0) {
            setSelectedStudentIndex(prev => prev - 1);
        }
    }, [selectedStudentIndex]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prevStudent();
            if (e.key === 'ArrowRight') nextStudent();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextStudent, prevStudent]);

    return (
        <>
            <Head title={`Review: ${assignment.title}`} />
            
            <div className="w-full p-3 space-y-4 max-w-7xl mx-auto">
                {/* Standardized Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/admin/academic/assignments" 
                            className="p-2.5 hover:bg-muted rounded-sm border border-border/50 text-muted-foreground hover:text-foreground transition-all shrink-0"
                        >
                            <ChevronLeft className="size-4" />
                        </Link>
                        <div className="space-y-0.5">
                            <h1 className="text-lg font-semibold text-foreground flex items-center gap-2 uppercase tracking-tight">
                                <BookOpen className="size-4 text-primary" /> Assignment Review
                            </h1>
                            <p className="text-xs text-muted-foreground">{assignment.title} • {assignment.batch.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-primary/5 px-4 py-2 rounded-sm border border-primary/10">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-tight">Review Progress</span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-xl font-bold text-foreground tabular-nums">
                                    {submissions.filter((s: any) => s.status === 'graded').length}
                                </span>
                                <span className="text-[10px] text-muted-foreground">/ {submissions.length} Students</span>
                            </div>
                        </div>
                        <div className="size-10 rounded-full border-2 border-primary/20 flex items-center justify-center">
                            <Users className="size-5 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Student Navigator Bar */}
                <div className="flex items-center justify-between bg-white border border-border rounded-sm p-3 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-8 rounded-sm hover:bg-muted" 
                                onClick={prevStudent}
                                disabled={selectedStudentIndex === 0}
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-8 rounded-sm hover:bg-muted" 
                                onClick={nextStudent}
                                disabled={selectedStudentIndex === submissions.length - 1}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                        <div className="h-4 w-px bg-border mx-2" />
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-sm bg-primary text-[11px] font-bold text-white flex items-center justify-center shadow-sm">
                                {currentSubmission.user.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-bold text-foreground leading-none">{currentSubmission.user.name}</span>
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight mt-1">
                                    Record {selectedStudentIndex + 1} of {submissions.length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "px-3 py-1 rounded-sm text-[10px] font-bold  border",
                            currentSubmission.status === 'graded' 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                : "bg-amber-50 text-amber-700 border-amber-100"
                        )}>
                            {currentSubmission.status === 'graded' ? 'Graded' : 'Pending'}
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Submission Content */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Summary Info */}
                        <div className="bg-white border border-border rounded-sm p-4 flex flex-wrap items-center justify-between gap-6 shadow-sm">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-foreground ">Handed In At</span>
                                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                                    <Clock className="size-3.5 text-primary" />
                                    {currentSubmission.submitted_at ? new Date(currentSubmission.submitted_at).toLocaleString() : 'N/A'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-foreground ">Submission Status</span>
                                <div className="flex items-center gap-2">
                                    {currentSubmission.is_late ? (
                                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-tight flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-sm border border-red-100">
                                            <AlertCircle className="size-3" /> Late Submission
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-100">
                                            <CheckCircle2 className="size-3" /> On Time
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-foreground ">Maximum Marks</span>
                                <div className="text-xs font-black text-foreground tabular-nums text-right">
                                    {assignment.max_marks} Points
                                </div>
                            </div>
                        </div>

                        {/* Written Statement */}
                        <div className="bg-white border border-border rounded-sm overflow-hidden shadow-sm">
                            <div className="px-4 py-2.5 border-b border-border bg-muted/5 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-700  flex items-center gap-2">
                                    <FileText className="size-3.5 text-primary" /> Written Response
                                </span>
                            </div>
                            <div className="p-6">
                                {currentSubmission.content ? (
                                    <p className="text-[13px] font-medium leading-relaxed text-slate-700 whitespace-pre-wrap">
                                        {currentSubmission.content}
                                    </p>
                                ) : (
                                    <div className="py-12 text-center opacity-30">
                                        <FileText className="size-10 mx-auto mb-2" strokeWidth={1} />
                                        <p className="text-[10px] font-bold ">No written statement</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* File Attachment */}
                        {currentSubmission.file_path && (
                            <div className="bg-white border border-border rounded-sm overflow-hidden shadow-sm">
                                <div className="px-4 py-2.5 border-b border-border bg-muted/5 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-700  flex items-center gap-2">
                                        <Paperclip className="size-3.5 text-primary" /> Primary Attachment
                                    </span>
                                    <Button variant="ghost" size="sm" className="h-7 px-3 rounded-sm text-[9px] font-bold  hover:bg-primary/5 text-primary" asChild>
                                        <a href={`/storage/${currentSubmission.file_path}`} target="_blank" download>
                                            <Download className="size-3 mr-1.5" /> Download
                                        </a>
                                    </Button>
                                </div>
                                <div className="p-4 bg-slate-50 flex items-center justify-center min-h-[240px]">
                                    {currentSubmission.file_path.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                        <img 
                                            src={`/storage/${currentSubmission.file_path}`} 
                                            alt="Submission" 
                                            className="max-w-full h-auto rounded-sm border border-border shadow-md"
                                        />
                                    ) : (
                                        <div className="text-center p-10 bg-white border border-border rounded-sm shadow-sm max-w-sm w-full">
                                            <div className="size-12 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4 border border-primary/10">
                                                <FileText className="size-6 text-primary" />
                                            </div>
                                            <p className="text-xs font-bold text-foreground mb-4 truncate">{currentSubmission.file_path.split('/').pop()}</p>
                                            <Button variant="outline" size="sm" className="rounded-sm font-bold text-[10px] " asChild>
                                                <a href={`/storage/${currentSubmission.file_path}`} target="_blank">
                                                    <Eye className="size-3.5 mr-1.5" /> View Document
                                                </a>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Grading & Feedback Sidebar */}
                    <div className="lg:col-span-4 space-y-4">
                        <GradingForm submission={currentSubmission} maxMarks={assignment.max_marks} />

                        {/* Feedback History */}
                        <div className="bg-white border border-border rounded-sm p-4 space-y-3 shadow-sm">
                            <h3 className="text-[10px] font-bold text-muted-foreground  flex items-center gap-2">
                                <MessageSquare className="size-3.5 text-primary" /> Feedback Log
                            </h3>
                            {currentSubmission.admin_comments ? (
                                <div className="bg-muted/5 border border-border p-3 rounded-sm space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-black text-slate-800 uppercase tracking-tighter">Your Response</span>
                                        <span className="text-[8px] text-muted-foreground font-bold uppercase">Sent</span>
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
                                        "{currentSubmission.admin_comments}"
                                    </p>
                                </div>
                            ) : (
                                <div className="py-6 text-center opacity-40">
                                    <p className="text-[10px] font-bold uppercase tracking-tighter italic">No feedback provided yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
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
            },
            preserveScroll: true
        });
    };

    return (
        <div className="bg-white border border-border rounded-sm p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-[10px] font-bold text-foreground ">Marking Tool</h3>
                {submission.is_late && (
                    <span className="text-[9px] font-bold text-red-600 uppercase tracking-tighter">-10 LATE</span>
                )}
            </div>
            
            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-muted-foreground ">Score Awarded</Label>
                    <div className="flex items-center gap-3">
                        <Input 
                            type="number" 
                            className="h-12 rounded-sm border-border bg-slate-50 text-xl font-bold text-center w-24 focus:ring-primary/5 transition-all"
                            value={data.marks_obtained}
                            onChange={e => setData('marks_obtained', parseInt(e.target.value) || 0)}
                            max={maxMarks}
                            min={0}
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-muted-foreground/30">/ {maxMarks}</span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Total</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-muted-foreground ">Feedback / Remarks</Label>
                    <Textarea 
                        placeholder="Add remarks for the student..."
                        className="min-h-[120px] rounded-sm border-border bg-slate-50 text-[12px] font-medium leading-relaxed p-4 focus:ring-primary/5"
                        value={data.admin_comments}
                        onChange={e => setData('admin_comments', e.target.value)}
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={processing}
                    className={cn(
                        "w-full h-11 rounded-sm font-bold text-[10px]  transition-all shadow-none border-0",
                        isSaved ? "bg-emerald-600 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
                    )}
                >
                    {processing ? '...' : (isSaved ? 'Saved' : 'Update Grade')}
                </Button>
            </form>
        </div>
    );
}

AdminAssignmentShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Academic', href: '#' }, { title: 'Assignments', href: '/admin/academic/assignments' }, { title: 'Review', href: '#' }]}>
        {page}
    </AppLayout>
);
