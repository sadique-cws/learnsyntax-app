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
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10 font-sans selection:bg-primary/20">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col items-center gap-6">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-3 group"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <AppLogoIcon className="size-8 text-primary" />
                            </div>
                            <div className="flex flex-col items-center leading-none">
                                <span className="font-black text-xl tracking-tighter uppercase">Learn <span className="text-primary">Syntax</span></span>
                            </div>
                        </Link>

                        <div className="space-y-1 text-center">
                            <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
                            <p className="text-sm text-muted-foreground font-medium">
                                {description}
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm shadow-black/[0.02]">
                        {children}
                    </div>

                    <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} Learn Syntax Platform
                    </p>
                </div>
            </div>
        </div>
    );
}
