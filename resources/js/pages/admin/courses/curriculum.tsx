import { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Plus, Edit2, Trash2, BookOpen, Layers, ChevronLeft, Layout } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export default function AdminCourseCurriculum({ course }: { course: any }) {
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showChapterModal, setShowChapterModal] = useState(false);
    const [editingModule, setEditingModule] = useState<any>(null);
    const [editingChapter, setEditingChapter] = useState<any>(null);
    const [targetModuleId, setTargetModuleId] = useState<number | null>(null);

    const moduleForm = useForm({ title: '' });
    const chapterForm = useForm({ title: '', description: '' });

    const handleAddModule = () => {
        setEditingModule(null);
        moduleForm.reset();
        setShowModuleModal(true);
    };

    const handleEditModule = (module: any) => {
        setEditingModule(module);
        moduleForm.setData('title', module.title);
        setShowModuleModal(true);
    };

    const handleAddChapter = (moduleId: number) => {
        setTargetModuleId(moduleId);
        setEditingChapter(null);
        chapterForm.reset();
        setShowChapterModal(true);
    };

    const handleEditChapter = (chapter: any) => {
        setEditingChapter(chapter);
        chapterForm.setData({ title: chapter.title, description: chapter.description || '' });
        setShowChapterModal(true);
    };

    const handleModuleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingModule) {
            moduleForm.patch(`/admin/academic/modules/${editingModule.id}`, { onSuccess: () => setShowModuleModal(false) });
        } else {
            moduleForm.post(`/admin/academic/courses/${course.id}/modules`, { onSuccess: () => setShowModuleModal(false) });
        }
    };

    const handleChapterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingChapter) {
            chapterForm.patch(`/admin/academic/chapters/${editingChapter.id}`, { onSuccess: () => setShowChapterModal(false) });
        } else {
            chapterForm.post(`/admin/academic/modules/${targetModuleId}/chapters`, { onSuccess: () => setShowChapterModal(false) });
        }
    };

    const deleteModule = (id: number) => { if (confirm('Delete module and all its chapters?')) router.delete(`/admin/academic/modules/${id}`); };
    const deleteChapter = (id: number) => { if (confirm('Delete this chapter?')) router.delete(`/admin/academic/chapters/${id}`); };

    return (
        <>
            <Head title={`Curriculum | ${course.title}`} />
            
            <div className="w-full p-4 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Link href="/admin/courses" className="size-7 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                                <ChevronLeft className="size-3.5" />
                            </Link>
                            <div>
                                <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <Layout className="size-4 text-primary" /> Curriculum Architecture
                                </h1>
                                <p className="text-xs text-muted-foreground">{course.title} • {course.modules.length} Modules</p>
                            </div>
                        </div>
                    </div>
                    
                    <Button onClick={handleAddModule} className="rounded-sm h-8 px-3 text-xs shadow-none">
                        <Plus className="size-3.5 mr-1.5" /> Add New Module
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {course.modules.map((module: any, mIndex: number) => (
                        <div key={module.id} className="rounded-sm border border-border bg-background overflow-hidden shadow-sm group">
                            <div className="flex items-center justify-between px-4 py-3 bg-muted/5 border-b border-border group-hover:bg-muted/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="size-8 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold text-xs tabular-nums">
                                        {mIndex + 1}
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            {module.title}
                                            <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/5 rounded-sm border border-primary/10 uppercase tracking-tight">Module</span>
                                        </h3>
                                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{module.chapters.length} Chapters Provisioned</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="size-8 rounded-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all" onClick={() => handleEditModule(module)}>
                                        <Edit2 className="size-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="size-8 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all" onClick={() => deleteModule(module.id)}>
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-8 px-3 rounded-sm text-xs border-border shadow-none ml-2 bg-background" onClick={() => handleAddChapter(module.id)}>
                                        <Plus className="size-3 mr-1.5" /> Add Chapter
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="divide-y divide-border/40">
                                {module.chapters.map((chapter: any, cIndex: number) => (
                                    <div key={chapter.id} className="flex items-center justify-between p-4 bg-background hover:bg-muted/5 transition-all group/chapter">
                                        <div className="flex items-center gap-4">
                                            <div className="size-7 rounded-sm bg-muted/30 border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground group-hover/chapter:bg-primary/5 group-hover/chapter:border-primary/10 group-hover/chapter:text-primary transition-all tabular-nums">
                                                {mIndex + 1}.{cIndex + 1}
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="text-xs font-semibold text-foreground group-hover/chapter:text-primary transition-all">{chapter.title}</div>
                                                {chapter.description && <p className="text-[10px] text-muted-foreground/60 line-clamp-1 italic">{chapter.description}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover/chapter:opacity-100 transition-all">
                                            <Button variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all" onClick={() => handleEditChapter(chapter)}>
                                                <Edit2 className="size-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all" onClick={() => deleteChapter(chapter.id)}>
                                                <Trash2 className="size-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {module.chapters.length === 0 && (
                                    <div className="py-10 text-center bg-muted/5">
                                        <Layers className="size-8 text-muted-foreground/20 mx-auto mb-2" strokeWidth={1} />
                                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Empty Module Unit</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {course.modules.length === 0 && (
                        <div className="py-24 text-center rounded-sm border border-dashed border-border/80 bg-muted/5">
                            <Layers className="size-12 text-muted-foreground/20 mx-auto mb-4" strokeWidth={1} />
                            <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Curriculum Foundation Missing</h2>
                            <p className="text-[10px] font-medium text-muted-foreground/40 uppercase mt-1 italic">Begin by defining structural modules for this course.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Module Modal */}
            <Dialog open={showModuleModal} onOpenChange={setShowModuleModal}>
                <DialogContent className="max-w-md rounded-sm p-0 overflow-hidden border border-border shadow-none">
                    <DialogHeader className="px-4 py-3 border-b border-border bg-muted/5">
                        <DialogTitle className="text-sm font-semibold">{editingModule ? 'Edit Module' : 'Add New Module'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleModuleSubmit} className="p-4 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground">Module Title</Label>
                            <Input className="h-9 rounded-sm text-xs border-border shadow-none" value={moduleForm.data.title} onChange={e => moduleForm.setData('title', e.target.value)} required placeholder="e.g. Fundamental Logic and Syntax" />
                        </div>
                        <DialogFooter className="pt-4 border-t border-border flex flex-row gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowModuleModal(false)} className="flex-1 h-9 rounded-sm text-xs shadow-none">Cancel</Button>
                            <Button type="submit" disabled={moduleForm.processing} className="flex-1 h-9 rounded-sm text-xs shadow-none">Save Module</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Chapter Modal */}
            <Dialog open={showChapterModal} onOpenChange={setShowChapterModal}>
                <DialogContent className="max-w-md rounded-sm p-0 overflow-hidden border border-border shadow-none">
                    <DialogHeader className="px-4 py-3 border-b border-border bg-muted/5">
                        <DialogTitle className="text-sm font-semibold">{editingChapter ? 'Edit Chapter' : 'Add New Chapter'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleChapterSubmit} className="p-4 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground">Chapter Title</Label>
                            <Input className="h-9 rounded-sm text-xs border-border shadow-none" value={chapterForm.data.title} onChange={e => chapterForm.setData('title', e.target.value)} required placeholder="e.g. Conditional Branching" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground">Description (Optional)</Label>
                            <Textarea className="min-h-[100px] rounded-sm text-xs border-border shadow-none resize-none p-3 leading-relaxed" value={chapterForm.data.description} onChange={e => chapterForm.setData('description', e.target.value)} placeholder="Define learning objectives..." />
                        </div>
                        <DialogFooter className="pt-4 border-t border-border flex flex-row gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowChapterModal(false)} className="flex-1 h-9 rounded-sm text-xs shadow-none">Cancel</Button>
                            <Button type="submit" disabled={chapterForm.processing} className="flex-1 h-9 rounded-sm text-xs shadow-none">Save Chapter</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminCourseCurriculum.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Courses', href: '/admin/courses' }, { title: 'Curriculum', href: '#' }]}>{page}</AppLayout>
);
