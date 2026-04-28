import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function WalletPage({ balance, transactions }: any) {
  return (
    <>
      <Head title="My Wallet" />
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">My Earnings Wallet</h1>
        <Card className="border-0 shadow-lg bg-emerald-50">
          <CardContent className="p-8">
            <p className="text-sm font-semibold text-emerald-800  ">Available Balance</p>
            <h2 className="text-6xl font-black text-emerald-600">₹{balance}</h2>
          </CardContent>
        </Card>

        <h3 className="text-2xl font-semibold mt-8 border-b pb-4">Transaction History</h3>
        <div className="space-y-4">
          {transactions.length === 0 && <p className="text-gray-500 italic">No transactions yet.</p>}
          {transactions.map((tx: any) => (
            <div key={tx.id} className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div>
                <p className="font-medium text-gray-900">{tx.description}</p>
                <p className="text-sm text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p>
              </div>
              <div className={`font-bold text-lg ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
