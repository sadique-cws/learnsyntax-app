import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { User, BookOpen, ChevronRight } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default function AdminStudentIndex({ students }: { students: any[] }) {
    const columns: Column<any>[] = [
        {
            key: 'name',
            label: 'Student',
            sortable: true,
            render: (student) => (
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <User className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{student.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{student.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'enrollments_count',
            label: 'Enrollments',
            sortable: false,
            render: (student) => (
                <div className="flex items-center gap-1.5">
                    <BookOpen className="size-3 text-muted-foreground/50" />
                    <span className="text-sm font-medium text-foreground tabular-nums">{student.enrollments.length}</span>
                    <span className="text-xs text-muted-foreground">courses</span>
                </div>
            )
        },
        {
            key: 'created_at',
            label: 'Registered',
            sortable: true,
            render: (student) => (
                <span className="text-xs text-muted-foreground tabular-nums">
                    {new Date(student.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            )
        }
    ];

    return (
        <>
            <Head title="Students" />
            
            <div className="w-full p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Students</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{students.length} registered students</p>
                    </div>
                </div>

                <div className="rounded-sm border border-border overflow-hidden">
                    <AdminDataTable 
                        title="All Students"
                        data={students}
                        columns={columns}
                        searchPlaceholder="Search by name or email..."
                        actions={(student) => (
                            <Button asChild variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50">
                                <Link href={`/admin/students/${student.id}`}>
                                    <ChevronRight className="size-3.5" />
                                </Link>
                            </Button>
                        )}
                    />
                </div>
            </div>
        </>
    );
}

AdminStudentIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Students', href: '/admin/students' }]}>
        {page}
    </AppLayout>
);
