import { Link, usePage } from '@inertiajs/react';
import { Home, LayoutGrid, User, Palette } from 'lucide-react';
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
        {
            title: 'Home',
            href: dashboard().url,
            icon: Home,
        },
        {
            title: 'Explore',
            href: '/courses',
            icon: LayoutGrid,
        },
        {
            title: 'Theme',
            href: appearanceEdit().url,
            icon: Palette,
        },
        {
            title: 'Profile',
            href: profileEdit().url,
            icon: User,
        },
    ] : [
        {
            title: 'Home',
            href: '/',
            icon: Home,
        },
        {
            title: 'Courses',
            href: '/courses',
            icon: LayoutGrid,
        },
        {
            title: 'Login',
            href: '/login',
            icon: User,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-border bg-background px-2 lg:hidden pb-safe">
            {navItems.map((item) => {
                const active = isCurrentUrl(item.href);
                return (
                    <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                            'flex flex-col items-center justify-center space-y-1 relative min-w-[64px] h-full',
                            active ? 'text-primary' : 'text-muted-foreground'
                        )}
                    >
                        <div className={cn(
                            "flex items-center justify-center w-16 h-8 rounded-full transition-colors duration-200",
                            active ? "bg-primary/10" : "bg-transparent"
                        )}>
                            <item.icon className={cn('size-[22px]', active && 'fill-primary/20')} strokeWidth={active ? 2.5 : 2} />
                        </div>
                        <span className={cn(
                            "text-[11px] font-bold tracking-tight transition-all",
                            active ? "opacity-100" : "opacity-80"
                        )}>{item.title}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
