import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function NotificationPopup() {
    const { auth } = usePage().props as any;
    const [isOpen, setIsOpen] = useState(false);
    const [newNotification, setNewNotification] = useState<any>(null);
    const latest = newNotification || auth.latestNotification;

    useEffect(() => {
        // Only show if we haven't shown it in this session and there's a latest unread notification
        if (latest && !sessionStorage.getItem('notified')) {
            setIsOpen(true);
        }
    }, [latest]);

    // Real-time listener
    useEffect(() => {
        if (auth.user && (window as any).Echo) {
            const channel = `App.Models.User.${auth.user.id}`;
            (window as any).Echo.private(channel)
                .notification((notification: any) => {
                    console.log('Real-time notification received:', notification);
                    // Clear the notified flag to allow showing the new one
                    sessionStorage.removeItem('notified');
                    setNewNotification({
                        ...notification,
                        data: notification // Laravel Echo notification payload is direct
                    });
                });

            return () => {
                (window as any).Echo.leave(channel);
            };
        }
    }, [auth.user]);

    const handleAction = (view = false) => {
        sessionStorage.setItem('notified', 'true');
        setIsOpen(false);
        // Mark all as read as requested
        router.post('/notifications/read-all', {}, {
            preserveScroll: true,
            onSuccess: () => {
                if (view) {
                    router.visit('/notifications');
                }
            }
        });
    };

    if (!latest) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) handleAction(false);
        }}>
            <DialogContent className="sm:max-w-[425px] border-none shadow-2xl p-0 overflow-hidden bg-background animate-in fade-in zoom-in duration-300">
                <div className="h-1.5 w-full bg-indigo-600" />
                <div className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 size-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            <Bell className="size-6 text-indigo-600 animate-bounce" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-lg font-bold text-foreground">
                                {latest.data?.subject || 'Important Update'}
                            </DialogTitle>
                            <div className="mt-2 p-3 bg-muted/30 border border-border rounded-sm">
                                <p className="text-sm text-foreground font-medium leading-relaxed italic">
                                    "{latest.data?.body || latest.data?.message || 'You have new updates waiting for you.'}"
                                </p>
                            </div>
                            <DialogDescription className="mt-3 text-[11px] text-muted-foreground font-medium uppercase tracking-tight">
                                Received {latest.created_at ? new Date(latest.created_at).toLocaleString() : 'Just now'}
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button 
                            variant="outline" 
                            onClick={() => handleAction(false)}
                            className="flex-1 h-10 rounded-sm font-bold text-xs uppercase tracking-tight shadow-none cursor-pointer"
                        >
                            Close
                        </Button>
                        <Button 
                            onClick={() => handleAction(true)}
                            className="flex-1 h-10 rounded-sm bg-indigo-600 hover:bg-indigo-700 font-bold text-xs uppercase tracking-tight shadow-none cursor-pointer"
                        >
                            View All
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
