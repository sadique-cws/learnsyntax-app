import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, PlayCircle, Clock, Zap, Users, Briefcase, Award, ChevronDown, HelpCircle } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

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
            <Head title={`${course.title} | Professional Certificate`} />
            <div className="pb-20 bg-background">
                {/* Hero */}
                <section className="bg-[#0a0a0a] text-white pt-12 pb-16 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent)]" />
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-7 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                                        <Link href="/courses" className="hover:text-primary/80 transition-colors">Catalog</Link>
                                        <span className="text-white/20">/</span>
                                        <span className="text-white/60">Specialization Path</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                                        {course.title}
                                    </h1>
                                    <p className="text-lg text-white/60 max-w-2xl leading-relaxed font-medium">
                                        Master the industrial standards of {course.title.toLowerCase()}. A comprehensive 24-week immersive track designed for high-performance careers.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-6 py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-3">
                                            {[1,2,3,4].map(i=><div key={i} className="size-9 rounded-sm border-2 border-[#0a0a0a] bg-muted overflow-hidden shrink-0"><img src={`https://i.pravatar.cc/100?u=${i+40}`} alt="User" className="size-full object-cover"/></div>)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">1,248+ Learners</span>
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Actively Enrolled</span>
                                        </div>
                                    </div>
                                    <div className="h-10 w-px bg-white/10 hidden md:block" />
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            {[1,2,3,4,5].map(i=><Star key={i} className="size-3.5 text-amber-400 fill-current"/>)}
                                        </div>
                                        <span className="text-sm font-bold text-white">4.92 / 5.0</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <Button size="lg" className="h-12 px-8 rounded-sm font-black uppercase tracking-widest bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-primary/40 transition-all border-none w-full sm:w-auto" onClick={handleEnroll} disabled={processing||(is_enrolled&&enrollment_status==='paid')}>
                                        {is_enrolled&&enrollment_status==='paid'?'Access Course Content':(enrollment_status==='pending'?'Complete Transaction':`Enroll Now • ₹${course.price.toLocaleString()}`)}
                                    </Button>
                                    <Button variant="outline" size="lg" className="h-12 px-8 rounded-sm font-bold uppercase tracking-widest border-white/20 text-white bg-transparent hover:bg-white/5 shadow-none w-full sm:w-auto transition-all">
                                        Syllabus PDF
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
                                            <span className="text-[11px] font-bold text-white/60">Starts: {formatDate(course.batches[0]?.start_date||'2026-05-01')}</span>
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
                                {icon:Clock,label:'Timeline',value:'24 Weeks Intensive'},
                                {icon:Zap,label:'Velocity',value:'Hands-on Labs'},
                                {icon:Users,label:'Engagement',value:'Live Interactive'},
                                {icon:Briefcase,label:'Placement',value:'Career Coaching'},
                                {icon:Award,label:'Accreditation',value:'Govt. Recognized'}
                            ].map(({icon:Icon,label,value})=>(
                                <div key={label} className="flex items-center gap-3 p-4 rounded-sm border border-border/60 bg-background shadow-sm hover:border-primary/30 transition-all group">
                                    <div className="size-10 rounded-sm bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors shrink-0">
                                        <Icon className="size-5 text-primary"/>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{label}</div>
                                        <div className="text-xs font-black text-foreground">{value}</div>
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
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-sm border border-primary/10 text-[11px] font-bold uppercase tracking-widest">
                                        Why Choose Learn Syntax
                                    </div>
                                    <h2 className="text-3xl font-black text-foreground tracking-tight leading-tight">
                                        Master the technology stack used by <span className="text-primary italic">Fortune 500 companies.</span>
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        {t:'Industry Experts',d:'Mentorship from senior leads at Google, Amazon & Meta.'},
                                        {t:'Production Grade',d:'Build scalable applications with modern architecture.'},
                                        {t:'Global Recognition',d:'Certificates valid across top-tier tech organizations.'},
                                        {t:'Job Ready',d:'End-to-end assistance from resume to final interview.'}
                                    ].map(({t,d})=>(
                                        <div key={t} className="p-5 rounded-sm border border-border/80 bg-background shadow-sm space-y-3 hover:border-primary/20 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                <span className="font-black text-xs uppercase tracking-wider">{t}</span>
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
                                            <div className="font-black text-xs uppercase tracking-widest">Verified Instructor Path</div>
                                            <div className="text-[11px] font-bold text-muted-foreground mt-0.5 uppercase tracking-tighter">Curriculum 2.0 Compliant</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Curriculum Section */}
                <section className="py-20 bg-muted/5 border-y border-border/60">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6">
                        <div className="text-center mb-12 space-y-3">
                            <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Syllabus Breakdown</h2>
                            <p className="text-sm font-bold text-muted-foreground max-w-lg mx-auto uppercase tracking-widest">A deep dive into the modules you will master</p>
                        </div>
                        <div className="space-y-3">
                            {[1,2,3,4,5,6].map(i=>(
                                <div key={i} className="rounded-sm border border-border/80 bg-background p-5 flex items-center justify-between cursor-pointer hover:border-primary transition-all group shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-sm bg-muted/50 flex items-center justify-center font-black text-xs text-muted-foreground border border-border/60 group-hover:bg-primary group-hover:text-white transition-all">{String(i).padStart(2,'0')}</div>
                                        <h3 className="font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors">Phase {i}: Advanced Integration Patterns</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase hidden sm:inline">12 Lessons</span>
                                        <ChevronDown className="size-4 text-muted-foreground group-hover:text-primary transition-colors"/>
                                    </div>
                                </div>
                            ))}
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
                            <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Support & Intelligence</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                {q:'Who is eligible for this track?',a:'Designed for ambitious learners and industry professionals looking to pivot into specialized engineering roles.'},
                                {q:'Is the certification global?',a:'Yes, our certificates are cryptographically signed and recognized by leading organizations globally.'},
                                {q:'What if I miss a live session?',a:'All sessions are recorded in 4K and made available on your personalized learning portal within 2 hours.'}
                            ].map(({q,a})=>(
                                <div key={q} className="rounded-sm border border-border/80 bg-background p-6 hover:border-primary transition-all group shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-black text-[15px] text-foreground uppercase tracking-tight">{q}</h3>
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
