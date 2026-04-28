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
            
            <div className="pb-24 bg-background">
                {/* Hero Section - Clean, Solid & Minimal */}
                <section className="px-6 py-12 md:py-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6 md:space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-sm tracking-widest uppercase">
                            <MonitorPlay className="size-4" />
                            <span>100% Online Learning</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
                            Master Tech Skills <br className="hidden md:block" />
                            <span className="text-primary">At Your Own Pace</span>
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                            Join India's most trusted educational platform. Quality courses, expert mentors, and guaranteed placement assistance for modern developers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button asChild size="lg" className="rounded font-bold text-sm h-12 px-8 w-full sm:w-auto">
                                <Link href={register().url}>Start Learning For Free</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded font-bold text-sm h-12 px-8 w-full sm:w-auto border-border bg-background">
                                <Link href="/courses">Browse Catalog</Link>
                            </Button>
                        </div>
                    </div>
                    
                    {/* Hero Image - Android App Style (Square/Solid, No heavy shadows) */}
                    <div className="flex-1 w-full relative">
                        <div className="aspect-[4/3] bg-muted/30 border border-border rounded flex items-center justify-center p-4 relative">
                            {/* Simple mentor image inside flat container */}
                            <img src="/images/mentor.png" alt="Learn" className="w-full h-full object-cover rounded border border-border" />
                            
                            {/* Floating stat card - Minimal */}
                            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-background border border-border p-3 rounded flex items-center gap-3">
                                <div className="size-10 bg-primary/10 rounded flex items-center justify-center text-primary shrink-0">
                                    <Users className="size-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">17k+ Learners</div>
                                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Joined this month</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Android App Style Categories Scroll (Material Chips) */}
                <section className="border-y border-border bg-muted/20 py-3 mb-10">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`whitespace-nowrap px-4 py-2 rounded text-[13px] font-bold transition-colors border ${
                                        selectedCategory === cat.id
                                            ? 'bg-foreground text-background border-foreground'
                                            : 'bg-background text-foreground border-border hover:bg-muted/50'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Popular Courses Grid */}
                <section className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">Popular Courses</h2>
                            <p className="text-sm text-muted-foreground mt-1">Start learning from our top-rated programs</p>
                        </div>
                        <Link href="/courses" className="hidden sm:flex items-center gap-1 text-xs font-bold text-primary hover:underline uppercase tracking-wider">
                            View all <ArrowUpRight className="size-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                        {courses.map((course, idx) => {
                            const covers = ['/images/ai_cover.png', '/images/web_cover.png', '/images/python_cover.png'];
                            const cover = covers[idx % covers.length];

                            return (
                                <Link key={course.id} href={`/courses/${course.slug}`} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                                    <div className="flex flex-col border border-border bg-card rounded overflow-hidden transition-colors hover:border-primary group-hover:bg-muted/10 h-full">
                                        <div className="relative aspect-[16/9] bg-muted border-b border-border">
                                            <img src={cover} alt={course.title} className="w-full h-full object-cover transition-opacity group-hover:opacity-90" />
                                            <div className="absolute top-2 right-2 px-2 py-1 bg-background border border-border rounded text-[10px] font-bold text-foreground">
                                                ${course.price}
                                            </div>
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Programming</div>
                                            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-4 leading-snug">
                                                {course.title}
                                            </h3>
                                            <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                                                <div className="flex items-center gap-1.5 font-medium">
                                                    <Clock className="size-3.5 text-foreground/70" />
                                                    <span>24 Weeks</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 font-medium">
                                                    <BookOpen className="size-3.5 text-foreground/70" />
                                                    <span>Beginner</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    
                    <div className="mt-8 sm:hidden">
                        <Button asChild variant="outline" className="w-full rounded h-12 font-bold bg-background">
                            <Link href="/courses">View All Courses</Link>
                        </Button>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
