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
    Send, 
    Paperclip, 
    ChevronLeft,
    ChevronDown,
    X,
    Check,
    ChevronRight,
    Milestone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

function cn(...classes: any[]) { return classes.filter(Boolean).join(' '); }

export default function StudentAssignments({ enrollment, assignments }: { enrollment: any, assignments: any[] }) {
    const { course, batch } = enrollment;
    const [expandedAssignmentId, setExpandedAssignmentId] = useState<number | null>(null);

    return (
        <>
            <Head title={`Assignments | ${course.title}`} />
            
            <div className="w-full p-4 space-y-6">
                {/* Standardized Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2.5 hover:bg-muted rounded-sm border border-border/50 text-muted-foreground hover:text-foreground transition-all shrink-0" aria-label="Back to dashboard">
                            <ChevronLeft className="size-4" />
                        </Link>
                        <div className="space-y-0.5">
                            <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <BookOpen className="size-4 text-primary" /> Course Assignments
                            </h1>
                            <p className="text-xs text-muted-foreground">{course.title} • Batch {batch?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-primary/5 px-4 py-2 rounded-sm border border-primary/10">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-tight">Active Tasks</span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-xl font-bold text-foreground tabular-nums">{assignments.length}</span>
                                <span className="text-[10px] text-muted-foreground">Assigned</span>
                            </div>
                        </div>
                        <div className="size-10 rounded-full border-2 border-primary/20 flex items-center justify-center">
                            <FileText className="size-5 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Assignments List */}
                <div className="space-y-4">
                    {assignments.map((assignment) => {
                        const submission = assignment.submissions[0];
                        const dueDate = new Date(assignment.due_date);
                        const isLate = assignment.due_date && new Date() > dueDate;
                        const isExpanded = expandedAssignmentId === assignment.id;

                        return (
                            <div 
                                key={assignment.id} 
                                className={cn(
                                    "border border-border rounded-sm transition-all overflow-hidden bg-background",
                                    isExpanded ? "ring-1 ring-primary/10 border-primary/20" : "hover:border-primary/20"
                                )}
                            >
                                <div 
                                    className={cn(
                                        "flex flex-col md:flex-row cursor-pointer transition-colors",
                                        isExpanded ? "bg-muted/5" : "hover:bg-muted/5"
                                    )}
                                    onClick={() => setExpandedAssignmentId(isExpanded ? null : assignment.id)}
                                >
                                    {/* Assignment Info */}
                                    <div className="p-5 md:flex-1 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className={cn(
                                                "size-9 rounded-sm flex items-center justify-center border shrink-0",
                                                submission?.status === 'graded' 
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                                    : "bg-primary/5 text-primary border-primary/10"
                                            )}>
                                                {submission?.status === 'graded' ? <CheckCircle2 className="size-4" /> : <FileText className="size-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-semibold text-foreground truncate">{assignment.title}</h3>
                                                    <div className={cn(
                                                        "text-[9px] font-bold  px-2 py-0.5 rounded-sm border shrink-0 ml-4 hidden sm:block",
                                                        submission?.status === 'graded' 
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                                            : submission?.status === 'submitted' 
                                                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                                                : "bg-slate-50 text-slate-500 border-slate-100"
                                                    )}>
                                                        {submission?.status === 'graded' ? 'Graded' : submission?.status === 'submitted' ? 'Submitted' : 'Assigned'}
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                                    <div className={cn("flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight", isLate && !submission ? "text-red-600" : "text-muted-foreground/60")}>
                                                        <Calendar className="size-3.5" />
                                                        Due {dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight text-primary/60">
                                                        <Info className="size-3.5" />
                                                        {assignment.max_marks} Pts
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Panel */}
                                    <div className={cn(
                                        "p-4 md:w-48 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-border transition-colors",
                                        submission?.status === 'graded' ? 'bg-emerald-50/10' : 'bg-muted/5'
                                    )}>
                                        {submission?.status === 'graded' ? (
                                            <div className="text-center">
                                                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Grade</div>
                                                <div className="text-xl font-bold text-emerald-600 tabular-nums">
                                                    {submission.marks_obtained}
                                                    <span className="text-xs text-emerald-600/30 ml-0.5">/{assignment.max_marks}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="w-full h-8 rounded-sm text-[10px] font-bold  text-primary hover:bg-primary/5 shadow-none"
                                            >
                                                {submission ? 'Manage' : 'Submit'}
                                                {isExpanded ? <ChevronDown className="size-3 ml-1.5" /> : <ChevronRight className="size-3 ml-1.5" />}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Submission Area */}
                                {isExpanded && (
                                    <div className="border-t border-border bg-muted/5 p-6 lg:p-8 space-y-6 animate-in slide-in-from-top-2 duration-300">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-bold text-muted-foreground  flex items-center gap-2">
                                                    <Info className="size-3.5" /> Instructions
                                                </h4>
                                                <div className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-wrap bg-white border border-border p-4 rounded-sm">
                                                    {assignment.description || 'No specific instructions provided.'}
                                                </div>
                                                {isLate && !submission && (
                                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-sm text-red-700">
                                                        <AlertCircle className="size-3.5 shrink-0" />
                                                        <p className="text-[10px] font-bold uppercase tracking-tight">Late Penalty: 10% reduction applied</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                {submission?.status === 'graded' ? (
                                                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-sm text-center space-y-2">
                                                        <CheckCircle2 className="size-8 text-emerald-500 mx-auto" />
                                                        <p className="text-xs font-bold text-emerald-800 ">Marked & Finalized</p>
                                                        {submission.admin_comments && (
                                                            <p className="text-[11px] font-medium text-emerald-700 italic border-t border-emerald-200 mt-2 pt-2">
                                                                "{submission.admin_comments}"
                                                            </p>
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
                        <div className="py-12 text-center border border-dashed border-border rounded-sm bg-muted/5">
                            <BookOpen className="size-8 text-muted-foreground/10 mx-auto mb-2" />
                            <p className="text-xs font-medium text-muted-foreground ">No assignments found</p>
                        </div>
                    )}
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
            <div className="bg-white border border-primary/20 p-6 rounded-sm space-y-6 shadow-md animate-in zoom-in-95 duration-200">
                <div className="border-b border-border pb-3">
                    <h5 className="text-[10px] font-bold text-primary ">Confirm Submission</h5>
                </div>

                <div className="space-y-4">
                    {data.content && (
                        <div className="space-y-1.5">
                            <span className="text-[9px] font-bold text-muted-foreground ">Written Response</span>
                            <div className="p-3 bg-muted/20 border border-border rounded-sm text-xs font-medium text-slate-700 max-h-[120px] overflow-y-auto">
                                {data.content}
                            </div>
                        </div>
                    )}

                    {data.file && (
                        <div className="space-y-1.5">
                            <span className="text-[9px] font-bold text-muted-foreground ">Attachment</span>
                            <div className="flex items-center gap-2 p-2 border border-border rounded-sm bg-slate-50">
                                <Paperclip className="size-3.5 text-primary" />
                                <span className="text-[10px] font-bold truncate">{data.file.name}</span>
                            </div>
                        </div>
                    )}

                    {filePreview && (
                        <div className="aspect-video bg-slate-900 rounded-sm border border-border overflow-hidden">
                            <img src={filePreview} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>

                <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => setIsConfirming(false)} className="flex-1 h-9 rounded-sm text-[10px] font-bold  shadow-none">
                        Edit
                    </Button>
                    <Button size="sm" onClick={submit} disabled={processing} className="flex-1 h-9 rounded-sm text-[10px] font-bold  shadow-none bg-primary hover:bg-primary/90">
                        {processing ? '...' : 'Confirm'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); setIsConfirming(true); }} className="bg-white border border-border p-6 rounded-sm space-y-6 shadow-sm">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-muted-foreground  flex items-center justify-between">
                        <span>Answer</span>
                        <span className="text-[9px] opacity-40">{data.content.length} chars</span>
                    </Label>
                    <Textarea
                        className="min-h-[180px] rounded-sm border-border text-xs font-medium p-4 focus:ring-primary/5 bg-slate-50/30"
                        placeholder="Type your response..."
                        value={data.content}
                        onChange={e => setData('content', e.target.value)}
                    />
                    {errors.content && <div className="text-[9px] text-red-600 font-bold uppercase">{errors.content}</div>}
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-muted-foreground ">Attachment</Label>
                    <div 
                        className="border border-dashed border-border hover:border-primary/40 rounded-sm p-6 text-center bg-muted/5 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,image/*" />
                        <FileUp className="size-5 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-[10px] font-bold text-muted-foreground ">
                            {data.file ? data.file.name : 'Select File'}
                        </p>
                    </div>
                    {data.file && (
                         <div className="flex items-center justify-between p-2 bg-primary/5 border border-primary/10 rounded-sm">
                            <span className="text-[9px] font-bold text-primary truncate max-w-[150px]">{data.file.name}</span>
                            <Button type="button" variant="ghost" size="icon" className="size-5 hover:bg-primary/10 text-primary" onClick={() => { setData('file', null); setFilePreview(null); }}>
                                <X className="size-3" />
                            </Button>
                         </div>
                    )}
                </div>
            </div>

            <Button type="submit" disabled={processing} className="w-full rounded-sm h-10 font-bold text-[10px]  shadow-none bg-slate-900 hover:bg-slate-800 transition-all">
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
