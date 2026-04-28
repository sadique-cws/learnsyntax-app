import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function AdminCourseIndex({ courses }: { courses: any[] }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this course?')) {
            destroy(`/admin/courses/${id}`);
        }
    };

    const columns: Column<any>[] = [
        {
            key: 'title',
            label: 'Course Info',
            sortable: true,
            render: (course) => (
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded bg-primary/5 border border-primary/10 flex items-center justify-center font-black text-primary text-xs shrink-0 uppercase">
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
                <div className="px-2 py-0.5 bg-muted rounded text-[10px] font-black uppercase tracking-tight inline-block">
                    {course.enrollments_count} Enrolled
                </div>
            )
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (course) => (
                <div className={cn(
                    "size-2 rounded-full",
                    course.is_active ? "bg-green-500" : "bg-muted"
                )} />
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
                    onAdd={() => {}} // Handle redirection or modal
                    addLabel="Add Course"
                    actions={(course) => (
                        <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="size-8 rounded hover:bg-primary/10 hover:text-primary transition-colors">
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
