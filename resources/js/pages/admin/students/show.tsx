import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { 
    User, 
    Mail, 
    Calendar, 
    BookOpen, 
    MapPin, 
    Globe, 
    CheckCircle2, 
    ChevronLeft, 
    Award, 
    Trophy,
    CreditCard,
    TrendingUp,
    FileText,
    ArrowUpRight,
    Receipt,
    Clock,
    ChevronRight
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default function AdminStudentShow({ student, available_batches, stats, all_courses }: { student: any, available_batches: any, stats: any, all_courses: any[] }) {
    const { patch, post, processing } = useForm();
    const [activeTab, setActiveTab] = useState<'academic' | 'payments' | 'enrollments'>('enrollments');
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
        course_id: '',
        batch_id: '',
        amount: '',
        payment_method: 'cash',
        transaction_id: ''
    });

    const selectedCourse = all_courses.find(c => c.id.toString() === enrollmentForm.data.course_id);

    const handleEditProfile = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.patch(`/admin/students/${student.id}`, {
            onSuccess: () => setShowEditModal(false)
        });
    };

    const handleManualEnroll = (e: React.FormEvent) => {
        e.preventDefault();
        enrollmentForm.post(`/admin/students/${student.id}/enroll`, {
            onSuccess: () => {
                setShowEnrollModal(false);
                enrollmentForm.reset();
            }
        });
    };

    const handleBatchChange = (enrollmentId: number, batchId: string) => {
        patch(`/admin/enrollments/${enrollmentId}/batch`, {
            data: { batch_id: batchId },
            preserveScroll: true
        });
    };

    const paymentColumns: Column<any>[] = [
        {
            key: 'transaction_id',
            label: 'Transaction ID',
            render: (payment) => <span className="font-mono text-[10px] text-primary">{payment.transaction_id}</span>
        },
        {
            key: 'course',
            label: 'Course',
            render: (payment) => <span className="text-xs font-bold">{payment.enrollment?.course?.title || 'Unknown Course'}</span>
        },
        {
            key: 'amount',
            label: 'Amount',
            render: (payment) => <span className="text-sm font-bold">₹{payment.amount}</span>
        },
        {
            key: 'date',
            label: 'Paid On',
            render: (payment) => <span className="text-[10px] text-muted-foreground font-medium">{new Date(payment.created_at).toLocaleDateString()}</span>
        },
        {
            key: 'actions',
            label: 'Invoice',
            render: (payment) => payment.invoice ? (
                <Link href={`/admin/invoices/${payment.invoice.id}`} className="inline-flex items-center gap-1 text-[9px] font-black ry hover:underline">
                    <Receipt className="size-3" /> {payment.invoice.invoice_number}
                </Link>
            ) : <span className="text-[9px] text-muted-foreground 
        }
    ];

    return (
        <>
            <Head title={`Student Profile: ${student.name}`} />
            
            <div className="w-full p-4  lg:p-6 bg-muted/5 min-h-screen">
                {/* Header Section */}
                <div className="max-w-7xl mx-auto mb-8">
                    <Link href="/admin/students" className="inline-flex items-center text-[10px] font-black d-foreground hover:text-primary transition-colors mb-6">
                        <ChevronLeft className="size-3.5 mr-1" /> Student Directory
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-background p-8 border border-border rounded-sm shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className="size-20 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                                <User className="size-10" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl font-black  text-foreground 
                                    <div className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black  border border-primary/20">
                                        ID: ST-{student.id.toString().padStart(4, '0')}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                        <Mail className="size-3.5 text-primary/40" /> {student.email}
                                    </div>
                                    {student.phone && (
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                            <div className="size-1.5 rounded-full bg-primary/40" />
                                            {student.phone}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                        <div className="size-1.5 rounded-full bg-primary/40" />
                                        Joined {new Date(student.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <Button 
                                onClick={() => setShowEditModal(true)}
                                variant="outline" 
                                className="h-10 rounded-sm font-black uppercase  text-[10px] border-border bg-card"
                            >
                                Edit Profile
                            </Button>
                            <Button 
                                onClick={() => setShowEnrollModal(true)}
                                className="h-10 rounded-sm font-black uppercase  text-[10px] bg-primary shadow-lg shadow-primary/10"
                            >
                                <BookOpen className="size-3.5 mr-2" /> Add Course
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Modal */}
                <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                    <DialogContent className="sm:max-w-[500px] rounded-sm p-0 overflow-hidden border-none shadow-2xl">
                        <DialogHeader className="p-6 bg-muted/5 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <User className="size-5" />
                                </div>
                                <div>
                                    <DialogTitle className="text-sm font-black uppercase tracking-tight">Edit Student Profile</DialogTitle>
                                    <DialogDescription className="text-[10px] font-bold uppercase  text-muted-foreground mt-0.5">
                                        Update student personal and academic details
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        
                        <form onSubmit={handleEditProfile} className="p-6 space-y-4 bg-background">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase  text-muted-foreground/50">Full Name</Label>
                                    <Input 
                                        className="h-10 rounded-sm border-border bg-muted/10 text-xs font-bold"
                                        value={editForm.data.name}
                                        onChange={e => editForm.setData('name', e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-black uppercase  text-muted-foreground/50">Email Address</Label>
                                        <Input 
                                            type="email"
                                            className="h-10 rounded-sm border-border bg-muted/10 text-xs font-bold"
                                            value={editForm.data.email}
                                            onChange={e => editForm.setData('email', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-black uppercase  text-muted-foreground/50">Phone Number</Label>
                                        <Input 
                                            className="h-10 rounded-sm border-border bg-muted/10 text-xs font-bold"
                                            value={editForm.data.phone}
                                            onChange={e => editForm.setData('phone', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-black uppercase  text-muted-foreground/50">Qualification</Label>
                                        <Input 
                                            className="h-10 rounded-sm border-border bg-muted/10 text-xs font-bold"
                                            value={editForm.data.qualification}
                                            onChange={e => editForm.setData('qualification', e.target.value)}
                                            placeholder="e.g. B.Tech, MCA"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-black uppercase  text-muted-foreground/50">College / Institution</Label>
                                        <Input 
                                            className="h-10 rounded-sm border-border bg-muted/10 text-xs font-bold"
                                            value={editForm.data.college}
                                            onChange={e => editForm.setData('college', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="pt-6 mt-6 border-t border-border flex flex-row gap-2 sm:justify-end">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => setShowEditModal(false)}
                                    className="h-10 rounded-sm font-black uppercase  text-[9px] px-6"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="h-10 rounded-sm font-black uppercase  text-[9px] px-8 bg-primary shadow-lg shadow-primary/10"
                                >
                                    {editForm.processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Manual Enrollment Modal */}
                <Dialog open={showEnrollModal} onOpenChange={setShowEnrollModal}>
                    <DialogContent className="sm:max-w-[500px] rounded-sm p-0 overflow-hidden border-none shadow-2xl">
                        <DialogHeader className="p-6 bg-muted/5 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <BookOpen className="size-5" />
                                </div>
                                <div>
                                    <DialogTitle className="text-sm font-black rse Enrollment</DialogTitle>
                                    <DialogDescription className="text-[10px] font-bold -foreground mt-0.5">
                                        Assign a new course and record payment
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        
                        <form onSubmit={handleManualEnroll} className="p-6 space-y-4 bg-background">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black -foreground/50">Select Course</Label>
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
                                        <SelectTrigger className="h-10 rounded-sm border-border bg-muted/10 text-xs font-bold 
                                            <SelectValue placeholder="Choose a course" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-sm">
                                            {all_courses.map(course => (
                                                <SelectItem key={course.id} value={course.id.toString()} className="text-[10px] font-black 
                                                    {course.title} (₹{course.price})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black -foreground/50">Select Batch</Label>
                                    <Select 
                                        value={enrollmentForm.data.batch_id} 
                                        onValueChange={(val) => enrollmentForm.setData('batch_id', val)}
                                        disabled={!enrollmentForm.data.course_id}
                                    >
                                        <SelectTrigger className="h-10 rounded-sm border-border bg-muted/10 text-xs font-bold 
                                            <SelectValue placeholder={enrollmentForm.data.course_id ? "Choose a batch" : "Select a course first"} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-sm">
                                            {(selectedCourse?.batches || []).map((batch: any) => (
                                                <SelectItem key={batch.id} value={batch.id.toString()} className="text-[10px] font-black 
                                                    {batch.name} - {batch.type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-black -foreground/50">Amount Paid (₹)</Label>
                                        <Input 
                                            type="number"
                                            className="h-10 rounded-sm border-border bg-muted/10 text-xs font-bold"
                                            value={enrollmentForm.data.amount}
                                            onChange={e => enrollmentForm.setData('amount', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-black -foreground/50">Payment Method</Label>
                                        <Select 
                                            value={enrollmentForm.data.payment_method} 
                                            onValueChange={(val) => enrollmentForm.setData('payment_method', val)}
                                        >
                                            <SelectTrigger className="h-10 rounded-sm border-border bg-muted/10 text-xs font-bold 
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-sm">
                                                <SelectItem value="cash" className="text-[10px] font-black 
                                                <SelectItem value="bank_transfer" className="text-[10px] font-black >
                                                <SelectItem value="other" className="text-[10px] font-black 
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black -foreground/50">Transaction ID (Optional)</Label>
                                    <Input 
                                        className="h-10 rounded-sm border-border bg-muted/10 text-xs font-mono"
                                        placeholder="e.g. CASH-123456"
                                        value={enrollmentForm.data.transaction_id}
                                        onChange={e => enrollmentForm.setData('transaction_id', e.target.value)}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="pt-6 mt-6 border-t border-border flex flex-row gap-2 sm:justify-end">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => setShowEnrollModal(false)}
                                    className="h-10 rounded-sm font-black  px-6"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit"
                                    disabled={enrollmentForm.processing || !enrollmentForm.data.batch_id}
                                    className="h-10 rounded-sm font-black  px-8 bg-primary shadow-lg shadow-primary/10"
                                >
                                    {enrollmentForm.processing ? 'Enrolling...' : 'Confirm Enrollment'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Stats Row */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Overall Progress', value: `${Math.round(stats.avg_performance)}%`, icon: TrendingUp, color: 'text-primary' },
                        { label: 'Total Investment', value: `₹${stats.total_paid}`, icon: CreditCard, color: 'text-green-600' },
                        { label: 'Courses Enrolled', value: stats.course_count, icon: BookOpen, color: 'text-blue-600' },
                        { label: 'Qualification', value: student.qualification || 'N/A', icon: Award, color: 'text-orange-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-background border border-border p-5 rounded-sm shadow-sm group hover:border-primary/20 transition-colors">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[9px] font-black -foreground/60">{stat.label}</span>
                                <stat.icon className={cn("size-3.5 opacity-40 group-hover:opacity-100 transition-opacity", stat.color)} />
                            </div>
                            <div className="text-xl font-black text-foreground">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Main Content with Custom Tabs */}
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-border mb-6 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'enrollments', label: 'Enrollments', icon: BookOpen },
                            { id: 'academic', label: 'Performance', icon: Trophy },
                            { id: 'payments', label: 'Finance', icon: CreditCard },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 text-[10px] font-black -all relative shrink-0",
                                    activeTab === tab.id 
                                        ? "text-primary border-b-2 border-primary" 
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <tab.icon className="size-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Enrollments Tab */}
                    {activeTab === 'enrollments' && (
                        <div className="grid grid-cols-1 gap-6">
                            {student.enrollments.map((enrollment: any) => (
                                <div key={enrollment.id} className="bg-background border border-border rounded-sm shadow-sm overflow-hidden flex flex-col lg:flex-row">
                                    <div className="lg:w-1/3 p-8 border-r border-border bg-muted/5">
                                        <div className={cn(
                                            "inline-block px-3 py-1 rounded-full text-[9px] font-black 
                                            enrollment.status === 'paid' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                        )}>
                                            {enrollment.status}
                                        </div>
                                        <h3 className="text-xl font-black text-foreground lment.course.title}</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                                                <span>Batch Status</span>
                                                <span className={enrollment.batch ? "text-foreground" : "text-red-500"}>
                                                    {enrollment.batch ? enrollment.batch.name : 'Not Assigned'}
                                                </span>
                                            </div>
                                            <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full" style={{ width: `${enrollment.overall_average}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:w-2/3 p-8 flex flex-col justify-between">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black -foreground/60">Batch Assignment</label>
                                                <Select 
                                                    defaultValue={enrollment.batch_id?.toString()} 
                                                    onValueChange={(val) => handleBatchChange(enrollment.id, val)}
                                                    disabled={processing}
                                                >
                                                    <SelectTrigger className="h-11 rounded-sm border-border bg-muted/10 focus:ring-primary">
                                                        <SelectValue placeholder="Assign a batch" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-sm shadow-2xl">
                                                        {(available_batches[enrollment.course_id] || []).map((batch: any) => (
                                                            <SelectItem key={batch.id} value={batch.id.toString()} className="font-bold text-xs 
                                                                {batch.name} ({batch.type})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-muted/30 border border-border rounded-sm">
                                                    <div className="text-[8px] font-black text-muted-foreground gnments</div>
                                                    <div className="text-sm font-black">{Math.round(enrollment.assignment_average)}%</div>
                                                </div>
                                                <div className="p-3 bg-muted/30 border border-border rounded-sm">
                                                    <div className="text-[8px] font-black text-muted-foreground l Exam</div>
                                                    <div className="text-sm font-black">{Math.round(enrollment.exam_score)}%</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-6 border-t border-border/50">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-muted-foreground Date</span>
                                                    <span className="text-xs font-bold">{new Date(enrollment.created_at).toLocaleDateString()}</span>
                                                </div>
                                                {enrollment.certificate && (
                                                    <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-sm border border-primary/10 text-primary text-[9px] font-black 
                                                        <Award className="size-3.5" /> Certificate Issued
                                                    </div>
                                                )}
                                            </div>
                                            {!enrollment.certificate && (
                                                <Button 
                                                    onClick={() => patch(`/admin/enrollments/${enrollment.id}/certificate`, {}, { method: 'post' })}
                                                    disabled={enrollment.overall_average < 60 || processing}
                                                    className={cn(
                                                        "h-10 rounded-sm font-black  px-6 transition-all",
                                                        enrollment.overall_average >= 60 ? "bg-primary shadow-lg shadow-primary/10" : "bg-muted text-muted-foreground cursor-not-allowed"
                                                    )}
                                                >
                                                    Generate Certificate
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Academic Performance Tab */}
                    {activeTab === 'academic' && (
                        <div className="space-y-6">
                            {/* Growth Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="border-border rounded-sm shadow-sm bg-background p-6">
                                    <div className="flex flex-col h-full justify-between">
                                        <div>
                                            <div className="text-[9px] font-black -foreground/60 mb-2">Academic Growth</div>
                                            <div className="text-2xl font-black text-foreground mb-1">+{Math.round(stats.avg_performance / 1.2)}%</div>
                                            <div className="text-[10px] font-bold text-green-600 Velocity</div>
                                        </div>
                                        <div className="mt-6 flex items-end gap-1 h-12">
                                            {[30, 45, 40, 60, 75, 85].map((h, i) => (
                                                <div key={i} className="flex-1 bg-primary/20 rounded-t-sm transition-all hover:bg-primary" style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                                <Card className="border-border rounded-sm shadow-sm bg-background p-6">
                                    <div className="text-[9px] font-black -foreground/60 mb-2">Consistency Score</div>
                                    <div className="text-2xl font-black text-foreground mb-1">High</div>
                                    <div className="text-[10px] font-bold text-blue-600 ing</div>
                                    <div className="mt-6 space-y-2">
                                        <div className="flex justify-between text-[8px] font-black -foreground/40">
                                            <span>Accuracy</span>
                                            <span>{Math.round(stats.avg_performance)}%</span>
                                        </div>
                                        <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                                            <div className="bg-blue-500 h-full" style={{ width: `${stats.avg_performance}%` }} />
                                        </div>
                                    </div>
                                </Card>
                                <Card className="border-border rounded-sm shadow-sm bg-background p-6">
                                    <div className="text-[9px] font-black -foreground/60 mb-2">Exam Readiness</div>
                                    <div className="text-2xl font-black text-foreground mb-1">Expert</div>
                                    <div className="text-[10px] font-bold text-orange-600 Final</div>
                                    <div className="mt-6 flex gap-2">
                                        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                        <div className="text-[9px] font-bold text-muted-foreground leading-tight">Analyzing historical<br/>attempt data...</div>
                                    </div>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Recent Exam Attempts */}
                                <Card className="border-border rounded-sm shadow-sm overflow-hidden bg-background">
                                    <CardHeader className="p-6 border-b border-border bg-muted/5">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-[11px] font-black ground">Recent Exam Attempts</CardTitle>
                                            <Trophy className="size-4 text-primary/40" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-border">
                                            {student.exam_attempts?.map((attempt: any) => (
                                                <div key={attempt.id} className="p-5 flex items-center justify-between hover:bg-muted/5 transition-colors">
                                                    <div>
                                                        <div className="text-xs font-black ound">{attempt.exam.title}</div>
                                                        <div className="text-[9px] font-bold text-muted-foreground items-center gap-2">
                                                            <Clock className="size-3" /> {new Date(attempt.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <div className="text-sm font-black text-primary">{attempt.score}%</div>
                                                            <div className="text-[8px] font-black text-muted-foreground status}</div>
                                                        </div>
                                                        <ChevronRight className="size-4 text-muted-foreground/30" />
                                                    </div>
                                                </div>
                                            ))}
                                            {(!student.exam_attempts || student.exam_attempts.length === 0) && (
                                                <div className="p-10 text-center text-[10px] font-black -foreground/40 italic">
                                                    No exam records found
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Assignment Submissions */}
                                <Card className="border-border rounded-sm shadow-sm overflow-hidden bg-background">
                                    <CardHeader className="p-6 border-b border-border bg-muted/5">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-[11px] font-black ground">Assignment History</CardTitle>
                                            <FileText className="size-4 text-primary/40" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-border">
                                            {student.assignment_submissions?.map((submission: any) => (
                                                <div key={submission.id} className="p-5 flex items-center justify-between hover:bg-muted/5 transition-colors">
                                                    <div>
                                                        <div className="text-xs font-black ound truncate max-w-[200px]">{submission.assignment.title}</div>
                                                        <div className="text-[9px] font-bold text-muted-foreground items-center gap-2">
                                                            <CheckCircle2 className="size-3 text-green-500/60" /> {new Date(submission.submitted_at || submission.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <div className="text-sm font-black text-foreground">{submission.marks_obtained || 0} / {submission.assignment.max_marks}</div>
                                                            <div className={cn(
                                                                "text-[8px] font-black 
                                                                submission.status === 'graded' ? "text-green-600" : "text-orange-600"
                                                            )}>{submission.status}</div>
                                                        </div>
                                                        <ChevronRight className="size-4 text-muted-foreground/30" />
                                                    </div>
                                                </div>
                                            ))}
                                            {(!student.assignment_submissions || student.assignment_submissions.length === 0) && (
                                                <div className="p-10 text-center text-[10px] font-black -foreground/40 italic">
                                                    No assignment submissions
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Payments Tab */}
                    {activeTab === 'payments' && (
                        <div className="bg-background overflow-hidden">
                            <AdminDataTable 
                                data={student.enrollments
                                    .filter((e: any) => e.payment)
                                    .map((e: any) => ({ ...e.payment, enrollment: e }))}
                                columns={paymentColumns}
                                searchPlaceholder="Filter payments..."
                                title="Transaction Ledger"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

AdminStudentShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Students', href: '/admin/students' }, { title: 'Profile', href: '#' }]}>
        {page}
    </AppLayout>
);
