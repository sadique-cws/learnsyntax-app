import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Wallet, IndianRupee, Landmark, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
      <Head title="Request Payout Withdrawal" />
      <div className="w-full max-w-3xl mx-auto p-4 lg:p-8 space-y-6">
        
        {/* Navigation */}
        <div>
            <Button variant="ghost" asChild className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                <Link href="/teacher/wallet" className="flex items-center gap-2">
                    <ArrowLeft className="size-4" />
                    Back to Wallet
                </Link>
            </Button>
        </div>

        {/* Header area */}
        <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm relative overflow-hidden group flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                    <Landmark className="size-3.5" />
                    Settlements
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                    Request Payout
                </h1>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                    Transfer your application balance securely to your bank.
                </p>
            </div>

            <div className="bg-muted/50 px-6 py-4 rounded-2xl border border-border flex flex-col items-end relative z-10 min-w-[200px]">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Available</span>
                <div className="flex items-baseline gap-0.5 text-indigo-500 mt-1">
                    <span className="text-xl font-bold">₹</span>
                    <span className="text-3xl font-black tracking-tight">{balance.toLocaleString()}</span>
                </div>
            </div>
        </div>

            <Card className="border border-border bg-card shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-indigo-600" />
                
                <CardHeader className="py-5 px-7 border-b border-border bg-muted/30 flex flex-row items-center gap-2">
                    <Wallet className="size-4 text-indigo-500" />
                    <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider">Account Details</CardTitle>
                </CardHeader>

                <CardContent className="p-7">
                    <form onSubmit={submitWithdrawal} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Withdrawal Amount (₹)</Label>
                            <div className="relative">
                                <Input 
                                    type="number" min="500" max={balance}
                                    placeholder="E.g. 1000"
                                    className="h-11 pl-10 rounded-xl bg-background focus:border-indigo-500 font-bold text-sm transition-all"
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    required
                                />
                                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            </div>
                            {errors.amount && <span className="text-xs font-bold text-red-500">{errors.amount}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Account Holder Name</Label>
                            <Input 
                                placeholder="Name as per Bank"
                                className="h-11 rounded-xl bg-background font-medium text-sm"
                                value={data.account_holder_name}
                                onChange={e => setData('account_holder_name', e.target.value)}
                                required
                            />
                            {errors.account_holder_name && <span className="text-xs font-bold text-red-500">{errors.account_holder_name}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Bank Name</Label>
                            <Input 
                                placeholder="E.g. State Bank of India"
                                className="h-11 rounded-xl bg-background font-medium text-sm"
                                value={data.bank_name}
                                onChange={e => setData('bank_name', e.target.value)}
                                required
                            />
                            {errors.bank_name && <span className="text-xs font-bold text-red-500">{errors.bank_name}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Account Number</Label>
                            <Input 
                                type="password"
                                placeholder="Enter Account Number"
                                className="h-11 rounded-xl bg-background font-bold tracking-wider text-sm"
                                value={data.account_number}
                                onChange={e => setData('account_number', e.target.value)}
                                required
                            />
                            {errors.account_number && <span className="text-xs font-bold text-red-500">{errors.account_number}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">IFSC Code</Label>
                            <Input 
                                placeholder="E.g. SBIN0001234"
                                className="h-11 rounded-xl bg-background font-bold uppercase tracking-wider text-sm"
                                value={data.ifsc_code}
                                onChange={e => setData('ifsc_code', e.target.value)}
                                required
                            />
                            {errors.ifsc_code && <span className="text-xs font-bold text-red-500">{errors.ifsc_code}</span>}
                        </div>

                        <div className="md:col-span-2 pt-4 flex justify-end border-t border-border/50 mt-2">
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full md:w-auto h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
                            >
                                <Save className="size-4 mr-2" />
                                Submit Settlement Request
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

      </div>
    </>
  );
}

WithdrawPage.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Instructor', href: '/teacher/dashboard' }, { title: 'Wallet', href: '/teacher/wallet' }, { title: 'Withdrawal', href: '#' }]}>
        {page}
    </TeacherLayout>
);
