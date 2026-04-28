import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { CheckCircle2, User, BookOpen, TrendingUp, Award, ChevronRight, Loader2 } from 'lucide-react';
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
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-sm bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                        <User className="size-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black  tracking-tight">{enrollment.user.name}</span>
                        <span className="text-[9px] text-muted-foreground font-bold lowercase">{enrollment.user.email}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'course',
            label: 'Course',
            render: (enrollment) => (
                <div className="flex items-center gap-2">
                    <BookOpen className="size-3.5 text-primary/40" />
                    <span className="text-xs font-bold ">{enrollment.course.title}</span>
                </div>
            )
        },
        {
            key: 'performance',
            label: 'Score',
            render: (enrollment) => (
                <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-black rounded-sm border border-green-100">
                        {Math.round(enrollment.overall_average)}%
                    </div>
                    <TrendingUp className="size-3 text-green-500/50" />
                </div>
            )
        },
        {
            key: 'actions',
            label: 'Action',
            render: (enrollment) => (
                <div className="flex items-center gap-2">
                    <Button 
                        onClick={() => handleGenerate(enrollment.id)}
                        disabled={processing}
                        className="h-8 rounded-sm bg-primary text-[9px] font-black   px-4 shadow-lg shadow-primary/10"
                    >
                        {processing ? <Loader2 className="size-3 animate-spin mr-2" /> : <Award className="size-3 mr-2" />}
                        Issue Certificate
                    </Button>
                    <Link href={`/admin/students/${enrollment.user_id}`}>
                        <Button variant="ghost" size="icon" className="size-8 rounded-sm">
                            <ChevronRight className="size-4" />
                        </Button>
                    </Link>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Qualified Students" />
            <div className="p-4  lg:p-6 w-full mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black   text-foreground">Qualified Students</h1>
                        <p className="text-muted-foreground text-xs font-bold   mt-1">Students eligible for certification (Score &gt;= 60%)</p>
                    </div>
                    <div className="size-12 rounded-sm bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="size-6" />
                    </div>
                </div>

                <div className="bg-background overflow-hidden">
                    <AdminDataTable 
                        data={qualified} 
                        columns={columns} 
                        searchPlaceholder="Filter by name, course, or score..."
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
