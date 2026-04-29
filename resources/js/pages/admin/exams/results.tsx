import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { Trophy, User, BookOpen, Clock, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function ExamResults({ exam }: { exam: any }) {
    const { patch, processing } = useForm({ marks_obtained: 0 });
    const [selectedAttempt, setSelectedAttempt] = useState<any>(null);

    const handleUpdateMarks = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAttempt) return;
        patch(`/admin/academic/exam-attempts/${selectedAttempt.id}`, {
            onSuccess: () => setSelectedAttempt(null),
            preserveScroll: true
        });
    };

    const columns: Column<any>[] = [
        {
            key: 'student', label: 'Student',
            render: (attempt) => (
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <User className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{attempt.user.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{attempt.user.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'date', label: 'Date',
            render: (attempt) => (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {new Date(attempt.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
            )
        },
        {
            key: 'score', label: 'Marks',
            render: (attempt) => (
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground tabular-nums">{attempt.marks_obtained} / {exam.total_marks}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">({Math.round((attempt.marks_obtained / exam.total_marks) * 100)}%)</span>
                </div>
            )
        },
        {
            key: 'status', label: 'Result',
            render: (attempt) => {
                const percentage = (attempt.marks_obtained / exam.total_marks) * 100;
                const passed = percentage >= 40;
                return (
                    <span className={cn(
                        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-medium border",
                        passed ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                    )}>
                        {passed ? <CheckCircle2 className="size-2.5" /> : <AlertCircle className="size-2.5" />}
                        {passed ? 'Passed' : 'Failed'}
                    </span>
                );
            }
        }
    ];

    return (
        <>
            <Head title={`Results: ${exam.title}`} />
            <div className="w-full p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                            <Link href="/admin/academic/exams" className="hover:text-foreground transition-colors">Exams</Link>
                            <span>/</span>
                            <span className="text-foreground font-medium">Results</span>
                        </div>
                        <h1 className="text-lg font-semibold text-foreground">{exam.title}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <BookOpen className="size-3" /> {exam.course.title}
                            </span>
                            <span className="text-xs text-muted-foreground">Total: {exam.total_marks} marks</span>
                        </div>
                    </div>
                    <div className="size-10 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Trophy className="size-5" />
                    </div>
                </div>

                <div className="rounded-sm border border-border overflow-hidden">
                    <AdminDataTable
                        data={exam.attempts}
                        columns={columns}
                        searchPlaceholder="Search by student..."
                        actions={(attempt) => (
                            <Button variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => setSelectedAttempt(attempt)}>
                                <Edit2 className="size-3" />
                            </Button>
                        )}
                    />
                </div>
            </div>

            <Dialog open={!!selectedAttempt} onOpenChange={(open) => !open && setSelectedAttempt(null)}>
                <DialogContent className="sm:max-w-sm rounded-sm p-0 overflow-hidden border border-border shadow-none">
                    <DialogHeader className="px-4 py-3 border-b border-border">
                        <DialogTitle className="text-sm font-semibold">Update Marks</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateMarks} className="p-4 space-y-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Student</Label>
                            <div className="p-2.5 bg-muted/5 border border-border rounded-sm text-sm font-medium">{selectedAttempt?.user?.name}</div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Marks (Max: {exam.total_marks})</Label>
                            <Input type="number" className="h-9 rounded-sm text-sm shadow-none" value={selectedAttempt?.marks_obtained ?? 0} onChange={e => setSelectedAttempt({...selectedAttempt, marks_obtained: parseInt(e.target.value)})} max={exam.total_marks} min={0} />
                        </div>
                        <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2">
                            <Button type="button" variant="outline" onClick={() => setSelectedAttempt(null)} className="flex-1 h-9 rounded-sm text-xs shadow-none">Cancel</Button>
                            <Button type="submit" disabled={processing} className="flex-1 h-9 rounded-sm text-xs shadow-none">Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

ExamResults.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Exams', href: '/admin/academic/exams' }, { title: 'Results', href: '#' }]}>
        {page}
    </AppLayout>
);
