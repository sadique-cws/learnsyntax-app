import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { CheckCircle2, User, BookOpen, TrendingUp, Award, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QualifiedStudents({ qualified }: { qualified: any[] }) {
    const { post, processing } = useForm();

    const handleGenerate = (enrollmentId: number) => {
        post(`/admin/enrollments/${enrollmentId}/certificate`, {
            preserveScroll: true
        });
    };

    const columns: Column<any>[] = [
        {
            key: 'student',
            label: 'NODE IDENTIFICATION',
            render: (enrollment) => (
                <div className="flex items-center gap-4 py-1">
                    <div className="size-11 rounded-xl bg-muted/20 border border-border flex items-center justify-center text-primary/60 shrink-0">
                        <User className="size-5.5" />
                    </div>
                    <div className="min-w-0">
                        <div className="font-black text-[13px] text-foreground uppercase tracking-tight leading-tight truncate">{enrollment.user.name}</div>
                        <div className="text-[10px] text-muted-foreground font-bold lowercase tracking-tight truncate mt-0.5">{enrollment.user.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'course',
            label: 'TARGET PROTOCOL',
            render: (enrollment) => (
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-muted/10 border border-border flex items-center justify-center shrink-0">
                        <BookOpen className="size-3.5 text-muted-foreground/40" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-tight">{enrollment.course.title}</span>
                </div>
            )
        },
        {
            key: 'performance',
            label: 'PRECISION METRIC',
            render: (enrollment) => (
                <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-black rounded border border-primary/20 uppercase tracking-widest">
                        {Math.round(enrollment.overall_average)}%
                    </div>
                    <TrendingUp className="size-3 text-primary/40" />
                </div>
            )
        },
        {
            key: 'actions',
            label: 'ISSUANCE PROTOCOL',
            render: (enrollment) => (
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => handleGenerate(enrollment.id)}
                        disabled={processing}
                        className="h-9 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest px-5 shadow-none hover:bg-primary/90 transition-all border-0"
                    >
                        {processing ? <Loader2 className="size-3.5 animate-spin mr-2" /> : <Award className="size-3.5 mr-2" />}
                        Generate Credential
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="size-9 rounded-lg hover:bg-muted/30 border border-transparent hover:border-border transition-all">
                        <Link href={`/admin/students/${enrollment.user_id}`}>
                            <ChevronRight className="size-4" />
                        </Link>
                    </Button>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="NODE_REGISTRY: QUALIFIED" />
            <div className="p-4 lg:p-6 w-full mx-auto space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-6 border border-border rounded-xl">
                    <div className="flex items-center gap-5">
                        <div className="size-16 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                            <ShieldCheck className="size-8" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-muted/10 border border-border text-muted-foreground/60 mb-2">
                                <CheckCircle2 className="size-3" /> System Verified
                            </div>
                            <h1 className="text-2xl font-black text-foreground uppercase tracking-tight leading-none">Qualified Node Registry</h1>
                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1.5 italic">Nodes eligible for credential generation (Threshold &gt;= 60%)</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card border-none">
                    <AdminDataTable 
                        data={qualified} 
                        columns={columns} 
                        searchPlaceholder="Filter registry by identity, protocol, or metric..."
                        title=""
                    />
                </div>
            </div>
        </>
    );
}

QualifiedStudents.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'SYSTEM_CONTROL', href: '#' }, { title: 'NODE_REGISTRY', href: '/admin/students' }, { title: 'VERIFIED_NODES', href: '#' }]}>
        {page}
    </AppLayout>
);
