import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import {
    User, Mail, Calendar, BookOpen, CheckCircle2, ChevronLeft, Award, Trophy,
    CreditCard, TrendingUp, FileText, Receipt, Clock, ChevronRight, Smartphone,
    Edit2, Plus, Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function AdminStudentShow({ student, available_batches, stats, all_courses }: { student: any, available_batches: any, stats: any, all_courses: any[] }) {
    const { patch, post, processing } = useForm();
    const [activeTab, setActiveTab] = useState<'enrollments' | 'academic' | 'payments'>('enrollments');
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const editForm = useForm({
        name: student.name,
        email: student.email,
        phone: student.phone || '',
        qualification: student.qualification || '',
        college: student.college || ''
    });

    const enrollmentForm = useForm({
        course_id: '', batch_id: '', amount: '', payment_method: 'cash', transaction_id: ''
    });

    const selectedCourse = all_courses.find(c => c.id.toString() === enrollmentForm.data.course_id);

    const handleEditProfile = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.patch(`/admin/students/${student.id}`, { onSuccess: () => setShowEditModal(false) });
    };

    const handleManualEnroll = (e: React.FormEvent) => {
        e.preventDefault();
        enrollmentForm.post(`/admin/students/${student.id}/enroll`, {
            onSuccess: () => { setShowEnrollModal(false); enrollmentForm.reset(); }
        });
    };

    const handleBatchChange = (enrollmentId: number, batchId: string) => {
        patch(`/admin/enrollments/${enrollmentId}/batch`, { data: { batch_id: batchId }, preserveScroll: true });
    };

    const paymentColumns: Column<any>[] = [
        {
            key: 'transaction_id', label: 'Transaction',
            render: (payment) => <span className="text-xs font-mono font-medium text-foreground">{payment.transaction_id}</span>
        },
        {
            key: 'course', label: 'Course',
            render: (payment) => <span className="text-sm font-medium text-foreground">{payment.enrollment?.course?.title || 'Unknown'}</span>
        },
        {
            key: 'amount', label: 'Amount',
            render: (payment) => <span className="text-sm font-medium text-foreground tabular-nums">₹{payment.amount}</span>
        },
        {
            key: 'date', label: 'Date',
            render: (payment) => <span className="text-xs text-muted-foreground">{new Date(payment.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        },
        {
            key: 'invoice', label: 'Invoice',
            render: (payment) => payment.invoice ? (
                <Link href={`/admin/invoices/${payment.invoice.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    <Receipt className="size-3" /> {payment.invoice.invoice_number}
                </Link>
            ) : <span className="text-xs text-muted-foreground">Not issued</span>
        }
    ];

    return (
        <>
            <Head title={`Student: ${student.name}`} />

            <div className="w-full p-4 space-y-4">
                {/* Back Link */}
                <Link href="/admin/students" className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronLeft className="size-3" /> Back to Students
                </Link>

                {/* Profile Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-sm border border-border">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <User className="size-6" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-lg font-semibold text-foreground">{student.name}</h1>
                                <span className="text-[10px] font-medium text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded-sm border border-border">
                                    ID: {student.id}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Mail className="size-3" /> {student.email}
                                </div>
                                {student.phone && (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Smartphone className="size-3" /> {student.phone}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Calendar className="size-3" /> Joined {new Date(student.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <Button onClick={() => setShowEditModal(true)} variant="outline" size="sm" className="h-8 px-3 rounded-sm text-xs shadow-none">
                            <Edit2 className="size-3 mr-1.5" /> Edit Profile
                        </Button>
                        <Button onClick={() => setShowEnrollModal(true)} size="sm" className="h-8 px-3 rounded-sm text-xs shadow-none">
                            <Plus className="size-3 mr-1.5" /> Enroll in Course
                        </Button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Avg. Performance', value: `${Math.round(stats.avg_performance)}%`, icon: TrendingUp },
                        { label: 'Total Paid', value: `₹${stats.total_paid}`, icon: CreditCard },
                        { label: 'Courses', value: stats.course_count, icon: BookOpen },
                        { label: 'Verification', value: student.qualification ? 'Verified' : 'Pending', icon: CheckCircle2 },
                    ].map((stat, i) => (
                        <div key={i} className="rounded-sm border border-border p-3">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-medium text-muted-foreground">{stat.label}</span>
                                <stat.icon className="size-3.5 text-muted-foreground/30" />
                            </div>
                            <div className="text-lg font-semibold text-foreground tabular-nums">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 border-b border-border">
                    {[
                        { id: 'enrollments', label: 'Enrollments', icon: BookOpen },
                        { id: 'academic', label: 'Academic', icon: Trophy },
                        { id: 'payments', label: 'Payments', icon: CreditCard },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors",
                                activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <tab.icon className="size-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Enrollments Tab */}
                {activeTab === 'enrollments' && (
                    <div className="space-y-3">
                        {student.enrollments.map((enrollment: any) => (
                            <div key={enrollment.id} className="rounded-sm border border-border overflow-hidden">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Left: Course Info */}
                                    <div className="lg:w-1/3 p-4 border-b lg:border-b-0 lg:border-r border-border bg-muted/5">
                                        <span className={cn(
                                            "inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium border mb-2 capitalize",
                                            enrollment.status === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                        )}>
                                            {enrollment.status}
                                        </span>
                                        <h3 className="text-sm font-semibold text-foreground mb-3">{enrollment.course.title}</h3>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">Overall Average</span>
                                                <span className="font-medium tabular-nums">{Math.round(enrollment.overall_average)}%</span>
                                            </div>
                                            <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full transition-all" style={{ width: `${enrollment.overall_average}%` }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Details */}
                                    <div className="lg:w-2/3 p-4 flex flex-col justify-between gap-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-medium text-muted-foreground">Batch</label>
                                                <Select
                                                    defaultValue={enrollment.batch_id?.toString()}
                                                    onValueChange={(val) => handleBatchChange(enrollment.id, val)}
                                                    disabled={processing}
                                                >
                                                    <SelectTrigger className="h-9 rounded-sm text-sm shadow-none">
                                                        <SelectValue placeholder="Assign batch" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-sm">
                                                        {(available_batches[enrollment.course_id] || []).map((batch: any) => (
                                                            <SelectItem key={batch.id} value={batch.id.toString()} className="text-sm">
                                                                {batch.name} ({batch.type})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="p-2.5 rounded-sm bg-muted/5 border border-border">
                                                    <div className="text-[10px] text-muted-foreground mb-0.5">Assignments</div>
                                                    <div className="text-sm font-semibold tabular-nums">{Math.round(enrollment.assignment_average)}%</div>
                                                </div>
                                                <div className="p-2.5 rounded-sm bg-muted/5 border border-border">
                                                    <div className="text-[10px] text-muted-foreground mb-0.5">Exams</div>
                                                    <div className="text-sm font-semibold tabular-nums">{Math.round(enrollment.exam_score)}%</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-border">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-muted-foreground">
                                                    Enrolled {new Date(enrollment.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                {enrollment.certificate && (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-primary/5 text-primary text-[10px] font-medium border border-primary/10">
                                                        <Award className="size-2.5" /> Certified
                                                    </span>
                                                )}
                                            </div>
                                            {!enrollment.certificate && (
                                                <Button
                                                    onClick={() => post(`/admin/enrollments/${enrollment.id}/certificate`)}
                                                    disabled={enrollment.overall_average < 60 || processing}
                                                    size="sm"
                                                    className={cn(
                                                        "h-7 px-2.5 rounded-sm text-xs shadow-none",
                                                        enrollment.overall_average < 60 && "opacity-50"
                                                    )}
                                                >
                                                    <Award className="size-3 mr-1" /> Issue Certificate
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {student.enrollments.length === 0 && (
                            <div className="py-12 text-center border border-dashed border-border rounded-sm">
                                <BookOpen className="size-6 text-muted-foreground/20 mx-auto mb-2" />
                                <p className="text-xs text-muted-foreground">No enrollments yet</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Academic Tab */}
                {activeTab === 'academic' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Exam Attempts */}
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                                <h3 className="text-xs font-semibold text-foreground">Exam Attempts</h3>
                                <Trophy className="size-3.5 text-muted-foreground/30" />
                            </div>
                            <div className="divide-y divide-border">
                                {student.exam_attempts?.map((attempt: any) => (
                                    <div key={attempt.id} className="px-3 py-2.5 flex items-center justify-between hover:bg-muted/5 transition-colors">
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-foreground truncate">{attempt.exam.title}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <Clock className="size-2.5" /> {new Date(attempt.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-primary tabular-nums">{attempt.score}%</div>
                                                <div className="text-[10px] text-muted-foreground capitalize">{attempt.status}</div>
                                            </div>
                                            <ChevronRight className="size-3.5 text-muted-foreground/20" />
                                        </div>
                                    </div>
                                ))}
                                {(!student.exam_attempts || student.exam_attempts.length === 0) && (
                                    <div className="py-8 text-center text-xs text-muted-foreground">No exam attempts</div>
                                )}
                            </div>
                        </div>

                        {/* Assignment Submissions */}
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                                <h3 className="text-xs font-semibold text-foreground">Assignment Submissions</h3>
                                <FileText className="size-3.5 text-muted-foreground/30" />
                            </div>
                            <div className="divide-y divide-border">
                                {student.assignment_submissions?.map((submission: any) => (
                                    <div key={submission.id} className="px-3 py-2.5 flex items-center justify-between hover:bg-muted/5 transition-colors">
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-foreground truncate">{submission.assignment.title}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <CheckCircle2 className="size-2.5 text-emerald-500/50" /> {new Date(submission.submitted_at || submission.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-foreground tabular-nums">{submission.marks_obtained || 0} / {submission.assignment.max_marks}</div>
                                                <div className={cn(
                                                    "text-[10px] capitalize",
                                                    submission.status === 'graded' ? "text-emerald-600" : "text-amber-600"
                                                )}>{submission.status}</div>
                                            </div>
                                            <ChevronRight className="size-3.5 text-muted-foreground/20" />
                                        </div>
                                    </div>
                                ))}
                                {(!student.assignment_submissions || student.assignment_submissions.length === 0) && (
                                    <div className="py-8 text-center text-xs text-muted-foreground">No submissions</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                    <div className="rounded-sm border border-border overflow-hidden">
                        <AdminDataTable
                            data={student.enrollments
                                .filter((e: any) => e.payment)
                                .map((e: any) => ({ ...e.payment, enrollment: e }))}
                            columns={paymentColumns}
                            searchPlaceholder="Search payments..."
                            title=""
                        />
                    </div>
                )}
            </div>

            {/* Edit Profile Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="sm:max-w-md rounded-sm p-0 overflow-hidden border border-border shadow-none">
                    <DialogHeader className="px-4 py-3 border-b border-border">
                        <DialogTitle className="text-sm font-semibold">Edit Student Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditProfile} className="p-4 space-y-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Full Name</Label>
                            <Input className="h-9 rounded-sm text-sm shadow-none" value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                                <Input type="email" className="h-9 rounded-sm text-sm shadow-none" value={editForm.data.email} onChange={e => editForm.setData('email', e.target.value)} required />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
                                <Input className="h-9 rounded-sm text-sm shadow-none" value={editForm.data.phone} onChange={e => editForm.setData('phone', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Qualification</Label>
                                <Input className="h-9 rounded-sm text-sm shadow-none" value={editForm.data.qualification} onChange={e => editForm.setData('qualification', e.target.value)} placeholder="e.g. B.Tech" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">College</Label>
                                <Input className="h-9 rounded-sm text-sm shadow-none" value={editForm.data.college} onChange={e => editForm.setData('college', e.target.value)} placeholder="Institution name" />
                            </div>
                        </div>
                        <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} className="flex-1 h-9 rounded-sm text-xs shadow-none">Cancel</Button>
                            <Button type="submit" disabled={editForm.processing} className="flex-1 h-9 rounded-sm text-xs shadow-none">
                                {editForm.processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Manual Enrollment Modal */}
            <Dialog open={showEnrollModal} onOpenChange={setShowEnrollModal}>
                <DialogContent className="sm:max-w-md rounded-sm p-0 overflow-hidden border border-border shadow-none">
                    <DialogHeader className="px-4 py-3 border-b border-border">
                        <DialogTitle className="text-sm font-semibold">Enroll Student</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleManualEnroll} className="p-4 space-y-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Course</Label>
                            <Select
                                value={enrollmentForm.data.course_id}
                                onValueChange={(val) => {
                                    enrollmentForm.setData(prev => ({
                                        ...prev,
                                        course_id: val,
                                        amount: all_courses.find(c => c.id.toString() === val)?.price.toString() || '',
                                        batch_id: ''
                                    }));
                                }}
                            >
                                <SelectTrigger className="h-9 rounded-sm text-sm shadow-none"><SelectValue placeholder="Select course" /></SelectTrigger>
                                <SelectContent className="rounded-sm">
                                    {all_courses.map(course => (
                                        <SelectItem key={course.id} value={course.id.toString()} className="text-sm">
                                            {course.title} (₹{course.price})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Batch</Label>
                            <Select
                                value={enrollmentForm.data.batch_id}
                                onValueChange={(val) => enrollmentForm.setData('batch_id', val)}
                                disabled={!enrollmentForm.data.course_id}
                            >
                                <SelectTrigger className="h-9 rounded-sm text-sm shadow-none">
                                    <SelectValue placeholder={enrollmentForm.data.course_id ? "Select batch" : "Select course first"} />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm">
                                    {(selectedCourse?.batches || []).map((batch: any) => (
                                        <SelectItem key={batch.id} value={batch.id.toString()} className="text-sm">
                                            {batch.name} — {batch.type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Amount (₹)</Label>
                                <Input type="number" className="h-9 rounded-sm text-sm shadow-none" value={enrollmentForm.data.amount} onChange={e => enrollmentForm.setData('amount', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Payment Method</Label>
                                <Select value={enrollmentForm.data.payment_method} onValueChange={(val) => enrollmentForm.setData('payment_method', val)}>
                                    <SelectTrigger className="h-9 rounded-sm text-sm shadow-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-sm">
                                        <SelectItem value="cash" className="text-sm">Cash</SelectItem>
                                        <SelectItem value="bank_transfer" className="text-sm">Bank Transfer</SelectItem>
                                        <SelectItem value="other" className="text-sm">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Transaction ID (Optional)</Label>
                            <Input className="h-9 rounded-sm text-sm font-mono shadow-none" placeholder="e.g. TXN123456" value={enrollmentForm.data.transaction_id} onChange={e => enrollmentForm.setData('transaction_id', e.target.value)} />
                        </div>
                        <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowEnrollModal(false)} className="flex-1 h-9 rounded-sm text-xs shadow-none">Cancel</Button>
                            <Button type="submit" disabled={enrollmentForm.processing || !enrollmentForm.data.batch_id} className="flex-1 h-9 rounded-sm text-xs shadow-none">
                                {enrollmentForm.processing ? 'Enrolling...' : 'Confirm Enrollment'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminStudentShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Students', href: '/admin/students' }, { title: 'Profile', href: '#' }]}>
        {page}
    </AppLayout>
);
