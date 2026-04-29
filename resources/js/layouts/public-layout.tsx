import { Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun, Home, BookOpen, User, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as any;
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground font-sans pb-14 md:pb-0">
            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-12">
                <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogoIcon className="size-5 text-primary" />
                            <span className="text-sm font-semibold hidden sm:block">Learn Syntax</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-5 text-[13px] font-medium text-muted-foreground">
                            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                            <Link href="/courses" className="hover:text-foreground transition-colors">Courses</Link>
                            <Link href="#" className="hover:text-foreground transition-colors">Internships</Link>
                            <Link href="#" className="hover:text-foreground transition-colors">Tutorials</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-sm size-8">
                            {mounted && (resolvedAppearance === 'dark' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />)}
                        </Button>

                        {auth.user ? (
                            <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-border">
                                <div className="text-right hidden sm:block">
                                    <div className="text-xs font-medium leading-none text-foreground">{auth.user.name}</div>
                                    <Link href={dashboard().url} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                                </div>
                                <div className="size-7 rounded-sm bg-muted overflow-hidden border border-border shrink-0">
                                    <img src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=random`} alt={auth.user.name} className="size-full object-cover" />
                                </div>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-1.5 pl-2">
                                <Button asChild variant="ghost" size="sm" className="rounded-sm font-medium text-xs h-7 px-2.5">
                                    <Link href={login().url}>Log in</Link>
                                </Button>
                                <Button asChild size="sm" className="rounded-sm font-medium text-xs h-7 px-2.5 shadow-none">
                                    <Link href={register().url}>Get Started</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            <main className="flex-1 pt-12">
                {children}
            </main>

            {/* Footer */}
            <footer className="hidden md:block bg-background border-t border-border pt-10 pb-6">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                            <AppLogoIcon className="size-5 text-primary" />
                            <span className="text-sm font-semibold">Learn Syntax</span>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                            Empowering the next generation of developers with affordable, high-quality technical education and guaranteed placement support.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 text-xs text-foreground">Platform</h4>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                            <li><Link href="/courses" className="hover:text-foreground transition-colors">All Courses</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Internships</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Workshops</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 text-xs text-foreground">Company</h4>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                            <li><Link href="#" className="hover:text-foreground transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-6 mt-6 border-t border-border">
                    <p className="text-[10px] text-muted-foreground">© {new Date().getFullYear()} Learn Syntax. All rights reserved.</p>
                </div>
            </footer>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex items-center justify-around h-14">
                <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-foreground hover:bg-muted/50 transition-colors gap-0.5">
                    <Home className="size-4" />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>
                <Link href="/courses" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors gap-0.5">
                    <BookOpen className="size-4" />
                    <span className="text-[10px] font-medium">Courses</span>
                </Link>
                {auth.user ? (
                    <Link href={dashboard().url} className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors gap-0.5">
                        <User className="size-4" />
                        <span className="text-[10px] font-medium">Account</span>
                    </Link>
                ) : (
                    <Link href={login().url} className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors gap-0.5">
                        <LogIn className="size-4" />
                        <span className="text-[10px] font-medium">Log in</span>
                    </Link>
                )}
            </nav>
        </div>
    );
}
