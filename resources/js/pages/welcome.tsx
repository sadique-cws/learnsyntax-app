import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppearance } from '@/hooks/use-appearance';
import { Clock, Users, ArrowUpRight, Moon, Sun, ChevronRight, GraduationCap, Search, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/layouts/public-layout';

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
    const [selectedCategory, setSelectedCategory] = useState('ds');

    return (
        <PublicLayout>
            <Head title="Welcome to Learn Syntax" />
            
            <div className="pb-20">
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

                {/* Categories Scroll */}
                <div className="mx-auto max-w-7xl px-6 mb-12">
                    <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all border ${
                                    selectedCategory === cat.id
                                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                        : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/50'
                                }`}
                            >
                                <span className="text-lg">{cat.icon}</span>
                                <span className="text-xs uppercase tracking-wider">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Popular Courses Section */}
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Explore Popular Courses</h2>
                            <p className="text-sm text-muted-foreground">Handpicked courses by our expert mentors</p>
                        </div>
                        <Button asChild variant="ghost" className="hidden sm:flex items-center gap-2 font-bold text-primary hover:text-primary hover:bg-primary/5">
                            <Link href="/courses">View All Courses <ArrowUpRight className="size-4" /></Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                        {courses.map((course, idx) => {
                            const covers = ['/images/ai_cover.png', '/images/web_cover.png', '/images/python_cover.png'];
                            const cover = covers[idx % covers.length];

                            return (
                                <Card key={course.id} className="group flex flex-col overflow-hidden border-border bg-card rounded-xl shadow-none hover:border-primary transition-all duration-300">
                                    <div className="relative aspect-video overflow-hidden">
                                        <img 
                                            src={cover} 
                                            alt={course.title} 
                                            className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                                            <span className="px-2 py-1 bg-background/95 backdrop-blur shadow-sm rounded text-[10px] font-bold text-foreground">
                                                ${course.price}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <CardContent className="p-5 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-wider rounded">Programming</span>
                                            <div className="flex items-center gap-1 text-[11px] font-bold text-orange-500">
                                                <span>★</span> 4.8
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] leading-tight">
                                            {course.title}
                                        </h3>
                                        
                                        <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="size-3.5 text-primary" />
                                                <span className="text-[11px] font-medium">24 Weeks</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Users className="size-3.5 text-primary" />
                                                <span className="text-[11px] font-medium">1.2k+ Students</span>
                                            </div>
                                        </div>

                                        <Button asChild variant="outline" className="mt-5 w-full rounded-lg border-border group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all font-bold text-xs h-10">
                                            <Link href={`/courses/${course.slug}`}>View Details</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                    
                    <div className="mt-12 sm:hidden text-center">
                        <Button asChild variant="outline" className="w-full h-12 rounded-xl font-bold">
                            <Link href="/courses">Explore All Courses</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
