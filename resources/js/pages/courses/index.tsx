import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { Clock, Users, Search, BookOpen, Trophy, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function CourseIndex({ courses }: { courses: any[] }) {
    const [search, setSearch] = useState('');

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase())
    );

    const covers = [
        '/images/ai_cover.png', 
        '/images/web_cover.png', 
        '/images/python_cover.png'
    ];

    return (
        <>
            <Head title="Course Catalog | Learn Syntax" />
            <div className="w-full p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold  mb-2">
                            Academic Catalog
                        </div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Master Industrial Skills</h1>
                        <p className="text-sm font-medium text-muted-foreground/60 max-w-xl">
                            Curated professional paths designed to take you from fundamentals to advanced specialization in modern technology.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                        <input
                            type="text"
                            placeholder="Filter courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 h-10 rounded-sm border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-sm font-bold text-foreground placeholder:text-muted-foreground/30 shadow-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredCourses.map((course, idx) => {
                        const cover = covers[idx % covers.length];

                        return (
                            <Link key={course.id} href={`/courses/${course.slug}`} className="group block focus:outline-none">
                                <div className="flex flex-col border border-border/80 bg-background rounded-sm overflow-hidden transition-all hover:border-primary/40 group-hover:shadow-md h-full relative">
                                    <div className="absolute top-3 right-3 z-10">
                                        <div className="px-2 py-0.5 bg-background/90 backdrop-blur-sm border border-border rounded-sm text-[11px] font-bold text-foreground shadow-sm">
                                            ₹{course.price.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="relative aspect-[16/10] bg-muted border-b border-border/60 overflow-hidden">
                                        <img 
                                            src={cover} 
                                            alt={course.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    <div className="p-4 flex flex-col flex-1 space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-primary  mb-2">
                                                <BookOpen className="size-3" />
                                                <span>Development</span>
                                            </div>
                                            <h3 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                {course.title}
                                            </h3>
                                        </div>

                                        <div className="mt-auto space-y-4">
                                            <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="size-3.5" strokeWidth={2.5} />
                                                    <span>24 Weeks</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Trophy className="size-3.5" strokeWidth={2.5} />
                                                    <span>Verified</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between gap-2 pt-4 border-t border-border/60">
                                                <span className="text-[11px] font-bold text-foreground group-hover:text-primary transition-all flex items-center gap-1">
                                                    Explore Path <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                                                </span>
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground/40">
                                                    <Users className="size-3" />
                                                    <span>1.2k</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="py-24 text-center border border-dashed border-border/80 rounded-sm bg-muted/5">
                        <div className="size-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4 border border-border/60">
                            <Search className="size-8 text-muted-foreground/20" />
                        </div>
                        <h3 className="text-base font-bold text-foreground">No matches found</h3>
                        <p className="text-xs font-medium text-muted-foreground mt-1">Try adjusting your search criteria to find available paths.</p>
                        <Button variant="outline" size="sm" className="mt-6 h-9 px-6 rounded-sm text-[11px] font-bold uppercase tracking-tight" onClick={() => setSearch('')}>
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

CourseIndex.layout = (page: React.ReactNode) => (
    <PublicLayout>
        {page}
    </PublicLayout>
);
