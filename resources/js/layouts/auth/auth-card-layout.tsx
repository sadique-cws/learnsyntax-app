import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-4 md:p-10 font-sans selection:bg-primary/20">
            <div className="flex w-full max-w-[440px] flex-col gap-6">
                <Link
                    href={home()}
                    className="flex items-center gap-2.5 self-center group"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                        <AppLogoIcon className="size-5 text-primary" />
                    </div>
                    <span className="font-semibold text-lg tracking-tight text-foreground">Learn<span className="text-primary">Syntax</span></span>
                </Link>

                <Card className="rounded-sm border-border shadow-none overflow-hidden">
                    <CardHeader className="px-8 md:px-10 pt-8 md:pt-10 pb-0 text-center space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
                        <CardDescription className="text-sm font-medium">{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 md:px-10 py-8 md:py-10">
                        {children}
                    </CardContent>
                </Card>
                
                <p className="text-center text-[11px] text-muted-foreground/60 font-medium">
                    &copy; {new Date().getFullYear()} Learn Syntax Education.
                </p>
            </div>
        </div>
    );
}
