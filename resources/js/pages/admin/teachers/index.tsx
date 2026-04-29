import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Percent, ChevronRight, UserPlus, Mail, Shield, UserCog } from 'lucide-react';
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
            <div className="flex items-center gap-2.5 py-1">
                <div className="size-8 rounded-sm bg-muted/20 border border-border flex items-center justify-center text-muted-foreground/60 shrink-0">
                    <span className="font-black text-[10px] tracking-tighter uppercase">
                        {teacher.user.name.substring(0, 2)}
                    </span>
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="font-black text-[12px] text-slate-900 leading-none truncate mb-1 uppercase tracking-tight">
                        {teacher.user.name}
                    </div>
                    <div className="text-[9px] text-muted-foreground/70 font-black uppercase tracking-[0.1em] flex items-center gap-1.5 leading-none">
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
                <div className="flex items-center gap-1.5 text-slate-900">
                    <span className="text-[9px] font-black opacity-40 tracking-tight">INR</span>
                    <span className="font-black text-[12px] tracking-tight">{teacher.wallet_balance.toLocaleString()}</span>
                </div>
                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest leading-none mt-1 opacity-60">Settled Balance</span>
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
              }} className="flex items-center gap-1.5 group">
                <div className="relative">
                    <Input 
                        type="number" 
                        name="percent" 
                        defaultValue={teacher.commission_percent} 
                        min="0" 
                        max="100" 
                        className="w-[70px] h-7 text-[10px] font-black pl-6 pr-1 rounded-sm border-border bg-muted/10 group-hover:bg-muted/20 group-hover:border-primary/30 focus-visible:ring-primary/10 transition-all text-slate-900 shadow-none" 
                    />
                    <Percent className="absolute left-2 top-1/2 -translate-y-1/2 size-2.5 text-muted-foreground/40" />
                </div>
                <Button type="submit" size="sm" variant="outline" className="h-7 px-2 text-[8px] font-black text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/40 rounded-sm opacity-0 group-hover:opacity-100 transition-all shadow-none uppercase tracking-widest">
                    SYNC
                </Button>
            </form>
        )
    }
  ];

  return (
    <>
      <Head title="Instructor Registry" />
      <div className="w-full p-4 space-y-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-border pb-4">
            <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-1.5">
                    <Shield className="size-2.5" />
                    <span>Access Level: Administrator</span>
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                    Instructor Registry
                </h1>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">
                    Protocol management for teaching faculty and revenue architecture.
                </p>
            </div>

            {!showAddForm && (
                <Button 
                    onClick={() => setShowAddForm(true)}
                    className="shrink-0 bg-primary text-white hover:bg-primary/90 h-9 px-4 rounded-sm font-black uppercase tracking-widest text-[9px] transition-all shadow-none"
                >
                    <UserPlus className="size-3 mr-1.5" />
                    Initialize New Node
                </Button>
            )}
        </div>

        {showAddForm && (
            <Card className="border border-border shadow-none bg-background rounded-sm">
                <CardHeader className="py-3 px-4 border-b border-border bg-muted/10 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <UserCog className="size-3 text-primary" />
                            Faculty Onboarding
                        </CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-slate-900 hover:bg-muted/30 rounded-sm size-7 shadow-none">
                        <svg className="size-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </Button>
                </CardHeader>
                <CardContent className="p-4">
                    <form onSubmit={submit} className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                        <div className="flex-1 space-y-1 w-full">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Target User Identification</Label>
                            <div className="relative group">
                                <select 
                                    className="flex h-9 w-full appearance-none rounded-sm border border-border bg-muted/10 px-3 py-1.5 text-[10px] font-black uppercase text-slate-900 focus:border-primary/50 focus:outline-none transition-all shadow-none"
                                    value={data.user_id} 
                                    onChange={e => setData('user_id', e.target.value)}
                                    required
                                >
                                    <option value="" disabled className="bg-background">Select registered identity...</option>
                                    {users.map((u: any) => (
                                        <option key={u.id} value={u.id} className="bg-background">{u.name} — {u.email}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground/40">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-32 space-y-1">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Yield Ratio %</Label>
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    min="0" 
                                    max="100" 
                                    className="h-9 pl-7 rounded-sm border-border bg-muted/10 focus:border-primary/50 font-black text-[10px] transition-all shadow-none" 
                                    value={data.commission_percent} 
                                    onChange={e => setData('commission_percent', e.target.value as any)} 
                                    required 
                                />
                                <Percent className="absolute left-2.5 top-1/2 -translate-y-1/2 size-2.5 text-muted-foreground/40" />
                            </div>
                        </div>
                        <div className="w-full lg:w-auto">
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full lg:w-auto h-9 px-4 bg-primary text-white hover:bg-primary/90 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all shadow-none"
                            >
                                Authorize Protocol
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )}

        <div className="bg-background rounded-sm border border-border overflow-hidden shadow-none">
            <AdminDataTable 
                title="Faculty Registry"
                subtitle="Complete roster of approved instructional nodes"
                data={teachers}
                columns={columns}
                searchPlaceholder="Filter registry by name or identification..."
                actions={(teacher) => (
                    <Button asChild variant="outline" size="icon" className="size-7 rounded-sm text-muted-foreground border-border bg-muted/5 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all shadow-none">
                        <Link href={`/admin/teachers/${teacher.id}`}>
                            <ChevronRight className="size-3" />
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
