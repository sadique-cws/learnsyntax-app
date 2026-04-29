import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Wallet, CheckCircle, XCircle, Clock, Landmark, User, ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
            <div className="flex items-center gap-2.5 py-1">
                <div className="size-8 rounded-sm bg-primary/5 flex items-center justify-center text-primary font-black text-[10px] border border-primary/10 shrink-0 uppercase">
                    {req.teacher?.user?.name?.substring(0, 2) || 'NA'}
                </div>
                <div>
                    <p className="font-black text-[12px] text-slate-900 leading-tight uppercase tracking-tight">{req.teacher?.user?.name || 'Unknown Instructor'}</p>
                    <span className="text-[9px] text-muted-foreground mt-0.5 block font-black tracking-widest uppercase opacity-60">{req.teacher?.user?.email || 'N/A'}</span>
                </div>
            </div>
        )
    },
    {
        key: 'amount',
        label: 'Payout Amount',
        sortable: true,
        render: (req) => (
            <span className="font-black text-[12px] text-slate-900">
                ₹{(req.amount || 0).toLocaleString()}
            </span>
        )
    },
    {
        key: 'bank',
        label: 'Bank Credentials',
        render: (req) => (
            <div className="flex flex-col text-[10px] font-black text-slate-700 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                    <Landmark className="size-3 text-muted-foreground/70" />
                    <span>{req.bank_name || 'N/A'}</span>
                </div>
                <span className="text-[9px] text-muted-foreground mt-0.5 opacity-60">
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
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm flex items-center gap-1.5 w-fit border
                ${req.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : ''}
                ${req.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : ''}
                ${req.status === 'rejected' ? 'bg-rose-100 text-rose-700 border-rose-200' : ''}
            `}>
                {req.status === 'approved' && <CheckCircle className="size-2.5" />}
                {req.status === 'rejected' && <XCircle className="size-2.5" />}
                {req.status === 'pending' && <Clock className="size-2.5" />}
                {req.status || 'unknown'}
            </span>
        )
    }
  ];

  return (
    <>
      <Head title="Withdrawal Requests" />
      <div className="w-full p-4 space-y-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-border pb-4">
            <div>
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-1.5">
                    <ArrowDownToLine className="size-3" /> Core Registry
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Settlement Operations</h1>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">
                    Approve or reject instructor disbursement requests efficiently.
                </p>
            </div>
        </div>

        {/* Data Table */}
        <div className="bg-background rounded-sm border border-border shadow-none overflow-hidden">
            <AdminDataTable 
                title="Payout Requests"
                subtitle="Manage and execute pending withdrawal settlements"
                data={withdrawals}
                columns={columns}
                searchPlaceholder="Filter requests by instructor..."
                actions={(req) => (
                    req.status === 'pending' && (
                        <div className="flex items-center justify-end gap-1.5">
                            <Button 
                                size="sm" 
                                onClick={() => handleOpenModal(req, 'approved')}
                                className="h-7 px-2.5 rounded-sm font-black text-[8px] uppercase tracking-widest border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-none"
                            >
                                Approve
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleOpenModal(req, 'rejected')}
                                className="h-7 px-2.5 rounded-sm font-black text-[8px] uppercase tracking-widest border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 shadow-none"
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
            <DialogContent className="sm:max-w-md rounded-sm border border-border p-0 overflow-hidden shadow-none">
                <DialogHeader className="p-4 bg-muted/20 border-b border-border">
                    <DialogTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-600">
                        {data.status === 'approved' ? (
                            <>
                                <CheckCircle className="size-3.5 text-emerald-500" />
                                Approve Settlement
                            </>
                        ) : (
                            <>
                                <XCircle className="size-3.5 text-rose-500" />
                                Reject Settlement
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">
                        Review target credentials before executing validation.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 bg-background">
                    {selectedRequest && (
                        <div className="bg-muted/10 border border-border rounded-sm p-3 mb-4 space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-muted-foreground/60">Instructor</span>
                                <span className="text-slate-900">{selectedRequest?.teacher?.user?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-muted-foreground/60">Transfer Amount</span>
                                <span className="text-primary text-[11px]">₹{(selectedRequest?.amount || 0).toLocaleString()}</span>
                            </div>
                            <div className="border-t border-border pt-2 mt-2 flex flex-col text-[10px] font-black uppercase tracking-widest">
                                <span className="text-muted-foreground/60 block mb-1">Bank Particulars</span>
                                <span className="text-slate-900">{selectedRequest?.bank_name || 'N/A'}</span>
                                <span className="text-muted-foreground mt-0.5">A/C: {selectedRequest?.account_number || 'N/A'}</span>
                                <span className="text-muted-foreground mt-0.5">IFSC: {selectedRequest?.ifsc_code || 'N/A'}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submitStatusUpdate} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Administrator Notes (Optional)</label>
                            <Input 
                                placeholder="E.g. TXN ID OR REJECTION REASON..."
                                className="h-9 rounded-sm border-border bg-muted/10 font-bold text-xs shadow-none uppercase"
                                value={data.admin_notes}
                                onChange={e => setData('admin_notes', e.target.value)}
                            />
                        </div>

                        <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2 sm:justify-start">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setSelectedRequest(null)}
                                className="flex-1 h-9 rounded-sm font-black uppercase tracking-widest text-[9px] border border-border shadow-none"
                            >
                                Abort
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className={`flex-1 h-9 rounded-sm font-black uppercase tracking-widest text-[9px] shadow-none
                                    ${data.status === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'}
                                `}
                            >
                                Execute
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
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
