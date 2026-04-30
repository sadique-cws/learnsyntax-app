import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ChevronRight, Users, BookOpen, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TeacherProgressIndex({ batches }: { batches: any[] }) {
    return (
        <>
            <Head title="Learning Progress | Instructor" />
            
            <div className="w-full p-4 space-y-6">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Layers className="size-4 text-primary" /> Learning Progress Sheets
                    </h1>
                    <p className="text-xs text-muted-foreground">Select a batch to track and update curriculum coverage</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {batches.map((batch: any) => (
                        <Link 
                            key={batch.id} 
                            href={`/teacher/batches/${batch.id}/progress`}
                            className="group rounded-sm border border-border bg-background p-5 hover:border-primary/30 transition-all shadow-sm"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="size-10 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary transition-all group-hover:bg-primary/10">
                                    <Users className="size-5" />
                                </div>
                                <div className={batch.is_active ? "text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-100 uppercase" : "text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-sm border border-border uppercase"}>
                                    {batch.is_active ? 'Active Batch' : 'Archived'}
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{batch.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <BookOpen className="size-3.5" />
                                    {batch.course.title}
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Update Curriculum Logs</span>
                                <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    ))}

                    {batches.length === 0 && (
                        <div className="col-span-full py-24 text-center rounded-sm border border-dashed border-border bg-muted/5">
                            <Users className="size-12 text-muted-foreground/20 mx-auto mb-4" strokeWidth={1} />
                            <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">No Active Batches Assigned</h2>
                            <p className="text-xs font-medium text-muted-foreground/40 mt-1 italic">You are not currently assigned to any operational training units.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

TeacherProgressIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Instructor', href: '#' }, { title: 'Learning Progress', href: '#' }]}>{page}</AppLayout>
);
