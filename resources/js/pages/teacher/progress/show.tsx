import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, Circle, Clock, MessageSquare, Calendar, ChevronLeft, Layout, Milestone, Plus, Edit2, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TeacherProgressShow({ batch }: { batch: any }) {
    const [selectedChapter, setSelectedChapter] = useState<any>(null);
    const [showLogModal, setShowLogModal] = useState(false);

    const form = useForm({
        course_chapter_id: '',
        date: new Date().toISOString().split('T')[0],
        remarks: '',
    });

    const openLogModal = (chapter: any) => {
        setSelectedChapter(chapter);
        const existingLog = chapter.learning_logs?.[0];
        form.setData({
            course_chapter_id: chapter.id.toString(),
            date: existingLog ? existingLog.date : new Date().toISOString().split('T')[0],
            remarks: existingLog ? existingLog.remarks : '',
        });
        setShowLogModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/teacher/batches/${batch.id}/progress`, {
            onSuccess: () => setShowLogModal(false),
        });
    };

    const totalChapters = batch.course.modules.reduce((acc: any, m: any) => acc + m.chapters.length, 0);
    const completedChapters = batch.course.modules.reduce((acc: any, m: any) => acc + m.chapters.filter((c: any) => c.learning_logs.length > 0).length, 0);
    const progressPercentage = Math.round((completedChapters / totalChapters) * 100) || 0;

    return (
        <>
            <Head title={`Progress | ${batch.name}`} />
            
            <div className="w-full p-4 space-y-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background p-4 rounded-sm border border-border shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/teacher/progress" className="size-8 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                            <ChevronLeft className="size-4" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <Layout className="size-4 text-primary" /> {batch.name}
                            </h1>
                            <p className="text-xs text-muted-foreground">{batch.course.title} • Learning Progress Registry</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Batch Mastery</span>
                            <div className="flex items-center gap-3">
                                <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden border border-border/50">
                                    <div 
                                        className="h-full bg-primary transition-all duration-1000" 
                                        style={{ width: `${progressPercentage}%` }} 
                                    />
                                </div>
                                <span className="text-xs font-bold text-foreground tabular-nums">{progressPercentage}%</span>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-border hidden md:block" />
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Delivered</span>
                            <span className="text-sm font-bold text-primary tabular-nums">
                                {completedChapters} <span className="text-muted-foreground/30 font-medium">/ {totalChapters}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Modules & Chapters Content */}
                <div className="space-y-4">
                    {batch.course.modules.map((module: any, mIndex: number) => (
                        <div key={module.id} className="rounded-sm border border-border bg-background overflow-hidden shadow-sm">
                            {/* Module Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-muted/5 border-b border-border">
                                <div className="flex items-center gap-4">
                                    <div className="size-8 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold text-xs tabular-nums">
                                        {mIndex + 1}
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wide">
                                            {module.title}
                                        </h3>
                                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{module.chapters.length} Units in Module</p>
                                    </div>
                                </div>
                            </div>

                            {/* Chapters List */}
                            <div className="divide-y divide-border/40">
                                {module.chapters.map((chapter: any, cIndex: number) => {
                                    const isCompleted = chapter.learning_logs.length > 0;
                                    const log = chapter.learning_logs[0];

                                    return (
                                        <div key={chapter.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background hover:bg-muted/5 transition-all group">
                                            <div className="flex items-start gap-4">
                                                <div className={cn(
                                                    "size-7 rounded-sm flex items-center justify-center border transition-all mt-0.5",
                                                    isCompleted 
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                                        : "bg-muted/30 text-muted-foreground/30 border-border"
                                                )}>
                                                    {isCompleted ? <CheckCircle2 className="size-3.5" /> : <Circle className="size-3.5" />}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className={cn(
                                                        "text-xs font-semibold",
                                                        isCompleted ? "text-emerald-900" : "text-foreground"
                                                    )}>
                                                        {chapter.title}
                                                    </div>
                                                    
                                                    {isCompleted ? (
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-tight flex items-center gap-1">
                                                                    <Calendar className="size-2.5" />
                                                                    {new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                                </span>
                                                                <span className="size-1 rounded-full bg-emerald-200" />
                                                                <span className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-tight flex items-center gap-1">
                                                                    <MessageSquare className="size-2.5" />
                                                                    Logged
                                                                </span>
                                                            </div>
                                                            <div className="p-2.5 rounded-sm bg-emerald-50 border border-emerald-100 max-w-xl">
                                                                <p className="text-[11px] text-emerald-800 leading-relaxed italic">
                                                                    "{log.remarks}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest mt-0.5">Pending Delivery</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4 md:mt-0 md:pl-4">
                                                <Button 
                                                    onClick={() => openLogModal(chapter)}
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className={cn(
                                                        "h-8 px-3 rounded-sm text-[10px] font-bold uppercase tracking-wider gap-2",
                                                        isCompleted 
                                                            ? "text-emerald-700 hover:bg-emerald-50" 
                                                            : "text-primary hover:bg-primary/5"
                                                    )}
                                                >
                                                    {isCompleted ? <Edit2 className="size-3" /> : <Plus className="size-3" />}
                                                    {isCompleted ? 'Edit remark' : 'Log progress'}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Log Modal */}
            <Dialog open={showLogModal} onOpenChange={setShowLogModal}>
                <DialogContent className="max-w-md rounded-sm p-0 overflow-hidden border border-border shadow-none">
                    <DialogHeader className="px-4 py-3 border-b border-border bg-muted/5">
                        <DialogTitle className="text-sm font-semibold flex items-center gap-2 uppercase tracking-tight">
                            <MessageSquare className="size-3.5 text-primary" /> Delivery Registry
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        <div className="p-3 rounded-sm bg-primary/5 border border-primary/10">
                            <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">Syllabus Unit</div>
                            <div className="text-xs font-semibold text-foreground">{selectedChapter?.title}</div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date of Delivery</Label>
                            <Input 
                                type="date" 
                                className="h-9 rounded-sm text-sm border-border shadow-none" 
                                value={form.data.date} 
                                onChange={e => form.setData('date', e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Instructional Remarks</Label>
                            <Textarea 
                                className="min-h-[120px] rounded-sm text-sm shadow-none resize-none border-border p-3 leading-relaxed" 
                                value={form.data.remarks} 
                                onChange={e => form.setData('remarks', e.target.value)} 
                                required 
                                placeholder="Describe content covered and student outcomes..." 
                            />
                        </div>

                        <DialogFooter className="pt-4 border-t border-border flex flex-row gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowLogModal(false)} className="flex-1 h-9 rounded-sm text-[10px] font-bold uppercase tracking-widest shadow-none">Cancel</Button>
                            <Button type="submit" disabled={form.processing} className="flex-1 h-9 rounded-sm text-[10px] font-bold uppercase tracking-widest shadow-none">Save Log</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

TeacherProgressShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Instructor', href: '#' }, { title: 'Learning Progress', href: '/teacher/progress' }, { title: 'Batch Details', href: '#' }]}>{page}</AppLayout>
);
