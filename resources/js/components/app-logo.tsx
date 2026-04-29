import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3 py-2 px-1 w-full">
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20 shrink-0">
                <AppLogoIcon className="size-5 fill-current text-white" />
            </div>
            <div className="flex flex-col flex-1 justify-center min-w-0">
                <span className="truncate leading-tight font-black text-[14px] text-primary tracking-tight">
                    Management
                </span>
                <span className="truncate leading-tight font-medium text-[10px] text-muted-foreground/80 tracking-tight">
                    Tech Coaching v2.4
                </span>
            </div>
        </div>
    );
}
