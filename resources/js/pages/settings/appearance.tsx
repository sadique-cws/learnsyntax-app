import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import SettingsLayout from '@/layouts/settings/layout';

export default function Appearance() {
    return (
        <SettingsLayout>
            <Head title="Appearance Settings" />

            <div className="space-y-4">
                <div className="rounded-sm border border-border bg-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-border bg-muted/5">
                        <h2 className="text-sm font-semibold text-foreground">Theme & Appearance</h2>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Customize how the platform looks on your device.</p>
                    </div>
                    
                    <div className="p-4">
                        <AppearanceTabs />
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
