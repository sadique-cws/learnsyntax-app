import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BookOpen, Calendar, TrendingUp, Trophy, Download, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export default function StudentCertificate({ enrollment, certificate }: { enrollment: any, certificate: any }) {
    const assignmentAvg = Math.round(enrollment.assignment_average || 0);
    const examScore = Math.round(enrollment.exam_score || 0);
    const overallAvg = Math.round(enrollment.overall_average || 0);
    const qualified = overallAvg >= 60;

    return (
        <>
            <Head title="Certification Status" />
            <div className="w-full p-4 lg:p-6 space-y-4">
                <div>
                    <span className="text-[10px] font-medium text-primary block mb-0.5">Academic Verification</span>
                    <h1 className="text-lg font-semibold text-foreground">Certification Status</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">{enrollment.course.title}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <ScoreCard title="Assignments" value={`${assignmentAvg}%`} icon={BookOpen} passed={assignmentAvg >= 60} />
                    <ScoreCard title="Final Exam" value={`${examScore}%`} icon={Trophy} passed={examScore >= 60} />
                    <ScoreCard title="Overall Average" value={`${overallAvg}%`} icon={TrendingUp} passed={qualified} highlight />
                </div>

                {/* Result Card */}
                {qualified ? (
                    <div className="border border-primary/20 rounded-sm bg-primary/5 p-6 text-center space-y-4">
                        <div className="size-12 rounded-sm bg-primary flex items-center justify-center text-white mx-auto">
                            <CheckCircle2 className="size-6" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-foreground">Congratulations, {enrollment.user.name}!</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">You have successfully completed {enrollment.course.title}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-w-md mx-auto text-left">
                            <div className="flex items-center gap-2.5 p-2.5 rounded-sm bg-background border border-border">
                                <ShieldCheck className="size-3.5 text-primary shrink-0" />
                                <div>
                                    <div className="text-[10px] text-muted-foreground">Certificate No.</div>
                                    <div className="text-xs font-medium text-foreground">{certificate?.certificate_number || 'Pending'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 p-2.5 rounded-sm bg-background border border-border">
                                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                                <div>
                                    <div className="text-[10px] text-muted-foreground">Status</div>
                                    <div className="text-xs font-medium text-emerald-600">Authenticated</div>
                                </div>
                            </div>
                        </div>

                        <Button size="sm" className="h-9 px-6 rounded-sm shadow-none font-medium text-sm">
                            <Download className="size-3.5 mr-2" /> Download Certificate
                        </Button>
                    </div>
                ) : (
                    <div className="border border-red-200 rounded-sm bg-red-50/50 p-6 text-center space-y-3">
                        <div className="size-12 rounded-sm bg-red-100 flex items-center justify-center text-red-600 mx-auto">
                            <XCircle className="size-6" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-foreground">Requirement Not Met</h2>
                            <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
                                An overall average of 60% is required to earn the professional certificate. Keep working on your assignments.
                            </p>
                        </div>
                        <Button asChild variant="outline" size="sm" className="rounded-sm h-8 px-4 shadow-none text-xs font-medium">
                            <Link href={`/my-course/${enrollment.id}/assignments`}>Review Performance</Link>
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

function ScoreCard({ title, value, icon: Icon, passed, highlight = false }: any) {
    return (
        <div className={`rounded-sm border p-3 ${highlight ? 'border-primary/20 bg-primary/5' : 'border-border bg-background'}`}>
            <div className="flex items-center justify-between mb-2">
                <div className={`size-7 rounded-sm flex items-center justify-center ${highlight ? 'bg-primary text-white' : 'bg-muted border border-border text-muted-foreground'}`}>
                    <Icon className="size-3.5" />
                </div>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-sm ${passed ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                    {passed ? 'PASS' : 'FAIL'}
                </span>
            </div>
            <div className="text-[10px] font-medium text-muted-foreground mb-0.5">{title}</div>
            <div className={`text-xl font-semibold tabular-nums ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</div>
        </div>
    );
}

StudentCertificate.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'My Course', href: '#' }, { title: 'Certificate', href: '#' }]}>
        {page}
    </AppLayout>
);
