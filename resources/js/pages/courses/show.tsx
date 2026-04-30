import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, PlayCircle, Clock, Zap, Users, Briefcase, Award, ChevronDown, HelpCircle, BookOpen } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';

function ModuleItem({ module, index, isFirst }: { module: any, index: number, isFirst: boolean }) {
    const [isOpen, setIsOpen] = useState(isFirst);
    return (
        <div className="rounded-sm border border-border overflow-hidden transition-all">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/5 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "size-7 rounded-sm flex items-center justify-center text-[10px] font-semibold border transition-all",
                        isOpen ? "bg-primary text-white border-primary" : "bg-muted/30 text-muted-foreground border-border group-hover:border-primary/30 group-hover:text-primary"
                    )}>
                        {index + 1}
                    </div>
                    <div>
                        <span className="text-[10px] font-medium text-muted-foreground block">Module {index + 1}</span>
                        <h3 className={cn(
                            "text-sm font-semibold transition-colors",
                            isOpen ? "text-primary" : "text-foreground"
                        )}>
                            {module.title}
                        </h3>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-medium text-muted-foreground hidden sm:inline tabular-nums">
                        {module.chapters?.length || 0} topics
                    </span>
                    <ChevronDown className={cn(
                        "size-3.5 text-muted-foreground transition-transform duration-300",
                        isOpen && "rotate-180 text-primary"
                    )}/>
                </div>
            </button>
            
            <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}>
                <div className="overflow-hidden">
                    <div className="border-t border-border bg-muted/5">
                        {module.chapters?.length > 0 ? (
                            <div className="divide-y divide-border">
                                {module.chapters.map((chapter: any, cIndex: number) => (
                                    <div key={chapter.id} className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-background transition-colors">
                                        <div className="size-5 rounded-sm bg-background flex items-center justify-center text-[10px] font-medium text-muted-foreground border border-border mt-0.5 shrink-0">
                                            {cIndex + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-medium text-foreground">{chapter.title}</h4>
                                            {chapter.description && (
                                                <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-1">{chapter.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-6 text-center">
                                <p className="text-xs text-muted-foreground">Chapters coming soon</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CourseShow({ course, is_enrolled, enrollment_status, enrollment_id }: {
    course: any, is_enrolled: boolean, enrollment_status: string | null, enrollment_id: number | null
}) {
    const { post, processing } = useForm();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const handleEnroll = () => { post(`/enroll/${course.id}`); };
    const formatDate = (d: string) => !mounted ? '' : new Date(d).toLocaleDateString();

    return (
        <PublicLayout>
            <Head title={`${course.title} | Course`} />
            <div className="pb-16 bg-background">
                {/* Hero */}
                <section className="bg-[#0a0a0a] text-white pt-10 pb-14 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent)]" />
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                            <div className="lg:col-span-7 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-medium">
                                        <Link href="/courses" className="text-primary hover:text-primary/80 transition-colors">Courses</Link>
                                        <span className="text-white/20">/</span>
                                        <span className="text-white/50">Professional Track</span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.1] tracking-tight">
                                        {course.title}
                                    </h1>
                                    <p className="text-base text-white/50 max-w-2xl leading-relaxed">
                                        Master the industrial standards of {course.title.toLowerCase()}. A comprehensive intensive track designed for high-performance careers.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex -space-x-2">
                                            {[1,2,3,4].map(i=><div key={i} className="size-7 rounded-sm border-2 border-[#0a0a0a] bg-muted overflow-hidden shrink-0"><img src={`https://i.pravatar.cc/100?u=${i+40}`} alt="User" className="size-full object-cover"/></div>)}
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-white">1,248+ Learners</span>
                                        </div>
                                    </div>
                                    <div className="h-6 w-px bg-white/10 hidden md:block" />
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex items-center gap-0.5">
                                            {[1,2,3,4,5].map(i=><Star key={i} className="size-3 text-amber-400 fill-current"/>)}
                                        </div>
                                        <span className="text-xs font-medium text-white">Top Rated</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                    <Button size="lg" className="h-10 px-6 rounded-sm text-sm font-medium shadow-none w-full sm:w-auto" onClick={handleEnroll} disabled={processing||(is_enrolled&&enrollment_status==='paid')}>
                                        {is_enrolled&&enrollment_status==='paid'?'Enter Classroom':(enrollment_status==='pending'?'Resume Payment':`Join Program • ₹${course.price.toLocaleString()}`)}
                                    </Button>
                                    <Button variant="outline" size="lg" className="h-10 px-6 rounded-sm text-sm font-medium border-white/20 text-white bg-transparent hover:bg-white/5 shadow-none w-full sm:w-auto">
                                        Download Curriculum
                                    </Button>
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="relative aspect-[16/10] rounded-sm border border-white/10 overflow-hidden bg-[#111] group">
                                    <img src="/images/ai_cover.png" alt={course.title} className="size-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"/>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="size-14 rounded-sm bg-primary text-white flex items-center justify-center hover:scale-110 transition-transform">
                                            <PlayCircle className="size-7 fill-current"/>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3 px-3 py-2 bg-black/60 backdrop-blur-md rounded-sm border border-white/10 text-white">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                                                <span className="text-[10px] font-medium">Open Enrollment</span>
                                            </div>
                                            <span className="text-[10px] text-white/50">Next Cohort: {formatDate(course.batches[0]?.start_date||'2026-05-01')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="border-b border-border bg-muted/5 py-4">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                {icon:Clock,label:'Timeline',value:'Intensive Curriculum'},
                                {icon:Zap,label:'Velocity',value:'Project-based Learning'},
                                {icon:Users,label:'Engagement',value:'Interactive Sessions'},
                                {icon:Briefcase,label:'Placement',value:'Placement Support'},
                                {icon:Award,label:'Accreditation',value:'Professional Certification'}
                            ].map(({icon:Icon,label,value})=>(
                                <div key={label} className="flex items-center gap-2.5 p-3 rounded-sm border border-border bg-background hover:bg-muted/5 transition-colors">
                                    <div className="size-8 rounded-sm bg-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                                        <Icon className="size-4 text-primary"/>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-muted-foreground">{label}</div>
                                        <div className="text-xs font-medium text-foreground">{value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Core Value Props */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-7 space-y-8">
                                <div className="space-y-3">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 text-primary rounded-sm border border-primary/10 text-xs font-medium">
                                        The Learn Syntax Advantage
                                    </span>
                                    <h2 className="text-2xl font-semibold text-foreground tracking-tight leading-tight">
                                        Master industry-leading technologies used by <span className="text-primary">top-tier tech companies.</span>
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        {t:'Industry Experts',d:'Mentorship from industry experts at global tech leads.'},
                                        {t:'Production Grade',d:'Build scalable applications with modern architecture.'},
                                        {t:'Global Recognition',d:'Certificates valid across top-tier tech organizations.'},
                                        {t:'Job Ready',d:'End-to-end assistance from resume to final interview.'}
                                    ].map(({t,d})=>(
                                        <div key={t} className="p-4 rounded-sm border border-border space-y-2 hover:bg-muted/5 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className="size-1.5 rounded-full bg-primary" />
                                                <span className="text-xs font-semibold text-foreground">{t}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{d}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="rounded-sm border border-border overflow-hidden">
                                    <img src="/images/mentor.png" alt="Learning" className="w-full h-[280px] object-cover"/>
                                    <div className="flex items-center gap-3 p-4 border-t border-border bg-muted/5">
                                        <div className="size-10 rounded-sm bg-emerald-500 text-white flex items-center justify-center shrink-0"><CheckCircle2 className="size-5"/></div>
                                        <div>
                                            <div className="text-xs font-semibold text-foreground">Certified Instruction</div>
                                            <div className="text-[10px] text-muted-foreground mt-0.5">Industry Validated</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Curriculum Section */}
                <section className="py-16 bg-muted/5 border-y border-border">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6">
                        <div className="text-center mb-10 space-y-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 text-primary rounded-sm border border-primary/10 text-xs font-medium">
                                Learning Journey
                            </span>
                            <h2 className="text-2xl font-semibold text-foreground tracking-tight">Curriculum Roadmap</h2>
                            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                                A comprehensive breakdown of the modules and chapters you'll master in this specialization.
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            {course.modules?.length > 0 ? (
                                course.modules.map((module: any, mIndex: number) => (
                                    <ModuleItem key={module.id} module={module} index={mIndex} isFirst={mIndex === 0} />
                                ))
                            ) : (
                                <div className="py-16 text-center rounded-sm border border-dashed border-border bg-background">
                                    <BookOpen className="size-8 text-muted-foreground/15 mx-auto mb-2" strokeWidth={1} />
                                    <h3 className="text-sm font-medium text-foreground">Curriculum Under Review</h3>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-[240px] mx-auto">
                                        The roadmap for this program is being optimized for current industry standards.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6">
                        <div className="flex flex-col items-center text-center gap-3 mb-10">
                            <div className="size-10 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                <HelpCircle className="size-5"/>
                            </div>
                            <h2 className="text-2xl font-semibold text-foreground tracking-tight">Common Questions</h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                {q:'Who is eligible for this track?',a:'Designed for ambitious learners and industry professionals looking to pivot into specialized engineering roles.'},
                                {q:'Is the certification global?',a:'Yes, our certificates are cryptographically signed and recognized by leading organizations globally.'},
                                {q:'What if I miss a live session?',a:'All sessions are recorded in 4K and made available on your personalized learning portal within 2 hours.'}
                            ].map(({q,a})=>(
                                <div key={q} className="rounded-sm border border-border p-4 hover:bg-muted/5 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-semibold text-foreground">{q}</h3>
                                        <ChevronDown className="size-3.5 text-muted-foreground shrink-0 ml-3"/>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed pl-3 border-l-2 border-primary/20">{a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
