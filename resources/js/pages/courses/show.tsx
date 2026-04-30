import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, PlayCircle, Clock, Zap, Users, Briefcase, Award, ChevronDown, HelpCircle, BookOpen } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

function cn(...classes: any[]) { return classes.filter(Boolean).join(' '); }

function ModuleItem({ module, index, isFirst }: { module: any, index: number, isFirst: boolean }) {
    const [isOpen, setIsOpen] = useState(isFirst);
    return (
        <div className="rounded-sm border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-200">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors group"
            >
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "size-9 rounded-sm flex items-center justify-center text-xs font-bold border transition-all",
                        isOpen ? "bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-200" : "bg-slate-50 text-slate-400 border-slate-200 group-hover:border-indigo-300 group-hover:text-indigo-500"
                    )}>
                        {index + 1}
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-400  block mb-0.5">Module {index + 1}</span>
                        <h3 className={cn(
                            "font-bold text-[15px] transition-colors",
                            isOpen ? "text-indigo-600" : "text-slate-900"
                        )}>
                            {module.title}
                        </h3>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase hidden sm:inline tracking-tight">
                        {module.chapters?.length || 0} Topics
                    </span>
                    <ChevronDown className={cn(
                        "size-4 text-slate-400 transition-transform duration-300",
                        isOpen && "rotate-180 text-indigo-600"
                    )}/>
                </div>
            </button>
            
            <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}>
                <div className="overflow-hidden">
                    <div className="p-5 pt-0 space-y-3 border-t border-slate-100 mt-0 bg-slate-50/30">
                        {module.chapters?.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2 pt-5">
                                {module.chapters.map((chapter: any, cIndex: number) => (
                                    <div key={chapter.id} className="flex items-start gap-3 p-3 rounded-sm border border-slate-200/60 bg-white hover:border-indigo-200 hover:shadow-sm transition-all group/chapter">
                                        <div className="size-5 rounded-sm bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200 mt-0.5 group-hover/chapter:bg-indigo-50 group-hover/chapter:text-indigo-600 group-hover/chapter:border-indigo-100 transition-colors">
                                            {cIndex + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-semibold text-slate-900 group-hover/chapter:text-indigo-600 transition-colors">{chapter.title}</h4>
                                            {chapter.description && (
                                                <p className="text-[10px] text-slate-500 leading-relaxed mt-1 line-clamp-1">{chapter.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <p className="text-[10px] font-bold text-slate-400  italic">Chapters coming soon</p>
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
            <Head title={`${course.title} | Specialization`} />
            <div className="pb-20 bg-background">
                {/* Hero */}
                <section className="bg-[#0a0a0a] text-white pt-12 pb-16 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent)]" />
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-7 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                                        <Link href="/courses" className="hover:text-primary/80 transition-colors">Courses</Link>
                                        <span className="text-white/20">/</span>
                                        <span className="text-white/60">Professional Track</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                                        {course.title}
                                    </h1>
                                    <p className="text-lg text-white/60 max-w-2xl leading-relaxed font-medium">
                                        Master the industrial standards of {course.title.toLowerCase()}. A comprehensive intensive track designed for high-performance careers.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-6 py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-3">
                                            {[1,2,3,4].map(i=><div key={i} className="size-9 rounded-sm border-2 border-[#0a0a0a] bg-muted overflow-hidden shrink-0"><img src={`https://i.pravatar.cc/100?u=${i+40}`} alt="User" className="size-full object-cover"/></div>)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">1,248+ Learners</span>
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Learning Now</span>
                                        </div>
                                    </div>
                                    <div className="h-10 w-px bg-white/10 hidden md:block" />
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            {[1,2,3,4,5].map(i=><Star key={i} className="size-3.5 text-amber-400 fill-current"/>)}
                                        </div>
                                        <span className="text-sm font-bold text-white">Top Rated</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <Button size="lg" className="h-12 px-8 rounded-sm font-bold  bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-primary/40 transition-all border-none w-full sm:w-auto" onClick={handleEnroll} disabled={processing||(is_enrolled&&enrollment_status==='paid')}>
                                        {is_enrolled&&enrollment_status==='paid'?'Enter Classroom':(enrollment_status==='pending'?'Resume Payment':`Join Program • ₹${course.price.toLocaleString()}`)}
                                    </Button>
                                    <Button variant="outline" size="lg" className="h-12 px-8 rounded-sm font-bold  border-white/20 text-white bg-transparent hover:bg-white/5 shadow-none w-full sm:w-auto transition-all">
                                        Download Curriculum
                                    </Button>
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="relative aspect-[16/10] rounded-sm border border-white/10 overflow-hidden bg-[#111] shadow-2xl group">
                                    <img src="/images/ai_cover.png" alt={course.title} className="size-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"/>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="size-16 rounded-sm bg-primary text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-xl">
                                            <PlayCircle className="size-8 fill-current"/>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-sm border border-white/10 text-white">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="size-2 rounded-full bg-emerald-500 animate-pulse"/>
                                                <span className="text-[11px] font-bold uppercase tracking-tight">Open Enrollment</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-white/60">Next Cohort: {formatDate(course.batches[0]?.start_date||'2026-05-01')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="border-b border-border bg-muted/5 py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                {icon:Clock,label:'Timeline',value:'Intensive Curriculum'},
                                {icon:Zap,label:'Velocity',value:'Project-based Learning'},
                                {icon:Users,label:'Engagement',value:'Interactive Sessions'},
                                {icon:Briefcase,label:'Placement',value:'Placement Support'},
                                {icon:Award,label:'Accreditation',value:'Professional Certification'}
                            ].map(({icon:Icon,label,value})=>(
                                <div key={label} className="flex items-center gap-3 p-4 rounded-sm border border-border/60 bg-background shadow-sm hover:border-primary/30 transition-all group">
                                    <div className="size-10 rounded-sm bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors shrink-0">
                                        <Icon className="size-5 text-primary"/>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-muted-foreground  mb-0.5">{label}</div>
                                        <div className="text-xs font-bold text-foreground">{value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Core Value Props */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                            <div className="lg:col-span-7 space-y-10">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-sm border border-primary/10 text-[11px] font-bold ">
                                        The Learn Syntax Advantage
                                    </div>
                                    <h2 className="text-3xl font-bold text-foreground tracking-tight leading-tight">
                                        Master industry-leading technologies used by <span className="text-primary italic">top-tier tech companies.</span>
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        {t:'Industry Experts',d:'Mentorship from industry experts at global tech leads.'},
                                        {t:'Production Grade',d:'Build scalable applications with modern architecture.'},
                                        {t:'Global Recognition',d:'Certificates valid across top-tier tech organizations.'},
                                        {t:'Job Ready',d:'End-to-end assistance from resume to final interview.'}
                                    ].map(({t,d})=>(
                                        <div key={t} className="p-5 rounded-sm border border-border/80 bg-background shadow-sm space-y-3 hover:border-primary/20 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                <span className="font-bold text-xs uppercase tracking-wider">{t}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">{d}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-5 relative">
                                <div className="absolute -top-4 -right-4 size-32 bg-primary/5 rounded-full blur-3xl" />
                                <div className="relative border border-border/80 rounded-sm p-4 bg-muted/10 shadow-2xl">
                                    <img src="/images/mentor.png" alt="Learning" className="w-full h-[320px] object-cover rounded-sm border border-border/60 mb-5"/>
                                    <div className="flex items-center gap-4 p-4 bg-background border border-border/80 rounded-sm shadow-sm">
                                        <div className="size-12 rounded-sm bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg"><CheckCircle2 className="size-6"/></div>
                                        <div>
                                            <div className="font-bold text-xs ">Certified Instruction</div>
                                            <div className="text-[11px] font-bold text-muted-foreground mt-0.5 uppercase tracking-tighter">Industry Validated</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Curriculum Section */}
                <section className="py-20 bg-slate-50/50 border-y border-slate-200">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6">
                        <div className="text-center mb-16 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-sm border border-indigo-100 text-[10px] font-bold ">
                                Learning Journey
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Curriculum Roadmap</h2>
                            <p className="text-sm font-medium text-slate-500 max-w-lg mx-auto leading-relaxed">
                                A comprehensive breakdown of the modules and chapters you'll master in this specialization.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            {course.modules?.length > 0 ? (
                                course.modules.map((module: any, mIndex: number) => (
                                    <ModuleItem key={module.id} module={module} index={mIndex} isFirst={mIndex === 0} />
                                ))
                            ) : (
                                <div className="py-20 text-center rounded-sm border border-dashed border-slate-200 bg-slate-50/50">
                                    <BookOpen className="size-12 text-slate-200 mx-auto mb-4" strokeWidth={1} />
                                    <h3 className="text-sm font-semibold text-slate-500 ">Curriculum Under Review</h3>
                                    <p className="text-xs font-medium text-slate-400 mt-1 italic leading-relaxed max-w-[240px] mx-auto">
                                        The roadmap for this program is being optimized for current industry standards.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-20">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6">
                        <div className="flex flex-col items-center text-center gap-4 mb-12">
                            <div className="size-12 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                <HelpCircle className="size-6"/>
                            </div>
                            <h2 className="text-3xl font-bold text-foreground tracking-tight uppercase">Common Questions</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                {q:'Who is eligible for this track?',a:'Designed for ambitious learners and industry professionals looking to pivot into specialized engineering roles.'},
                                {q:'Is the certification global?',a:'Yes, our certificates are cryptographically signed and recognized by leading organizations globally.'},
                                {q:'What if I miss a live session?',a:'All sessions are recorded in 4K and made available on your personalized learning portal within 2 hours.'}
                            ].map(({q,a})=>(
                                <div key={q} className="rounded-sm border border-border/80 bg-background p-6 hover:border-primary transition-all group shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-[15px] text-foreground uppercase tracking-tight">{q}</h3>
                                        <ChevronDown className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0"/>
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground leading-relaxed pl-1 border-l-2 border-primary/20">{a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
