import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useEffect, useState } from 'react';
import { Wifi, Clock, Calendar, LogOut, User } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props as any;
    const [dateTime, setDateTime] = useState(new Date());
    const [speed, setSpeed] = useState<string>('Detecting...');

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        
        const updateConnectionSpeed = () => {
            const conn = (navigator as any).connection;
            if (conn) {
                setSpeed(`${conn.downlink} Mbps`);
            } else {
                setSpeed('Stable');
            }
        };

        updateConnectionSpeed();
        if ((navigator as any).connection) {
            (navigator as any).connection.addEventListener('change', updateConnectionSpeed);
        }

        return () => {
            clearInterval(timer);
            if ((navigator as any).connection) {
                (navigator as any).connection.removeEventListener('change', updateConnectionSpeed);
            }
        };
    }, []);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div className="size-px h-4 bg-border mx-1 hidden sm:block" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-4 sm:gap-8">
                <div className="hidden lg:flex items-center gap-6 border-r border-border pr-6 mr-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tight text-muted-foreground/60">
                        <Wifi className="size-3.5 text-primary" />
                        <span>{speed}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tight text-muted-foreground/60">
                        <Calendar className="size-3.5 text-primary" />
                        <span>{dateTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tight text-primary bg-primary/5 px-3 py-1.5 rounded-sm border border-primary/10">
                        <Clock className="size-3.5" />
                        <span>{dateTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-tight leading-none mb-0.5">{auth.user.name}</span>
                        <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{auth.user.is_admin ? 'Administrator' : 'Student'}</span>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleLogout}
                        className="size-9 rounded-sm border border-border hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="size-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
