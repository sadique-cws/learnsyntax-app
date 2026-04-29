import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Wallet, Percent, Plus, ChevronRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function AdminTeachers({ teachers, users }: any) {
  const { data, setData, post, processing, reset } = useForm({
    user_id: '',
    commission_percent: 50,
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const submit = (e: any) => {
    e.preventDefault();
    post(route('admin.teachers.store'), {
      onSuccess: () => {
        reset();
        setShowAddForm(false);
      }
    });
  };

  const columns: Column<any>[] = [
    {
        key: 'name',
        label: 'Teacher',
        sortable: true,
        render: (teacher) => (
            <div className="flex items-center gap-3">
                <div className="size-10 rounded-md bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                    <User className="size-5 opacity-70" />
                </div>
                <div>
                    <div className="font-semibold text-sm text-foreground leading-tight">{teacher.user.name}</div>
                    <div className="text-[11px] text-muted-foreground font-medium mt-0.5">{teacher.user.email}</div>
                </div>
            </div>
        )
    },
    {
        key: 'wallet_balance',
        label: 'Wallet',
        sortable: true,
        render: (teacher) => (
            <div className="flex items-center gap-2">
                <Wallet className="size-3.5 text-green-600/70" />
                <span className="font-semibold text-sm text-green-700">₹{teacher.wallet_balance.toLocaleString()}</span>
            </div>
        )
    },
    {
        key: 'commission_percent',
        label: 'Commission',
        sortable: true,
        render: (teacher) => (
            <form onSubmit={(e) => {
                e.preventDefault();
                router.put(route('admin.teachers.update', teacher.id), {
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
                        className="w-20 h-8 text-xs font-bold pl-7 pr-1 rounded-md border-border/50 bg-muted/10 group-hover:bg-background transition-colors" 
                    />
                    <Percent className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground/50" />
                </div>
                <Button type="submit" size="sm" variant="ghost" className="h-8 px-2 text-[10px] font-bold text-primary hover:bg-primary/5">SET</Button>
            </form>
        )
    }
  ];

  return (
    <>
      <Head title="Manage Teachers" />
      <div className="w-full p-4 lg:p-6 space-y-6">
        {showAddForm && (
            <Card className="border-border/50 shadow-sm bg-background animate-in fade-in slide-in-from-top-2 duration-300">
                <CardHeader className="py-4 px-6 border-b border-border/50">
                    <CardTitle className="text-sm font-semibold">Onboard New Teacher</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={submit} className="flex flex-col md:flex-row gap-6 items-end">
                        <div className="flex-1 space-y-2 w-full">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Select User Account</Label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-border/50 bg-muted/10 px-3 py-2 text-xs font-medium focus:bg-background outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                                value={data.user_id} 
                                onChange={e => setData('user_id', e.target.value)}
                                required
                            >
                                <option value="">Choose User...</option>
                                {users.map((u: any) => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-40 space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Commission %</Label>
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    min="0" 
                                    max="100" 
                                    className="h-10 pl-9 rounded-md border-border/50 bg-muted/10 focus:bg-background font-bold text-xs" 
                                    value={data.commission_percent} 
                                    onChange={e => setData('commission_percent', e.target.value as any)} 
                                    required 
                                />
                                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)} className="flex-1 h-10 text-xs font-semibold">CANCEL</Button>
                            <Button type="submit" disabled={processing} className="flex-1 h-10 px-6 bg-primary shadow-md shadow-primary/20 text-xs font-semibold">ADD TEACHER</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )}

        <AdminDataTable 
            title="Faculty Directory"
            subtitle="Manage teacher accounts, earnings, and commission rates"
            data={teachers}
            columns={columns}
            searchPlaceholder="Search faculty by name or email..."
            onAdd={() => setShowAddForm(true)}
            addLabel="Add Teacher"
            actions={(teacher) => (
                <Button asChild variant="ghost" size="icon" className="size-8 rounded-md hover:bg-primary/5 hover:text-primary transition-colors">
                    <Link href={`/admin/teachers/${teacher.id}`}>
                        <ChevronRight className="size-4" />
                    </Link>
                </Button>
            )}
        />
      </div>
    </>
  );
}

AdminTeachers.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Teachers', href: '/admin/teachers' }]}>
        {page}
    </AppLayout>
);
