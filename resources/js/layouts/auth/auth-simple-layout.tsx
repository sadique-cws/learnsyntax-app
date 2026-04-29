import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-4 md:p-10 font-sans selection:bg-primary/20">
            <div className="w-full max-w-[360px]">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex items-center gap-2.5 group"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                                <AppLogoIcon className="size-5 text-primary" />
                            </div>
                            <span className="font-semibold text-lg tracking-tight text-foreground">Learn<span className="text-primary">Syntax</span></span>
                        </Link>

                        <div className="space-y-0.5 text-center">
                            <h1 className="text-lg font-semibold text-foreground tracking-tight">{title}</h1>
                            <p className="text-xs text-muted-foreground font-medium">
                                {description}
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-card border border-border rounded-sm p-5 md:p-6 shadow-none">
                        {children}
                    </div>

                    <p className="text-center text-[11px] text-muted-foreground/60 font-medium">
                        &copy; {new Date().getFullYear()} Learn Syntax Education. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
