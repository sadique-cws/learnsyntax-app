import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { Clock, Users, Search } from 'lucide-react';
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
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-foreground">All Courses</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Master your skills with our industry-leading programming courses.</p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6 max-w-sm">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 h-9 rounded-sm border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-sm font-medium text-foreground placeholder:text-muted-foreground/40"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {filteredCourses.map((course, idx) => {
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
                                                <Users className="size-3 text-foreground/50" />
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
                    <div className="py-16 text-center border border-dashed border-border rounded-sm mt-4">
                        <Search className="size-8 text-muted-foreground/20 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No courses found matching your search.</p>
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
