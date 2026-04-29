import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Wallet, IndianRupee, Landmark, ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TeacherLayout from '@/layouts/teacher-layout';

export default function WithdrawPage({ balance }: any) {
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        bank_name: '',
        account_number: '',
        ifsc_code: '',
        account_holder_name: '',
    });

    const submitWithdrawal = (e: any) => {
        e.preventDefault();
        post('/teacher/wallet/withdraw');
    };

    return (
        <>
            <Head title="Request Withdrawal" />
            <div className="w-full p-4 lg:p-6 space-y-4">

                {/* Back + Header */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="size-7 rounded-sm border border-border text-muted-foreground hover:bg-muted shrink-0">
                        <Link href="/teacher/wallet"><ArrowLeft className="size-3.5" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Request Withdrawal</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Transfer your earnings to your bank account</p>
                    </div>
                </div>

                {/* Available Balance Banner */}
                <div className="flex items-center justify-between px-4 py-3 rounded-sm border border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-2">
                        <Wallet className="size-3.5 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">Available Balance</span>
                    </div>
                    <div className="text-lg font-semibold text-primary tabular-nums">
                        ₹{balance.toLocaleString()}
                    </div>
                </div>

                {/* Form Card */}
                <div className="max-w-xl rounded-sm border border-border overflow-hidden">
                    <div className="px-3 py-2.5 bg-muted/5 border-b border-border flex items-center gap-1.5">
                        <Landmark className="size-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold">Bank Account Details</span>
                    </div>

                    <form onSubmit={submitWithdrawal} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            {/* Amount — full width */}
                            <div className="md:col-span-2 space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Withdrawal Amount (₹)</Label>
                                <div className="relative">
                                    <Input
                                        type="number" min="500" max={balance}
                                        placeholder="E.g. 1000"
                                        className="h-8 pl-7 rounded-sm text-sm border-border"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        required
                                    />
                                    <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                                </div>
                                {errors.amount && <p className="text-[10px] text-red-500 mt-0.5">{errors.amount}</p>}
                                <p className="text-[10px] text-muted-foreground">Minimum withdrawal: ₹500</p>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Account Holder Name</Label>
                                <Input
                                    placeholder="As per bank records"
                                    className="h-8 rounded-sm text-sm border-border"
                                    value={data.account_holder_name}
                                    onChange={e => setData('account_holder_name', e.target.value)}
                                    required
                                />
                                {errors.account_holder_name && <p className="text-[10px] text-red-500">{errors.account_holder_name}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Bank Name</Label>
                                <Input
                                    placeholder="E.g. State Bank of India"
                                    className="h-8 rounded-sm text-sm border-border"
                                    value={data.bank_name}
                                    onChange={e => setData('bank_name', e.target.value)}
                                    required
                                />
                                {errors.bank_name && <p className="text-[10px] text-red-500">{errors.bank_name}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Account Number</Label>
                                <Input
                                    type="password"
                                    placeholder="Enter account number"
                                    className="h-8 rounded-sm text-sm border-border"
                                    value={data.account_number}
                                    onChange={e => setData('account_number', e.target.value)}
                                    required
                                />
                                {errors.account_number && <p className="text-[10px] text-red-500">{errors.account_number}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">IFSC Code</Label>
                                <Input
                                    placeholder="E.g. SBIN0001234"
                                    className="h-8 rounded-sm text-sm border-border uppercase"
                                    value={data.ifsc_code}
                                    onChange={e => setData('ifsc_code', e.target.value.toUpperCase())}
                                    required
                                />
                                {errors.ifsc_code && <p className="text-[10px] text-red-500">{errors.ifsc_code}</p>}
                            </div>

                            <div className="md:col-span-2 pt-3 border-t border-border flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    size="sm"
                                    className="h-8 px-5 rounded-sm text-xs shadow-none font-medium"
                                >
                                    {processing ? 'Submitting...' : <span className="flex items-center gap-1.5"><Send className="size-3" /> Submit Request</span>}
                                </Button>
                            </div>

                        </div>
                    </form>
                </div>

            </div>
        </>
    );
}

WithdrawPage.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Dashboard', href: '/teacher/dashboard' }, { title: 'Wallet', href: '/teacher/wallet' }, { title: 'Withdraw', href: '#' }]}>
        {page}
    </TeacherLayout>
);
