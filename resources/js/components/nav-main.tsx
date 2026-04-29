import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
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
        <SidebarGroup className="px-3 py-4">
            <SidebarMenu className="gap-1">
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={`h-9 px-3 rounded-lg transition-all duration-150 ${
                                    active 
                                        ? "bg-primary/5 text-primary border border-primary/20 shadow-none" 
                                        : "text-slate-500 hover:bg-muted/50 hover:text-slate-900 border border-transparent"
                                }`}
                            >
                                <Link 
                                    href={item.href} 
                                    prefetch 
                                    onClick={() => setOpenMobile(false)}
                                    className="flex items-center gap-2.5 w-full"
                                >
                                    {item.icon && <item.icon className={`size-4 ${active ? "text-primary" : "text-slate-400"}`} strokeWidth={active ? 2.5 : 2} />}
                                    <span className={`text-[10px] tracking-[0.15em] uppercase font-black ${active ? "text-primary" : "text-slate-500"}`}>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
