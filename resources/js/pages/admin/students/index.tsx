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
                    <div className="size-10 rounded bg-primary/5 border border-primary/10 flex items-center justify-center font-black text-primary text-xs shrink-0 ">
                        <User className="size-4" />
                    </div>
                    <div>
                        <div className="font-bold text-sm text-foreground">{student.name}</div>
                        <div className="text-[10px] text-muted-foreground font-bold  tracking-tight">{student.email}</div>
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
                    <BookOpen className="size-3 text-muted-foreground" />
                    <span className="font-bold text-xs">{student.enrollments.length} Programs</span>
                </div>
            )
        },
        {
            key: 'created_at',
            label: 'Joined Date',
            sortable: true,
            render: (student) => (
                <span className="text-xs text-muted-foreground">{new Date(student.created_at).toLocaleDateString()}</span>
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
