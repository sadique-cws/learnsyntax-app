import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const { setOpenMobile } = useSidebar();

    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarMenu className="gap-0.5">
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={`h-8 px-2.5 rounded-sm transition-colors duration-100 ${
                                    active 
                                        ? "bg-primary/5 text-primary font-medium" 
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                }`}
                            >
                                <Link 
                                    href={item.href} 
                                    prefetch 
                                    onClick={() => setOpenMobile(false)}
                                    className="flex items-center gap-2.5 w-full"
                                >
                                    {item.icon && <item.icon className={`size-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground/60"}`} strokeWidth={active ? 2 : 1.5} />}
                                    <span className="text-[13px] truncate">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
