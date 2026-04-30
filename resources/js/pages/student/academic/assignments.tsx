import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { 
    BookOpen, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    Info, 
    FileUp, 
    AlertCircle, 
    FileText, 
    Paperclip, 
    ChevronLeft,
    ChevronDown,
    X,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export default function StudentAssignments({ enrollment, assignments }: { enrollment: any, assignments: any[] }) {
    const { course, batch } = enrollment;
    const [expandedAssignmentId, setExpandedAssignmentId] = useState<number | null>(null);

    return (
        <>
            <Head title={`Assignments | ${course.title}`} />
            
            <div className="w-full p-4 space-y-3">
                {/* Header — same pattern as index */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="p-2 hover:bg-muted rounded-sm border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer" aria-label="Back to dashboard">
                            <ChevronLeft className="size-4" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">Course Assignments</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">{course.title} • Batch {batch?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-muted/5">
                        <FileText className="size-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold text-foreground tabular-nums">{assignments.length}</span>
                        <span className="text-[10px] text-muted-foreground">tasks assigned</span>
                    </div>
                </div>

                {/* Assignments Table Container */}
                <div className="rounded-sm border border-border overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xs font-semibold text-foreground">Your Tasks</h2>
                            <span className="text-[10px] text-muted-foreground tabular-nums">{assignments.length}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1"><CheckCircle2 className="size-3 text-emerald-500" /> {assignments.filter(a => a.submissions[0]?.status === 'graded').length} graded</span>
                            <span className="flex items-center gap-1"><Clock className="size-3 text-amber-500" /> {assignments.filter(a => a.submissions[0]?.status === 'submitted').length} pending</span>
                        </div>
                    </div>

                    {/* Assignment rows */}
                    <div className="divide-y divide-border">
                        {assignments.map((assignment) => {
                            const submission = assignment.submissions[0];
                            const dueDate = new Date(assignment.due_date);
                            const isLate = assignment.due_date && new Date() > dueDate;
                            const isExpanded = expandedAssignmentId === assignment.id;

                            return (
                                <div key={assignment.id}>
                                    <div 
                                        className={cn(
                                            "flex flex-col md:flex-row cursor-pointer transition-colors",
                                            isExpanded ? "bg-muted/5" : "hover:bg-muted/5"
                                        )}
                                        onClick={() => setExpandedAssignmentId(isExpanded ? null : assignment.id)}
                                    >
                                        {/* Assignment Info */}
                                        <div className="px-3 py-3 md:flex-1 flex items-center gap-2.5 min-w-0">
                                            <div className={cn(
                                                "size-8 rounded-sm flex items-center justify-center border shrink-0",
                                                submission?.status === 'graded' 
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                                    : "bg-primary/5 text-primary border-primary/10"
                                            )}>
                                                {submission?.status === 'graded' ? <CheckCircle2 className="size-3.5" /> : <FileText className="size-3.5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-foreground truncate">{assignment.title}</div>
                                                <div className="flex items-center gap-3 mt-0.5">
                                                    <span className={cn(
                                                        "flex items-center gap-1 text-[10px] text-muted-foreground",
                                                        isLate && !submission && "text-red-600"
                                                    )}>
                                                        <Calendar className="size-3" />
                                                        Due {dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground tabular-nums">{assignment.max_marks} pts</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status / Grade Panel */}
                                        <div className={cn(
                                            "px-3 py-3 md:w-40 flex items-center justify-center border-t md:border-t-0 md:border-l border-border",
                                            submission?.status === 'graded' ? 'bg-emerald-50/30' : 'bg-muted/5'
                                        )}>
                                            {submission?.status === 'graded' ? (
                                                <div className="text-center">
                                                    <div className="text-[10px] text-emerald-600">Grade</div>
                                                    <div className="text-lg font-semibold text-emerald-600 tabular-nums leading-none">
                                                        {submission.marks_obtained}
                                                        <span className="text-xs text-emerald-400 ml-0.5">/{assignment.max_marks}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium border",
                                                        submission?.submitted_at 
                                                            ? "bg-amber-50 text-amber-600 border-amber-100"
                                                            : "bg-slate-50 text-slate-500 border-slate-100"
                                                    )}>
                                                        {submission?.submitted_at ? 'Submitted' : 'Assigned'}
                                                    </span>
                                                    {isExpanded ? <ChevronDown className="size-3 text-muted-foreground" /> : <ChevronRight className="size-3 text-muted-foreground" />}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Submission Area */}
                                    {isExpanded && (
                                        <div className="border-t border-border bg-muted/5 p-4 lg:p-6 animate-in slide-in-from-top-2 duration-200">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                                                        <Info className="size-3" /> Instructions
                                                    </div>
                                                    <div className="text-xs font-medium text-foreground leading-relaxed whitespace-pre-wrap bg-background border border-border p-3 rounded-sm">
                                                        {assignment.description || 'No specific instructions provided.'}
                                                    </div>
                                                    {isLate && !submission && (
                                                        <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-100 rounded-sm">
                                                            <AlertCircle className="size-3 text-red-600 shrink-0" />
                                                            <p className="text-[10px] font-medium text-red-700">Late penalty: 10% reduction</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    {submission?.status === 'graded' ? (
                                                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-sm text-center space-y-2">
                                                            <CheckCircle2 className="size-6 text-emerald-500 mx-auto" />
                                                            <p className="text-xs font-medium text-emerald-800">Marked & Finalized</p>
                                                            {submission.admin_comments && (
                                                                <p className="text-[11px] font-medium text-emerald-700 italic border-t border-emerald-200 mt-2 pt-2">
                                                                    "{submission.admin_comments}"
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : submission?.submitted_at ? (
                                                        <div className="bg-background border border-border p-4 rounded-sm space-y-4 animate-in fade-in duration-300">
                                                            <div className="flex items-center justify-between border-b border-border pb-2">
                                                                <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                                                                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                                                                    Submission Recorded
                                                                </span>
                                                                <span className="text-[10px] text-muted-foreground tabular-nums">
                                                                    {new Date(submission.submitted_at).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            
                                                            {submission.content && (
                                                                <div className="space-y-1.5">
                                                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Your Response</Label>
                                                                    <div className="text-xs font-medium text-foreground bg-muted/5 border border-border p-3 rounded-sm whitespace-pre-wrap leading-relaxed">
                                                                        {submission.content}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {submission.file_path && (
                                                                <div className="space-y-1.5">
                                                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Attachment</Label>
                                                                    <div className="flex items-center justify-between p-2.5 bg-card border border-border rounded-sm group hover:border-primary/20 transition-colors">
                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                            <Paperclip className="size-3.5 text-indigo-500 shrink-0" />
                                                                            <span className="text-[11px] font-bold text-foreground truncate max-w-[200px]">
                                                                                {submission.file_path.split('/').pop()}
                                                                            </span>
                                                                        </div>
                                                                        <Button variant="outline" size="sm" className="h-6 px-2 rounded-sm text-[10px] font-bold uppercase tracking-tight" asChild>
                                                                            <a href={`/storage/${submission.file_path}`} target="_blank">
                                                                                View
                                                                            </a>
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <SubmissionForm enrollment={enrollment} assignment={assignment} submission={submission} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {assignments.length === 0 && (
                            <div className="py-12 text-center">
                                <BookOpen className="size-6 text-muted-foreground/15 mx-auto mb-1" strokeWidth={1} />
                                <p className="text-xs text-muted-foreground/50">No assignments found</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-3 py-1.5 border-t border-border bg-muted/5 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{assignments.length} tasks total</span>
                        <span className="text-[10px] text-muted-foreground">{assignments.filter(a => a.submissions[0]).length} submitted</span>
                    </div>
                </div>
            </div>
        </>
    );
}

function SubmissionForm({ enrollment, assignment, submission = null }: { enrollment: any, assignment: any, submission?: any }) {
    const { data, setData, post, processing, errors } = useForm({
        content: submission?.content || '',
        file: null as File | null,
    });

    const [isConfirming, setIsConfirming] = useState(false);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('file', file);
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/my-course/${enrollment.id}/assignments/${assignment.id}`, {
            onSuccess: () => setIsConfirming(false),
            forceFormData: true,
            preserveScroll: true
        });
    };

    if (isConfirming) {
        return (
            <div className="bg-background border border-primary/20 p-4 rounded-sm space-y-4 animate-in zoom-in-95 duration-200">
                <div className="text-[11px] font-semibold text-foreground border-b border-border pb-2">Confirm Submission</div>

                <div className="space-y-3">
                    {data.content && (
                        <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground">Written Response</span>
                            <div className="p-2.5 bg-muted/5 border border-border rounded-sm text-xs font-medium text-foreground max-h-[100px] overflow-y-auto">
                                {data.content}
                            </div>
                        </div>
                    )}

                    {data.file && (
                        <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground">Attachment</span>
                            <div className="flex items-center gap-2 p-2 border border-border rounded-sm bg-muted/5">
                                <Paperclip className="size-3 text-muted-foreground" />
                                <span className="text-[10px] font-medium truncate">{data.file.name}</span>
                            </div>
                        </div>
                    )}

                    {filePreview && (
                        <div className="aspect-video bg-slate-900 rounded-sm border border-border overflow-hidden">
                            <img src={filePreview} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsConfirming(false)} className="flex-1 h-8 rounded-sm text-xs shadow-none cursor-pointer">
                        Edit
                    </Button>
                    <Button size="sm" onClick={submit} disabled={processing} className="flex-1 h-8 rounded-sm text-xs shadow-none cursor-pointer">
                        {processing ? '...' : 'Confirm'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); setIsConfirming(true); }} className="bg-background border border-border p-4 rounded-sm space-y-4">
            <div className="space-y-3">
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                        <span>Answer</span>
                        <span className="text-[10px] text-muted-foreground/40 tabular-nums">{data.content.length} chars</span>
                    </Label>
                    <Textarea
                        className="min-h-[140px] rounded-sm border-border text-xs font-medium p-3 bg-muted/5 shadow-none"
                        placeholder="Type your response..."
                        value={data.content}
                        onChange={e => setData('content', e.target.value)}
                    />
                    {errors.content && <div className="text-[10px] text-red-600 font-medium">{errors.content}</div>}
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Attachment</Label>
                    <div 
                        className="border border-dashed border-border hover:border-primary/30 rounded-sm p-4 text-center bg-muted/5 cursor-pointer transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,image/*" />
                        <FileUp className="size-4 text-muted-foreground/20 mx-auto mb-1" />
                        <p className="text-[10px] text-muted-foreground">
                            {data.file ? data.file.name : 'Click to select file'}
                        </p>
                    </div>
                    {data.file && (
                         <div className="flex items-center justify-between p-2 bg-primary/5 border border-primary/10 rounded-sm">
                            <span className="text-[10px] font-medium text-primary truncate max-w-[180px]">{data.file.name}</span>
                            <Button type="button" variant="ghost" size="icon" className="size-5 text-primary cursor-pointer" onClick={() => { setData('file', null); setFilePreview(null); }}>
                                <X className="size-3" />
                            </Button>
                         </div>
                    )}
                </div>
            </div>

            <Button type="submit" disabled={processing} className="w-full rounded-sm h-9 text-xs font-medium shadow-none cursor-pointer">
                {submission ? 'Update Submission' : 'Submit Assignment'}
            </Button>
        </form>
    );
}

StudentAssignments.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'My Course', href: '/dashboard' }, { title: 'Assignments', href: '#' }]}>
        {page}
    </AppLayout>
);
