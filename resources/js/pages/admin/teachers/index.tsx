import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Percent, ChevronRight, UserPlus, Mail, UserCog, X, LogIn } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

export default function AdminTeachers({ teachers, users }: any) {
  const { data, setData, post, processing, reset } = useForm({ user_id: '', commission_percent: 50 });
  const [showAddForm, setShowAddForm] = useState(false);

  const submit = (e: any) => {
    e.preventDefault();
    post('/admin/teachers', { onSuccess: () => { reset(); setShowAddForm(false); } });
  };

  const handleLoginAs = (id: number) => {
    if (confirm('Are you sure you want to login as this teacher?')) {
      router.post(`/admin/teachers/${id}/login-as`);
    }
  };

  const columns: Column<any>[] = [
    {
      key: 'name', label: 'Teacher', sortable: true,
      render: (teacher) => (
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold shrink-0">
            {teacher.user.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{teacher.user.name}</div>
            <div className="text-xs text-muted-foreground truncate">{teacher.user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'wallet_balance', label: 'Balance', sortable: true,
      render: (teacher) => (
        <div>
          <div className="text-sm font-medium text-foreground tabular-nums">₹{teacher.wallet_balance.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground">Wallet</div>
        </div>
      )
    },
    {
      key: 'commission_percent', label: 'Commission', sortable: true,
      render: (teacher) => (
        <form onSubmit={(e) => { e.preventDefault(); router.put(`/admin/teachers/${teacher.id}`, { commission_percent: (e.target as any).percent.value }); }} className="flex items-center gap-1.5 group">
          <div className="relative">
            <Input type="number" name="percent" defaultValue={teacher.commission_percent} min="0" max="100" className="w-16 h-7 text-xs pl-5 pr-1 rounded-sm border-border shadow-none" />
            <Percent className="absolute left-1.5 top-1/2 -translate-y-1/2 size-2.5 text-muted-foreground/40" />
          </div>
          <Button type="submit" size="sm" variant="ghost" className="h-7 px-2 text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 rounded-sm">Save</Button>
        </form>
      )
    }
  ];

  return (
    <>
      <Head title="Teachers" />
      <div className="w-full p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Teachers</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{teachers.length} registered teachers</p>
          </div>
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)} size="sm" className="h-8 px-3 rounded-sm text-xs font-medium shadow-none">
              <UserPlus className="size-3.5 mr-1.5" /> Add Teacher
            </Button>
          )}
        </div>

        {showAddForm && (
          <div className="border border-border rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <UserCog className="size-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Add New Teacher</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)} className="size-7 rounded-sm text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </Button>
            </div>
            <form onSubmit={submit} className="flex flex-col lg:flex-row gap-3 items-end">
              <div className="flex-1 space-y-1 w-full">
                <Label className="text-xs font-medium text-muted-foreground">Select User</Label>
                <select className="flex h-9 w-full rounded-sm border border-border bg-background px-3 text-sm shadow-none focus:outline-none focus:ring-1 focus:ring-ring" value={data.user_id} onChange={e => setData('user_id', e.target.value)} required>
                  <option value="" disabled>Choose a user...</option>
                  {users.map((u: any) => <option key={u.id} value={u.id}>{u.name} — {u.email}</option>)}
                </select>
              </div>
              <div className="w-full lg:w-28 space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Commission %</Label>
                <Input type="number" min="0" max="100" className="h-9 rounded-sm text-sm shadow-none" value={data.commission_percent} onChange={e => setData('commission_percent', e.target.value as any)} required />
              </div>
              <Button type="submit" disabled={processing} className="h-9 px-4 rounded-sm text-xs shadow-none">Add Teacher</Button>
            </form>
          </div>
        )}

        <div className="rounded-sm border border-border overflow-hidden">
          <AdminDataTable title="All Teachers" data={teachers} columns={columns} searchPlaceholder="Search teachers..."
            actions={(teacher) => (
              <div className="flex items-center gap-1">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-7 rounded-sm text-muted-foreground hover:text-primary hover:bg-primary/5"
                    onClick={() => handleLoginAs(teacher.id)}
                    title="Login as Teacher"
                >
                  <LogIn className="size-3.5" />
                </Button>
                <Button asChild variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50">
                  <Link href={`/admin/teachers/${teacher.id}`}><ChevronRight className="size-3.5" /></Link>
                </Button>
              </div>
            )}
          />
        </div>
      </div>
    </>
  );
}

AdminTeachers.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Teachers', href: '/admin/teachers' }]}>{page}</AppLayout>
);
