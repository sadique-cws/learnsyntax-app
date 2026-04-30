import { Head, Link } from '@inertiajs/react';
import { register } from '@/routes';
import { Button } from '@/components/ui/button';
import { Clock, Users, ArrowUpRight, BookOpen, MonitorPlay } from 'lucide-react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';

const categories = [
    { id: 'all', name: 'All' },
    { id: 'ds', name: 'Data Science' },
    { id: 'dm', name: 'Marketing' },
    { id: 'sd', name: 'Software' },
    { id: 'pp', name: 'Placement' },
    { id: 'bf', name: 'Finance' },
];

export default function Welcome({ courses = [] }: { courses?: any[] }) {
    const [selectedCategory, setSelectedCategory] = useState('all');

    return (
        <PublicLayout>
            <Head title="Welcome to Learn Syntax" />

            <div className="pb-16 bg-background selection:bg-primary/20">
                {/* Hero Section */}
                <section className="px-6 py-8 md:py-12 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <div className="flex-1 space-y-6 order-2 md:order-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-bold  rounded-sm border border-primary/10 mx-auto md:mx-0">
                                <MonitorPlay className="size-3" />
                                <span>The Future of Learning</span>
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1]">
                                    Master Code & <br />
                                    <span className="text-primary italic">Intelligence.</span>
                                </h1>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto md:mx-0 font-medium">
                                    Accelerate your career with industry-led courses in Programming, AI, and modern Tech. Dense curriculum, practical projects, and a community of high-performers.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center md:justify-start">
                                <Button asChild size="lg" className="rounded-sm font-bold text-xs h-10 px-8 shadow-none bg-primary hover:bg-primary/90 transition-all uppercase tracking-tight">
                                    <Link href={register().url}>Join the Community</Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="rounded-sm font-bold text-xs h-10 px-8 shadow-none border-border hover:bg-muted/50 transition-all uppercase tracking-tight">
                                    <Link href="/courses">Explore Catalog</Link>
                                </Button>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-6 pt-4 text-muted-foreground/60">
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-foreground leading-none">17k+</span>
                                    <span className="text-[10px] font-semibold uppercase">Learners</span>
                                </div>
                                <div className="h-8 w-px bg-border/50" />
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-foreground leading-none">4.9/5</span>
                                    <span className="text-[10px] font-semibold uppercase">Rating</span>
                                </div>
                                <div className="h-8 w-px bg-border/50" />
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-foreground leading-none">120+</span>
                                    <span className="text-[10px] font-semibold uppercase">Courses</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image / Visual */}
                        <div className="flex-1 w-full order-1 md:order-2">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-sm blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative aspect-[4/3] bg-zinc-900 border border-white/5 rounded-sm overflow-hidden shadow-2xl">
                                    <img 
                                        src="/assets/ai_coding_hero_1777463782874.png" 
                                        alt="AI and Programming Learning" 
                                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                        <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-2 rounded-sm flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                            <span className="text-[10px] font-bold text-white uppercase tracking-tight">Active Workshop: Generative AI</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Category Chips */}
                <section className="border-y border-border/40 bg-muted/10 py-3 mb-10">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            <span className="text-[10px] font-bold text-muted-foreground  mr-2 shrink-0">Explore:</span>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-tight transition-all border ${
                                        selectedCategory === cat.id
                                            ? 'bg-primary text-white border-primary shadow-sm'
                                            : 'bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-primary'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Courses Grid */}
                <section className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-8">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-8 bg-primary rounded-full" />
                                <span className="text-[10px] font-bold text-primary ">Trending Now</span>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">Popular Learning Paths</h2>
                        </div>
                        <Link href="/courses" className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-all uppercase tracking-tight">
                            View All <ArrowUpRight className="size-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                        {courses.map((course, idx) => {
                            const covers = ['/images/ai_cover.png', '/images/web_cover.png', '/images/python_cover.png'];
                            const cover = covers[idx % covers.length];
                            return (
                                <Link key={course.id} href={`/courses/${course.slug}`} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                                    <div className="flex flex-col border border-border bg-card rounded-sm overflow-hidden transition-colors hover:border-primary/50 h-full">
                                        <div className="relative aspect-[16/9] bg-muted border-b border-border">
                                            <img src={cover} alt={course.title} className="w-full h-full object-cover transition-opacity group-hover:opacity-90" />
                                            <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-background border border-border rounded-sm text-[10px] font-medium text-foreground">
                                                ₹{course.price}
                                            </div>
                                        </div>
                                        <div className="p-3 flex flex-col flex-1">
                                            <div className="text-[10px] font-medium text-primary mb-1.5">Programming</div>
                                            <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3 leading-snug">
                                                {course.title}
                                            </h3>
                                            <div className="mt-auto flex items-center justify-between text-[10px] text-muted-foreground pt-2.5 border-t border-border">
                                                <div className="flex items-center gap-1 font-medium">
                                                    <Clock className="size-3 text-foreground/50" />
                                                    <span>24 Weeks</span>
                                                </div>
                                                <div className="flex items-center gap-1 font-medium">
                                                    <BookOpen className="size-3 text-foreground/50" />
                                                    <span>Beginner</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-6 sm:hidden">
                        <Button asChild variant="outline" className="w-full rounded-sm h-9 font-medium text-sm shadow-none">
                            <Link href="/courses">View All Courses</Link>
                        </Button>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
