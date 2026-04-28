import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { Clock, Users, ArrowUpRight, Search } from 'lucide-react';
import { useState } from 'react';

export default function CourseIndex({ courses }: { courses: any[] }) {
    const [search, setSearch] = useState('');

    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head title="Our Courses" />
            
            <div className="w-full p-4 lg:p-6 max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black  text-foreground leading-[1.15] mb-2">Our Courses</h1>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">Master your skills with our industry-leading programming courses.</p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-12 max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search courses..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredCourses.map((course, idx) => {
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
                                        <div className="text-[10px] font-black text-primary   mb-2">Programming</div>
                                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-4 leading-snug">
                                            {course.title}
                                        </h3>
                                        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <Clock className="size-3.5 text-foreground/70" />
                                                <span>24 Weeks</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <Users className="size-3.5 text-foreground/70" />
                                                <span>1.2k+ Enrolled</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-muted-foreground">No courses found matching your search.</p>
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
