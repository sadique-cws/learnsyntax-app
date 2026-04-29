import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { User, BookOpen, ChevronRight, Hash, Mail, CalendarDays } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { cn } from '@/lib/utils';

export default function AdminStudentIndex({ students }: { students: any[] }) {
    const columns: Column<any>[] = [
        {
            key: 'name',
            label: 'NODE IDENTIFICATION',
            sortable: true,
            render: (student) => (
                <div className="flex items-center gap-4 py-1">
                    <div className="size-11 rounded-xl bg-muted/20 border border-border flex items-center justify-center text-muted-foreground/40 shrink-0">
                        <User className="size-5.5" />
                    </div>
                    <div className="min-w-0">
                        <div className="font-black text-[13px] text-foreground leading-tight uppercase tracking-tight truncate">{student.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest bg-primary/5 px-1.5 py-0.5 border border-primary/10 rounded">
                                ID_{student.id.toString().padStart(4, '0')}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-bold truncate opacity-60 lowercase tracking-tight">{student.email}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'enrollments_count',
            label: 'ALLOCATION DENSITY',
            sortable: false,
            render: (student) => (
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-muted/10 border border-border flex items-center justify-center shrink-0">
                        <BookOpen className="size-3.5 text-muted-foreground/40" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black text-foreground tracking-tighter">{student.enrollments.length} UNITS</span>
                        <span className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest">Active Assets</span>
                    </div>
                </div>
            )
        },
        {
            key: 'created_at',
            label: 'REGISTRY TIMESTAMP',
            sortable: true,
            render: (student) => (
                <div className="flex flex-col">
                    <span className="text-[11px] font-black text-foreground tracking-tight uppercase">
                        {new Date(student.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">Entry Date</span>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="NODE_REGISTRY: STUDENTS" />
            
            <div className="w-full p-4 lg:p-6 space-y-6">
                <AdminDataTable 
                    title="STUDENT_NODE_REGISTRY"
                    subtitle="System-level management of learner nodes and curriculum allocation traces"
                    data={students}
                    columns={columns}
                    searchPlaceholder="Filter registry by node name or email..."
                    actions={(student) => (
                        <div className="flex items-center justify-end">
                            <Button asChild variant="ghost" className="h-9 px-4 rounded-lg hover:bg-muted/30 border border-transparent hover:border-border transition-all group">
                                <Link href={`/admin/students/${student.id}`} className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Access Node</span>
                                    <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
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
    <AppLayout breadcrumbs={[{ title: 'SYSTEM_CONTROL', href: '#' }, { title: 'NODE_REGISTRY', href: '/admin/students' }]}>
        {page}
    </AppLayout>
);
