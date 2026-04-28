import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Book, Users, CreditCard, ShoppingBag, Home, GraduationCap, Trophy } from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const isAdmin = user?.is_admin;

    const mainNavItems: NavItem[] = [];

    if (user) {
        mainNavItems.push({
            title: 'Dashboard',
            href: dashboard().url,
            icon: LayoutGrid,
        });

        if (isAdmin) {
            mainNavItems.push(
                {
                    title: 'Manage Courses',
                    href: '/admin/courses',
                    icon: Book,
                },
                {
                    title: 'Manage Students',
                    href: '/admin/students',
                    icon: Users,
                },
                {
                    title: 'Manage Batches',
                    href: '/admin/batches',
                    icon: GraduationCap,
                },
                {
                    title: 'All Payments',
                    href: '/admin/payments',
                    icon: CreditCard,
                },
                {
                    title: 'Manage Assignments',
                    href: '/admin/academic/assignments',
                    icon: BookOpen,
                },
                {
                    title: 'Manage Exams',
                    href: '/admin/academic/exams',
                    icon: Trophy,
                }
            );
        } else {
            mainNavItems.push(
                {
                    title: 'Browse Courses',
                    href: '/courses',
                    icon: ShoppingBag,
                },
                {
                    title: 'My Courses',
                    href: '/dashboard',
                    icon: Book,
                }
            );
        }
    } else {
        mainNavItems.push(
            {
                title: 'Home',
                href: '/',
                icon: Home,
            },
            {
                title: 'All Courses',
                href: '/courses',
                icon: ShoppingBag,
            }
        );
    }

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard().url} prefetch>
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
