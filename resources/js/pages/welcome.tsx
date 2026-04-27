import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppearance } from '@/hooks/use-appearance';
import { Clock, Users, ArrowUpRight, Moon, Sun, ChevronRight, GraduationCap, Search, Menu } from 'lucide-react';
import { useState } from 'react';

const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'ds', name: 'Data Science & Analytics', icon: '📊' },
    { id: 'dm', name: 'Digital Marketing', icon: '📱' },
    { id: 'sd', name: 'Software Development', icon: '💻' },
    { id: 'pp', name: 'Placement Program', icon: '🎓' },
    { id: 'bf', name: 'Banking & Finance', icon: '🏦' },
    { id: 'dsa', name: 'DSA Courses', icon: '🧬' },
];

export default function Welcome({
    canRegister = true,
    courses = [],
}: {
    canRegister?: boolean;
    courses?: any[];
}) {
    const { auth } = usePage().props as any;
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [selectedCategory, setSelectedCategory] = useState('ds');

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <>
            <Head title="Welcome to Learn Syntax">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-primary/20">
                {/* Navbar */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                    <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <AppLogoIcon className="size-8 text-primary" />
                                <span className="text-xl font-bold tracking-tight">Learn Syntax</span>
                            </div>
                            <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                                <Link href="/" className="hover:text-primary transition-colors text-foreground">Home</Link>
                                <Link href="/courses" className="hover:text-primary transition-colors">Our Courses</Link>
                                <Link href="#" className="hover:text-primary transition-colors">Internships</Link>
                                <Link href="#" className="hover:text-primary transition-colors">Free Tutorials</Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                                {resolvedAppearance === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
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
                                    {canRegister && (
                                        <Button asChild variant="default" size="sm" className="rounded-xl shadow-none bg-primary hover:bg-primary/90">
                                            <Link href={register().url}>Get Started</Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main className="flex-1 pt-16 pb-16">
                    {/* Trusted & Affordable Section (Now Full-Width Header Design) */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border mb-20">
                        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-24">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="text-left z-10">
                                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.1]">
                                        India's <span className="text-primary">Trusted & Affordable</span><br />
                                        Educational Platform
                                    </h1>
                                    <p className="text-lg text-muted-foreground mb-12 max-w-xl leading-relaxed">
                                        Unlock your potential by signing up with Learn Syntax - 
                                        The most affordable and quality-driven learning solution for modern developers.
                                    </p>
                                    <Button asChild size="lg" className="h-14 px-12 rounded-xl font-bold shadow-none bg-primary hover:bg-primary/90 text-white tracking-widest uppercase text-sm">
                                        <Link href={register().url}>Get Started</Link>
                                    </Button>
                                    
                                    {/* Social Proof */}
                                    <div className="mt-12 p-4 bg-muted/30 border border-border rounded-xl inline-flex items-center gap-6">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="size-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Learner" className="size-full object-cover" />
                                                </div>
                                            ))}
                                            <div className="size-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                                                99+
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-sm font-bold">17,000+ <span className="text-primary">★★★★★</span></div>
                                            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Trusted Learners</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center">
                                    {/* Decorative Path */}
                                    <svg className="absolute inset-0 w-full h-full text-primary/10 -z-10" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M50,200 Q100,50 200,200 T350,200" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" className="animate-pulse" />
                                    </svg>

                                    {/* Male Mentor Avatar */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 group">
                                        <div className="relative">
                                            <div className="size-48 lg:size-64 rounded-full border-8 border-background shadow-2xl overflow-hidden z-20">
                                                <img src="/images/mentor.png" alt="Mentor" className="size-full object-cover" />
                                            </div>
                                            <div className="absolute -right-8 top-4 bg-primary text-white text-xs font-bold px-5 py-4 rounded-xl rounded-bl-none shadow-xl max-w-[180px] animate-bounce-subtle z-30">
                                                Learn with love and grow with guidance
                                            </div>
                                        </div>
                                    </div>

                                    {/* Female Student Avatar */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4">
                                        <div className="relative">
                                            <div className="size-40 lg:size-56 rounded-full border-8 border-background shadow-2xl overflow-hidden z-10">
                                                <img src="/images/student.png" alt="Student" className="size-full object-cover" />
                                            </div>
                                            <div className="absolute -left-12 -top-12 bg-background border border-border text-foreground text-xs font-bold px-5 py-4 rounded-xl rounded-br-none shadow-xl z-30">
                                                Best learning platform!
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Decorative circles */}
                                    <div className="absolute inset-0 border-4 border-dashed border-primary/20 rounded-full animate-spin-slow" />
                                </div>
                            </div>
                        </div>

                        {/* White Stats Bar (Integrated into Hero Bottom) */}
                        <div className="bg-background/40 backdrop-blur-sm border-t border-border">
                            <div className="mx-auto max-w-7xl px-6 py-8">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                                            <div className="size-6 bg-orange-500 rounded-md flex items-center justify-center text-[10px] text-white font-bold">LIVE</div>
                                        </div>
                                        <div className="font-bold text-lg leading-tight">Daily Live</div>
                                        <div className="text-xs text-muted-foreground mt-1">Interactive classes</div>
                                    </div>
                                    
                                    <div className="flex flex-col items-center text-center">
                                        <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
                                            <div className="font-bold text-blue-500 text-sm">PDF</div>
                                        </div>
                                        <div className="font-bold text-lg leading-tight">10 Million +</div>
                                        <div className="text-xs text-muted-foreground mt-1">Tests, sample papers & notes</div>
                                    </div>
                                    
                                    <div className="flex flex-col items-center text-center">
                                        <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-500">
                                            <Users className="size-6" />
                                        </div>
                                        <div className="font-bold text-lg leading-tight">24 x 7</div>
                                        <div className="text-xs text-muted-foreground mt-1">Doubt solving sessions</div>
                                    </div>
                                    
                                    <div className="flex flex-col items-center text-center">
                                        <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 text-green-500">
                                            <GraduationCap className="size-6" />
                                        </div>
                                        <div className="font-bold text-lg leading-tight">100 +</div>
                                        <div className="text-xs text-muted-foreground mt-1">Offline centres</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl px-6">

                        {/* Tech Icons Bar */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-12 pb-20 opacity-40 grayscale group hover:grayscale-0 transition-all border-b border-border mb-20">
                             {['python', 'tensorflow', 'pytorch', 'react', 'nodejs', 'typescript', 'nextjs', 'laravel'].map((tech) => (
                                 <img 
                                    key={tech}
                                    src={`https://cdn.simpleicons.org/${tech}/000000`} 
                                    alt={tech} 
                                    className="h-6 sm:h-8 w-auto dark:invert"
                                 />
                             ))}
                        </div>

                        {/* Category Selector */}
                        <div className="mb-10 relative">
                            <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 rounded-lg border transition-all whitespace-nowrap shrink-0 group ${
                                            selectedCategory === cat.id 
                                            ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                                            : 'bg-card border-border hover:border-primary/50'
                                        }`}
                                    >
                                        <span className="text-lg sm:text-xl">{cat.icon}</span>
                                        <div className="text-left">
                                            <div className={`text-xs sm:text-sm font-bold ${selectedCategory === cat.id ? 'text-primary' : 'text-foreground'}`}>{cat.name}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Course List Section */}
                        <div className="mb-20">
                            <div className="mb-6 px-2 sm:px-0">
                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{categories.find(c => c.id === selectedCategory)?.name}</h2>
                            </div>
                            
                            {/* Mobile: Horizontal Scroll | Desktop: Grid */}
                            <div className="flex sm:grid flex-nowrap sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible pb-6 sm:pb-0 no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
                                {courses.map((course, idx) => (
                                    <Card key={course.id} className="group flex flex-col w-[280px] sm:w-full shrink-0 h-full overflow-hidden border-border rounded-xl shadow-none hover:border-primary transition-all">
                                        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center p-10 bg-gradient-to-br from-primary/5 to-accent/5 group-hover:scale-110 transition-transform duration-500">
                                                <AppLogoIcon className="size-16 sm:size-20 opacity-20" />
                                            </div>
                                            {/* Badges */}
                                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-2">
                                                {idx === 0 && <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-orange-500 text-white text-[9px] sm:text-[10px] font-bold uppercase rounded-md shadow-sm">Popular</span>}
                                                {idx === 1 && <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-primary text-white text-[9px] sm:text-[10px] font-bold uppercase rounded-md shadow-sm">Bestseller</span>}
                                                {idx === 2 && <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-accent text-white text-[9px] sm:text-[10px] font-bold uppercase rounded-md shadow-sm">New</span>}
                                            </div>
                                            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
                                                 <div className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-background/90 backdrop-blur shadow-sm rounded-md text-[9px] sm:text-[10px] font-bold">
                                                    Starting at ${course.price}
                                                 </div>
                                            </div>
                                        </div>
                                        
                                        <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
                                            <h3 className="text-sm sm:text-lg font-bold mb-3 sm:mb-4 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[3.5rem] leading-tight">
                                                {course.title}
                                            </h3>
                                            
                                            <div className="mt-auto pt-3 sm:pt-4 border-t border-border flex items-center justify-between text-muted-foreground">
                                                <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-medium">
                                                    <Clock className="size-3 sm:size-3.5" />
                                                    <span>6 months</span>
                                                </div>
                                                <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-medium hidden xs:flex">
                                                    <Users className="size-3 sm:size-3.5" />
                                                    <span>500+ Enrolled</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* View All Button - Center Mobile */}
                            <div className="mt-8 flex justify-center">
                                <Button asChild variant="default" className="rounded-xl h-12 px-8 font-bold shadow-none bg-foreground text-background hover:bg-foreground/90 w-full sm:w-auto mx-6 sm:mx-0">
                                    <Link href="/courses" className="flex items-center gap-2">
                                        View All Courses
                                        <ArrowUpRight className="size-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Features / Why Us */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                            <Card className="bg-primary/5 border-none rounded-2xl p-8">
                                <div className="size-14 rounded-xl bg-primary text-white flex items-center justify-center mb-6">
                                    <GraduationCap className="size-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-primary">Industry Validated</h3>
                                <p className="text-primary/70 leading-relaxed">Our curriculum is designed with input from top tech companies to ensure you learn exactly what the market demands.</p>
                            </Card>
                            
                            <Card className="bg-accent/5 border-none rounded-2xl p-8">
                                <div className="size-14 rounded-xl bg-accent text-white flex items-center justify-center mb-6">
                                    <Users className="size-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-accent">Personalized Support</h3>
                                <p className="text-accent/70 leading-relaxed">Don't learn alone. Get 1-on-1 mentorship and 24/7 community support to clear your doubts instantly.</p>
                            </Card>
                            
                            <Card className="bg-muted/50 border-border rounded-2xl p-8">
                                <div className="size-14 rounded-xl bg-foreground text-background flex items-center justify-center mb-6">
                                    <ArrowUpRight className="size-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Guaranteed Growth</h3>
                                <p className="text-muted-foreground leading-relaxed">We focus on outcomes. 90% of our graduates report significant career advancement within 6 months.</p>
                            </Card>
                        </div>
                    </div>
                </main>

                <footer className="py-12 border-t border-border bg-muted/30">
                    <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <AppLogoIcon className="size-5 grayscale opacity-50" />
                            <span>&copy; {new Date().getFullYear()} Learn Syntax. All rights reserved.</span>
                        </div>
                        <div className="flex items-center gap-8">
                            <a href="#" className="hover:text-foreground transition-colors font-medium">Privacy</a>
                            <a href="#" className="hover:text-foreground transition-colors font-medium">Terms</a>
                            <a href="#" className="hover:text-foreground transition-colors font-medium">Careers</a>
                        </div>
                    </div>
                </footer>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </>
    );
}

