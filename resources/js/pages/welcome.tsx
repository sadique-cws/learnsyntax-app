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
                {/* Hero Section */}
                <section className="px-6 py-10 md:py-16 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 space-y-5">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-sm border border-primary/10">
                            <MonitorPlay className="size-3.5" />
                            <span>100% Online Learning</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                            Master Tech Skills <br className="hidden md:block" />
                            <span className="text-primary">At Your Own Pace</span>
                        </h1>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                            Join India's most trusted educational platform. Quality courses, expert mentors, and guaranteed placement assistance for modern developers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                            <Button asChild size="default" className="rounded-sm font-medium text-sm h-9 px-6 shadow-none w-full sm:w-auto">
                                <Link href={register().url}>Start Learning For Free</Link>
                            </Button>
                            <Button asChild size="default" variant="outline" className="rounded-sm font-medium text-sm h-9 px-6 w-full sm:w-auto shadow-none">
                                <Link href="/courses">Browse Catalog</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="flex-1 w-full">
                        <div className="aspect-[4/3] bg-muted/30 border border-border rounded-sm overflow-hidden relative">
                            <img src="/images/mentor.png" alt="Learn" className="w-full h-full object-cover" />
                            <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-background border border-border p-2.5 rounded-sm flex items-center gap-2.5">
                                <div className="size-8 bg-primary/10 rounded-sm flex items-center justify-center text-primary shrink-0">
                                    <Users className="size-4" />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">17k+ Learners</div>
                                    <div className="text-[10px] font-medium text-muted-foreground">Joined this month</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Category Chips */}
                <section className="border-y border-border bg-muted/20 py-2.5 mb-8">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`whitespace-nowrap px-3 py-1.5 rounded-sm text-xs font-medium transition-colors border ${
                                        selectedCategory === cat.id
                                            ? 'bg-foreground text-background border-foreground'
                                            : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground'
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
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Popular Courses</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">Start learning from our top-rated programs</p>
                        </div>
                        <Link href="/courses" className="hidden sm:flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-colors">
                            View all <ArrowUpRight className="size-3" />
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
