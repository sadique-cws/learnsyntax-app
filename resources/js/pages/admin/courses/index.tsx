import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Plus, Edit2, Trash2, BookOpen, Layers, Eye } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export default function AdminCourseIndex({ courses }: { courses: any[] }) {
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<any>(null);
    const { delete: destroy } = useForm();
    const form = useForm({ title: '', description: '', price: '', is_active: true });

    const handleAdd = () => { setEditingCourse(null); form.reset(); form.setData({ title: '', description: '', price: '', is_active: true }); setShowModal(true); };
    const handleEdit = (course: any) => { setEditingCourse(course); form.setData({ title: course.title, description: course.description, price: course.price.toString(), is_active: !!course.is_active }); setShowModal(true); };
    const handleDelete = (id: number) => { if (confirm('Delete this course?')) destroy(`/admin/courses/${id}`); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCourse) form.patch(`/admin/courses/${editingCourse.id}`, { onSuccess: () => setShowModal(false) });
        else form.post('/admin/courses', { onSuccess: () => setShowModal(false) });
    };

    const columns: Column<any>[] = [
        {
            key: 'title', label: 'Course', sortable: true,
            render: (course) => (
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
                        <BookOpen className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                        <a href={`/courses/${course.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">
                            {course.title}
                        </a>
                        <div className="text-xs text-muted-foreground truncate">{course.slug}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'price', label: 'Price', sortable: true,
            render: (course) => <span className="text-sm font-medium text-foreground tabular-nums">₹{course.price.toLocaleString()}</span>
        },
        {
            key: 'enrollments_count', label: 'Enrollments', sortable: true,
            render: (course) => (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100 tabular-nums">
                    {course.enrollments_count}
                </span>
            )
        },
        {
            key: 'is_active', label: 'Status', sortable: true,
            render: (course) => (
                <div className="flex items-center gap-1.5">
                    <div className={cn("size-1.5 rounded-full", course.is_active ? "bg-emerald-500" : "bg-slate-300")} />
                    <span className={cn("text-xs font-medium", course.is_active ? "text-emerald-600" : "text-muted-foreground")}>
                        {course.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Courses" />
            <div className="w-full p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Courses</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{courses.length} courses in catalog</p>
                    </div>
                    <Button onClick={handleAdd} size="sm" className="h-8 px-3 rounded-sm text-xs font-medium shadow-none">
                        <Plus className="size-3.5 mr-1.5" /> New Course
                    </Button>
                </div>
                <div className="rounded-sm border border-border overflow-hidden">
                    <AdminDataTable title="All Courses" data={courses} columns={columns} searchPlaceholder="Search courses..."
                        actions={(course) => (
                            <div className="flex items-center justify-end gap-1">
                                <Button asChild variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50" title="View Public Page">
                                    <a href={`/courses/${course.slug}`} target="_blank" rel="noopener noreferrer">
                                        <Eye className="size-3" />
                                    </a>
                                </Button>
                                <Button variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50" title="Curriculum" onClick={() => router.get(`/admin/academic/courses/${course.id}/curriculum`)}>
                                    <Layers className="size-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => handleEdit(course)}>
                                    <Edit2 className="size-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5" onClick={() => handleDelete(course.id)}>
                                    <Trash2 className="size-3" />
                                </Button>
                            </div>
                        )}
                    />
                </div>
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-md rounded-sm p-0 overflow-hidden border border-border shadow-none">
                    <DialogHeader className="px-4 py-3 border-b border-border">
                        <DialogTitle className="text-sm font-semibold">{editingCourse ? 'Edit Course' : 'New Course'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="p-4 space-y-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Title</Label>
                            <Input className="h-9 rounded-sm text-sm shadow-none" value={form.data.title} onChange={e => form.setData('title', e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Price (₹)</Label>
                                <Input type="number" className="h-9 rounded-sm text-sm shadow-none" value={form.data.price} onChange={e => form.setData('price', e.target.value)} required />
                            </div>
                            <div className="space-y-1 flex flex-col">
                                <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                                <div className="flex items-center gap-2 h-9 px-3 rounded-sm border border-border">
                                    <Checkbox id="course_active" checked={form.data.is_active} onCheckedChange={(checked) => form.setData('is_active', !!checked)} className="rounded-sm" />
                                    <label htmlFor="course_active" className="text-xs font-medium cursor-pointer">{form.data.is_active ? 'Active' : 'Inactive'}</label>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                            <Textarea className="min-h-[80px] rounded-sm text-sm shadow-none resize-none" value={form.data.description} onChange={e => form.setData('description', e.target.value)} required />
                        </div>
                        <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 h-9 rounded-sm text-xs shadow-none">Cancel</Button>
                            <Button type="submit" disabled={form.processing} className="flex-1 h-9 rounded-sm text-xs shadow-none">{editingCourse ? 'Update' : 'Create'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminCourseIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Courses', href: '/admin/courses' }]}>{page}</AppLayout>
);
