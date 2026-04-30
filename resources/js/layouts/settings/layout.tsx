import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { User, Shield, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import AppLayout from '../app-layout';

const sidebarNavItems = [
    { title: 'Profile', href: edit(), icon: User },
    { title: 'Security', href: editSecurity(), icon: Shield },
    { title: 'Appearance', href: editAppearance(), icon: Palette },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <AppLayout breadcrumbs={[{ title: 'Settings', href: '#' }]}>
            <div className="w-full p-4 space-y-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Nav */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="rounded-sm border border-border bg-card overflow-hidden">
                            <div className="px-3 py-2 border-b border-border bg-muted/5">
                                <h2 className="text-xs font-semibold text-foreground">User Settings</h2>
                            </div>
                            <nav className="p-1.5 space-y-0.5">
                                {sidebarNavItems.map((item, index) => {
                                    const active = isCurrentOrParentUrl(item.href);
                                    return (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                            className={cn(
                                                'w-full justify-start h-9 px-3 rounded-sm font-medium transition-colors',
                                                active ? 'bg-primary/5 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                            )}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className={cn("size-3.5 mr-2.5", active ? "text-primary" : "text-muted-foreground")} />
                                                <span className="text-xs">{item.title}</span>
                                            </Link>
                                        </Button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        {children}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
