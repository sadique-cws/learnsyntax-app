import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative grid min-h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0 font-sans selection:bg-primary/20">
            {/* Dark Side - Immersive Content */}
            <div className="relative hidden h-full flex-col bg-zinc-950 p-10 text-white lg:flex border-r border-white/5 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(var(--primary-rgb),0.05),transparent_40%)]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-2.5 font-semibold text-lg"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <AppLogoIcon className="size-5 text-primary" />
                    </div>
                    <span className="tracking-tight">Learn<span className="text-primary">Syntax</span></span>
                </Link>

                <div className="relative z-20 mt-auto max-w-lg">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Live Learning Community</span>
                        </div>
                        <blockquote className="space-y-4">
                            <p className="text-2xl font-medium leading-tight tracking-tight">
                                &ldquo;The most comprehensive platform for mastering modern development syntax and logic.&rdquo;
                            </p>
                            <footer className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10" />
                                <div>
                                    <p className="text-sm font-semibold text-white">Alex Rivera</p>
                                    <p className="text-xs text-white/50">Lead Developer @ TechScale</p>
                                </div>
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex flex-col p-6 lg:p-12 min-h-svh justify-center bg-background">
                <div className="mx-auto flex w-full max-w-[380px] flex-col justify-center gap-10">
                    <div className="flex flex-col items-center lg:items-start gap-4">
                        <Link
                            href={home()}
                            className="flex items-center gap-2.5 lg:hidden group"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                                <AppLogoIcon className="size-5 text-primary" />
                            </div>
                            <span className="font-semibold text-lg tracking-tight text-foreground">Learn<span className="text-primary">Syntax</span></span>
                        </Link>
                        
                        <div className="space-y-1 text-center lg:text-left">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        {children}
                    </div>

                    <div className="flex items-center gap-2 text-center justify-center lg:justify-start">
                        <p className="text-[11px] text-muted-foreground/60 font-medium">
                            &copy; {new Date().getFullYear()} Learn Syntax Education.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
