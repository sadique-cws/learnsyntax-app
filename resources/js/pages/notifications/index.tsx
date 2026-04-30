import { Head, Link, router } from '@inertiajs/react';
import { Bell, CheckCheck, Trash2, Clock, ExternalLink } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Notifications({ notifications }: { notifications: any }) {
    const markAllAsRead = () => {
        router.post(route('notifications.read-all'));
    };

    const markAsRead = (id: string) => {
        router.post(route('notifications.read', { id }));
    };

    return (
        <>
            <Head title="Notifications" />
            <div className="flex flex-1 flex-col gap-5 p-4 lg:p-6 bg-background">
                {/* Header */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-foreground tracking-tight">Notifications</h1>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">Stay updated with your latest activities and alerts.</p>
                    </div>
                    {notifications.data.length > 0 && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={markAllAsRead}
                            className="h-8 px-3 rounded-sm text-[10px] font-bold uppercase tracking-tight border-primary/10 hover:bg-primary hover:text-white transition-all shadow-none"
                        >
                            <CheckCheck className="mr-2 h-3 w-3" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                <div className="rounded-sm border border-border/80 bg-background overflow-hidden shadow-sm">
                    {notifications.data.length > 0 ? (
                        <div className="divide-y divide-border/60">
                            {notifications.data.map((notification: any) => (
                                <div 
                                    key={notification.id} 
                                    className={cn(
                                        "p-4 transition-colors flex gap-4 group",
                                        !notification.read_at ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/5"
                                    )}
                                >
                                    <div className={cn(
                                        "size-10 rounded-sm flex items-center justify-center border shrink-0",
                                        !notification.read_at ? "bg-primary/10 text-primary border-primary/20" : "bg-muted/30 text-muted-foreground border-border/60"
                                    )}>
                                        <Bell className="size-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="text-sm font-bold text-foreground leading-tight">
                                                {notification.data.subject}
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                                                    <Clock className="size-3" />
                                                    {new Date(notification.created_at).toLocaleDateString()}
                                                </div>
                                                {!notification.read_at && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="size-7 rounded-sm text-muted-foreground/40 hover:text-primary hover:bg-primary/5"
                                                    >
                                                        <CheckCheck className="size-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 leading-normal max-w-2xl">
                                            {notification.data.body}
                                        </p>
                                        
                                        {notification.data.link && (
                                            <div className="mt-3">
                                                <Button asChild variant="outline" size="sm" className="h-7 px-3 rounded-sm text-[10px] font-bold uppercase tracking-tight border-primary/20 hover:bg-primary hover:text-white transition-all shadow-none">
                                                    <Link href={notification.data.link}>
                                                        View Details
                                                        <ExternalLink className="ml-2 h-3 w-3" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center flex flex-col items-center justify-center">
                            <div className="size-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                                <Bell className="size-8 text-muted-foreground/30" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">No notifications yet</h3>
                            <p className="text-xs text-muted-foreground mt-1">We'll notify you when something important happens.</p>
                        </div>
                    )}
                </div>

                {/* Pagination (Simplified) */}
                {notifications.links && notifications.links.length > 3 && (
                    <div className="flex justify-center gap-2 mt-2">
                        {notifications.links.map((link: any, i: number) => (
                            <Button
                                key={i}
                                asChild={!!link.url}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                className={cn(
                                    "h-8 rounded-sm text-[10px] font-bold uppercase tracking-tight shadow-none",
                                    !link.url && "opacity-50 pointer-events-none"
                                )}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            >
                                {link.url ? <Link href={link.url} /> : null}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Notifications.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Notifications', href: '/notifications' }]}>
        {page}
    </AppLayout>
);
