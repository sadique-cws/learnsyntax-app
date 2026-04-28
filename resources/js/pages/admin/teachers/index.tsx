import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AdminTeachers({ teachers, users }: any) {
  const { data, setData, post, processing, reset } = useForm({
    user_id: '',
    commission_percent: 50,
  });

  const submit = (e: any) => {
    e.preventDefault();
    post(route('admin.teachers.store'), {
      onSuccess: () => reset()
    });
  };

  return (
    <>
      <Head title="Manage Teachers" />
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Teachers Management</h1>
        
        <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Add New Teacher</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium">Select User</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
              <div className="w-32">
                <label className="text-sm font-medium">Commission %</label>
                <Input type="number" min="0" max="100" value={data.commission_percent} onChange={e => setData('commission_percent', e.target.value as any)} required />
              </div>
              <Button type="submit" disabled={processing} className="bg-gradient-to-r from-blue-600 to-purple-600">Add Teacher</Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {teachers.map((teacher: any) => (
            <Card key={teacher.id} className="shadow-sm border-0 bg-white/50 backdrop-blur-sm hover:shadow-md transition-all">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-semibold text-lg">{teacher.user.name}</h3>
                  <p className="text-sm text-gray-500">{teacher.user.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-emerald-600 rounded-full bg-emerald-50 px-3 py-1">Wallet: ₹{teacher.wallet_balance}</span>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    router.put(route('admin.teachers.update', teacher.id), {
                      commission_percent: (e.target as any).percent.value
                    })
                  }} className="flex gap-2">
                    <Input type="number" name="percent" defaultValue={teacher.commission_percent} min="0" max="100" className="w-20" />
                    <Button type="submit" variant="outline">%</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
