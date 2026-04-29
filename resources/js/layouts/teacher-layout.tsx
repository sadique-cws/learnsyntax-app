import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { TeacherSidebar } from '@/components/teacher-sidebar';
import type { BreadcrumbItem } from '@/types';

export default function TeacherLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppShell variant="sidebar">
            <TeacherSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden pb-16 lg:pb-0 bg-slate-50">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
                <MobileBottomNav />
            </AppContent>
        </AppShell>
    );
}
