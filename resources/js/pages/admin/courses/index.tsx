import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Plus, Edit2, Trash2, BookOpen, Layers } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export default function AdminCourseIndex({ courses }: { courses: any[] }) {
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<any>(null);

    const { delete: destroy } = useForm();
    const form = useForm({
        title: '',
        description: '',
        price: '',
        is_active: true,
    });

    const handleAdd = () => {
        setEditingCourse(null);
        form.reset();
        form.setData({
            title: '',
            description: '',
            price: '',
            is_active: true,
        });
        setShowModal(true);
    };

    const handleEdit = (course: any) => {
        setEditingCourse(course);
        form.setData({
            title: course.title,
            description: course.description,
            price: course.price.toString(),
            is_active: !!course.is_active,
        });
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this course?')) {
            destroy(`/admin/courses/${id}`);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCourse) {
            form.patch(`/admin/courses/${editingCourse.id}`, {
                onSuccess: () => setShowModal(false),
            });
        } else {
            form.post('/admin/courses', {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const columns: Column<any>[] = [
        {
            key: 'title',
            label: 'Course Info',
            sortable: true,
            render: (course) => (
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded bg-primary/5 border border-primary/10 flex items-center justify-center font-black text-primary text-xs shrink-0 ">
                        {course.title[0]}
                    </div>
                    <div>
                        <div className="font-bold text-sm text-foreground">{course.title}</div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{course.slug}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'price',
            label: 'Price',
            sortable: true,
            render: (course) => <span className="font-bold">₹{course.price}</span>
        },
        {
            key: 'enrollments_count',
            label: 'Learners',
            sortable: true,
            render: (course) => (
                <div className="px-2 py-0.5 bg-muted rounded text-[10px] font-black uppercase inline-block">
                    {course.enrollments_count} Enrolled
                </div>
            )
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (course) => (
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "size-2 rounded-full",
                        course.is_active ? "bg-green-500" : "bg-muted"
                    )} />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        {course.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Manage Courses" />
            
            <div className="w-full p-4 lg:p-6">
                <AdminDataTable 
                    title="Course Catalog"
                    subtitle="Manage and organize your academic programs"
                    data={courses}
                    columns={columns}
                    searchPlaceholder="Search courses..."
                    onAdd={handleAdd}
                    addLabel="Add Course"
                    actions={(course) => (
                        <div className="flex items-center justify-end gap-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-8 rounded hover:bg-primary/10 hover:text-primary transition-colors"
                                onClick={() => handleEdit(course)}
                            >
                                <Edit2 className="size-3.5" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-8 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                                onClick={() => handleDelete(course.id)}
                            >
                                <Trash2 className="size-3.5" />
                            </Button>
                        </div>
                    )}
                />
            </div>

            {/* Course Add/Edit Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-[500px] rounded-sm p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-muted/5 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <BookOpen className="size-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-black uppercase tracking-tight">
                                    {editingCourse ? 'Edit Course' : 'Create New Course'}
                                </DialogTitle>
                                <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                                    {editingCourse ? 'Update course details and pricing' : 'Add a new academic program to the catalog'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-background">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Course Title</Label>
                                <Input 
                                    className="h-10 rounded-sm border-border bg-muted/10 text-xs font-bold"
                                    value={form.data.title}
                                    onChange={e => form.setData('title', e.target.value)}
                                    placeholder="e.g. Advanced React Architecture"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Price (₹)</Label>
                                    <Input 
                                        type="number"
                                        className="h-10 rounded-sm border-border bg-muted/10 text-xs font-bold"
                                        value={form.data.price}
                                        onChange={e => form.setData('price', e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5 flex flex-col">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-3">Status</Label>
                                    <div className="flex items-center gap-2">
                                        <Checkbox 
                                            id="course_active"
                                            checked={form.data.is_active}
                                            onCheckedChange={(checked) => form.setData('is_active', !!checked)}
                                        />
                                        <label htmlFor="course_active" className="text-[10px] font-bold uppercase text-muted-foreground cursor-pointer">
                                            {form.data.is_active ? 'Active' : 'Inactive'}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Description</Label>
                                <Textarea 
                                    className="min-h-[120px] rounded-sm border-border bg-muted/10 text-xs font-medium resize-none"
                                    value={form.data.description}
                                    onChange={e => form.setData('description', e.target.value)}
                                    placeholder="Briefly describe what students will learn..."
                                    required
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-6 mt-6 border-t border-border flex flex-row gap-2 sm:justify-end">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setShowModal(false)}
                                className="h-10 rounded-sm font-black uppercase tracking-widest text-[9px] px-6"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={form.processing}
                                className="h-10 rounded-sm font-black uppercase tracking-widest text-[9px] px-8 bg-primary shadow-lg shadow-primary/10"
                            >
                                {form.processing ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

AdminCourseIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Manage Courses', href: '/admin/courses' }]}>
        {page}
    </AppLayout>
);
