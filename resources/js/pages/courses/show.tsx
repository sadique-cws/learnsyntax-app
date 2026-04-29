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
            <Head title={course.title} />
            <div className="pb-16">
                {/* Hero */}
                <section className="bg-foreground text-background pt-8 pb-10 border-b border-border">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-7">
                                <div className="flex items-center gap-1.5 text-primary text-[10px] font-medium mb-3">
                                    <Link href="/courses" className="hover:underline">Courses</Link>
                                    <span className="opacity-40">/</span>
                                    <span>Professional Certificate</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-background leading-tight mb-4">{course.title}</h1>
                                <p className="text-sm text-background/70 mb-6 max-w-2xl leading-relaxed">{course.description} Comprehensive hands-on training designed to take you from beginner to professional in 24 weeks.</p>
                                <div className="flex flex-wrap items-center gap-4 mb-5">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1,2,3].map(i=><div key={i} className="size-7 rounded-sm border-2 border-foreground bg-muted overflow-hidden shrink-0"><img src={`https://i.pravatar.cc/100?u=${i+30}`} alt="User" className="size-full object-cover"/></div>)}
                                        </div>
                                        <span className="text-[11px] font-medium text-background/60">1.2k+ Enrolled</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="size-3.5 text-orange-400 fill-current"/>
                                        <span className="text-xs font-medium">4.9 / 5</span>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button size="default" className="h-9 px-6 rounded-sm font-medium bg-primary text-white shadow-none w-full sm:w-auto" onClick={handleEnroll} disabled={processing||(is_enrolled&&enrollment_status==='paid')}>
                                        {is_enrolled&&enrollment_status==='paid'?'Already Enrolled':(enrollment_status==='pending'?'Proceed to Payment':`Enroll Now @ ₹${course.price}`)}
                                    </Button>
                                    <Button variant="outline" size="default" className="h-9 px-6 rounded-sm font-medium border-background/20 text-background bg-transparent hover:bg-background/10 shadow-none w-full sm:w-auto">Download Brochure</Button>
                                </div>
                            </div>
                            <div className="lg:col-span-5">
                                <div className="relative aspect-video rounded-sm border border-border overflow-hidden bg-muted">
                                    <img src="/images/ai_cover.png" alt={course.title} className="size-full object-cover opacity-80"/>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="size-14 rounded-sm bg-background/20 backdrop-blur-sm border border-background/30 flex items-center justify-center text-white cursor-pointer hover:bg-primary transition-colors">
                                            <PlayCircle className="size-7 fill-current"/>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-foreground/90 rounded-sm border border-background/20 text-background">
                                        <div className="flex items-center gap-2">
                                            <div className="size-1.5 rounded-full bg-red-500 animate-pulse"/>
                                            <span className="text-[10px] font-medium">Next Batch: {formatDate(course.batches[0]?.start_date||'2026-05-01')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="border-b border-border bg-muted/20 py-4">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[{icon:Clock,label:'Duration',value:'24 Weeks'},{icon:Zap,label:'Learning',value:'Live Projects'},{icon:Users,label:'Format',value:'Live Interactive'},{icon:Briefcase,label:'Career',value:'Job Assist'},{icon:Award,label:'Certificate',value:'Professional'}].map(({icon:Icon,label,value})=>(
                                <div key={label} className="flex items-center gap-2 p-2.5 rounded-sm border border-border bg-background">
                                    <Icon className="size-3.5 text-primary shrink-0"/>
                                    <div><div className="text-[9px] font-medium text-muted-foreground">{label}</div><div className="text-xs font-semibold">{value}</div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Highlights */}
                <section className="py-10 border-b border-border">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-sm border border-primary/10 text-[10px] font-medium mb-3">Skill Development</div>
                                <h2 className="text-lg font-semibold text-foreground mb-5">Become a job-ready <span className="text-primary">{course.title} Expert</span></h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {[{t:'Industry Curriculum',d:'Designed by senior engineers from top tech companies.'},{t:'Hands-on Projects',d:'Build real-world applications for your portfolio.'},{t:'1:1 Mentorship',d:'Personal doubt clearing sessions with experts.'},{t:'Certification',d:'Get a verified professional certificate on completion.'}].map(({t,d})=>(
                                        <div key={t} className="p-3 rounded-sm border border-border bg-background space-y-1">
                                            <div className="flex items-center gap-1.5"><div className="size-1.5 rounded-full bg-primary"/><span className="font-semibold text-xs">{t}</span></div>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed pl-3">{d}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="border border-border rounded-sm p-3 bg-muted/10">
                                <img src="/images/mentor.png" alt="Learning" className="w-full h-[220px] object-cover rounded-sm border border-border mb-3"/>
                                <div className="flex items-center gap-2.5 p-2.5 bg-background border border-border rounded-sm">
                                    <div className="size-8 rounded-sm bg-primary text-white flex items-center justify-center shrink-0"><CheckCircle2 className="size-4"/></div>
                                    <div><div className="font-semibold text-xs">Verified Path</div><div className="text-[10px] text-muted-foreground">Enroll to start your journey</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Curriculum */}
                <section className="py-10 bg-muted/10 border-b border-border">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6">
                        <div className="mb-5"><h2 className="text-lg font-semibold text-foreground">Course Curriculum</h2><p className="text-xs text-muted-foreground mt-0.5">A structured path to mastery, broken down into modules.</p></div>
                        <div className="space-y-2">
                            {[1,2,3,4].map(i=>(
                                <div key={i} className="rounded-sm border border-border bg-background p-3 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="size-7 rounded-sm bg-muted flex items-center justify-center font-medium text-xs text-muted-foreground border border-border">{String(i).padStart(2,'0')}</div>
                                        <h3 className="font-medium text-sm">Module {i}: Core Concepts</h3>
                                    </div>
                                    <ChevronDown className="size-3.5 text-muted-foreground"/>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-10">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6">
                        <div className="flex items-center gap-2 mb-5"><HelpCircle className="size-4 text-primary"/><h2 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h2></div>
                        <div className="space-y-2">
                            {[{q:'Who is this course for?',a:'Designed for beginners and intermediate learners looking to master modern industry standards.'},{q:'Do I get a certificate?',a:'Yes, upon successful completion, you will receive an official professional certificate.'},{q:'Is there placement assistance?',a:'Yes, we provide dedicated job assistance and portfolio reviews.'}].map(({q,a})=>(
                                <div key={q} className="rounded-sm border border-border bg-background p-3 hover:border-primary/50 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-between mb-1.5"><h3 className="font-medium text-sm text-foreground">{q}</h3><ChevronDown className="size-3.5 text-muted-foreground shrink-0"/></div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
