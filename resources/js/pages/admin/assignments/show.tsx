import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    CheckCircle2, 
    ChevronLeft, 
    ChevronRight, 
    FileText, 
    Paperclip, 
    Clock,
    AlertCircle,
    MessageSquare,
    Download,
    Users
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

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
            
            <div className="w-full p-4 space-y-3">
                {/* Header — same pattern as index */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/admin/academic/assignments" 
                            className="p-2 hover:bg-muted rounded-sm border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
                        >
                            <ChevronLeft className="size-4" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">Assignment Review</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">{assignment.title} • {assignment.batch.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-muted/5">
                            <Users className="size-3.5 text-muted-foreground" />
                            <span className="text-xs font-semibold text-foreground tabular-nums">
                                {submissions.filter((s: any) => s.status === 'graded').length}
                            </span>
                            <span className="text-[10px] text-muted-foreground">/ {submissions.length} graded</span>
                        </div>
                    </div>
                </div>

                {/* Student Navigator — table-toolbar style */}
                <div className="rounded-sm border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-muted/5 border-b border-border">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                                <Button 
                                    variant="ghost" size="icon" 
                                    className="size-7 rounded-sm cursor-pointer" 
                                    onClick={prevStudent}
                                    disabled={selectedStudentIndex === 0}
                                >
                                    <ChevronLeft className="size-3.5" />
                                </Button>
                                <Button 
                                    variant="ghost" size="icon" 
                                    className="size-7 rounded-sm cursor-pointer" 
                                    onClick={nextStudent}
                                    disabled={selectedStudentIndex === submissions.length - 1}
                                >
                                    <ChevronRight className="size-3.5" />
                                </Button>
                            </div>
                            <div className="h-4 w-px bg-border" />
                            <div className="flex items-center gap-2.5">
                                <div className="size-7 rounded-sm bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                                    {currentSubmission.user.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-foreground leading-none">{currentSubmission.user.name}</div>
                                    <div className="text-[10px] text-muted-foreground tabular-nums mt-0.5">
                                        {selectedStudentIndex + 1} of {submissions.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium border",
                                currentSubmission.status === 'graded' 
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                    : "bg-amber-50 text-amber-600 border-amber-100"
                            )}>
                                {currentSubmission.status === 'graded' ? 'Graded' : 'Pending'}
                            </span>
                        </div>
                    </div>

                    {/* Content area */}
                    <div key={currentSubmission.id} className="grid grid-cols-1 lg:grid-cols-12">
                        {/* Submission Content */}
                        <div className="lg:col-span-8 lg:border-r border-border">
                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-4 px-4 py-3 border-b border-border bg-background">
                                <div className="flex items-center gap-2 text-xs text-foreground">
                                    <Clock className="size-3 text-muted-foreground" />
                                    <span className="font-medium">
                                        {currentSubmission.submitted_at ? new Date(currentSubmission.submitted_at).toLocaleString() : 'Not submitted'}
                                    </span>
                                </div>
                                <div className="h-3 w-px bg-border" />
                                {currentSubmission.is_late ? (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-red-50 text-red-600 border border-red-100">
                                        <AlertCircle className="size-3" /> Late
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        <CheckCircle2 className="size-3" /> On Time
                                    </span>
                                )}
                                <div className="h-3 w-px bg-border" />
                                <span className="text-xs font-medium text-muted-foreground tabular-nums">{assignment.max_marks} pts max</span>
                            </div>

                            {/* Written Response */}
                            <div className="border-b border-border">
                                <div className="px-4 py-1.5 border-b border-border bg-muted/5">
                                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                                        <FileText className="size-3" /> Written Response
                                    </span>
                                </div>
                                <div className="p-4">
                                    {currentSubmission.content ? (
                                        <p className="text-sm font-medium leading-relaxed text-foreground whitespace-pre-wrap">
                                            {currentSubmission.content}
                                        </p>
                                    ) : (
                                        <div className="py-8 text-center">
                                            <FileText className="size-8 text-muted-foreground/15 mx-auto mb-1" strokeWidth={1} />
                                            <p className="text-xs text-muted-foreground/50">No written response</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* File Attachment */}
                            {currentSubmission.file_path && (
                                <div>
                                    <div className="px-4 py-1.5 border-b border-border bg-muted/5 flex items-center justify-between">
                                        <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                                            <Paperclip className="size-3" /> Attachment
                                        </span>
                                        <Button variant="ghost" size="sm" className="h-6 px-2 rounded-sm text-[10px] font-medium text-primary cursor-pointer" asChild>
                                            <a href={`/storage/${currentSubmission.file_path}`} target="_blank" download>
                                                <Download className="size-3 mr-1" /> Download
                                            </a>
                                        </Button>
                                    </div>
                                    <div className="bg-muted/5">
                                        {currentSubmission.file_path.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                            <div className="p-4 flex items-center justify-center">
                                                <img 
                                                    src={`/storage/${currentSubmission.file_path}`} 
                                                    alt="Submission" 
                                                    className="max-w-full max-h-[500px] h-auto rounded-sm border border-border"
                                                />
                                            </div>
                                        ) : (
                                            <iframe 
                                                key={currentSubmission.id + currentSubmission.file_path}
                                                src={`/storage/${currentSubmission.file_path}`} 
                                                className="w-full border-0" 
                                                style={{ minHeight: '500px' }}
                                                title={currentSubmission.file_path.split('/').pop()}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Grading Sidebar */}
                        <div className="lg:col-span-4">
                            <GradingForm key={currentSubmission.id} submission={currentSubmission} maxMarks={assignment.max_marks} />

                            {/* Feedback Log */}
                            <div className="border-t border-border">
                                <div className="px-4 py-1.5 border-b border-border bg-muted/5">
                                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                                        <MessageSquare className="size-3" /> Feedback Log
                                    </span>
                                </div>
                                <div className="p-4">
                                    {currentSubmission.admin_comments ? (
                                        <div className="bg-muted/5 border border-border p-3 rounded-sm space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-semibold text-foreground">Your Response</span>
                                                <span className="text-[10px] text-muted-foreground">Sent</span>
                                            </div>
                                            <p className="text-xs font-medium text-muted-foreground leading-relaxed italic">
                                                "{currentSubmission.admin_comments}"
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="py-4 text-center">
                                            <p className="text-xs text-muted-foreground/50">No feedback yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-3 py-1.5 border-t border-border bg-muted/5 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">Use ← → arrow keys to navigate students</span>
                        <span className="text-[10px] text-muted-foreground tabular-nums">{selectedStudentIndex + 1} of {submissions.length}</span>
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
        <div>
            <div className="px-4 py-1.5 border-b border-border bg-muted/5 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">Marking Tool</span>
                {submission.is_late && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-red-50 text-red-600 border border-red-100">Late -10%</span>
                )}
            </div>
            <form onSubmit={submit} className="p-4 space-y-3">
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Score</Label>
                    <div className="flex items-center gap-2">
                        <Input 
                            type="number" 
                            className="h-10 rounded-sm border-border bg-muted/5 text-lg font-semibold text-center w-20 shadow-none"
                            value={data.marks_obtained}
                            onChange={e => setData('marks_obtained', parseInt(e.target.value) || 0)}
                            max={maxMarks}
                            min={0}
                        />
                        <span className="text-xs text-muted-foreground">/ {maxMarks}</span>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Remarks</Label>
                    <Textarea 
                        placeholder="Add feedback..."
                        className="min-h-[100px] rounded-sm border-border bg-muted/5 text-xs font-medium p-3 shadow-none"
                        value={data.admin_comments}
                        onChange={e => setData('admin_comments', e.target.value)}
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={processing}
                    className={cn(
                        "w-full h-9 rounded-sm text-xs font-medium shadow-none cursor-pointer",
                        isSaved ? "bg-emerald-600 text-white hover:bg-emerald-600" : ""
                    )}
                >
                    {processing ? '...' : (isSaved ? 'Saved ✓' : 'Update Grade')}
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
