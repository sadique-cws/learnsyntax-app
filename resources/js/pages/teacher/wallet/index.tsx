import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Wallet, ArrowUpRight, ArrowDownRight, History, Clock, Landmark, AlertCircle, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TeacherLayout from '@/layouts/teacher-layout';

export default function WalletPage({ balance, actual_balance, transactions, withdrawalRequests = [], kyc_status }: any) {
    const pendingSum = withdrawalRequests
        .filter((req: any) => req.status === 'pending')
        .reduce((acc: number, cur: any) => acc + parseFloat(cur.amount), 0);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    return (
        <>
            <Head title="Wallet & Earnings" />
            <div className="w-full p-4 lg:p-6 space-y-4">

                {/* KYC Status Banner */}
                {kyc_status !== 'approved' && (
                    <div className={`flex items-start gap-3 px-4 py-3 rounded-sm border ${
                        !kyc_status         ? 'bg-amber-50 border-amber-200' :
                        kyc_status === 'pending'  ? 'bg-blue-50 border-blue-200' :
                                                    'bg-red-50 border-red-200'
                    }`}>
                        <AlertCircle className={`size-3.5 shrink-0 mt-0.5 ${
                            !kyc_status ? 'text-amber-600' : kyc_status === 'pending' ? 'text-blue-600' : 'text-red-600'
                        }`} />
                        <div className="flex-1">
                            <p className={`text-xs font-semibold ${
                                !kyc_status ? 'text-amber-700' : kyc_status === 'pending' ? 'text-blue-700' : 'text-red-700'
                            }`}>
                                {!kyc_status && 'KYC verification required to withdraw funds'}
                                {kyc_status === 'pending' && 'KYC under review — withdrawals temporarily disabled'}
                                {kyc_status === 'rejected' && 'KYC rejected — please resubmit your documents'}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                {!kyc_status && 'Submit your Aadhaar card and bank details to unlock withdrawals.'}
                                {kyc_status === 'pending' && 'Our team will review your submission within 1–2 business days.'}
                                {kyc_status === 'rejected' && 'Check your KYC page for the rejection reason and resubmit.'}
                            </p>
                        </div>
                        <Button asChild size="sm" variant="outline" className="h-7 px-3 rounded-sm text-xs shadow-none shrink-0 font-medium">
                            <Link href="/teacher/kyc">
                                {!kyc_status ? 'Complete KYC' : kyc_status === 'pending' ? 'View Status' : 'Resubmit KYC'}
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <Wallet className="size-4 text-muted-foreground" /> Wallet
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Your earnings and payout history</p>
                    </div>
                    <Button asChild size="sm" className="h-7 px-3 rounded-sm text-xs shadow-none font-medium">
                        <Link href="/teacher/wallet/withdraw">
                            <Landmark className="size-3 mr-1.5" /> Withdraw Funds
                        </Link>
                    </Button>
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Available Balance — primary */}
                    <div className="rounded-sm border border-primary/20 bg-primary p-4 text-primary-foreground">
                        <div className="text-[10px] font-medium text-primary-foreground/70 mb-2">Available to Withdraw</div>
                        <div className="text-2xl font-semibold tabular-nums">
                            <span className="text-base font-normal mr-0.5">₹</span>{balance.toLocaleString()}
                        </div>
                    </div>

                    <div className="rounded-sm border border-border bg-background p-4">
                        <div className="text-[10px] font-medium text-muted-foreground mb-2">Pending Withdrawals</div>
                        <div className="text-2xl font-semibold tabular-nums text-amber-600">
                            <span className="text-base font-normal mr-0.5">₹</span>{pendingSum.toLocaleString()}
                        </div>
                    </div>

                    <div className="rounded-sm border border-border bg-background p-4">
                        <div className="text-[10px] font-medium text-muted-foreground mb-2">Gross Total Earned</div>
                        <div className="text-2xl font-semibold tabular-nums">
                            <span className="text-base font-normal mr-0.5">₹</span>{actual_balance.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Transaction Ledger */}
                    <div className="lg:col-span-2 rounded-sm border border-border overflow-hidden">
                        <div className="px-3 py-2.5 bg-muted/5 border-b border-border flex items-center gap-1.5">
                            <History className="size-3.5 text-muted-foreground" />
                            <span className="text-xs font-semibold">Transaction Ledger</span>
                            <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">{transactions.length} entries</span>
                        </div>
                        <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
                            {transactions.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Clock className="size-7 text-muted-foreground/20 mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground">No transactions yet</p>
                                </div>
                            ) : (
                                transactions.map((tx: any) => (
                                    <div key={tx.id} className="px-3 py-2.5 flex justify-between items-center hover:bg-muted/10 transition-colors">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`size-7 rounded-sm flex items-center justify-center shrink-0 border ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                {tx.type === 'credit'
                                                    ? <ArrowDownRight className="size-3.5" />
                                                    : <ArrowUpRight className="size-3.5" />
                                                }
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-foreground">{tx.description}</p>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(tx.created_at)}</p>
                                            </div>
                                        </div>
                                        <div className={`text-sm font-semibold tabular-nums ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {tx.type === 'credit' ? '+' : '-'} ₹{parseFloat(tx.amount).toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Withdrawal Pipeline */}
                    <div className="rounded-sm border border-border overflow-hidden h-fit">
                        <div className="px-3 py-2.5 bg-muted/5 border-b border-border flex items-center gap-1.5">
                            <ShieldCheck className="size-3.5 text-muted-foreground" />
                            <span className="text-xs font-semibold">Withdrawal Requests</span>
                        </div>
                        <div className="divide-y divide-border">
                            {withdrawalRequests.length === 0 ? (
                                <div className="py-10 text-center">
                                    <AlertCircle className="size-6 text-muted-foreground/20 mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground">No requests yet</p>
                                </div>
                            ) : (
                                withdrawalRequests.map((req: any) => (
                                    <div key={req.id} className="p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold tabular-nums">₹{parseFloat(req.amount).toLocaleString()}</span>
                                            <span className={`inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-sm border ${
                                                req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                req.status === 'pending'  ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                             'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                                {req.status === 'approved' && <CheckCircle2 className="size-2.5" />}
                                                {req.status === 'rejected' && <XCircle className="size-2.5" />}
                                                {req.status === 'pending'  && <Clock className="size-2.5" />}
                                                {req.status}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground space-y-1 pt-1.5 border-t border-border">
                                            <div className="flex justify-between">
                                                <span>Bank</span>
                                                <span className="font-medium text-foreground">{req.bank_name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Requested</span>
                                                <span className="font-medium text-foreground">{formatDate(req.created_at)}</span>
                                            </div>
                                        </div>
                                        {req.admin_notes && (
                                            <div className="p-2 rounded-sm bg-red-50 border border-red-100 text-[10px] text-red-700">
                                                <strong>Note:</strong> {req.admin_notes}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

WalletPage.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Dashboard', href: '/teacher/dashboard' }, { title: 'Wallet', href: '/teacher/wallet' }]}>
        {page}
    </TeacherLayout>
);
