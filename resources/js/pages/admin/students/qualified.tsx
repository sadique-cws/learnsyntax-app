import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { User, BookOpen, TrendingUp, Award, ChevronRight, Loader2 } from 'lucide-react';
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
            label: 'Student',
            render: (enrollment) => (
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <User className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{enrollment.user.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{enrollment.user.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'course',
            label: 'Course',
            render: (enrollment) => (
                <div className="flex items-center gap-1.5">
                    <BookOpen className="size-3 text-muted-foreground/50" />
                    <span className="text-sm font-medium text-foreground">{enrollment.course.title}</span>
                </div>
            )
        },
        {
            key: 'performance',
            label: 'Score',
            render: (enrollment) => (
                <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-100 tabular-nums">
                        <TrendingUp className="size-2.5" />
                        {Math.round(enrollment.overall_average)}%
                    </span>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Qualified Students" />
            <div className="w-full p-4 space-y-3">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">Qualified Students</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">{qualified.length} students eligible for certification (≥ 60% average)</p>
                </div>

                <div className="rounded-sm border border-border overflow-hidden">
                    <AdminDataTable 
                        data={qualified} 
                        columns={columns} 
                        title="Eligible Students"
                        searchPlaceholder="Search by name, email, or course..."
                        actions={(enrollment) => (
                            <div className="flex items-center justify-end gap-1">
                                <Button 
                                    onClick={() => handleGenerate(enrollment.id)}
                                    disabled={processing}
                                    size="sm"
                                    className="h-7 px-2.5 rounded-sm text-xs font-medium shadow-none"
                                >
                                    {processing ? <Loader2 className="size-3 animate-spin mr-1" /> : <Award className="size-3 mr-1" />}
                                    Issue Certificate
                                </Button>
                                <Button asChild variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50">
                                    <Link href={`/admin/students/${enrollment.user_id}`}>
                                        <ChevronRight className="size-3.5" />
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

QualifiedStudents.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Students', href: '/admin/students' }, { title: 'Qualified', href: '#' }]}>
        {page}
    </AppLayout>
);
