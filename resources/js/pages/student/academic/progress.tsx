import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { CheckCircle2, Clock, BookOpen, Milestone, Info, Layout, ChevronLeft } from 'lucide-react';
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
            
            <div className="w-full p-4 space-y-3">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="p-2 hover:bg-muted rounded-sm border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer" aria-label="Back to dashboard">
                            <ChevronLeft className="size-4" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">Learning Roadmap</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">{course.title} • Batch {batch?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-muted/5">
                            <Milestone className="size-3.5 text-muted-foreground" />
                            <span className="text-xs font-semibold text-foreground tabular-nums">{progressPercentage}%</span>
                            <span className="text-[10px] text-muted-foreground">complete</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-muted/5">
                            <CheckCircle2 className="size-3.5 text-emerald-500" />
                            <span className="text-xs font-semibold text-foreground tabular-nums">{completedChapters}</span>
                            <span className="text-[10px] text-muted-foreground">/ {totalChapters}</span>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                    {/* Module List */}
                    <div className="lg:col-span-3 space-y-3">
                        {course.modules.map((module: any, mIndex: number) => {
                            const moduleCompleted = module.chapters.filter((c: any) => c.learning_logs.length > 0).length;
                            const moduleTotal = module.chapters.length;

                            return (
                                <div key={module.id} className="rounded-sm border border-border overflow-hidden">
                                    {/* Module Header */}
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                                        <div className="flex items-center gap-2">
                                            <span className="size-6 rounded-sm bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary border border-primary/10">{mIndex + 1}</span>
                                            <h3 className="text-xs font-semibold text-foreground">{module.title}</h3>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground tabular-nums">{moduleCompleted}/{moduleTotal} done</span>
                                    </div>

                                    {/* Chapter Rows */}
                                    <div className="divide-y divide-border">
                                        {module.chapters.map((chapter: any) => {
                                            const isCompleted = chapter.learning_logs.length > 0;
                                            const log = chapter.learning_logs[0];

                                            return (
                                                <div 
                                                    key={chapter.id} 
                                                    className={cn(
                                                        "flex items-center justify-between px-3 py-2.5 transition-colors",
                                                        isCompleted ? "bg-emerald-50/30" : "hover:bg-muted/5"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        {isCompleted ? (
                                                            <div className="size-6 rounded-sm bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                                                <CheckCircle2 className="size-3" />
                                                            </div>
                                                        ) : (
                                                            <div className="size-6 rounded-sm bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0">
                                                                <Clock className="size-3" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-medium text-foreground truncate">{chapter.title}</div>
                                                            {chapter.description && (
                                                                <p className="text-xs text-muted-foreground truncate mt-0.5">{chapter.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0 ml-3">
                                                        {isCompleted && log && (
                                                            <span className="text-[10px] text-muted-foreground tabular-nums">
                                                                {new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                            </span>
                                                        )}
                                                        <span className={cn(
                                                            "inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium border",
                                                            isCompleted 
                                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                                                : "bg-slate-50 text-slate-500 border-slate-100"
                                                        )}>
                                                            {isCompleted ? 'Done' : 'Pending'}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-3">
                        {/* Progress Summary */}
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="px-3 py-2 border-b border-border bg-muted/5">
                                <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <Layout className="size-3" /> Summary
                                </h3>
                            </div>
                            <div className="p-3 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Modules</span>
                                    <span className="text-xs font-semibold text-foreground tabular-nums">{course.modules.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Chapters</span>
                                    <span className="text-xs font-semibold text-foreground tabular-nums">{totalChapters}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Completed</span>
                                    <span className="text-xs font-semibold text-emerald-600 tabular-nums">{completedChapters}</span>
                                </div>
                                <div className="h-px bg-border" />
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-muted-foreground">Progress</span>
                                        <span className="text-xs font-semibold text-primary tabular-nums">{progressPercentage}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progressPercentage}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="px-3 py-2 border-b border-border bg-muted/5">
                                <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <Info className="size-3" /> Info
                                </h3>
                            </div>
                            <div className="p-3">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Your instructor updates this roadmap daily. Stay consistent and complete chapters to master the curriculum.
                                </p>
                            </div>
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
