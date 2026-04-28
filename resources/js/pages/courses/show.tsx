import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLogoIcon from '@/components/app-logo-icon';
import { CheckCircle2, Globe, Users, Calendar, ArrowRight, LayoutDashboard, Clock, Star, PlayCircle, BookOpen, ShieldCheck, Zap, GraduationCap, MessageSquare, ChevronDown, Award, HelpCircle, Briefcase, UserCheck } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { dashboard } from '@/routes';

export default function CourseShow({ course, is_enrolled, enrollment_status, enrollment_id }: { 
    course: any, 
    is_enrolled: boolean, 
    enrollment_status: string | null,
    enrollment_id: number | null
}) {
    const { post, processing } = useForm();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('curriculum');

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleEnroll = () => {
        post(`/enroll/${course.id}`);
    };

    const formatDate = (dateString: string) => {
        if (!mounted) return '';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <PublicLayout>
            <Head title={course.title} />
            
            <div className="font-sans selection:bg-primary/20 bg-white overflow-hidden">
                
                {/* 1. DARK HERO SECTION */}
                <section className="bg-[#0f172a] text-white pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px] -z-0" />
                    <div className="mx-auto max-w-7xl px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-7">
                                <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                                    <Link href="/courses" className="opacity-60 hover:opacity-100">Online Courses</Link>
                                    <span className="opacity-20">/</span>
                                    <span>Professional Certificate</span>
                                </div>
                                <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-8 leading-tight">
                                    {course.title} <span className="text-primary block lg:inline">Masterclass</span>
                                </h1>
                                <p className="text-lg text-slate-300 mb-10 max-w-2xl font-medium leading-relaxed opacity-80">
                                    {course.description} Comprehensive hands-on training designed to take you from beginner to professional in 24 weeks.
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-6 mb-12">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="size-8 rounded-full border-2 border-[#0f172a] bg-slate-800 overflow-hidden shrink-0">
                                                    <img src={`https://i.pravatar.cc/100?u=${i + 30}`} alt="User" className="size-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">1.2k+ Enrolled</span>
                                    </div>
                                    <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
                                    <div className="flex items-center gap-2">
                                        <Star className="size-4 text-orange-500 fill-current" />
                                        <span className="text-sm font-black tracking-tight">4.9/5 Rating</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <Button 
                                        size="lg" 
                                        className="h-14 px-10 rounded-xl font-black bg-primary hover:bg-primary/90 text-white tracking-widest uppercase text-xs   transition-transform active:scale-95"
                                        onClick={handleEnroll}
                                        disabled={processing || is_enrolled}
                                    >
                                        {is_enrolled ? 'Already Enrolled' : 'Enroll Now @ ₹' + course.price}
                                    </Button>
                                    <Button variant="outline" size="lg" className="h-14 px-10 rounded-xl font-black border-white/20 text-white hover:bg-white/5 tracking-widest uppercase text-xs">
                                        Download Brochure
                                    </Button>
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="relative group aspect-video lg:aspect-square rounded-3xl bg-slate-900 border-4 border-white/5 overflow-hidden ">
                                    <img 
                                        src="/images/ai_cover.png" 
                                        alt={course.title} 
                                        className="size-full object-cover opacity-60" 
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="size-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-primary transition-all group/play  ring-8 ring-white/5">
                                            <PlayCircle className="size-10 fill-current group-hover/play:scale-110 transition-transform" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Next Batch Starts: {formatDate(course.batches[0]?.start_date || '2026-05-01')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. STATS BAR (MIRRORING IMAGE) */}
                <section className="border-b border-slate-100 py-8 bg-slate-50/50">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                            <StatItem icon={Clock} label="Duration" value="24 Weeks" />
                            <StatItem icon={Zap} label="Learning" value="Hands-on Projects" />
                            <StatItem icon={Users} label="Batch Type" value="Live Interactive" />
                            <StatItem icon={Briefcase} label="Career" value="Job Assistance" />
                            <StatItem icon={Award} label="Certificate" value="Professional ID" />
                        </div>
                    </div>
                </section>

                {/* 3. KEY HIGHLIGHTS / WHAT YOU'LL LEARN */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-md text-[10px] font-black uppercase tracking-widest mb-6">
                                    Skill Development
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight mb-10 leading-tight">
                                    Become a job-ready <br /> 
                                    <span className="text-primary">{course.title} Expert</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                    <HighlightItem title="Industry Curriculum" desc="Designed by senior engineers from top tech companies." />
                                    <HighlightItem title="Hands-on Projects" desc="Build real-world applications for your professional portfolio." />
                                    <HighlightItem title="1:1 Mentorship" desc="Personal doubt clearing sessions with industry experts." />
                                    <HighlightItem title="Certification" desc="Get a verified professional certificate on completion." />
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] -z-10" />
                                <div className="rounded-3xl border border-slate-200 p-8 bg-white  overflow-hidden relative group">
                                    <img src="/images/mentor.png" alt="Learning" className="w-full h-[300px] object-cover rounded-2xl mb-8 group-hover:scale-105 transition-transform duration-700" />
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-primary text-white flex items-center justify-center  ">
                                            <CheckCircle2 className="size-6" />
                                        </div>
                                        <div>
                                            <div className="font-black text-sm uppercase tracking-tight">Verified Path</div>
                                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Enroll to start your journey</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. CURRICULUM SECTION (MIRRORING IMAGE ACCORDION) */}
                <section className="py-24 bg-slate-50">
                    <div className="mx-auto max-w-5xl px-6 text-center">
                        <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight mb-4">Course Curriculum</h2>
                        <p className="text-muted-foreground font-medium mb-16">A structured path to mastery, broken down into modules.</p>
                        
                        <div className="space-y-4 text-left">
                            {[1,2,3,4].map((i) => (
                                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 flex items-center justify-between group cursor-pointer hover:border-primary transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-xs text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                            {String(i).padStart(2, '0')}
                                        </div>
                                        <h3 className="font-black text-sm uppercase tracking-widest">Module {i}: Advanced Architectural Patterns</h3>
                                    </div>
                                    <ChevronDown className="size-5 text-slate-300 group-hover:text-primary transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. CERTIFICATION SECTION */}
                <section className="py-24 bg-[#0f172a] text-white">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight mb-8">Get Your Professional Certificate</h2>
                                <p className="text-lg text-slate-300 mb-10 font-medium leading-relaxed opacity-80">
                                    Showcase your expertise to potential employers with a unique certification ID. Our certificates are recognized by leading tech firms across India.
                                </p>
                                <ul className="space-y-5">
                                    <li className="flex items-center gap-4 text-sm font-black uppercase tracking-widest">
                                        <div className="size-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                            <CheckCircle2 className="size-4" />
                                        </div>
                                        Verified Credential
                                    </li>
                                    <li className="flex items-center gap-4 text-sm font-black uppercase tracking-widest">
                                        <div className="size-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                            <CheckCircle2 className="size-4" />
                                        </div>
                                        LinkedIn Sharable
                                    </li>
                                </ul>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/20 rounded-[2rem] blur-2xl opacity-30 group-hover:opacity-50 transition-all" />
                                <div className="relative rounded-2xl border-4 border-white/5 bg-white/5 backdrop-blur overflow-hidden ">
                                    <img src="/images/certificate.png" alt="Certificate" className="w-full h-auto opacity-90 group-hover:scale-105 transition-transform duration-700" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. FAQ SECTION */}
                <section className="py-24">
                    <div className="mx-auto max-w-3xl px-6">
                        <div className="flex items-center justify-center gap-3 mb-10">
                            <HelpCircle className="size-6 text-primary" />
                            <h2 className="text-3xl font-black uppercase tracking-tight">Frequently Asked Questions</h2>
                        </div>
                        <div className="space-y-4">
                            <FaqItem question="Who is this course for?" answer="This course is designed for both beginners and intermediate learners who want to master modern industry standards." />
                            <FaqItem question="Do I get a certificate?" answer="Yes, upon successful completion of the course and final assessment, you will receive an official professional certificate." />
                            <FaqItem question="Is there any placement assistance?" answer="Yes, our Professional and Elite plans include dedicated job assistance and portfolio review sessions." />
                        </div>
                    </div>
                </section>

                {/* 8. STICKY BOTTOM BAR */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 lg:p-6 z-50 lg:hidden shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                    <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Fee</div>
                            <div className="text-xl font-black">₹{course.price}</div>
                        </div>
                        <Button 
                            className="flex-1 rounded-xl h-12 font-black uppercase tracking-widest text-[10px] bg-primary" 
                            onClick={handleEnroll}
                            disabled={processing || is_enrolled}
                        >
                            {is_enrolled ? 'Already Enrolled' : 'Enroll Now'}
                        </Button>
                    </div>
                </div>

            </div>
        </PublicLayout>
    );
}

function StatItem({ icon: Icon, label, value }: any) {
    return (
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                    <Icon className="size-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
            </div>
            <div className="text-sm font-black uppercase tracking-tight">{value}</div>
        </div>
    );
}

function HighlightItem({ title, desc }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary" />
                <h3 className="font-black text-sm uppercase tracking-widest">{title}</h3>
            </div>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed pl-5">{desc}</p>
        </div>
    );
}

function FaqItem({ question, answer }: any) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 hover:border-primary transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-black text-sm uppercase tracking-widest text-foreground/80">{question}</h3>
                <ChevronDown className="size-4 text-slate-300 group-hover:text-primary transition-all" />
            </div>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">{answer}</p>
        </div>
    );
}
