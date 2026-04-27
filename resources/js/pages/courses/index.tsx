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
            
            <div className="w-full p-4 lg:p-6">
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">Our Courses</h1>
                    <p className="text-muted-foreground">Master your skills with our industry-leading programming courses.</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {filteredCourses.map((course, idx) => {
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
                                            <span className="text-[11px] font-medium">1.2k+ Enrolled</span>
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
