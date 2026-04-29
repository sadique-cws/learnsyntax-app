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
        <SidebarGroup className="px-2 py-2">
            <SidebarMenu className="gap-1.5">
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={`h-[36px] px-3 rounded-md transition-all duration-200 ${
                                    active 
                                        ? "bg-primary/5 text-primary border border-dashed border-primary/30 shadow-sm shadow-primary/5" 
                                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-transparent"
                                }`}
                            >
                                <Link 
                                    href={item.href} 
                                    prefetch 
                                    onClick={() => setOpenMobile(false)}
                                    className="flex items-center gap-2.5 w-full"
                                >
                                    {item.icon && <item.icon className={`size-[16px] ${active ? "text-primary" : "text-muted-foreground/70"}`} strokeWidth={active ? 2.5 : 2} />}
                                    <span className={`text-[11px] tracking-[0.08em] uppercase font-bold ${active ? "" : ""}`}>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
