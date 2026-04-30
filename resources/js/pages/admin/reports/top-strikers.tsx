import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Flame, Trophy, Calendar, User, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function TopStrikers({ strikers }: { strikers: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStrikers = strikers.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head title="Top Strikers Report" />
            
            <div className="w-full p-4 space-y-3">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/users" className="p-2 hover:bg-muted rounded-sm border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0">
                            <ArrowLeft className="size-4" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">Top Strikers</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">Ranking users by their login consistency</p>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60" />
                        <Input 
                            placeholder="Filter by name or email..." 
                            className="pl-9 h-8 w-64 rounded-sm border-border text-xs shadow-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Report Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    {/* Top 3 Podium */}
                    <div className="lg:col-span-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {filteredStrikers.slice(0, 3).map((striker, i) => (
                                <div key={striker.id} className={cn(
                                    "p-4 rounded-sm border flex flex-col items-center text-center relative overflow-hidden",
                                    i === 0 ? "bg-amber-50 border-amber-200" : 
                                    i === 1 ? "bg-slate-50 border-slate-200" : 
                                    "bg-orange-50 border-orange-200"
                                )}>
                                    <div className="absolute top-0 right-0 p-2">
                                        <Trophy className={cn(
                                            "size-12 opacity-10 rotate-12",
                                            i === 0 ? "text-amber-600" : i === 1 ? "text-slate-600" : "text-orange-600"
                                        )} />
                                    </div>
                                    <div className={cn(
                                        "size-12 rounded-sm flex items-center justify-center text-xl font-bold mb-3 border shadow-sm",
                                        i === 0 ? "bg-white text-amber-600 border-amber-200" : 
                                        i === 1 ? "bg-white text-slate-600 border-slate-200" : 
                                        "bg-white text-orange-600 border-orange-200"
                                    )}>
                                        {i + 1}
                                    </div>
                                    <div className="text-sm font-bold text-foreground truncate w-full px-4">{striker.name}</div>
                                    <div className="text-[10px] text-muted-foreground mb-3 truncate w-full px-4">{striker.email}</div>
                                    <div className="flex items-center gap-1 text-2xl font-black tabular-nums">
                                        <Flame className="size-5 text-orange-500 fill-orange-500" />
                                        <span>{striker.streak}</span>
                                        <span className="text-xs font-bold text-muted-foreground ml-1 uppercase">Days</span>
                                    </div>
                                    <div className="text-[10px] font-bold text-muted-foreground mt-1">Best: {striker.longest}d</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Full Leaderboard */}
                    <div className="lg:col-span-12">
                        <div className="rounded-sm border border-border overflow-hidden bg-card">
                            <div className="px-3 py-2 border-b border-border bg-muted/5 flex items-center justify-between">
                                <h2 className="text-xs font-semibold text-foreground">Global Rankings</h2>
                                <span className="text-[10px] font-bold text-muted-foreground bg-muted/10 px-1.5 py-0.5 rounded-sm tabular-nums">
                                    {filteredStrikers.length} Active Strikers
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/5">
                                            <th className="px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Rank</th>
                                            <th className="px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-tight">User</th>
                                            <th className="px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-tight text-center">Current Streak</th>
                                            <th className="px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-tight text-center">Longest Streak</th>
                                            <th className="px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-tight text-right">Last Login</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredStrikers.map((striker, i) => (
                                            <tr key={striker.id} className="hover:bg-muted/5 transition-colors">
                                                <td className="px-4 py-3">
                                                    <span className={cn(
                                                        "inline-flex items-center justify-center size-6 rounded-sm text-xs font-bold tabular-nums border",
                                                        i < 3 ? "bg-primary text-primary-foreground border-primary" : "bg-muted/10 text-muted-foreground border-border"
                                                    )}>
                                                        {i + 1}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="size-8 rounded-sm bg-muted/30 flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0 border border-border">
                                                            {striker.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-semibold text-foreground truncate">{striker.name}</div>
                                                            <div className="text-[10px] text-muted-foreground truncate">{striker.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-1.5 font-bold text-orange-600 tabular-nums">
                                                        <Flame className="size-3.5 fill-orange-500 text-orange-500" />
                                                        {striker.streak}d
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="text-xs font-medium text-foreground tabular-nums">
                                                        {striker.longest} days
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground tabular-nums">
                                                        <Calendar className="size-3" />
                                                        {striker.last_login}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

TopStrikers.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Reports', href: '#' }, { title: 'Top Strikers', href: '/admin/reports/top-strikers' }]}>
        {page}
    </AppLayout>
);
