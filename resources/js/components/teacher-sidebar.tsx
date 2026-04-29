import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutGrid, Wallet, LogOut, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

export function TeacherSidebar() {
    const { setOpenMobile } = useSidebar();

    const mainNavItems: NavItem[] = [
        {
            title: 'Instructor Dashboard',
            href: '/teacher/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Enrolled Students',
            href: '/teacher/students',
            icon: Users,
        },
        {
            title: 'Course Manager',
            href: '/teacher/courses',
            icon: BookOpen,
        },
        {
            title: 'Earnings Wallet',
            href: '/teacher/wallet',
            icon: Wallet,
        },
        {
            title: 'Exit to Student Portal',
            href: '/dashboard',
            icon: LogOut,
        }
    ];

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link 
                                href="/teacher/dashboard" 
                                prefetch 
                                onClick={() => setOpenMobile(false)}
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
