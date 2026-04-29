import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { User, BookOpen, ChevronRight, Users } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { cn } from '@/lib/utils';

export default function AdminStudentIndex({ students }: { students: any[] }) {
    const columns: Column<any>[] = [
        {
            key: 'name',
            label: 'NODE IDENTIFICATION',
            sortable: true,
            render: (student) => (
                <div className="flex items-center gap-2.5 py-1">
                    <div className="size-8 rounded-sm bg-muted/20 border border-border flex items-center justify-center text-muted-foreground/40 shrink-0">
                        <User className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                        <div className="font-black text-[12px] text-slate-900 leading-tight uppercase tracking-tight truncate">{student.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8px] font-black text-primary/80 uppercase tracking-[0.2em] bg-primary/5 px-1 py-0.5 border border-primary/10 rounded-sm leading-none">
                                ID_{student.id.toString().padStart(4, '0')}
                            </span>
                            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest truncate opacity-60 leading-none">{student.email}</span>
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
                <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-sm bg-muted/10 border border-border flex items-center justify-center shrink-0">
                        <BookOpen className="size-3 text-muted-foreground/40" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-900 tracking-tighter uppercase">{student.enrollments.length} UNITS</span>
                        <span className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest mt-0.5">Active Assets</span>
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
                    <span className="text-[11px] font-black text-slate-900 tracking-tight uppercase">
                        {new Date(student.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest mt-0.5">Entry Date</span>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Learner Nodes" />
            
            <div className="w-full p-4 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-border pb-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-1.5">
                            <Users className="size-2.5" /> Learner Registry
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Student Database</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">
                            System-level management of learner nodes and curriculum allocation traces.
                        </p>
                    </div>
                </div>

                <div className="bg-background rounded-sm border border-border overflow-hidden shadow-none">
                    <AdminDataTable 
                        title="Student Registry"
                        subtitle="Centralized ledger of all active student profiles"
                        data={students}
                        columns={columns}
                        searchPlaceholder="Filter registry by node name or email..."
                        actions={(student) => (
                            <div className="flex items-center justify-end">
                                <Button asChild variant="ghost" className="h-7 px-2.5 rounded-sm hover:bg-muted/30 border border-transparent hover:border-border transition-all group shadow-none">
                                    <Link href={`/admin/students/${student.id}`} className="flex items-center gap-1.5">
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Access Node</span>
                                        <ChevronRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    />
                </div>
            </div>
        </>
    );
}

AdminStudentIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'System Control', href: '#' }, { title: 'Student Registry', href: '/admin/students' }]}>
        {page}
    </AppLayout>
);
