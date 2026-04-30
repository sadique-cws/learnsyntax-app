import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import type { AppLayoutProps } from '@/types';

import { NotificationPopup } from '@/components/notification-popup';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden pb-16 lg:pb-0">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
                <MobileBottomNav />
                <NotificationPopup />
            </AppContent>
        </AppShell>
    );
}
