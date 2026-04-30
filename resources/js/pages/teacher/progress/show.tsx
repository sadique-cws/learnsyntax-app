import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, Circle, Clock, MessageSquare, Calendar, ChevronRight, BookOpen, Layers, ChevronLeft, Layout } from 'lucide-react';
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
            
            <div className="w-full p-4 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Link href="/teacher/progress" className="size-7 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                                <ChevronLeft className="size-3.5" />
                            </Link>
                            <div>
                                <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <Layout className="size-4 text-primary" /> {batch.name}
                                </h1>
                                <p className="text-xs text-muted-foreground">{batch.course.title} • Registry Log</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-muted/20 px-4 py-2 rounded-sm border border-border">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Mastery</span>
                            <span className="text-base font-bold text-foreground tabular-nums">
                                {progressPercentage}%
                            </span>
                        </div>
                        <div className="w-px h-8 bg-border mx-1" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Delivered</span>
                            <span className="text-base font-bold text-primary tabular-nums">
                                {completedChapters}/{totalChapters}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {batch.course.modules.map((module: any, mIndex: number) => (
                        <div key={module.id} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-sm border border-primary/10 uppercase">
                                    Module {mIndex + 1}
                                </div>
                                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">{module.title}</h2>
                                <div className="flex-1 h-px bg-border/50" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {module.chapters.map((chapter: any) => {
                                    const isCompleted = chapter.learning_logs.length > 0;
                                    const log = chapter.learning_logs[0];

                                    return (
                                        <div 
                                            key={chapter.id} 
                                            className={cn(
                                                "group rounded-sm border p-4 transition-all relative overflow-hidden",
                                                isCompleted ? "bg-emerald-50/5 border-emerald-500/20" : "bg-background border-border hover:border-primary/30"
                                            )}
                                        >
                                            <div className="flex items-start justify-between gap-4 relative z-10">
                                                <div className="flex items-start gap-3">
                                                    <div className={cn(
                                                        "size-8 rounded-sm flex items-center justify-center shrink-0 border transition-all",
                                                        isCompleted ? "bg-emerald-500 text-white border-emerald-600" : "bg-muted text-muted-foreground/30 border-border"
                                                    )}>
                                                        {isCompleted ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className={cn(
                                                            "text-xs font-semibold leading-tight",
                                                            isCompleted ? "text-emerald-900" : "text-foreground"
                                                        )}>
                                                            {chapter.title}
                                                        </h4>
                                                        {isCompleted ? (
                                                            <div className="flex items-center gap-3 mt-1.5">
                                                                <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-700/60 uppercase">
                                                                    <Calendar className="size-3" />
                                                                    {new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                                </div>
                                                                <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-700/60 uppercase">
                                                                    <MessageSquare className="size-3" />
                                                                    Remarked
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-[10px] text-muted-foreground/40 mt-1 italic uppercase font-medium">Pending Delivery</p>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <Button 
                                                    onClick={() => openLogModal(chapter)}
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className={cn(
                                                        "h-8 px-2 rounded-sm text-[10px] font-bold uppercase",
                                                        isCompleted ? "text-emerald-700 hover:bg-emerald-500/10" : "text-primary hover:bg-primary/5"
                                                    )}
                                                >
                                                    {isCompleted ? 'Edit' : 'Log'}
                                                </Button>
                                            </div>

                                            {isCompleted && (
                                                <div className="mt-3 p-3 rounded-sm bg-emerald-500/5 border border-emerald-500/10 relative z-10">
                                                    <p className="text-[11px] text-emerald-800 leading-relaxed italic">
                                                        "{log.remarks}"
                                                    </p>
                                                </div>
                                            )}
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
                        <DialogTitle className="text-sm font-semibold">Operational Delivery Log</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        <div className="p-3 rounded-sm bg-primary/5 border border-primary/10">
                            <div className="text-[10px] font-bold text-primary uppercase mb-0.5">Active Unit</div>
                            <div className="text-xs font-semibold text-foreground">{selectedChapter?.title}</div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground">Delivery Date</Label>
                            <Input 
                                type="date" 
                                className="h-9 rounded-sm text-xs border-border shadow-none" 
                                value={form.data.date} 
                                onChange={e => form.setData('date', e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground">Teacher Remarks</Label>
                            <Textarea 
                                className="min-h-[120px] rounded-sm text-xs shadow-none resize-none border-border p-3 leading-relaxed" 
                                value={form.data.remarks} 
                                onChange={e => form.setData('remarks', e.target.value)} 
                                required 
                                placeholder="Describe content covered and student comprehension..." 
                            />
                        </div>

                        <DialogFooter className="pt-4 border-t border-border flex flex-row gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowLogModal(false)} className="flex-1 h-9 rounded-sm text-xs shadow-none">Cancel</Button>
                            <Button type="submit" disabled={form.processing} className="flex-1 h-9 rounded-sm text-xs shadow-none">Save Log</Button>
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
