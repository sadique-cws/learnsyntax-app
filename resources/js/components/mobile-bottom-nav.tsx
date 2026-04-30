import { Link, usePage } from '@inertiajs/react';
import { Home, LayoutGrid, User, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard, home } from '@/routes';
import { edit as appearanceEdit } from '@/routes/appearance';
import { edit as profileEdit } from '@/routes/profile';

export function MobileBottomNav() {
    const { auth } = usePage().props as any;
    const { isCurrentUrl } = useCurrentUrl();
    const user = auth?.user;

    const navItems = user ? [
        { title: 'Home', href: dashboard().url, icon: Home },
        { title: 'Explore', href: '/courses', icon: LayoutGrid },
        { title: 'Alerts', href: '/notifications', icon: Bell, count: auth.unreadNotificationsCount },
        { title: 'Profile', href: profileEdit().url, icon: User },
    ] : [
        { title: 'Home', href: '/', icon: Home },
        { title: 'Courses', href: '/courses', icon: LayoutGrid },
        { title: 'Login', href: '/login', icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t border-border bg-background px-1 lg:hidden pb-safe">
            {navItems.map((item) => {
                const active = isCurrentUrl(item.href);
                return (
                    <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                            'flex flex-col items-center justify-center relative min-w-[56px] h-full gap-0.5 transition-colors',
                            active ? 'text-primary' : 'text-muted-foreground'
                        )}
                    >
                        <div className="relative">
                            <item.icon className={cn('size-5', active && 'text-primary')} strokeWidth={active ? 2 : 1.5} />
                            {(item as any).count > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-red-500 px-0.5 text-[8px] font-bold text-white ring-1 ring-background">
                                    {(item as any).count}
                                </span>
                            )}
                        </div>
                        <span className={cn(
                            "text-[10px] font-medium transition-colors",
                            active ? "text-primary" : "text-muted-foreground"
                        )}>{item.title}</span>
                        {active && (
                            <div className="absolute top-0 w-6 h-0.5 bg-primary rounded-full" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
