import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutGrid, Wallet, LogOut, Users, GraduationCap, ShieldCheck, Activity } from 'lucide-react';
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
    SidebarGroup,
    SidebarGroupLabel,
    useSidebar,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { dashboard } from '@/routes';

export function TeacherSidebar() {
    const { setOpenMobile } = useSidebar();

    const overviewItems: NavItem[] = [
        {
            title: 'Overview',
            href: '/teacher/dashboard',
            icon: LayoutGrid,
        },
    ];

    const academicItems: NavItem[] = [
        {
            title: 'My Courses',
            href: '/teacher/courses',
            icon: BookOpen,
        },
        {
            title: 'Assignments',
            href: '/teacher/assignments',
            icon: GraduationCap,
        },
        {
            title: 'Daily Progress',
            href: '/teacher/progress',
            icon: Activity,
        },
    ];

    const financeItems: NavItem[] = [
        {
            title: 'Wallet & Payouts',
            href: '/teacher/wallet',
            icon: Wallet,
        },
    ];

    const settingItems: NavItem[] = [
        {
            title: 'KYC Verification',
            href: '/teacher/kyc',
            icon: ShieldCheck,
        },
        {
            title: 'Switch to Student',
            href: dashboard().url,
            icon: LogOut,
        }
    ];

    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-border/50">
            <SidebarHeader className="border-b border-border/50 py-4">
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

            <SidebarContent className="gap-0 py-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-4 mb-2">Main</SidebarGroupLabel>
                    <NavMain items={overviewItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-4 mb-2">Management</SidebarGroupLabel>
                    <NavMain items={academicItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-4 mb-2">Financials</SidebarGroupLabel>
                    <NavMain items={financeItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-4 mb-2">Account</SidebarGroupLabel>
                    <NavMain items={settingItems} />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-border/50">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
