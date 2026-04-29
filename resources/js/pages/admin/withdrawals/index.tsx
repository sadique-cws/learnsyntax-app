import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Wallet, CheckCircle, XCircle, Clock, Landmark, Briefcase, User, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function AdminWithdrawals({ withdrawals = [] }: any) {
  const { data, setData, post, processing, reset } = useForm({
    status: '',
    admin_notes: '',
  });

  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const handleOpenModal = (request: any, action: 'approved' | 'rejected') => {
    setSelectedRequest(request);
    setData({
      status: action,
      admin_notes: '',
    });
  };

  const submitStatusUpdate = (e: any) => {
    e.preventDefault();
    if (!selectedRequest?.id) return;
    post(`/admin/withdrawals/${selectedRequest.id}/status`, {
      onSuccess: () => {
        setSelectedRequest(null);
        reset();
      }
    });
  };

  const columns: Column<any>[] = [
    {
        key: 'teacher',
        label: 'Instructor',
        sortable: true,
        render: (req) => (
            <div className="flex items-center gap-3 py-1">
                <div className="size-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold text-xs border border-indigo-500/20 shrink-0">
                    {req.teacher?.user?.name?.substring(0, 2).toUpperCase() || 'NA'}
                </div>
                <div>
                    <p className="font-bold text-xs text-foreground leading-tight">{req.teacher?.user?.name || 'Unknown Instructor'}</p>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">{req.teacher?.user?.email || 'N/A'}</span>
                </div>
            </div>
        )
    },
    {
        key: 'amount',
        label: 'Payout Amount',
        sortable: true,
        render: (req) => (
            <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                ₹{(req.amount || 0).toLocaleString()}
            </span>
        )
    },
    {
        key: 'bank',
        label: 'Bank Credentials',
        render: (req) => (
            <div className="flex flex-col text-xs font-medium text-foreground/90">
                <div className="flex items-center gap-1">
                    <Landmark className="size-3.5 text-muted-foreground/70" />
                    <span>{req.bank_name || 'N/A'}</span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                    A/C: {req.account_number || 'N/A'} | IFSC: {req.ifsc_code || 'N/A'}
                </span>
            </div>
        )
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (req) => (
            <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-md tracking-wide flex items-center gap-1 w-fit
                ${req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : ''}
                ${req.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : ''}
                ${req.status === 'rejected' ? 'bg-red-500/10 text-red-600 border border-red-500/20' : ''}
            `}>
                {req.status === 'approved' && <CheckCircle className="size-3" />}
                {req.status === 'rejected' && <XCircle className="size-3" />}
                {req.status === 'pending' && <Clock className="size-3" />}
                {req.status || 'unknown'}
            </span>
        )
    }
  ];

  return (
    <>
      <Head title="Withdrawal Requests" />
      <div className="w-full p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                    <Wallet className="size-7 text-indigo-500" />
                    Payout Requests
                </h1>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                    Approve or reject instructor settlement payments efficiently.
                </p>
            </div>
        </div>

        {/* Data Table */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <AdminDataTable 
                title=""
                subtitle=""
                data={withdrawals}
                columns={columns}
                searchPlaceholder="Search by instructor name..."
                actions={(req) => (
                    req.status === 'pending' && (
                        <div className="flex items-center gap-2">
                            <Button 
                                size="sm" 
                                onClick={() => handleOpenModal(req, 'approved')}
                                className="h-8 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all"
                            >
                                Approve
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleOpenModal(req, 'rejected')}
                                className="h-8 px-3 text-xs font-bold border-red-200 text-red-600 hover:bg-red-500/10 hover:text-red-700 rounded-lg transition-all dark:border-red-500/20"
                            >
                                Reject
                            </Button>
                        </div>
                    )
                )}
            />
        </div>

        {/* Status update Modal */}
        <Dialog open={selectedRequest !== null} onOpenChange={(open) => !open && setSelectedRequest(null)}>
            <DialogContent className="rounded-2xl border-border">
                <DialogHeader>
                    <DialogTitle className="text-lg font-black flex items-center gap-2">
                        {data.status === 'approved' ? (
                            <>
                                <CheckCircle className="size-5 text-emerald-500" />
                                Approve Settlement
                            </>
                        ) : (
                            <>
                                <XCircle className="size-5 text-red-500" />
                                Reject Settlement
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-xs mt-1">
                        Review instructor account specifics before validating disbursement.
                    </DialogDescription>
                </DialogHeader>

                {selectedRequest && (
                    <div className="bg-muted/40 border border-border rounded-xl p-4 space-y-2 my-2 text-xs font-medium">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Instructor:</span>
                            <span className="font-bold text-foreground">{selectedRequest?.teacher?.user?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Transfer Amount:</span>
                            <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">₹{(selectedRequest?.amount || 0).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-border/40 pt-2 mt-1 flex flex-col">
                            <span className="text-muted-foreground block mb-0.5 uppercase font-bold text-[9px] tracking-wider">Bank Particulars</span>
                            <span className="text-foreground">{selectedRequest?.bank_name || 'N/A'}</span>
                            <span className="text-muted-foreground">A/C: {selectedRequest?.account_number || 'N/A'}</span>
                            <span className="text-muted-foreground">IFSC: {selectedRequest?.ifsc_code || 'N/A'}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={submitStatusUpdate} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Administrator Notes (Optional)</label>
                        <Input 
                            placeholder="E.g. Transaction ID or rejection reason..."
                            className="h-11 rounded-xl border-border bg-background/50 text-sm"
                            value={data.admin_notes}
                            onChange={e => setData('admin_notes', e.target.value)}
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => setSelectedRequest(null)}
                            className="h-11 rounded-xl font-bold text-xs"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className={`h-11 px-6 rounded-xl font-semibold text-xs shadow-md text-white
                                ${data.status === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10' : 'bg-red-600 hover:bg-red-700 shadow-red-600/10'}
                            `}
                        >
                            Confirm Execution
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

      </div>
    </>
  );
}

AdminWithdrawals.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Payouts', href: '/admin/withdrawals' }]}>
        {page}
    </AppLayout>
);
