import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Trophy, Settings, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function AdminExamIndex({ courses }: { courses: any[] }) {
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({ course_id: '', title: '', total_marks: 50 });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/academic/exams', { onSuccess: () => { setIsConfigOpen(false); reset(); } });
    };

    const columns: Column<any>[] = [
        {
            key: 'title', label: 'Course', sortable: true,
            render: (course) => (
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-sm bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                        <Trophy className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{course.title}</div>
                        <div className="text-xs text-muted-foreground">{course.exam ? course.exam.title : 'No exam configured'}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'questions_count', label: 'Questions',
            render: (course) => (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100 tabular-nums">
                    {course.exam ? `${course.exam.questions_count ?? 0} Q` : '—'}
                </span>
            )
        },
        {
            key: 'total_marks', label: 'Total Marks',
            render: (course) => (
                <span className="text-sm font-medium text-foreground tabular-nums">{course.exam ? course.exam.total_marks : '—'}</span>
            )
        },
        {
            key: 'status', label: 'Status',
            render: (course) => {
                if (!course.exam) return <span className="text-xs text-muted-foreground">—</span>;
                const isLive = course.exam.is_active;
                return (
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium border ${isLive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {isLive ? 'Live' : 'Draft'}
                    </span>
                );
            }
        }
    ];

    return (
        <>
            <Head title="Exams" />
            <div className="w-full p-4 space-y-3">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">Exams</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Configure exams and manage questions</p>
                </div>
                <div className="rounded-sm border border-border overflow-hidden">
                    <AdminDataTable title="Course Exams" data={courses} columns={columns} searchPlaceholder="Search courses..."
                        actions={(course) => (
                            <div className="flex items-center justify-end gap-1">
                                <Dialog open={isConfigOpen && data.course_id === course.id.toString()} onOpenChange={(open) => {
                                    setIsConfigOpen(open);
                                    if (open) setData({ course_id: course.id.toString(), title: course.exam?.title || 'Final Exam', total_marks: course.exam?.total_marks || 50 });
                                }}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-7 px-2 rounded-sm text-xs font-medium text-muted-foreground hover:text-foreground">
                                            <Settings className="size-3 mr-1" /> {course.exam ? 'Edit' : 'Setup'}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-sm border border-border max-w-md p-0 overflow-hidden shadow-none">
                                        <DialogHeader className="px-4 py-3 border-b border-border">
                                            <DialogTitle className="text-sm font-semibold">Configure Exam</DialogTitle>
                                            <p className="text-xs text-muted-foreground">{course.title}</p>
                                        </DialogHeader>
                                        <form onSubmit={submit} className="p-4 space-y-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-muted-foreground">Exam Title</Label>
                                                <Input required className="h-9 rounded-sm text-sm shadow-none" value={data.title} onChange={e => setData('title', e.target.value)} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-muted-foreground">Total Marks</Label>
                                                <Input type="number" required className="h-9 rounded-sm text-sm shadow-none" value={data.total_marks} onChange={e => setData('total_marks', parseInt(e.target.value))} />
                                            </div>
                                            <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2">
                                                <Button type="button" variant="outline" onClick={() => setIsConfigOpen(false)} className="flex-1 h-9 rounded-sm text-xs shadow-none">Cancel</Button>
                                                <Button type="submit" disabled={processing} className="flex-1 h-9 rounded-sm text-xs shadow-none">Save</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                {course.exam && (
                                    <>
                                        <Button asChild variant="ghost" size="sm" className="h-7 px-2 rounded-sm text-xs font-medium text-muted-foreground hover:text-foreground">
                                            <Link href={`/admin/academic/exams/${course.exam.id}/questions`}>Questions</Link>
                                        </Button>
                                        <Button asChild variant="ghost" size="sm" className="h-7 px-2 rounded-sm text-xs font-medium text-muted-foreground hover:text-foreground">
                                            <Link href={`/admin/academic/exams/${course.exam.id}/results`}>Results <ChevronRight className="size-3 ml-0.5" /></Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>
        </>
    );
}

AdminExamIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Exams', href: '/admin/academic/exams' }]}>{page}</AppLayout>
);
