import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5 py-1.5 px-0.5 w-full">
            <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-primary text-primary-foreground shrink-0">
                <AppLogoIcon className="size-4 fill-current text-white" />
            </div>
            <div className="flex flex-col flex-1 justify-center min-w-0">
                <span className="truncate leading-tight font-semibold text-sm text-foreground">
                    LearnSyntax
                </span>
                <span className="truncate leading-tight text-[10px] text-muted-foreground">
                    Admin Panel
                </span>
            </div>
        </div>
    );
}
