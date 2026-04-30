import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import TeacherLayout from '@/layouts/teacher-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Calendar, ChevronLeft, Layout, Save, Edit2, Plus, Video, ExternalLink, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function TeacherProgressShow({ batch }: { batch: any }) {
    const [selectedChapter, setSelectedChapter] = useState<any>(null);
    const [showLogModal, setShowLogModal] = useState(false);

    const form = useForm({
        course_chapter_id: '',
        date: new Date().toISOString().split('T')[0],
        remarks: '',
        status: 'delivered',
        video_url: '',
    });

    // Flatten all chapters from all modules into a single sorted list
    const allChapters = batch.course.modules.flatMap((module: any) => 
        module.chapters.map((chapter: any) => ({
            ...chapter,
            module_title: module.title
        }))
    ).sort((a: any, b: any) => a.sort_order - b.sort_order);

    const openLogModal = (chapter: any) => {
        setSelectedChapter(chapter);
        const log = chapter.learning_logs?.[0];
        form.setData({
            course_chapter_id: chapter.id.toString(),
            date: log ? log.date : new Date().toISOString().split('T')[0],
            remarks: log ? log.remarks : '',
            status: log ? log.status : 'delivered',
            video_url: log ? (log.video_url || '') : '',
        });
        setShowLogModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/teacher/batches/${batch.id}/progress`, {
            onSuccess: () => setShowLogModal(false),
            preserveScroll: true
        });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long' });
    };

    return (
        <>
            <Head title={`Learning Ledger | ${batch.name}`} />
            
            <div className="w-full p-4 lg:p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div className="flex items-center gap-3">
                        <Link href="/teacher/progress" className="size-8 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                            <ChevronLeft className="size-4" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <Layout className="size-4 text-muted-foreground" /> Learning Ledger
                            </h1>
                            <p className="text-xs text-muted-foreground uppercase tracking-tight">{batch.name} • Full Curriculum View</p>
                        </div>
                    </div>
                </div>

                {/* Flat Spreadsheet Table */}
                <div className="rounded-sm border border-border bg-background overflow-hidden shadow-sm">
                    <Table className="border-collapse">
                        <TableHeader>
                            <TableRow className="bg-slate-50 hover:bg-slate-50 divide-x divide-border border-b border-border">
                                <TableHead className="w-[120px] h-9 px-3 text-[11px] font-bold text-slate-800 uppercase tracking-tight">Date</TableHead>
                                <TableHead className="h-9 px-3 text-[11px] font-bold text-slate-800 uppercase tracking-tight">Topic</TableHead>
                                <TableHead className="w-[300px] h-9 px-3 text-[11px] font-bold text-slate-800 uppercase tracking-tight">Video Url</TableHead>
                                <TableHead className="w-[80px] h-9 px-3 text-[11px] font-bold text-slate-800 uppercase tracking-tight text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-border">
                            {allChapters.map((chapter: any) => {
                                const log = chapter.learning_logs?.[0];
                                return (
                                    <TableRow key={chapter.id} className="divide-x divide-border hover:bg-muted/5 group transition-colors">
                                        <TableCell className="py-2 px-3 align-top whitespace-nowrap">
                                            <div className="text-[11px] font-medium text-slate-600 tabular-nums">
                                                {log ? formatDate(log.date) : ''}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2 px-3 align-top">
                                            <div className="space-y-1">
                                                <div className="text-[11px] font-semibold text-foreground">
                                                    {chapter.title}
                                                </div>
                                                {log && log.remarks && (
                                                    <div className="text-[11px] text-muted-foreground leading-relaxed italic pr-4">
                                                        {log.remarks}
                                                    </div>
                                                )}
                                                {!log && (
                                                    <div className="text-[10px] text-muted-foreground/30  font-medium">Pending Delivery</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2 px-3 align-top">
                                            {log && log.video_url ? (
                                                <a 
                                                    href={log.video_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-[11px] text-primary hover:underline flex items-center gap-1.5 break-all leading-relaxed"
                                                >
                                                    <Video className="size-3 shrink-0" />
                                                    {log.video_url}
                                                </a>
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground/10 italic">Not Linked</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-2 px-3 text-right align-top">
                                            <Button 
                                                onClick={() => openLogModal(chapter)}
                                                variant="outline" 
                                                size="sm" 
                                                className="h-7 px-2 rounded-sm text-[10px] font-bold  text-muted-foreground hover:text-primary transition-all border-border/50 hover:bg-muted/50 shadow-none"
                                            >
                                                {log ? <Edit2 className="size-3 mr-1" /> : <Plus className="size-3 mr-1" />}
                                                {log ? 'Edit' : 'Add'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Entry Modal */}
            <Dialog open={showLogModal} onOpenChange={setShowLogModal}>
                <DialogContent className="max-w-md rounded-sm p-0 overflow-hidden border border-border shadow-none">
                    <DialogHeader className="px-5 py-4 border-b border-border bg-muted/5">
                        <DialogTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <Save className="size-4 text-primary" /> Session Delivery Entry
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="p-4 rounded-sm bg-slate-50 border border-border space-y-1">
                            <div className="text-[10px] font-bold text-slate-500 ">Syllabus Topic</div>
                            <div className="text-sm font-bold text-foreground">{selectedChapter?.title}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground ">Execution Date</Label>
                                <Input 
                                    type="date" 
                                    className="h-10 rounded-sm text-sm border-border shadow-none focus-visible:ring-primary/20" 
                                    value={form.data.date} 
                                    onChange={e => form.setData('date', e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground ">Status</Label>
                                <Select value={form.data.status} onValueChange={v => form.setData('status', v)}>
                                    <SelectTrigger className="h-10 rounded-sm text-sm border-border shadow-none focus:ring-primary/20">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-sm border-border">
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="skipped">Skipped</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-muted-foreground ">Session Summary (Remarks)</Label>
                            <Textarea 
                                className="min-h-[100px] rounded-sm text-sm shadow-none resize-none border-border p-4 leading-relaxed focus-visible:ring-primary/20" 
                                value={form.data.remarks} 
                                onChange={e => form.setData('remarks', e.target.value)} 
                                required 
                                placeholder="Highlight key concepts covered..." 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-muted-foreground  flex items-center gap-1.5">
                                <Video className="size-3" /> Video Recording URL
                            </Label>
                            <Input 
                                type="url" 
                                className="h-10 rounded-sm text-sm border-border shadow-none focus-visible:ring-primary/20" 
                                value={form.data.video_url} 
                                onChange={e => form.setData('video_url', e.target.value)} 
                                placeholder="Link to session recording..." 
                            />
                        </div>

                        <DialogFooter className="pt-6 border-t border-border flex flex-row gap-3">
                            <Button type="button" variant="ghost" onClick={() => setShowLogModal(false)} className="flex-1 h-10 rounded-sm text-[10px] font-bold  shadow-none">Cancel</Button>
                            <Button type="submit" disabled={form.processing} className="flex-1 h-10 rounded-sm text-[10px] font-bold  shadow-none gap-2">
                                <Save className="size-3.5" /> Save Entry
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

TeacherProgressShow.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Instructor', href: '#' }, { title: 'Learning Progress', href: '/teacher/progress' }, { title: 'Learning Ledger', href: '#' }]}>
        {page}
    </TeacherLayout>
);
;
