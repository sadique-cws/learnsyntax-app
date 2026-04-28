import { Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun, Menu, X } from 'lucide-react';
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
        <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-primary/20">
            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogoIcon className="size-8 text-primary" />
                            <span className="text-xl font-bold tracking-tight">Learn Syntax</span>
                        </Link>
                        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                            <Link href="/courses" className="hover:text-primary transition-colors">Our Courses</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Internships</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Free Tutorials</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Mobile Menu Toggle */}
                        <button className="lg:hidden p-2 hover:bg-muted rounded-xl text-muted-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>

                        <div className="flex items-center gap-4 text-sm font-medium">
                            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                                {mounted && (resolvedAppearance === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />)}
                            </Button>
                            
                            {auth.user ? (
                                <div className="flex items-center gap-3 pl-4 border-l border-border">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-sm font-bold leading-none">{auth.user.name}</div>
                                        <Link href={dashboard().url} className="text-[10px] text-muted-foreground hover:text-primary">Go to Dashboard</Link>
                                    </div>
                                    <div className="size-10 rounded-xl bg-muted overflow-hidden border border-border">
                                        <img src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=random`} alt={auth.user.name} className="size-full object-cover" />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" size="sm" className="hidden sm:flex rounded-xl">
                                        <Link href={login().url}>Log in</Link>
                                    </Button>
                                    <Button asChild variant="default" size="sm" className="rounded-xl  bg-primary hover:bg-primary/90">
                                        <Link href={register().url}>Get Started</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-background border-b border-border p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
                        <Link href="/" className="block text-lg font-bold">Home</Link>
                        <Link href="/courses" className="block text-lg font-bold">Our Courses</Link>
                        <Link href="#" className="block text-lg font-bold">Internships</Link>
                        <Link href="#" className="block text-lg font-bold">Free Tutorials</Link>
                        {!auth.user && (
                            <div className="pt-4 flex flex-col gap-3">
                                <Button asChild variant="outline" className="w-full rounded-xl">
                                    <Link href={login().url}>Log in</Link>
                                </Button>
                                <Button asChild className="w-full rounded-xl">
                                    <Link href={register().url}>Get Started</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </header>

            <main className="flex-1 pt-16">
                {children}
            </main>

            {/* Public Footer */}
            <footer className="bg-card border-t border-border py-12">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <AppLogoIcon className="size-8 text-primary" />
                            <span className="text-xl font-bold tracking-tight uppercase">Learn Syntax</span>
                        </div>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            Empowering the next generation of developers with affordable, high-quality technical education.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/courses">All Courses</Link></li>
                            <li><Link href="#">Internships</Link></li>
                            <li><Link href="#">Workshops</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#">About Us</Link></li>
                            <li><Link href="#">Contact</Link></li>
                            <li><Link href="#">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} Learn Syntax. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
