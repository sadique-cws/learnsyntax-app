import { Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun, Menu, X, Home, BookOpen, User, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as any;
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-primary/20 pb-14 md:pb-0">
            {/* Flat Android-style Navbar (Solid Background, 1px border) */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
                <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogoIcon className="size-6 text-primary" />
                            <span className="text-lg font-black tracking-tight uppercase hidden sm:block">Learn Syntax</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-5 text-[13px] font-bold text-muted-foreground uppercase tracking-wide">
                            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                            <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Internships</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Tutorials</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full size-9">
                            {mounted && (resolvedAppearance === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />)}
                        </Button>
                        
                        {auth.user ? (
                            <div className="flex items-center gap-3 pl-3 ml-1 border-l border-border">
                                <div className="text-right hidden sm:block">
                                    <div className="text-xs font-bold leading-none">{auth.user.name}</div>
                                    <Link href={dashboard().url} className="text-[10px] text-muted-foreground hover:text-primary uppercase tracking-wider">Dashboard</Link>
                                </div>
                                <div className="size-8 rounded bg-muted overflow-hidden border border-border">
                                    <img src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=random`} alt={auth.user.name} className="size-full object-cover" />
                                </div>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2 pl-2">
                                <Button asChild variant="ghost" size="sm" className="rounded font-bold text-xs">
                                    <Link href={login().url}>Log in</Link>
                                </Button>
                                <Button asChild variant="accent" size="sm" className="rounded font-bold text-xs h-8">
                                    <Link href={register().url}>Get Started</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            <main className="flex-1 pt-14">
                {children}
            </main>

            {/* Solid Flat Footer - Hidden on Mobile */}
            <footer className="hidden md:block bg-background border-t border-border pt-12 pb-8">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <AppLogoIcon className="size-6 text-primary" />
                            <span className="text-lg font-black tracking-tight uppercase">Learn Syntax</span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
                            Empowering the next generation of developers with affordable, high-quality technical education and guaranteed placement support.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black mb-4 text-sm uppercase tracking-wider">Platform</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                            <li><Link href="/courses" className="hover:text-primary transition-colors">All Courses</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Internships</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Workshops</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black mb-4 text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                            <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground">© {new Date().getFullYear()} Learn Syntax. All rights reserved.</p>
                </div>
            </footer>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex items-center justify-around h-14 pb-safe">
                <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-foreground hover:bg-muted/50 transition-colors">
                    <Home className="size-[18px]" />
                    <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Home</span>
                </Link>
                <Link href="/courses" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                    <BookOpen className="size-[18px]" />
                    <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Courses</span>
                </Link>
                {auth.user ? (
                    <Link href={dashboard().url} className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                        <User className="size-[18px]" />
                        <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Account</span>
                    </Link>
                ) : (
                    <Link href={login().url} className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                        <LogIn className="size-[18px]" />
                        <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Log in</span>
                    </Link>
                )}
            </nav>
        </div>
    );
}
