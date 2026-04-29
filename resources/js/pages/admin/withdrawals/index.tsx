import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle, XCircle, Clock, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

function cn(...classes: any[]) { return classes.filter(Boolean).join(' '); }

export default function AdminWithdrawals({ withdrawals = [] }: any) {
  const { data, setData, post, processing, reset } = useForm({ status: '', admin_notes: '' });
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const handleOpenModal = (request: any, action: 'approved' | 'rejected') => {
    setSelectedRequest(request);
    setData({ status: action, admin_notes: '' });
  };

  const submitStatusUpdate = (e: any) => {
    e.preventDefault();
    if (!selectedRequest?.id) return;
    post(`/admin/withdrawals/${selectedRequest.id}/status`, { onSuccess: () => { setSelectedRequest(null); reset(); } });
  };

  const columns: Column<any>[] = [
    {
      key: 'teacher', label: 'Teacher', sortable: true,
      render: (req) => (
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold shrink-0">
            {req.teacher?.user?.name?.substring(0, 2).toUpperCase() || 'NA'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{req.teacher?.user?.name || 'Unknown'}</div>
            <div className="text-xs text-muted-foreground truncate">{req.teacher?.user?.email || 'N/A'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'amount', label: 'Amount', sortable: true,
      render: (req) => <span className="text-sm font-medium text-foreground tabular-nums">₹{(req.amount || 0).toLocaleString()}</span>
    },
    {
      key: 'bank', label: 'Bank Details',
      render: (req) => (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Landmark className="size-3 text-muted-foreground/50" />{req.bank_name || 'N/A'}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">A/C: {req.account_number || 'N/A'} · IFSC: {req.ifsc_code || 'N/A'}</div>
        </div>
      )
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (req) => (
        <span className={cn(
          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-medium border",
          req.status === 'approved' && "bg-emerald-50 text-emerald-600 border-emerald-100",
          req.status === 'pending' && "bg-amber-50 text-amber-600 border-amber-100",
          req.status === 'rejected' && "bg-red-50 text-red-600 border-red-100"
        )}>
          {req.status === 'approved' && <CheckCircle className="size-2.5" />}
          {req.status === 'rejected' && <XCircle className="size-2.5" />}
          {req.status === 'pending' && <Clock className="size-2.5" />}
          <span className="capitalize">{req.status || 'unknown'}</span>
        </span>
      )
    }
  ];

  return (
    <>
      <Head title="Withdrawals" />
      <div className="w-full p-4 space-y-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Withdrawals</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage teacher payout requests</p>
        </div>
        <div className="rounded-sm border border-border overflow-hidden">
          <AdminDataTable title="Payout Requests" data={withdrawals} columns={columns} searchPlaceholder="Search by teacher..."
            actions={(req) => req.status === 'pending' && (
              <div className="flex items-center justify-end gap-1">
                <Button size="sm" variant="ghost" onClick={() => handleOpenModal(req, 'approved')} className="h-7 px-2 rounded-sm text-xs font-medium text-emerald-600 hover:bg-emerald-50">Approve</Button>
                <Button size="sm" variant="ghost" onClick={() => handleOpenModal(req, 'rejected')} className="h-7 px-2 rounded-sm text-xs font-medium text-red-600 hover:bg-red-50">Reject</Button>
              </div>
            )}
          />
        </div>

        <Dialog open={selectedRequest !== null} onOpenChange={(open) => !open && setSelectedRequest(null)}>
          <DialogContent className="sm:max-w-md rounded-sm border border-border p-0 overflow-hidden shadow-none">
            <DialogHeader className="px-4 py-3 border-b border-border">
              <DialogTitle className="text-sm font-semibold flex items-center gap-2">
                {data.status === 'approved' ? <><CheckCircle className="size-4 text-emerald-500" /> Approve Withdrawal</> : <><XCircle className="size-4 text-red-500" /> Reject Withdrawal</>}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              {selectedRequest && (
                <div className="bg-muted/5 border border-border rounded-sm p-3 mb-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Teacher</span><span className="font-medium">{selectedRequest?.teacher?.user?.name || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium tabular-nums">₹{(selectedRequest?.amount || 0).toLocaleString()}</span></div>
                  <div className="border-t border-border pt-2 text-xs text-muted-foreground">
                    <div>{selectedRequest?.bank_name || 'N/A'} · A/C: {selectedRequest?.account_number || 'N/A'} · IFSC: {selectedRequest?.ifsc_code || 'N/A'}</div>
                  </div>
                </div>
              )}
              <form onSubmit={submitStatusUpdate} className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">Admin Notes (Optional)</Label>
                  <Input placeholder="Transaction ID or reason..." className="h-9 rounded-sm text-sm shadow-none" value={data.admin_notes} onChange={e => setData('admin_notes', e.target.value)} />
                </div>
                <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2">
                  <Button type="button" variant="outline" onClick={() => setSelectedRequest(null)} className="flex-1 h-9 rounded-sm text-xs shadow-none">Cancel</Button>
                  <Button type="submit" disabled={processing} className={cn("flex-1 h-9 rounded-sm text-xs shadow-none text-white", data.status === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700')}>
                    Confirm
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
  <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Withdrawals', href: '/admin/withdrawals' }]}>{page}</AppLayout>
);
