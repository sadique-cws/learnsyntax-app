import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminCourseIndex({ courses }: { courses: any[] }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this course?')) {
            destroy(`/admin/courses/${id}`);
        }
    };

    return (
        <>
            <Head title="Manage Courses" />
            
            <div className="w-full p-4 lg:p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manage Courses</h1>
                        <p className="text-muted-foreground text-sm">Create and edit your programming courses.</p>
                    </div>
                    <Button className="rounded-lg shadow-none">
                        <Plus className="size-4 mr-2" />
                        Add Course
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {courses.map((course) => (
                        <Card key={course.id} className="border-border shadow-none rounded-xl overflow-hidden">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-lg bg-muted flex items-center justify-center font-bold text-muted-foreground">
                                        {course.title[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold">{course.title}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {course.enrollments_count} Students • ${course.price}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Edit2 className="size-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:bg-destructive/10" onClick={() => handleDelete(course.id)}>
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

AdminCourseIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Manage Courses', href: '/admin/courses' }]}>
        {page}
    </AppLayout>
);
