import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function TeacherDashboard({ stats }: any) {
  return (
    <>
      <Head title="Teacher Dashboard" />
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Instructor Dashboard</h1>
            <div className="flex gap-4">
                <Link href={route('teacher.courses.index')} className="text-sm font-medium text-blue-600 hover:underline">Manage Courses</Link>
                <Link href={route('teacher.wallet')} className="text-sm font-medium text-blue-600 hover:underline">My Wallet</Link>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader><CardTitle className="text-blue-800">Total Courses</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-black text-blue-600">{stats.courses}</p></CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader><CardTitle className="text-emerald-800">Total Sales</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-black text-emerald-600">₹{stats.total_sales}</p></CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader><CardTitle className="text-purple-800">Wallet Balance</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-black text-purple-600">₹{stats.wallet_balance}</p></CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
