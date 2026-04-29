import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Wallet, Percent, ChevronRight, UserPlus, Sparkles, Building2, Briefcase, Mail, Shield, UserCog } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { cn } from '@/lib/utils';

export default function AdminTeachers({ teachers, users }: any) {
  const { data, setData, post, processing, reset } = useForm({
    user_id: '',
    commission_percent: 50,
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const submit = (e: any) => {
    e.preventDefault();
    post('/admin/teachers', {
      onSuccess: () => {
        reset();
        setShowAddForm(false);
      }
    });
  };

  const columns: Column<any>[] = [
    {
        key: 'name',
        label: 'FACULTY PROTOCOL',
        sortable: true,
        render: (teacher) => (
            <div className="flex items-center gap-3 py-1.5">
                <div className="size-10 rounded-xl bg-muted/20 border border-border flex items-center justify-center text-muted-foreground/60 shrink-0">
                    <span className="font-black text-xs tracking-tighter">
                        {teacher.user.name.substring(0, 2).toUpperCase()}
                    </span>
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="font-bold text-sm text-foreground leading-none truncate mb-1">
                        {teacher.user.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground/70 font-black uppercase tracking-[0.1em] flex items-center gap-1.5 leading-none">
                        <Mail className="size-2.5 opacity-40" />
                        {teacher.user.email}
                    </div>
                </div>
            </div>
        )
    },
    {
        key: 'wallet_balance',
        label: 'FINANCIAL ASSETS',
        sortable: true,
        render: (teacher) => (
            <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-foreground">
                    <span className="text-[10px] font-black opacity-30 tracking-tight">INR</span>
                    <span className="font-black text-[14px] tracking-tight">{teacher.wallet_balance.toLocaleString()}</span>
                </div>
                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest leading-none mt-1 opacity-50">Settled Balance</span>
            </div>
        )
    },
    {
        key: 'commission_percent',
        label: 'REVENUE SPLIT',
        sortable: true,
        render: (teacher) => (
            <form onSubmit={(e) => {
                e.preventDefault();
                router.put(`/admin/teachers/${teacher.id}`, {
                  commission_percent: (e.target as any).percent.value
                })
              }} className="flex items-center gap-2 group">
                <div className="relative">
                    <Input 
                        type="number" 
                        name="percent" 
                        defaultValue={teacher.commission_percent} 
                        min="0" 
                        max="100" 
                        className="w-[72px] h-8 text-[11px] font-black pl-7 pr-1 rounded-lg border-border bg-muted/10 group-hover:bg-muted/20 group-hover:border-primary/30 focus-visible:ring-primary/10 transition-all text-foreground shadow-none" 
                    />
                    <Percent className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground/40" />
                </div>
                <Button type="submit" size="sm" variant="outline" className="h-8 px-2 text-[9px] font-black text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-none uppercase tracking-widest">
                    SYNC
                </Button>
            </form>
        )
    }
  ];

  return (
    <>
      <Head title="Instructor Registry" />
      <div className="w-full p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/5 p-6 rounded-xl border border-border relative overflow-hidden">
            <div className="relative">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-muted/10 text-muted-foreground/60 text-[9px] font-black uppercase tracking-[0.2em] mb-3">
                    <Shield className="size-2.5" />
                    <span>Access Level: Administrator</span>
                </div>
                <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">
                    Instructor Registry
                </h1>
                <p className="text-[11px] text-muted-foreground mt-1 font-bold uppercase tracking-wide opacity-70 leading-relaxed">
                    Protocol management for teaching faculty and revenue architecture.
                </p>
            </div>

            {!showAddForm && (
                <Button 
                    onClick={() => setShowAddForm(true)}
                    className="shrink-0 bg-primary text-white hover:bg-primary/90 h-10 px-5 rounded-lg font-black uppercase tracking-[0.15em] text-[10px] transition-all active:translate-y-px shadow-none border-0"
                >
                    <UserPlus className="size-3.5 mr-2" />
                    Initialize New Node
                </Button>
            )}
        </div>

        {showAddForm && (
            <Card className="border border-border shadow-none bg-card rounded-xl animate-in fade-in zoom-in-95 duration-200">
                <CardHeader className="py-4 px-6 border-b border-border bg-muted/10 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xs font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                            <UserCog className="size-3.5 text-primary" />
                            Faculty Onboarding
                        </CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg size-8">
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </Button>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
                        <div className="flex-1 space-y-2 w-full">
                            <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 ml-1 leading-none">Target User Identification</Label>
                            <div className="relative group">
                                <select 
                                    className="flex h-10 w-full appearance-none rounded-lg border border-border bg-muted/10 px-4 py-2 text-[11px] font-bold text-foreground focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all hover:bg-muted/20"
                                    value={data.user_id} 
                                    onChange={e => setData('user_id', e.target.value)}
                                    required
                                >
                                    <option value="" disabled className="bg-background">Select registered identity...</option>
                                    {users.map((u: any) => (
                                        <option key={u.id} value={u.id} className="bg-background">{u.name} — {u.email}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground/40">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-40 space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 ml-1 leading-none">Yield Ratio %</Label>
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    min="0" 
                                    max="100" 
                                    className="h-10 pl-9 rounded-lg border-border bg-muted/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 font-black text-[11px] transition-all shadow-none" 
                                    value={data.commission_percent} 
                                    onChange={e => setData('commission_percent', e.target.value as any)} 
                                    required 
                                />
                                <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground/40" />
                            </div>
                        </div>
                        <div className="w-full lg:w-auto">
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full lg:w-auto h-10 px-6 bg-primary text-white hover:bg-primary/90 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] transition-all active:translate-y-px shadow-none"
                            >
                                Authorize Protocol
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )}

        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <AdminDataTable 
                title=""
                subtitle=""
                data={teachers}
                columns={columns}
                searchPlaceholder="Filter registry by name or identification..."
                actions={(teacher) => (
                    <Button asChild variant="outline" size="icon" className="size-8 rounded-lg text-muted-foreground border-border bg-muted/5 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all shadow-none">
                        <Link href={`/admin/teachers/${teacher.id}`}>
                            <ChevronRight className="size-3.5" />
                        </Link>
                    </Button>
                )}
            />
        </div>
      </div>
    </>
  );
}

AdminTeachers.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'System Control', href: '#' }, { title: 'Faculty Assets', href: '/admin/teachers' }]}>
        {page}
    </AppLayout>
);
