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
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-background px-1 lg:hidden pb-safe shadow-none">
            {navItems.map((item) => {
                const active = isCurrentUrl(item.href);
                return (
                    <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                            'flex flex-col items-center justify-center relative min-w-[60px] h-full transition-all duration-200',
                            active ? 'text-primary' : 'text-slate-400'
                        )}
                    >
                        <div className="flex items-center justify-center h-8">
                            <item.icon className={cn('size-5 transition-transform', active && 'scale-110')} strokeWidth={active ? 2.5 : 2} />
                        </div>
                        <span className={cn(
                            "text-[8px] font-black uppercase tracking-[0.2em] transition-all",
                            active ? "opacity-100" : "opacity-40"
                        )}>{item.title}</span>
                        {active && (
                            <div className="absolute top-0 w-8 h-0.5 bg-primary rounded-full" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
