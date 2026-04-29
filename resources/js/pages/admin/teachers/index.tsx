import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Wallet, Percent, ChevronRight, UserPlus, Sparkles, Building2, Briefcase } from 'lucide-react';
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
        label: 'Instructor Profile',
        sortable: true,
        render: (teacher) => (
            <div className="flex items-center gap-4 py-1">
                <div className="relative">
                    <div className="size-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                        <span className="font-bold text-sm tracking-wide">
                            {teacher.user.name.substring(0, 2).toUpperCase()}
                        </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-background shadow-sm">
                        <Sparkles className="size-2.5 text-white" />
                    </div>
                </div>
                <div>
                    <div className="font-semibold text-sm text-foreground leading-tight hover:text-indigo-600 transition-colors">
                        {teacher.user.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                        <Briefcase className="size-3" />
                        {teacher.user.email}
                    </div>
                </div>
            </div>
        )
    },
    {
        key: 'wallet_balance',
        label: 'Earnings',
        sortable: true,
        render: (teacher) => (
            <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500">
                    <Wallet className="size-3.5" />
                    <span className="font-bold text-[15px]">₹{teacher.wallet_balance.toLocaleString()}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium ml-5">Current Balance</span>
            </div>
        )
    },
    {
        key: 'commission_percent',
        label: 'Commission Rate',
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
                        className="w-[84px] h-9 text-sm font-bold pl-8 pr-2 rounded-lg border-border bg-muted/50 group-hover:bg-muted group-hover:border-indigo-500/50 focus-visible:ring-indigo-500/20 transition-all text-foreground" 
                    />
                    <Percent className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-indigo-400" />
                </div>
                <Button type="submit" size="sm" variant="ghost" className="h-9 px-3 text-[11px] font-bold text-indigo-600 hover:bg-indigo-500/10 hover:text-indigo-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    SAVE
                </Button>
            </form>
        )
    }
  ];

  return (
    <>
      <Head title="Manage Teachers" />
      <div className="w-full p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-semibold mb-3">
                    <Building2 className="size-3.5" />
                    <span>Faculty Management</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                    Instructors Directory
                </h1>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                    Manage your teaching staff, monitor earnings, and set commission structures.
                </p>
            </div>

            {!showAddForm && (
                <Button 
                    onClick={() => setShowAddForm(true)}
                    className="relative shrink-0 shadow-lg shadow-indigo-500/25 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white border-0 h-11 px-6 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:-translate-y-0.5"
                >
                    <UserPlus className="size-4 mr-2" />
                    Onboard New Instructor
                </Button>
            )}
        </div>

        {showAddForm && (
            <Card className="border border-border shadow-xl shadow-indigo-900/5 bg-card relative overflow-hidden animate-in slide-in-from-top-4 fade-in duration-500">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                <CardHeader className="py-5 px-7 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                            <Sparkles className="size-4 text-indigo-500" />
                            Onboard New Instructor
                        </CardTitle>
                        <CardDescription className="text-xs mt-1 text-muted-foreground">
                            Select a registered user to grant them instructor privileges.
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full size-8">
                        <span className="sr-only">Close</span>
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </Button>
                </CardHeader>
                <CardContent className="p-7">
                    <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
                        <div className="flex-1 space-y-2.5 w-full">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Select User Account</Label>
                            <div className="relative group">
                                <select 
                                    className="flex h-11 w-full appearance-none rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all hover:border-muted-foreground/30"
                                    value={data.user_id} 
                                    onChange={e => setData('user_id', e.target.value)}
                                    required
                                >
                                    <option value="" disabled className="bg-background">Search and choose a user...</option>
                                    {users.map((u: any) => (
                                        <option key={u.id} value={u.id} className="bg-background">{u.name} — {u.email}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-48 space-y-2.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Platform Commission %</Label>
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    min="0" 
                                    max="100" 
                                    className="h-11 pl-10 rounded-xl border-border bg-background focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-bold text-sm transition-all" 
                                    value={data.commission_percent} 
                                    onChange={e => setData('commission_percent', e.target.value as any)} 
                                    required 
                                />
                                <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="w-full lg:w-auto">
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full lg:w-auto h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                            >
                                Grant Instructor Access
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )}

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <AdminDataTable 
                title=""
                subtitle=""
                data={teachers}
                columns={columns}
                searchPlaceholder="Search faculty by name or email..."
                actions={(teacher) => (
                    <Button asChild variant="ghost" size="icon" className="size-9 rounded-xl text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors">
                        <Link href={`/admin/teachers/${teacher.id}`}>
                            <ChevronRight className="size-4.5" />
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
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Teachers', href: '/admin/teachers' }]}>
        {page}
    </AppLayout>
);
