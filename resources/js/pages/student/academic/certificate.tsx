import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Download, Award, ShieldCheck, CheckCircle2, XCircle, TrendingUp, BookOpen, Trophy } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function StudentCertificate({ enrollment, certificate }: { enrollment: any, certificate: any }) {
    const isEligible = !enrollment.error; // The controller handles redirect if not eligible, but let's be safe
    
    // Virtual calculation for UI display
    const assignmentAvg = Math.round(enrollment.assignment_average || 0);
    const examScore = Math.round(enrollment.exam_score || 0);
    const overallAvg = Math.round(enrollment.overall_average || 0);

    return (
        <>
            <Head title="Certification Center" />
            
            <div className="w-full p-4 lg:p-6 font-sans">
                <div className="max-w-4xl mx-auto space-y-10">
                    <div className="text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2 block">Academic Verification</span>
                        <h1 className="text-4xl font-black tracking-tight uppercase leading-none">Your Certification Status</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatsCard 
                            title="Assignment Average" 
                            value={`${assignmentAvg}%`} 
                            icon={BookOpen} 
                            status={assignmentAvg >= 60 ? 'PASS' : 'FAIL'} 
                        />
                        <StatsCard 
                            title="Final Exam" 
                            value={`${examScore}%`} 
                            icon={Trophy} 
                            status={examScore >= 60 ? 'PASS' : 'FAIL'} 
                        />
                        <StatsCard 
                            title="Overall Average" 
                            value={`${overallAvg}%`} 
                            icon={TrendingUp} 
                            status={overallAvg >= 60 ? 'QUALIFIED' : 'NOT ELIGIBLE'} 
                            highlight 
                        />
                    </div>

                    {overallAvg >= 60 ? (
                        <Card className="border-border  rounded-[3rem] overflow-hidden bg-primary/5 border-2 border-primary/20 p-1">
                            <CardContent className="p-10 text-center space-y-8 bg-white rounded-[2.8rem]">
                                <div className="size-24 rounded-[2rem] bg-primary flex items-center justify-center text-white mx-auto  ">
                                    <Award className="size-14" />
                                </div>
                                
                                <div>
                                    <h2 className="text-4xl font-black uppercase tracking-tight mb-3">Congratulations, {enrollment.user.name}!</h2>
                                    <p className="text-muted-foreground font-medium max-w-lg mx-auto">
                                        You have successfully cleared the Learn Syntax professional certification for <span className="text-foreground font-black">{enrollment.course.title}</span>.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border">
                                        <ShieldCheck className="size-5 text-primary" />
                                        <div className="text-[10px] font-bold uppercase text-muted-foreground">Verification ID: <span className="text-foreground font-black">{certificate?.certificate_number}</span></div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border">
                                        <CheckCircle2 className="size-5 text-green-600" />
                                        <div className="text-[10px] font-bold uppercase text-muted-foreground">Status: <span className="text-foreground font-black text-green-600">VERIFIED</span></div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button size="lg" className="h-16 px-12 rounded-[2rem] bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-sm   transition-all active:scale-95">
                                        <Download className="mr-3 size-5" /> Download Professional Certificate
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-border  rounded-[3rem] overflow-hidden bg-red-500/[0.03] border-2 border-red-500/20 p-1">
                            <CardContent className="p-12 text-center space-y-6 bg-white rounded-[2.8rem]">
                                <div className="size-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-600 mx-auto">
                                    <XCircle className="size-12" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Certification Requirement Not Met</h2>
                                    <p className="text-muted-foreground font-medium max-w-md mx-auto">
                                        An overall average of <span className="text-foreground font-black">60%</span> is required to earn the certificate. Please review your weekly assignments or re-take the exam if applicable.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <Button asChild variant="outline" className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px] border-2">
                                        <Link href={`/my-course/${enrollment.id}/assignments`}>Review Assignments</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

function StatsCard({ title, value, icon: Icon, status, highlight = false }: any) {
    return (
        <Card className={`border-border  rounded-[2rem] ${highlight ? 'border-2 border-primary/20 bg-primary/5' : 'bg-muted/30 border border-border/50'}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`size-10 rounded-xl flex items-center justify-center ${highlight ? 'bg-primary text-white  ' : 'bg-background border border-border text-muted-foreground'}`}>
                        <Icon className="size-5" />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${status === 'PASS' || status === 'QUALIFIED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {status}
                    </span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{title}</div>
                <div className={`text-3xl font-black ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</div>
            </CardContent>
        </Card>
    );
}

StudentCertificate.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'My Course', href: '#' }, { title: 'Certificate', href: '#' }]}>
        {page}
    </AppLayout>
);
