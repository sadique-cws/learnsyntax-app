import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, BookOpen, Clock, Award, ChevronRight, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface MyLearningProps {
    enrollments: any[];
}

export default function MyLearning({ enrollments = [] }: MyLearningProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredEnrollments = useMemo(() => {
        return enrollments.filter(enrollment => {
            const matchesSearch = enrollment.course.title.toLowerCase().includes(searchQuery.toLowerCase());
            const isCompleted = enrollment.overall_average >= 60 && enrollment.certificate;
            const matchesFilter = 
                filterStatus === 'all' || 
                (filterStatus === 'active' && !isCompleted) || 
                (filterStatus === 'completed' && isCompleted);
            
            return matchesSearch && matchesFilter;
        });
    }, [enrollments, searchQuery, filterStatus]);

    return (
        <>
            <Head title="My Learning" />
            <div className="w-full p-4 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">My Learning</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Track your progress and access your course materials</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn("h-8 px-2 rounded-sm", viewMode === 'grid' && "bg-muted")}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid className="size-3.5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn("h-8 px-2 rounded-sm", viewMode === 'list' && "bg-muted")}
                            onClick={() => setViewMode('list')}
                        >
                            <List className="size-3.5" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Search your courses..."
                            className="pl-9 h-9 rounded-sm border-border bg-card text-sm shadow-none focus-visible:ring-1"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex p-0.5 bg-muted/50 border border-border rounded-sm">
                            {(['all', 'active', 'completed'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-3 py-1 text-[10px] font-bold uppercase rounded-sm transition-all",
                                        filterStatus === status 
                                            ? "bg-card text-foreground shadow-sm border border-border/50" 
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {filteredEnrollments.length > 0 ? (
                    <div className={cn(
                        "grid gap-4",
                        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                    )}>
                        {filteredEnrollments.map((enrollment: any) => (
                            <div key={enrollment.id} className={cn(
                                "group rounded-sm border border-border bg-card overflow-hidden flex flex-col transition-all hover:border-primary/20 hover:shadow-sm",
                                viewMode === 'list' && "md:flex-row"
                            )}>
                                <div className={cn(
                                    "relative bg-muted/20 border-b border-border aspect-video md:aspect-auto",
                                    viewMode === 'list' ? "md:w-48 md:border-b-0 md:border-r" : "w-full"
                                )}>
                                    {enrollment.course.image_path ? (
                                        <img src={`/storage/${enrollment.course.image_path}`} alt={enrollment.course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen className="size-8 text-muted-foreground/20" />
                                        </div>
                                    )}
                                    {enrollment.certificate && (
                                        <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-sm shadow-lg">
                                            <Award className="size-3" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                                    {enrollment.batch?.name || 'Self-Paced'}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground font-medium tabular-nums">
                                                    {Math.round(enrollment.overall_average)}% Complete
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
                                                {enrollment.course.title}
                                            </h3>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="w-full bg-muted/30 h-1 rounded-full overflow-hidden">
                                                <div 
                                                    className={cn(
                                                        "h-full transition-all duration-500",
                                                        enrollment.overall_average >= 60 ? "bg-emerald-500" : "bg-primary"
                                                    )} 
                                                    style={{ width: `${enrollment.overall_average}%` }} 
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-[10px]">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-muted-foreground flex items-center gap-1">
                                                        <Clock className="size-3" /> Started {new Date(enrollment.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                {enrollment.certificate && (
                                                    <span className="text-emerald-600 font-bold uppercase tracking-tight">Completed</span>
                                                )}
                                                {enrollment.is_eligible && !enrollment.certificate && (
                                                    <span className="text-amber-600 font-bold uppercase tracking-tight">Eligible for Cert</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "flex items-center gap-2 pt-4",
                                        viewMode === 'list' && "md:pt-0 md:justify-end"
                                    )}>
                                        {enrollment.is_eligible || enrollment.certificate ? (
                                            <Button asChild size="sm" className="flex-1 h-8 rounded-sm text-[11px] font-bold shadow-none cursor-pointer bg-emerald-600 hover:bg-emerald-700">
                                                <Link href={`/my-course/${enrollment.id}/certificate`} target="_blank">
                                                    Download Certificate
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button asChild size="sm" className="flex-1 h-8 rounded-sm text-[11px] font-bold shadow-none cursor-pointer">
                                                <Link href={`/my-course/${enrollment.id}/progress`}>
                                                    Continue Learning
                                                </Link>
                                            </Button>
                                        )}
                                        <Button asChild variant="outline" size="sm" className="h-8 px-2 rounded-sm shadow-none cursor-pointer">
                                            <Link href={`/my-course/${enrollment.id}/progress`}>
                                                <ChevronRight className="size-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-sm border border-border bg-card p-12 text-center">
                        <div className="size-12 rounded-sm bg-muted/10 flex items-center justify-center mx-auto mb-4 border border-border">
                            <BookOpen className="size-6 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground">No courses found</h3>
                        <p className="text-xs text-muted-foreground mt-1 max-w-[300px] mx-auto">
                            {searchQuery ? `We couldn't find any courses matching "${searchQuery}"` : "You haven't enrolled in any courses yet."}
                        </p>
                        {!searchQuery && (
                            <Button asChild variant="outline" size="sm" className="mt-4 rounded-sm h-8 text-xs shadow-none cursor-pointer">
                                <Link href="/">Explore Catalog</Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

MyLearning.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'My Learning', href: '#' }]}>
        {page}
    </AppLayout>
);
