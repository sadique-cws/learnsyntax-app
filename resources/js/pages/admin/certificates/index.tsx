import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { Award, User, BookOpen, Calendar, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CertificateIndex({ certificates }: { certificates: any[] }) {
    const columns: Column<any>[] = [
        {
            key: 'certificate_number',
            label: 'Certificate #',
            render: (cert) => <span className="font-mono text-[10px] font-black text-primary">{cert.certificate_number}</span>
        },
        {
            key: 'student',
            label: 'Student',
            render: (cert) => (
                <div className="flex items-center gap-2">
                    <div className="size-6 rounded-sm bg-primary/5 flex items-center justify-center text-primary">
                        <User className="size-3" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase">{cert.enrollment.user.name}</span>
                        <span className="text-[9px] text-muted-foreground font-medium lowercase italic">{cert.enrollment.user.email}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'course',
            label: 'Course',
            render: (cert) => (
                <div className="flex items-center gap-2">
                    <BookOpen className="size-3 text-muted-foreground" />
                    <span className="text-xs font-bold uppercase">{cert.enrollment.course.title}</span>
                </div>
            )
        },
        {
            key: 'issued_at',
            label: 'Issued Date',
            render: (cert) => (
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                    <Calendar className="size-3" />
                    {new Date(cert.issued_at).toLocaleDateString()}
                </div>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (cert) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="size-8 rounded-sm hover:bg-primary/5 text-primary">
                        <Download className="size-3.5" />
                    </Button>
                    <Link href={`/admin/students/${cert.enrollment.user_id}`}>
                        <Button variant="ghost" size="icon" className="size-8 rounded-sm hover:bg-primary/5">
                            <Eye className="size-3.5" />
                        </Button>
                    </Link>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Issued Certificates" />
            <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">Issued Certificates</h1>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Official credentials issued to students</p>
                    </div>
                    <div className="size-12 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                        <Award className="size-6" />
                    </div>
                </div>

                <div className="bg-background border border-border rounded-sm shadow-sm overflow-hidden">
                    <AdminDataTable 
                        data={certificates} 
                        columns={columns} 
                        searchPlaceholder="Search certificates, students, or courses..."
                    />
                </div>
            </div>
        </>
    );
}

CertificateIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Certificates', href: '/admin/certificates' }]}>
        {page}
    </AppLayout>
);
