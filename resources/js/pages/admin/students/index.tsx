import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { User, BookOpen, ChevronRight } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function AdminStudentIndex({ students }: { students: any[] }) {
    const columns: Column<any>[] = [
        {
            key: 'name',
            label: 'Student',
            sortable: true,
            render: (student) => (
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-md bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                        <User className="size-5 opacity-70" />
                    </div>
                    <div>
                        <div className="font-semibold text-sm text-foreground leading-tight">{student.name}</div>
                        <div className="text-[11px] text-muted-foreground font-medium mt-0.5">{student.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'enrollments_count',
            label: 'Courses',
            sortable: false,
            render: (student) => (
                <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-primary/40" />
                    <span className="font-medium text-xs text-muted-foreground"><span className="text-foreground font-semibold">{student.enrollments.length}</span> Programs</span>
                </div>
            )
        },
        {
            key: 'created_at',
            label: 'Joined Date',
            sortable: true,
            render: (student) => (
                <span className="text-[13px] font-medium text-muted-foreground/80">{new Date(student.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            )
        }
    ];

    return (
        <>
            <Head title="Manage Students" />
            
            <div className="w-full p-4 lg:p-6">
                <AdminDataTable 
                    title="Learners Directory"
                    subtitle="Manage student accounts and their course progress"
                    data={students}
                    columns={columns}
                    searchPlaceholder="Search students by name or email..."
                    actions={(student) => (
                        <div className="flex items-center justify-end gap-1">
                            <Button asChild variant="ghost" size="icon" className="size-8 rounded hover:bg-primary/10 hover:text-primary transition-colors">
                                <Link href={`/admin/students/${student.id}`}>
                                    <ChevronRight className="size-4" />
                                </Link>
                            </Button>
                        </div>
                    )}
                />
            </div>
        </>
    );
}

AdminStudentIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Students', href: '/admin/students' }]}>
        {page}
    </AppLayout>
);
