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

import { cn } from '@/lib/utils';

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
            label: 'Asset Registry',
            sortable: true,
            render: (course) => (
                <div className="flex items-center gap-2.5 py-1">
                    <div className="size-8 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                        <BookOpen className="size-3" />
                    </div>
                    <div>
                        <div className="font-black text-[12px] text-slate-900 leading-tight uppercase tracking-tight">{course.title}</div>
                        <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-0.5 opacity-60 italic">{course.slug}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'price',
            label: 'Yield Cost',
            sortable: true,
            render: (course) => <span className="font-black text-slate-900 text-[12px] uppercase tracking-tighter">₹{course.price.toLocaleString()}</span>
        },
        {
            key: 'enrollments_count',
            label: 'Active Nodes',
            sortable: true,
            render: (course) => (
                <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 bg-primary/5 text-primary rounded-sm border border-primary/10 text-[9px] font-black uppercase tracking-widest">
                        {course.enrollments_count} Users
                    </div>
                </div>
            )
        },
        {
            key: 'is_active',
            label: 'Protocol Status',
            sortable: true,
            render: (course) => (
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "size-1.5 rounded-none",
                        course.is_active ? "bg-emerald-500" : "bg-slate-300"
                    )} />
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-[0.2em]",
                        course.is_active ? "text-emerald-600" : "text-slate-400"
                    )}>
                        {course.is_active ? 'Online' : 'Offline'}
                    </span>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Course Assets" />
            
            <div className="w-full p-4 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-border pb-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-1.5">
                            <Layers className="size-3" /> Asset Catalog
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Curriculum Management</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Synchronizing academic programs and deployment metrics.</p>
                    </div>
                </div>

                <div className="bg-background rounded-sm border border-border overflow-hidden shadow-none">
                    <AdminDataTable 
                        title="Program Registry"
                        subtitle="Orchestrating academic deliverables and asset valuation"
                        data={courses}
                        columns={columns}
                        searchPlaceholder="Filter catalog by asset metadata..."
                        onAdd={handleAdd}
                        addLabel="Initialize Program"
                        actions={(course) => (
                            <div className="flex items-center justify-end gap-1.5">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-7 rounded-sm hover:bg-primary/10 hover:text-primary transition-all shadow-none"
                                    onClick={() => handleEdit(course)}
                                >
                                    <Edit2 className="size-3" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-7 rounded-sm hover:bg-rose-50 hover:text-rose-600 transition-all shadow-none"
                                    onClick={() => handleDelete(course.id)}
                                >
                                    <Trash2 className="size-3" />
                                </Button>
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* Course Add/Edit Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-md rounded-sm p-0 overflow-hidden border border-border shadow-none">
                    <DialogHeader className="p-4 bg-muted/20 border-b border-border">
                        <DialogTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-600">
                            {editingCourse ? 'Modify Protocol' : 'Initialize Asset'}
                        </DialogTitle>
                        <DialogDescription className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">
                            {editingCourse ? 'Updating structural metadata and valuation' : 'Registering new academic program in core catalog'}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-background">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Asset Title</Label>
                                <Input 
                                    className="h-9 rounded-sm border-border bg-muted/10 font-bold text-xs shadow-none uppercase placeholder:text-muted-foreground/30"
                                    value={form.data.title}
                                    onChange={e => form.setData('title', e.target.value)}
                                    placeholder="PROGRAM_IDENTIFIER_ALPHA"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Yield Valuation (₹)</Label>
                                    <Input 
                                        type="number"
                                        className="h-9 rounded-sm border-border bg-muted/10 font-black text-xs shadow-none"
                                        value={form.data.price}
                                        onChange={e => form.setData('price', e.target.value)}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div className="space-y-1 flex flex-col">
                                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Registry Status</Label>
                                    <div className="flex items-center gap-2 bg-muted/10 h-9 px-3 rounded-sm border border-border mt-0.5">
                                        <Checkbox 
                                            id="course_active"
                                            checked={form.data.is_active}
                                            onCheckedChange={(checked) => form.setData('is_active', !!checked)}
                                            className="rounded-sm border-border shadow-none"
                                        />
                                        <label htmlFor="course_active" className="text-[9px] font-black uppercase tracking-widest text-slate-500 cursor-pointer select-none">
                                            {form.data.is_active ? 'Online' : 'Offline'}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Protocol Specifications</Label>
                                <Textarea 
                                    className="min-h-[100px] rounded-sm border-border bg-muted/10 font-medium text-xs shadow-none resize-none"
                                    value={form.data.description}
                                    onChange={e => form.setData('description', e.target.value)}
                                    placeholder="Detailed execution protocol and learning objectives..."
                                    required
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setShowModal(false)}
                                className="flex-1 h-9 rounded-sm font-black uppercase tracking-widest text-[9px] border border-border"
                            >
                                Abort
                            </Button>
                            <Button 
                                type="submit"
                                disabled={form.processing}
                                className="flex-1 h-9 rounded-sm font-black uppercase tracking-widest text-[9px] bg-primary text-white hover:bg-primary/90 shadow-none"
                            >
                                {form.processing ? 'Syncing...' : (editingCourse ? 'Update Module' : 'Commit Asset')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminCourseIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Asset Protocol', href: '#' }, { title: 'Curriculum Management', href: '/admin/courses' }]}>
        {page}
    </AppLayout>
);
