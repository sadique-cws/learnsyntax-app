import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { Award, User, BookOpen, Calendar, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CertificateIndex({ certificates }: { certificates: any[] }) {
    const columns: Column<any>[] = [
        {
            key: 'certificate_number', label: 'Certificate #',
            render: (cert) => <span className="text-xs font-mono font-medium text-foreground">{cert.certificate_number}</span>
        },
        {
            key: 'student', label: 'Student',
            render: (cert) => (
                <div className="flex items-center gap-2">
                    <div className="size-7 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                        <User className="size-3" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-foreground">{cert.enrollment.user.name}</div>
                        <div className="text-xs text-muted-foreground">{cert.enrollment.user.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'course', label: 'Course',
            render: (cert) => (
                <div className="flex items-center gap-1.5">
                    <BookOpen className="size-3 text-muted-foreground/50" />
                    <span className="text-sm font-medium text-foreground">{cert.enrollment.course.title}</span>
                </div>
            )
        },
        {
            key: 'issued_at', label: 'Issued',
            render: (cert) => (
                <span className="text-xs text-muted-foreground tabular-nums">
                    {new Date(cert.issued_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            )
        }
    ];

    return (
        <>
            <Head title="Certificates" />
            <div className="w-full p-4 space-y-3">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">Certificates</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">{certificates.length} certificates issued</p>
                </div>
                <div className="rounded-sm border border-border overflow-hidden">
                    <AdminDataTable data={certificates} columns={columns} title="Issued Certificates" searchPlaceholder="Search certificates..."
                        actions={(cert) => (
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50">
                                    <Download className="size-3.5" />
                                </Button>
                                <Link href={`/admin/students/${cert.enrollment.user_id}`}>
                                    <Button variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50">
                                        <Eye className="size-3.5" />
                                    </Button>
                                </Link>
                            </div>
                        )}
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
