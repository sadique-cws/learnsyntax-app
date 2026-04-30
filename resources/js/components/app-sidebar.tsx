import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Book, Shield, 
    CheckCircle2, Users, Award, CreditCard, ShoppingBag, Home, GraduationCap, Trophy, Receipt, Settings, Layers } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
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
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const { setOpenMobile } = useSidebar();
    const user = auth?.user;
    const isAdmin = user?.is_admin;

    const mainNavItems: NavItem[] = [];

    if (user) {
        mainNavItems.push({
            title: 'Dashboard',
            href: dashboard().url,
            icon: LayoutGrid,
        });

        if (user.is_teacher) {
            mainNavItems.push({
                title: 'Instructor Panel',
                href: '/teacher/dashboard',
                icon: Award,
            });
            mainNavItems.push({
                title: 'Learning Progress',
                href: '/teacher/progress',
                icon: Layers,
            });
            mainNavItems.push({
                title: 'Assignments',
                href: '/teacher/assignments',
                icon: BookOpen,
            });
        }

        if (isAdmin) {
            mainNavItems.push(
                { title: 'Users', href: '/admin/users', icon: Shield },
                { title: 'Courses', href: '/admin/courses', icon: Book },
                { title: 'Students', href: '/admin/students', icon: Users },
                { title: 'Teachers', href: '/admin/teachers', icon: GraduationCap },
                { title: 'Payouts', href: '/admin/withdrawals', icon: CreditCard },
                { title: 'Qualified', href: '/admin/students/qualified', icon: CheckCircle2 },
                { title: 'Certificates', href: '/admin/certificates', icon: Award },
                { title: 'Batches', href: '/admin/batches', icon: FolderGit2 },
                { title: 'Payments', href: '/admin/payments', icon: CreditCard },
                { title: 'GST Reports', href: '/admin/payments/gst-report', icon: Receipt },
                { title: 'Top Strikers', href: '/admin/reports/top-strikers', icon: Trophy },
                { title: 'Assignments', href: '/admin/academic/assignments', icon: BookOpen },
                { title: 'Exams', href: '/admin/academic/exams', icon: Trophy },
                { title: 'Settings', href: '/admin/settings', icon: Settings },
            );
        } else {
            mainNavItems.push(
                { title: 'Browse Courses', href: '/courses', icon: ShoppingBag }
            );

            if (user.is_student) {
                mainNavItems.push({
                    title: 'Dashboard',
                    href: '/dashboard',
                    icon: LayoutGrid,
                });
                mainNavItems.push({
                    title: 'My Learning',
                    href: '/academic/learning',
                    icon: Book,
                });
                mainNavItems.push({
                    title: 'My Assignments',
                    href: '/academic/assignments',
                    icon: BookOpen,
                });
                mainNavItems.push({
                    title: 'My Exams',
                    href: '/academic/exams',
                    icon: Trophy,
                });
                mainNavItems.push({
                    title: 'My Payments',
                    href: '/academic/payments',
                    icon: CreditCard,
                });
            } else {
                mainNavItems.push({
                    title: 'Become a Student',
                    href: '/courses',
                    icon: CheckCircle2,
                });
            }
        }
    } else {
        mainNavItems.push(
            { title: 'Home', href: '/', icon: Home },
            { title: 'All Courses', href: '/courses', icon: ShoppingBag },
        );
    }

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link 
                                href={dashboard().url} 
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
