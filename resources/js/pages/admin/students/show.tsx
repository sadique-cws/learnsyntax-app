import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { User, Mail, Calendar, BookOpen, MapPin, Globe, CheckCircle2, ChevronLeft, Award, Trophy } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from '@inertiajs/react';

export default function AdminStudentShow({ student, available_batches }: { student: any, available_batches: any }) {
    const { patch, processing } = useForm();

    const handleBatchChange = (enrollmentId: number, batchId: string) => {
        patch(`/admin/enrollments/${enrollmentId}/batch`, {
            data: { batch_id: batchId },
            preserveScroll: true
        });
    };

    return (
        <>
            <Head title={`Student: ${student.name}`} />
            
            <div className="w-full p-4 lg:p-6 font-sans">
                <div className="mb-8">
                    <Link href="/admin/students" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-6">
                        <ChevronLeft className="size-4 mr-1" /> Back to Directory
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="size-20 rounded-3xl bg-primary flex items-center justify-center text-white  ">
                            <User className="size-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight uppercase leading-none mb-3">{student.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground font-bold">
                                <div className="flex items-center gap-1.5"><Mail className="size-3.5" /> {student.email}</div>
                                {student.phone && <div className="flex items-center gap-1.5 text-primary"><div className="size-3.5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] italic font-black">P</div> {student.phone}</div>}
                                <div className="size-1.5 rounded-full bg-border" />
                                <div className="uppercase tracking-widest">{student.gender || 'Unknown'}</div>
                                <div className="size-1.5 rounded-full bg-border" />
                                <div>Joined {new Date(student.created_at).toLocaleDateString()}</div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {student.qualification && (
                                    <div className="px-3 py-1 bg-muted rounded-lg text-[9px] font-black uppercase tracking-tight">
                                        {student.qualification}
                                    </div>
                                )}
                                {student.college && (
                                    <div className="px-3 py-1 bg-muted rounded-lg text-[9px] font-black uppercase tracking-tight text-primary">
                                        {student.college}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <section>
                        <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                            <BookOpen className="size-6 text-primary" />
                            Enrollments & Batch Management
                        </h2>
                        
                        <div className="grid grid-cols-1 gap-6">
                            {student.enrollments.map((enrollment: any) => (
                                <Card key={enrollment.id} className="border-border  rounded-[2rem] overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col lg:flex-row">
                                            <div className="p-8 lg:w-1/3 bg-muted/30 border-r border-border">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${enrollment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {enrollment.status}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-4">{enrollment.course.title}</h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                                        <Calendar className="size-4" />
                                                        Enrolled: {new Date(enrollment.created_at).toLocaleDateString()}
                                                    </div>
                                                    {enrollment.payment && (
                                                        <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                                                            <CheckCircle2 className="size-4" />
                                                            Paid: ${enrollment.payment.amount} via {enrollment.payment.payment_method}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="p-8 lg:w-2/3 flex flex-col justify-center border-b border-border lg:border-b-0">
                                                 <div className="mb-6">
                                                     <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-3 block">Assigned Batch</Label>
                                                     <div className="flex flex-col md:flex-row items-center gap-4">
                                                         <div className="flex-1 w-full">
                                                             <Select 
                                                                 defaultValue={enrollment.batch_id?.toString()} 
                                                                 onValueChange={(val) => handleBatchChange(enrollment.id, val)}
                                                                 disabled={processing}
                                                             >
                                                                 <SelectTrigger className="h-12 rounded-xl  border-2 border-border focus:border-primary transition-all">
                                                                     <SelectValue placeholder="No batch assigned" />
                                                                 </SelectTrigger>
                                                                 <SelectContent className="rounded-xl ">
                                                                     {(available_batches[enrollment.course_id] || []).map((batch: any) => (
                                                                         <SelectItem key={batch.id} value={batch.id.toString()} className="font-bold">
                                                                             <div className="flex items-center gap-2">
                                                                                 {batch.type === 'online' ? <Globe className="size-3.5" /> : <MapPin className="size-3.5" />}
                                                                                 {batch.name} ({batch.type})
                                                                             </div>
                                                                         </SelectItem>
                                                                     ))}
                                                                 </SelectContent>
                                                             </Select>
                                                         </div>
                                                         {enrollment.batch && (
                                                             <div className="flex items-center gap-4 px-4 py-3 bg-primary/5 rounded-xl border border-primary/20 text-primary">
                                                                 <div className="flex items-center gap-1.5 text-[10px] font-black uppercase">
                                                                     <Calendar className="size-3.5" />
                                                                     Starts {new Date(enrollment.batch.start_date).toLocaleDateString()}
                                                                 </div>
                                                             </div>
                                                         )}
                                                     </div>
                                                 </div>
                                                 
                                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                                     <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                                                         <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Assignments</div>
                                                         <div className="text-sm font-black">{Math.round(enrollment.assignment_average)}%</div>
                                                     </div>
                                                     <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                                                         <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Final Exam</div>
                                                         <div className="text-sm font-black">{Math.round(enrollment.exam_score)}%</div>
                                                     </div>
                                                     <div className={`p-3 rounded-xl border ${enrollment.overall_average >= 60 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
                                                         <div className="text-[9px] font-bold uppercase tracking-widest mb-1">Overall Avg</div>
                                                         <div className="text-sm font-black">{Math.round(enrollment.overall_average)}%</div>
                                                     </div>
                                                 </div>

                                                 <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/50">
                                                     {enrollment.certificate ? (
                                                         <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg text-primary text-[10px] font-bold uppercase tracking-wider">
                                                             <Award className="size-4" />
                                                             Certificate Issued: {enrollment.certificate.certificate_number}
                                                         </div>
                                                     ) : (
                                                         <div className="flex items-center gap-4 w-full">
                                                             <Button 
                                                                 onClick={() => patch(`/admin/enrollments/${enrollment.id}/certificate`, {}, { method: 'post' })}
                                                                 disabled={enrollment.overall_average < 60 || processing}
                                                                 className={`flex-1 h-11 rounded-xl font-bold uppercase tracking-widest text-[10px] ${enrollment.overall_average >= 60 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
                                                             >
                                                                 <Trophy className="size-4 mr-2" />
                                                                 {enrollment.overall_average >= 60 ? 'Generate Certificate' : 'Not Eligible (Requires 60%)'}
                                                             </Button>
                                                         </div>
                                                     )}
                                                 </div>
                                             </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {student.enrollments.length === 0 && (
                                <div className="py-20 text-center border-2 border-dashed border-border rounded-[2rem]">
                                    <BookOpen className="size-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                    <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No active enrollments for this student</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return <span className={className}>{children}</span>;
}

AdminStudentShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Students', href: '/admin/students' }, { title: 'Profile', href: '#' }]}>
        {page}
    </AppLayout>
);
