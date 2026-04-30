import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { CheckCircle2, Circle, Clock, BookOpen, Layers, Milestone, Info, Layout, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudentProgress({ enrollment }: { enrollment: any }) {
    const { course, batch } = enrollment;
    
    const totalChapters = course.modules.reduce((acc: number, m: any) => acc + m.chapters.length, 0);
    const completedChapters = course.modules.reduce((acc: number, m: any) => 
        acc + m.chapters.filter((c: any) => c.learning_logs.length > 0).length, 0
    );
    const progressPercentage = Math.round((completedChapters / totalChapters) * 100) || 0;

    return (
        <>
            <Head title={`Roadmap | ${course.title}`} />
            
            <div className="w-full p-4 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2.5 hover:bg-muted rounded-sm border border-border/50 text-muted-foreground hover:text-foreground transition-all shrink-0" aria-label="Back to dashboard">
                            <ChevronLeft className="size-4" />
                        </Link>
                        <div className="space-y-0.5">
                            <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <Milestone className="size-4 text-primary" /> Learning Journey
                            </h1>
                            <p className="text-xs text-muted-foreground">{course.title} • Batch {batch?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-primary/5 px-4 py-2 rounded-sm border border-primary/10">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-tight">Curriculum Mastery</span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-xl font-bold text-foreground tabular-nums">{progressPercentage}%</span>
                                <span className="text-[10px] text-muted-foreground">Complete</span>
                            </div>
                        </div>
                        <div className="size-10 rounded-full border-2 border-primary/20 flex items-center justify-center relative">
                            <div 
                                className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent -rotate-45"
                                style={{ clipPath: `polygon(0 0, 100% 0, 100% ${progressPercentage}%, 0 ${progressPercentage}%)` }}
                            />
                            <span className="text-[10px] font-bold text-primary">{completedChapters}/{totalChapters}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 space-y-8 relative">
                        {/* Timeline Path */}
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-border/40 to-transparent hidden md:block" />

                        {course.modules.map((module: any, mIndex: number) => (
                            <div key={module.id} className="relative pl-0 md:pl-12 space-y-4">
                                {/* Module Node */}
                                <div className="absolute left-0 top-0 size-8 rounded-sm bg-background border border-primary/30 flex items-center justify-center z-10 hidden md:flex shadow-sm">
                                    <span className="text-xs font-bold text-primary">{mIndex + 1}</span>
                                </div>

                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Module {mIndex + 1}</span>
                                    <h3 className="text-base font-semibold text-foreground">{module.title}</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {module.chapters.map((chapter: any) => {
                                        const isCompleted = chapter.learning_logs.length > 0;
                                        const log = chapter.learning_logs[0];

                                        return (
                                            <div 
                                                key={chapter.id} 
                                                className={cn(
                                                    "group p-4 rounded-sm border transition-all relative overflow-hidden",
                                                    isCompleted ? "bg-emerald-50/5 border-emerald-500/20" : "bg-background border-border"
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <div className={cn(
                                                                "size-1.5 rounded-full",
                                                                isCompleted ? "bg-emerald-500" : "bg-muted-foreground/30"
                                                            )} />
                                                            <span className={cn(
                                                                "text-[10px] font-bold uppercase tracking-tight",
                                                                isCompleted ? "text-emerald-700" : "text-muted-foreground/60"
                                                            )}>
                                                                {isCompleted ? 'Completed' : 'Upcoming'}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-xs font-semibold text-foreground leading-tight">
                                                            {chapter.title}
                                                        </h4>
                                                        {chapter.description && (
                                                            <p className="text-[10px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                                                                {chapter.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    
                                                    {isCompleted ? (
                                                        <div className="size-7 rounded-sm bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                                            <CheckCircle2 className="size-3.5" />
                                                        </div>
                                                    ) : (
                                                        <div className="size-7 rounded-sm bg-muted border border-border flex items-center justify-center text-muted-foreground/40 shrink-0">
                                                            <Clock className="size-3.5" />
                                                        </div>
                                                    )}
                                                </div>

                                                {isCompleted && (
                                                    <div className="mt-3 pt-3 border-t border-emerald-500/10 flex items-center justify-between">
                                                        <span className="text-[10px] text-emerald-700/60 font-medium">
                                                            {new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 cursor-help" title={log.remarks || 'No remarks provided'}>
                                                            <Info className="size-3 text-emerald-600/40" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 rounded-sm border border-border bg-background shadow-sm space-y-4">
                            <h3 className="text-xs font-semibold text-foreground flex items-center gap-2">
                                <Layout className="size-3.5 text-primary" />
                                Progress Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Modules</span>
                                    <span className="text-xs font-semibold">{course.modules.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Chapters</span>
                                    <span className="text-xs font-semibold">{totalChapters}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Completed</span>
                                    <span className="text-xs font-semibold text-emerald-600">{completedChapters}</span>
                                </div>
                                <div className="h-px bg-border/50" />
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Completion Rate</span>
                                        <span className="text-xs font-bold text-primary">{progressPercentage}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progressPercentage}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-sm bg-primary/5 border border-primary/10 space-y-2">
                            <div className="size-7 rounded-sm bg-primary/10 flex items-center justify-center text-primary mb-1">
                                <Info className="size-3.5" />
                            </div>
                            <h4 className="text-xs font-semibold text-foreground">Track Your Progress</h4>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                Your instructor updates this roadmap daily. Stay consistent and complete chapters to master the curriculum.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

StudentProgress.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Curriculum Roadmap', href: '#' }]}>{page}</AppLayout>
);
