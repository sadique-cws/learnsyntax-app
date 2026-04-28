import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Receipt, FileText, ChevronLeft, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function AdminGSTReport({ invoices, stats }: { invoices: any[], stats: any }) {
    const columns: Column<any>[] = [
        {
            key: 'invoice_number',
            label: 'Invoice',
            sortable: true,
            render: (invoice) => (
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded bg-primary/5 border border-primary/10 flex items-center justify-center font-medium text-primary text-xs shrink-0">
                        <FileText className="size-4" />
                    </div>
                    <div>
                        <div className="font-medium text-sm text-foreground">{invoice.invoice_number}</div>
                        <div className="text-[10px] text-muted-foreground font-medium tracking-tight">Issued on {new Date(invoice.issued_at).toLocaleDateString()}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'gst_number',
            label: 'Customer GSTIN',
            sortable: true,
            render: (invoice) => (
                <div className="text-sm font-mono text-muted-foreground">{invoice.gst_number || 'N/A'}</div>
            )
        },
        {
            key: 'taxable_amount',
            label: 'Taxable Amt',
            sortable: true,
            render: (invoice) => (
                <div className="text-sm font-medium">₹{invoice.taxable_amount}</div>
            )
        },
        {
            key: 'gst_split',
            label: 'GST Breakup',
            sortable: false,
            render: (invoice) => (
                <div className="text-[10px] font-medium space-y-1">
                    <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">CGST:</span>
                        <span className="text-foreground">₹{invoice.cgst}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">SGST:</span>
                        <span className="text-foreground">₹{invoice.sgst}</span>
                    </div>
                    {invoice.igst > 0 && (
                        <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">IGST:</span>
                            <span className="text-foreground">₹{invoice.igst}</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'amount',
            label: 'Total Bill',
            sortable: true,
            render: (invoice) => (
                <div className="font-medium text-sm text-primary">₹{invoice.amount}</div>
            )
        }
    ];

    return (
        <>
            <Head title="GST Compliance Report" />
            
            <div className="w-full p-4 lg:p-6">
                <div className="mb-8">
                    <Link href="/admin/payments" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
                        <ChevronLeft className="size-4 mr-1" /> Back to Ledger
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-medium tracking-tight leading-none mb-1">GST Compliance Report</h1>
                            <p className="text-muted-foreground text-xs font-medium tracking-tight">Monthly tax summary and B2B invoice tracking</p>
                        </div>
                        <Button variant="outline" className="rounded h-11 px-6 font-medium text-xs border-border bg-card">
                            <Download className="size-4 mr-2" /> Export GSTR-1
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    <Card className="border-border rounded bg-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase">Total GST Collected</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-medium tracking-tight">₹{stats.total_gst.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-border rounded bg-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase">Total CGST (9%)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-medium tracking-tight text-blue-600">₹{stats.total_cgst.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-border rounded bg-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase">Total SGST (9%)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-medium tracking-tight text-green-600">₹{stats.total_sgst.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-border rounded bg-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase">Total IGST (18%)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-medium tracking-tight text-purple-600">₹{stats.total_igst.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                </div>

                <AdminDataTable 
                    data={invoices}
                    columns={columns}
                    searchPlaceholder="Search invoices or GSTIN..."
                />
            </div>
        </>
    );
}

AdminGSTReport.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Payments', href: '/admin/payments' }, { title: 'GST Report', href: '#' }]}>
        {page}
    </AppLayout>
);
