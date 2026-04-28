import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Download, Award, ShieldCheck, CheckCircle2, XCircle, TrendingUp, BookOpen, Trophy } from 'lucide-react';

export default function StudentCertificate({ enrollment, certificate }: { enrollment: any, certificate: any }) {
    const assignmentAvg = Math.round(enrollment.assignment_average || 0);
    const examScore = Math.round(enrollment.exam_score || 0);
    const overallAvg = Math.round(enrollment.overall_average || 0);

    return (
        <>
            <Head title="Certification Center" />
            
            <div className="w-full p-4 lg:p-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center">
                        <span className="text-[10px] font-black   text-primary mb-2 block">Academic Verification</span>
                        <h1 className="text-3xl font-black   leading-none">Certification Status</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatsCard 
                            title="Assignments" 
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
                            title="Overall" 
                            value={`${overallAvg}%`} 
                            icon={TrendingUp} 
                            status={overallAvg >= 60 ? 'QUALIFIED' : 'PENDING'} 
                            highlight 
                        />
                    </div>

                    {overallAvg >= 60 ? (
                        <Card className="border-border rounded overflow-hidden bg-primary/5 border border-primary/20">
                            <CardContent className="p-8 text-center space-y-8">
                                <div className="size-20 rounded bg-primary flex items-center justify-center text-white mx-auto">
                                    <Award className="size-10" />
                                </div>
                                
                                <div>
                                    <h2 className="text-3xl font-black   mb-3">Certified: {enrollment.user.name}</h2>
                                    <p className="text-[10px] text-muted-foreground font-black   max-w-lg mx-auto">
                                        Verified professional certification for {enrollment.course.title}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                                    <div className="flex items-center gap-3 p-4 rounded bg-card border border-border">
                                        <ShieldCheck className="size-4 text-primary" />
                                        <div className="text-[10px] font-bold  text-muted-foreground tracking-tight">Ref: <span className="text-foreground font-black">{certificate?.certificate_number}</span></div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded bg-card border border-border">
                                        <CheckCircle2 className="size-4 text-green-600" />
                                        <div className="text-[10px] font-bold  text-muted-foreground tracking-tight">Status: <span className="text-foreground font-black text-green-600 ">Authenticated</span></div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button size="lg" className="h-14 px-10 rounded bg-primary hover:bg-primary/90 font-black   text-xs transition-all">
                                        <Download className="mr-3 size-4" /> Download Certificate
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-border rounded overflow-hidden bg-red-500/[0.03] border border-red-500/20">
                            <CardContent className="p-10 text-center space-y-6 bg-card">
                                <div className="size-16 rounded bg-red-500/10 flex items-center justify-center text-red-600 mx-auto">
                                    <XCircle className="size-10" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black   mb-2">Requirement Not Met</h2>
                                    <p className="text-[10px] text-muted-foreground font-black   max-w-md mx-auto">
                                        An overall average of 60% is required to earn the professional certificate.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <Button asChild variant="outline" className="rounded h-11 px-8 font-black   text-[10px] border-border bg-card">
                                        <Link href={`/my-course/${enrollment.id}/assignments`}>Review Performance</Link>
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
        <Card className={`border-border rounded ${highlight ? 'border border-primary/20 bg-primary/5' : 'bg-card border border-border'}`}>
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className={`size-8 rounded flex items-center justify-center ${highlight ? 'bg-primary text-white' : 'bg-muted border border-border text-muted-foreground'}`}>
                        <Icon className="size-4" />
                    </div>
                    <span className={`text-[9px] font-black   px-2 py-0.5 rounded ${status === 'PASS' || status === 'QUALIFIED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {status}
                    </span>
                </div>
                <div className="text-[10px] font-black   text-muted-foreground/60 mb-1">{title}</div>
                <div className={`text-2xl font-black ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</div>
            </CardContent>
        </Card>
    );
}

StudentCertificate.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'My Course', href: '#' }, { title: 'Certificate', href: '#' }]}>
        {page}
    </AppLayout>
);
