import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props as any;
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4 bg-background sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 size-7 rounded-sm" />
                <div className="size-px h-4 bg-border mx-1 hidden sm:block" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                    <span>{time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                    <span className="text-border">·</span>
                    <span>{time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-xs font-medium text-foreground leading-none">{auth.user.name}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">{auth.user.is_admin ? 'Admin' : 'Student'}</span>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleLogout}
                        className="size-8 rounded-sm text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="size-3.5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
