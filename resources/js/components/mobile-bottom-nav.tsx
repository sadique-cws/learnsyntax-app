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
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-background px-4 lg:hidden ">
            {navItems.map((item) => {
                const active = isCurrentUrl(item.href);
                return (
                    <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                            'flex flex-col items-center justify-center space-y-1 transition-colors',
                            active ? 'text-primary' : 'text-muted-foreground'
                        )}
                    >
                        <item.icon className={cn('h-5 w-5', active && 'fill-current')} />
                        <span className="text-[10px] font-medium">{item.title}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
