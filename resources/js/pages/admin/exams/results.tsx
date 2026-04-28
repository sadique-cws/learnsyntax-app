import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { Trophy, User, BookOpen, Clock, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function ExamResults({ exam }: { exam: any }) {
    const { patch, processing } = useForm({
        marks_obtained: 0
    });
    
    const [selectedAttempt, setSelectedAttempt] = useState<any>(null);

    const handleUpdateMarks = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/academic/exam-attempts/${selectedAttempt.id}`, {
            onSuccess: () => setSelectedAttempt(null),
            preserveScroll: true
        });
    };

    const columns: Column<any>[] = [
        {
            key: 'student',
            label: 'Student',
            render: (attempt) => (
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-sm bg-primary/5 flex items-center justify-center text-primary">
                        <User className="size-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-tight">{attempt.user.name}</span>
                        <span className="text-[9px] text-muted-foreground font-bold lowercase">{attempt.user.email}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'date',
            label: 'Attempted On',
            render: (attempt) => (
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                    <Clock className="size-3" />
                    {new Date(attempt.created_at).toLocaleString()}
                </div>
            )
        },
        {
            key: 'score',
            label: 'Marks',
            render: (attempt) => (
                <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 bg-muted rounded-sm text-xs font-black">
                        {attempt.marks_obtained} / {exam.total_marks}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        ({Math.round((attempt.marks_obtained / exam.total_marks) * 100)}%)
                    </span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Result',
            render: (attempt) => {
                const percentage = (attempt.marks_obtained / exam.total_marks) * 100;
                const passed = percentage >= 40;
                return (
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest ${
                        passed ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                        {passed ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
                        {passed ? 'Passed' : 'Failed'}
                    </div>
                );
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (attempt) => (
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-8 rounded-sm hover:bg-primary/5"
                    onClick={() => {
                        setSelectedAttempt(attempt);
                    }}
                >
                    <Edit2 className="size-3.5" />
                </Button>
            )
        }
    ];

    return (
        <>
            <Head title={`Results: ${exam.title}`} />
            <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Link href="/admin/academic/exams" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Manage Exams</Link>
                            <span className="text-muted-foreground/30">/</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Results</span>
                        </div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">{exam.title}</h1>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase">
                                <BookOpen className="size-3.5 text-primary/40" /> {exam.course.title}
                            </div>
                            <div className="size-1.5 rounded-full bg-border" />
                            <div className="text-xs font-bold text-muted-foreground uppercase">
                                Total Marks: <span className="text-foreground">{exam.total_marks}</span>
                            </div>
                        </div>
                    </div>
                    <div className="size-12 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                        <Trophy className="size-6" />
                    </div>
                </div>

                <div className="bg-background border border-border rounded-sm shadow-sm overflow-hidden">
                    <AdminDataTable 
                        data={exam.attempts} 
                        columns={columns} 
                        searchPlaceholder="Filter by student name or email..."
                    />
                </div>
            </div>

            {/* Edit Marks Dialog */}
            <Dialog open={!!selectedAttempt} onOpenChange={(open) => !open && setSelectedAttempt(null)}>
                <DialogContent className="rounded-sm max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-black uppercase tracking-widest">Update Exam Marks</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateMarks} className="space-y-4 py-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Student</label>
                            <div className="p-3 bg-muted/20 border border-border rounded-sm text-xs font-bold uppercase">
                                {selectedAttempt?.user?.name}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Marks Obtained (Max: {exam.total_marks})</label>
                            <Input 
                                type="number"
                                className="h-10 rounded-sm border-border bg-muted/10 text-sm font-bold focus:bg-background"
                                value={selectedAttempt ? (selectedAttempt.marks_obtained) : 0}
                                onChange={e => setSelectedAttempt({...selectedAttempt, marks_obtained: parseInt(e.target.value)})}
                                max={exam.total_marks}
                                min={0}
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setSelectedAttempt(null)}
                                className="rounded-sm text-[10px] font-black uppercase tracking-widest"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="rounded-sm bg-primary text-[10px] font-black uppercase tracking-widest px-8 shadow-lg shadow-primary/10"
                            >
                                Save Changes
                            </Button>
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
