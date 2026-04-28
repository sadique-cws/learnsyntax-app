import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useEffect, useState } from 'react';
import { Wifi, Clock, Calendar } from 'lucide-react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const [dateTime, setDateTime] = useState(new Date());
    const [speed, setSpeed] = useState<string>('Detecting...');

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        
        // Simple speed detection using Network Information API
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

    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tight text-muted-foreground/60">
                    <Wifi className="size-3.5 text-primary" />
                    <span>{speed}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tight text-muted-foreground/60">
                    <Calendar className="size-3.5 text-primary" />
                    <span>{dateTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tight text-muted-foreground/60 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                    <Clock className="size-3.5 text-primary" />
                    <span className="text-primary">{dateTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
                </div>
            </div>
        </header>
    );
}
