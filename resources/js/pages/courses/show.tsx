import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, PlayCircle, Clock, Zap, Users, Briefcase, Award, ChevronDown, HelpCircle } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export default function CourseShow({ course, is_enrolled, enrollment_status, enrollment_id }: { 
    course: any, 
    is_enrolled: boolean,
    enrollment_status: string | null,
    enrollment_id: number | null
}) {
    const { post, processing } = useForm();
    const [mounted, setMounted] = useState(false);

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
            
            <div className="font-sans selection:bg-primary/20 pb-16">
                
                {/* 1. SOLID HERO SECTION */}
                <section className="bg-foreground text-background pt-8 pb-12 lg:pt-16 lg:pb-16 border-b border-border">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                            <div className="lg:col-span-7">
                                <div className="flex items-center gap-2 text-primary text-[10px] font-black   mb-4">
                                    <Link href="/courses" className="hover:underline">Online Courses</Link>
                                    <span className="opacity-50">/</span>
                                    <span>Professional Certificate</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black  text-foreground leading-[1.15] mb-6">
                                    {course.title}
                                </h1>
                                <p className="text-base lg:text-lg text-background/80 mb-8 max-w-2xl font-medium leading-relaxed">
                                    {course.description} Comprehensive hands-on training designed to take you from beginner to professional in 24 weeks.
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-8">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="size-8 rounded border-2 border-foreground bg-muted overflow-hidden shrink-0">
                                                    <img src={`https://i.pravatar.cc/100?u=${i + 30}`} alt="User" className="size-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[11px] font-bold   text-background/70">1.2k+ Enrolled</span>
                                    </div>
                                    <div className="h-4 w-[1px] bg-background/20 hidden sm:block" />
                                    <div className="flex items-center gap-1.5">
                                        <Star className="size-4 text-orange-400 fill-current" />
                                        <span className="text-sm font-bold tracking-tight">4.9/5 Rating</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button 
                                        size="lg" 
                                        className="h-12 px-8 rounded font-bold bg-primary hover:bg-primary/90 text-white text-xs w-full sm:w-auto"
                                        onClick={handleEnroll}
                                        disabled={processing || (is_enrolled && enrollment_status === 'paid')}
                                    >
                                        {is_enrolled && enrollment_status === 'paid' 
                                            ? 'Already Enrolled' 
                                            : (enrollment_status === 'pending' ? 'Proceed to Payment' : `Enroll Now @ ₹${course.price}`)}
                                    </Button>
                                    <Button variant="outline" size="lg" className="h-12 px-8 rounded font-bold border-background/20 text-background bg-foreground hover:bg-background/10 hover:text-background   text-xs w-full sm:w-auto">
                                        Download Brochure
                                    </Button>
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="relative group aspect-video rounded border border-border overflow-hidden bg-muted">
                                    <img 
                                        src="/images/ai_cover.png" 
                                        alt={course.title} 
                                        className="size-full object-cover opacity-80" 
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="size-16 rounded bg-background/20 backdrop-blur-sm border border-background/30 flex items-center justify-center text-white cursor-pointer hover:bg-primary transition-colors">
                                            <PlayCircle className="size-8 fill-current" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 p-3 bg-foreground/90 rounded border border-background/20 text-background">
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                                            <span className="text-[10px] font-bold  ">Next Batch: {formatDate(course.batches[0]?.start_date || '2026-05-01')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. FLAT STATS BAR */}
                <section className="border-b border-border bg-muted/20 py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
                            <StatItem icon={Clock} label="Duration" value="24 Weeks" />
                            <StatItem icon={Zap} label="Learning" value="Projects" />
                            <StatItem icon={Users} label="Format" value="Live Interactive" />
                            <StatItem icon={Briefcase} label="Career" value="Job Assist" />
                            <StatItem icon={Award} label="Certificate" value="Professional ID" />
                        </div>
                    </div>
                </section>

                {/* 3. KEY HIGHLIGHTS */}
                <section className="py-12 md:py-20 border-b border-border">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded text-[10px] font-bold   mb-4">
                                    Skill Development
                                </div>
                                <h2 className="text-xl md:text-2xl font-black  text-foreground mb-8">
                                    Become a job-ready <br /> 
                                    <span className="text-primary">{course.title} Expert</span>
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <HighlightItem title="Industry Curriculum" desc="Designed by senior engineers from top tech companies." />
                                    <HighlightItem title="Hands-on Projects" desc="Build real-world applications for your portfolio." />
                                    <HighlightItem title="1:1 Mentorship" desc="Personal doubt clearing sessions with experts." />
                                    <HighlightItem title="Certification" desc="Get a verified professional certificate on completion." />
                                </div>
                            </div>
                            <div className="border border-border rounded p-4 bg-muted/20">
                                <img src="/images/mentor.png" alt="Learning" className="w-full h-[250px] object-cover rounded border border-border mb-4" />
                                <div className="flex items-center gap-3 p-3 bg-background border border-border rounded">
                                    <div className="size-10 rounded bg-primary text-white flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="size-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm  tracking-tight">Verified Path</div>
                                        <div className="text-[10px] font-medium text-muted-foreground  ">Enroll to start your journey</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. CURRICULUM ACCORDION */}
                <section className="py-12 md:py-20 bg-muted/10 border-b border-border">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6">
                        <div className="text-center mb-10">
                            <h2 className="text-xl md:text-2xl font-black  text-foreground mb-2">Course Curriculum</h2>
                            <p className="text-sm text-muted-foreground">A structured path to mastery, broken down into modules.</p>
                        </div>
                        
                        <div className="space-y-3">
                            {[1,2,3,4].map((i) => (
                                <div key={i} className="rounded border border-border bg-background p-4 flex items-center justify-between cursor-pointer hover:border-primary transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="size-8 rounded bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground">
                                            {String(i).padStart(2, '0')}
                                        </div>
                                        <h3 className="font-bold text-sm  tracking-wide">Module {i}: Core Concepts</h3>
                                    </div>
                                    <ChevronDown className="size-4 text-muted-foreground" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. FAQ SECTION */}
                <section className="py-12 md:py-20">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6">
                        <div className="flex items-center gap-2 mb-8">
                            <HelpCircle className="size-5 text-primary" />
                            <h2 className="text-xl md:text-2xl font-black  text-foreground">Frequently Asked Questions</h2>
                        </div>
                        <div className="space-y-3">
                            <FaqItem question="Who is this course for?" answer="Designed for beginners and intermediate learners looking to master modern industry standards." />
                            <FaqItem question="Do I get a certificate?" answer="Yes, upon successful completion, you will receive an official professional certificate." />
                            <FaqItem question="Is there placement assistance?" answer="Yes, we provide dedicated job assistance and portfolio reviews." />
                        </div>
                    </div>
                </section>

            </div>
        </PublicLayout>
    );
}

function StatItem({ icon: Icon, label, value }: any) {
    return (
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left p-3 rounded border border-border bg-background">
            <div className="flex items-center gap-2 mb-2">
                <Icon className="size-3.5 text-primary" />
                <span className="text-[9px] font-bold   text-muted-foreground">{label}</span>
            </div>
            <div className="text-xs font-bold  tracking-tight">{value}</div>
        </div>
    );
}

function HighlightItem({ title, desc }: any) {
    return (
        <div className="space-y-1 p-4 rounded border border-border bg-background">
            <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-primary" />
                <h3 className="font-bold text-xs  tracking-wide">{title}</h3>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed pl-3.5">{desc}</p>
        </div>
    );
}

function FaqItem({ question, answer }: any) {
    return (
        <div className="rounded border border-border bg-background p-4 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm  tracking-wide text-foreground">{question}</h3>
                <ChevronDown className="size-4 text-muted-foreground" />
            </div>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">{answer}</p>
        </div>
    );
}
