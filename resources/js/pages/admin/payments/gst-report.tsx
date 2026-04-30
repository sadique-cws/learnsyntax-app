import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { FileText, Download, IndianRupee } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function AdminGSTReport({ invoices, stats }: { invoices: any[], stats: any }) {
    const columns: Column<any>[] = [
        {
            key: 'invoice_number',
            label: 'Invoice',
            sortable: true,
            render: (invoice) => (
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                        <FileText className="size-3.5" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-foreground">{invoice.invoice_number}</div>
                        <div className="text-[10px] text-muted-foreground">{new Date(invoice.issued_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'gst_number',
            label: 'Customer GSTIN',
            sortable: true,
            render: (invoice) => (
                <span className="text-xs font-mono text-muted-foreground">{invoice.gst_number || 'N/A'}</span>
            )
        },
        {
            key: 'taxable_amount',
            label: 'Taxable Amt',
            sortable: true,
            render: (invoice) => (
                <span className="text-sm font-medium text-foreground tabular-nums">₹{invoice.taxable_amount}</span>
            )
        },
        {
            key: 'gst_split',
            label: 'GST Breakup',
            sortable: false,
            render: (invoice) => (
                <div className="text-[10px] space-y-0.5">
                    <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">CGST:</span>
                        <span className="text-foreground font-medium tabular-nums">₹{invoice.cgst}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">SGST:</span>
                        <span className="text-foreground font-medium tabular-nums">₹{invoice.sgst}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'sac_code',
            label: 'SAC',
            render: (invoice) => (
                <span className="font-mono text-[10px] text-muted-foreground">{invoice.sac_code || '9992'}</span>
            )
        },
        {
            key: 'amount',
            label: 'Total',
            sortable: true,
            render: (invoice) => (
                <span className="text-sm font-medium text-primary tabular-nums">₹{invoice.amount}</span>
            )
        }
    ];

    const handleExport = () => {
        window.location.href = '/admin/payments/gst-report/export';
    };

    return (
        <>
            <Head title="GST Compliance Report" />
            <div className="w-full p-4 space-y-3">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">GST Compliance Report</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Monthly tax summary and B2B invoice tracking</p>
                    </div>
                    <Button variant="outline" className="h-8 px-3 rounded-sm text-xs font-medium shadow-none" onClick={handleExport}>
                        <Download className="size-3.5 mr-1.5" /> Export GSTR-1
                    </Button>
                </div>

                {/* Stats Row */}
                <div className="grid gap-3 md:grid-cols-4">
                    {[
                        { label: 'Total GST Collected', value: `₹${stats.total_gst.toFixed(2)}` },
                        { label: 'Total CGST (9%)', value: `₹${stats.total_cgst.toFixed(2)}` },
                        { label: 'Total SGST (9%)', value: `₹${stats.total_sgst.toFixed(2)}` },
                        { label: 'Total IGST (18%)', value: `₹${stats.total_igst.toFixed(2)}` },
                    ].map(({ label, value }) => (
                        <div key={label} className="rounded-sm border border-border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                                <div className="size-7 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                    <IndianRupee className="size-3.5" />
                                </div>
                            </div>
                            <div className="text-2xl font-semibold text-foreground tabular-nums">{value}</div>
                        </div>
                    ))}
                </div>

                {/* Data Table */}
                <div className="rounded-sm border border-border overflow-hidden">
                    <AdminDataTable 
                        data={invoices}
                        columns={columns}
                        dateFilterKey="issued_at"
                        searchPlaceholder="Search invoices or GSTIN..."
                    />
                </div>
            </div>
        </>
    );
}

AdminGSTReport.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Payments', href: '/admin/payments' }, { title: 'GST Report', href: '#' }]}>
        {page}
    </AppLayout>
);
