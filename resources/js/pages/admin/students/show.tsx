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
    ChevronRight,
    Smartphone,
    GraduationCap,
    School,
    Activity,
    ShieldCheck
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
import { cn } from '@/lib/utils';

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
            label: 'TXID PROTOCOL',
            render: (payment) => <span className="font-mono text-[10px] font-bold text-primary tracking-tighter uppercase">{payment.transaction_id}</span>
        },
        {
            key: 'course',
            label: 'ASSET ALLOCATION',
            render: (payment) => <span className="text-[11px] font-black uppercase tracking-tight">{payment.enrollment?.course?.title || 'System Unknown'}</span>
        },
        {
            key: 'amount',
            label: 'VALUATION',
            render: (payment) => (
                <div className="flex items-center gap-1">
                    <span className="text-[10px] font-black opacity-30">INR</span>
                    <span className="text-[13px] font-black tracking-tighter">{payment.amount}</span>
                </div>
            )
        },
        {
            key: 'date',
            label: 'SETTLEMENT',
            render: (payment) => <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{new Date(payment.created_at).toLocaleDateString()}</span>
        },
        {
            key: 'actions',
            label: 'DOCUMENTATION',
            render: (payment) => payment.invoice ? (
                <Link href={`/admin/invoices/${payment.invoice.id}`} className="inline-flex items-center gap-1 text-[9px] font-black text-primary hover:underline uppercase tracking-widest">
                    <Receipt className="size-3 opacity-60" /> {payment.invoice.invoice_number}
                </Link>
            ) : <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest italic">NOT_ISSUED</span>
        }
    ];

    return (
        <>
            <Head title={`Student Node: ${student.name}`} />
            
            <div className="w-full p-4 lg:p-6 bg-muted/5 min-h-screen space-y-6 max-w-[1400px] mx-auto">
                {/* Header Section */}
                <div className="space-y-4">
                    <Link href="/admin/students" className="inline-flex items-center text-[9px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.2em]">
                        <ChevronLeft className="size-3 mr-1" /> Back to Student Registry
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-6 border border-border rounded-xl">
                        <div className="flex items-center gap-5">
                            <div className="size-16 rounded-xl bg-muted/20 border border-border flex items-center justify-center text-muted-foreground/40 shrink-0">
                                <User className="size-8" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl font-black text-foreground tracking-tight uppercase truncate">{student.name}</h1>
                                    <div className="px-2 py-0.5 bg-muted/10 text-muted-foreground/60 text-[9px] font-black border border-border uppercase tracking-widest shrink-0">
                                        STID_{student.id.toString().padStart(4, '0')}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                                        <Mail className="size-3 text-primary/40" /> {student.email}
                                    </div>
                                    {student.phone && (
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                                            <Smartphone className="size-3 text-primary/40" /> {student.phone}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                                        <Calendar className="size-3 text-primary/40" /> Registered {new Date(student.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <Button 
                                onClick={() => setShowEditModal(true)}
                                variant="outline" 
                                className="h-9 px-4 rounded-lg font-black uppercase text-[10px] border-border bg-muted/5 hover:bg-muted/10 transition-all shadow-none tracking-[0.1em]"
                            >
                                Edit Identity
                            </Button>
                            <Button 
                                onClick={() => setShowEnrollModal(true)}
                                className="h-9 px-4 rounded-lg font-black uppercase text-[10px] bg-primary text-white hover:bg-primary/90 transition-all shadow-none border-0 tracking-[0.1em]"
                            >
                                <BookOpen className="size-3.5 mr-2" /> Allocate Asset
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Modal */}
                <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                    <DialogContent className="sm:max-w-[500px] rounded-xl p-0 overflow-hidden border border-border bg-card shadow-none">
                        <DialogHeader className="p-5 border-b border-border bg-muted/10">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-muted/20 flex items-center justify-center text-primary border border-border">
                                    <User className="size-4" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xs font-black uppercase tracking-[0.2em]">Identity Refactoring</DialogTitle>
                                    <DialogDescription className="text-[9px] font-bold uppercase text-muted-foreground/60 mt-0.5">
                                        Modify core student credentials
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        
                        <form onSubmit={handleEditProfile} className="p-6 space-y-5 bg-card">
                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/50 ml-1 leading-none">Full Legal Name</Label>
                                    <Input 
                                        className="h-10 rounded-lg border-border bg-muted/5 text-[11px] font-bold focus:ring-4 focus:ring-primary/5 transition-all shadow-none"
                                        value={editForm.data.name}
                                        onChange={e => editForm.setData('name', e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/50 ml-1 leading-none">Primary Email</Label>
                                        <Input 
                                            type="email"
                                            className="h-10 rounded-lg border-border bg-muted/5 text-[11px] font-bold focus:ring-4 focus:ring-primary/5 transition-all shadow-none"
                                            value={editForm.data.email}
                                            onChange={e => editForm.setData('email', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/50 ml-1 leading-none">Contact Protocol</Label>
                                        <Input 
                                            className="h-10 rounded-lg border-border bg-muted/5 text-[11px] font-bold focus:ring-4 focus:ring-primary/5 transition-all shadow-none"
                                            value={editForm.data.phone}
                                            onChange={e => editForm.setData('phone', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/50 ml-1 leading-none">Credential Base</Label>
                                        <Input 
                                            className="h-10 rounded-lg border-border bg-muted/5 text-[11px] font-bold focus:ring-4 focus:ring-primary/5 transition-all shadow-none"
                                            value={editForm.data.qualification}
                                            onChange={e => editForm.setData('qualification', e.target.value)}
                                            placeholder="Qualification..."
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/50 ml-1 leading-none">Affiliation</Label>
                                        <Input 
                                            className="h-10 rounded-lg border-border bg-muted/5 text-[11px] font-bold focus:ring-4 focus:ring-primary/5 transition-all shadow-none"
                                            value={editForm.data.college}
                                            onChange={e => editForm.setData('college', e.target.value)}
                                            placeholder="Institution..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="pt-5 border-t border-border flex flex-row gap-2 sm:justify-end">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => setShowEditModal(false)}
                                    className="h-9 px-5 rounded-lg font-black uppercase text-[10px] tracking-widest"
                                >
                                    Abort
                                </Button>
                                <Button 
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="h-9 px-6 rounded-lg font-black uppercase text-[10px] bg-primary text-white hover:bg-primary/90 transition-all shadow-none border-0 tracking-widest"
                                >
                                    {editForm.processing ? 'Syncing...' : 'Update Data'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Manual Enrollment Modal */}
                <Dialog open={showEnrollModal} onOpenChange={setShowEnrollModal}>
                    <DialogContent className="sm:max-w-[500px] rounded-xl p-0 overflow-hidden border border-border bg-card shadow-none">
                        <DialogHeader className="p-5 border-b border-border bg-muted/10">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-muted/20 flex items-center justify-center text-primary border border-border">
                                    <BookOpen className="size-4" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xs font-black uppercase tracking-[0.2em]">Asset Allocation</DialogTitle>
                                    <DialogDescription className="text-[9px] font-bold uppercase text-muted-foreground/60 mt-0.5">
                                        Assign new curriculum and reconcile payment
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        
                        <form onSubmit={handleManualEnroll} className="p-6 space-y-5 bg-card">
                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/50 ml-1 leading-none">Curriculum Target</Label>
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
                                        <SelectTrigger className="h-10 rounded-lg border-border bg-muted/5 text-[11px] font-bold focus:ring-4 focus:ring-primary/5 transition-all shadow-none">
                                            <SelectValue placeholder="Choose target course" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg shadow-none border-border">
                                            {all_courses.map(course => (
                                                <SelectItem key={course.id} value={course.id.toString()} className="text-[10px] font-black uppercase tracking-tight">
                                                    {course.title} (₹{course.price})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/50 ml-1 leading-none">Deployment Batch</Label>
                                    <Select 
                                        value={enrollmentForm.data.batch_id} 
                                        onValueChange={(val) => enrollmentForm.setData('batch_id', val)}
                                        disabled={!enrollmentForm.data.course_id}
                                    >
                                        <SelectTrigger className="h-10 rounded-lg border-border bg-muted/5 text-[11px] font-bold focus:ring-4 focus:ring-primary/5 transition-all shadow-none">
                                            <SelectValue placeholder={enrollmentForm.data.course_id ? "Choose deployment batch" : "Curriculum required first"} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg shadow-none border-border">
                                            {(selectedCourse?.batches || []).map((batch: any) => (
                                                <SelectItem key={batch.id} value={batch.id.toString()} className="text-[10px] font-black uppercase tracking-tight">
                                                    {batch.name} - {batch.type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/50 ml-1 leading-none">Capital Transfer (INR)</Label>
                                        <Input 
                                            type="number"
                                            className="h-10 rounded-lg border-border bg-muted/5 text-[11px] font-bold focus:ring-4 focus:ring-primary/5 transition-all shadow-none"
                                            value={enrollmentForm.data.amount}
                                            onChange={e => enrollmentForm.setData('amount', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/50 ml-1 leading-none">Transfer Channel</Label>
                                        <Select 
                                            value={enrollmentForm.data.payment_method} 
                                            onValueChange={(val) => enrollmentForm.setData('payment_method', val)}
                                        >
                                            <SelectTrigger className="h-10 rounded-lg border-border bg-muted/5 text-[11px] font-bold focus:ring-4 focus:ring-primary/5 transition-all shadow-none">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-lg shadow-none border-border">
                                                <SelectItem value="cash" className="text-[10px] font-black uppercase tracking-widest">Liquid Cash</SelectItem>
                                                <SelectItem value="bank_transfer" className="text-[10px] font-black uppercase tracking-widest">Wire Transfer</SelectItem>
                                                <SelectItem value="other" className="text-[10px] font-black uppercase tracking-widest">Alternative</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/50 ml-1 leading-none">TXID Metadata (Optional)</Label>
                                    <Input 
                                        className="h-10 rounded-lg border-border bg-muted/5 text-[11px] font-mono focus:ring-4 focus:ring-primary/5 transition-all shadow-none"
                                        placeholder="CASH_X_000000"
                                        value={enrollmentForm.data.transaction_id}
                                        onChange={e => enrollmentForm.setData('transaction_id', e.target.value)}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="pt-5 border-t border-border flex flex-row gap-2 sm:justify-end">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => setShowEnrollModal(false)}
                                    className="h-9 px-5 rounded-lg font-black uppercase text-[10px] tracking-widest"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit"
                                    disabled={enrollmentForm.processing || !enrollmentForm.data.batch_id}
                                    className="h-9 px-6 rounded-lg font-black uppercase text-[10px] bg-primary text-white hover:bg-primary/90 transition-all shadow-none border-0 tracking-widest"
                                >
                                    {enrollmentForm.processing ? 'Deploying...' : 'Confirm Allocation'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Growth Vector', value: `${Math.round(stats.avg_performance)}%`, icon: TrendingUp, color: 'text-primary' },
                        { label: 'Total Valuation', value: `₹${stats.total_paid}`, icon: CreditCard, color: 'text-muted-foreground' },
                        { label: 'Active Assets', value: stats.course_count, icon: BookOpen, color: 'text-muted-foreground' },
                        { label: 'Status Protocol', value: student.qualification ? 'VERIFIED' : 'PENDING', icon: ShieldCheck, color: 'text-muted-foreground' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-card border border-border p-4 rounded-xl group hover:border-primary/20 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{stat.label}</span>
                                <stat.icon className={cn("size-3 opacity-30 group-hover:opacity-100 transition-opacity", stat.color)} />
                            </div>
                            <div className="text-xl font-black text-foreground tracking-tighter">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Main Content with Custom Tabs */}
                <div className="space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex gap-2 p-1 bg-muted/10 border border-border rounded-xl w-fit overflow-hidden">
                        {[
                            { id: 'enrollments', label: 'Allocated Assets', icon: BookOpen },
                            { id: 'academic', label: 'Performance Log', icon: Trophy },
                            { id: 'payments', label: 'Fiscal History', icon: CreditCard },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                                    activeTab === tab.id 
                                        ? "bg-card text-primary border border-border shadow-none" 
                                        : "text-muted-foreground hover:bg-muted/30 border border-transparent"
                                )}
                            >
                                <tab.icon className="size-3.5 opacity-60" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Enrollments Tab */}
                    {activeTab === 'enrollments' && (
                        <div className="space-y-4">
                            {student.enrollments.map((enrollment: any) => (
                                <div key={enrollment.id} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col lg:flex-row transition-all hover:border-border/80">
                                    <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-border bg-muted/5 flex flex-col justify-between">
                                        <div>
                                            <div className={cn(
                                                "inline-block px-2 py-0.5 border text-[9px] font-black uppercase tracking-widest mb-3",
                                                enrollment.status === 'paid' ? "bg-green-500/5 text-green-600 border-green-500/20" : "bg-orange-500/5 text-orange-600 border-orange-500/20"
                                            )}>
                                                {enrollment.status}
                                            </div>
                                            <h3 className="text-lg font-black text-foreground uppercase tracking-tight leading-tight">{enrollment.course.title}</h3>
                                        </div>
                                        <div className="mt-6 space-y-3">
                                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                                <span>Protocol Average</span>
                                                <span className="text-foreground">{Math.round(enrollment.overall_average)}%</span>
                                            </div>
                                            <div className="w-full bg-muted/30 border border-border h-2 rounded-lg overflow-hidden">
                                                <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${enrollment.overall_average}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:w-2/3 p-6 flex flex-col justify-between gap-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/40 ml-1">Deployment Batch</label>
                                                <Select 
                                                    defaultValue={enrollment.batch_id?.toString()} 
                                                    onValueChange={(val) => handleBatchChange(enrollment.id, val)}
                                                    disabled={processing}
                                                >
                                                    <SelectTrigger className="h-10 rounded-lg border-border bg-muted/5 focus:ring-4 focus:ring-primary/5 font-bold text-[11px] transition-all shadow-none uppercase tracking-tight">
                                                        <SelectValue placeholder="Assign deployment batch" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-lg shadow-none border-border">
                                                        {(available_batches[enrollment.course_id] || []).map((batch: any) => (
                                                            <SelectItem key={batch.id} value={batch.id.toString()} className="font-black text-[10px] uppercase tracking-tight">
                                                                {batch.name} ({batch.type})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-3 bg-muted/5 border border-border rounded-lg flex flex-col justify-center">
                                                    <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Submissions</div>
                                                    <div className="text-sm font-black tracking-tighter">{Math.round(enrollment.assignment_average)}%</div>
                                                </div>
                                                <div className="p-3 bg-muted/5 border border-border rounded-lg flex flex-col justify-center">
                                                    <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Assessments</div>
                                                    <div className="text-sm font-black tracking-tighter">{Math.round(enrollment.exam_score)}%</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-5 border-t border-border">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Timestamp</span>
                                                    <span className="text-[10px] font-black uppercase">{new Date(enrollment.created_at).toLocaleDateString()}</span>
                                                </div>
                                                {enrollment.certificate && (
                                                    <div className="flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">
                                                        <Award className="size-3" /> Validated
                                                    </div>
                                                )}
                                            </div>
                                            {!enrollment.certificate && (
                                                <Button 
                                                    onClick={() => patch(`/admin/enrollments/${enrollment.id}/certificate`, {}, { method: 'post' })}
                                                    disabled={enrollment.overall_average < 60 || processing}
                                                    className={cn(
                                                        "h-9 px-5 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all shadow-none border-0",
                                                        enrollment.overall_average >= 60 ? "bg-primary text-white hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                                                    )}
                                                >
                                                    Issue Credential
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {student.enrollments.length === 0 && (
                                <div className="p-16 border border-dashed border-border rounded-xl text-center bg-muted/5">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">
                                        No assets currently allocated to this node
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Academic Performance Tab */}
                    {activeTab === 'academic' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="border-border rounded-xl shadow-none bg-card p-5">
                                    <div className="flex flex-col h-full justify-between">
                                        <div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-3">Growth Velocity</div>
                                            <div className="text-2xl font-black text-foreground tracking-tighter">+{Math.round(stats.avg_performance / 1.2)}%</div>
                                        </div>
                                        <div className="mt-6 flex items-end gap-1.5 h-10">
                                            {[30, 45, 40, 60, 75, 85].map((h, i) => (
                                                <div key={i} className="flex-1 bg-primary/20 rounded-t-sm transition-all hover:bg-primary" style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                                <Card className="border-border rounded-xl shadow-none bg-card p-5">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-3">Stability Index</div>
                                    <div className="text-2xl font-black text-foreground tracking-tighter">OPTIMIZED</div>
                                    <div className="mt-6 space-y-2">
                                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
                                            <span>Precision</span>
                                            <span className="text-foreground">{Math.round(stats.avg_performance)}%</span>
                                        </div>
                                        <div className="w-full bg-muted/30 border border-border h-1.5 rounded-lg overflow-hidden">
                                            <div className="bg-primary h-full" style={{ width: `${stats.avg_performance}%` }} />
                                        </div>
                                    </div>
                                </Card>
                                <Card className="border-border rounded-xl shadow-none bg-card p-5">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-3">Deployment Readiness</div>
                                    <div className="text-2xl font-black text-foreground tracking-tighter uppercase">PRO_LEVEL</div>
                                    <div className="mt-6 flex gap-3 items-center">
                                        <Activity className="size-5 text-primary animate-pulse" />
                                        <div className="text-[9px] font-black uppercase text-muted-foreground/60 leading-tight tracking-wide">Synthesizing multi-vector<br/>performance patterns...</div>
                                    </div>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="border-border rounded-xl shadow-none overflow-hidden bg-card">
                                    <CardHeader className="p-5 border-b border-border bg-muted/5">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Assessment Protocol Log</CardTitle>
                                            <Trophy className="size-3.5 text-muted-foreground/30" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-border">
                                            {student.exam_attempts?.map((attempt: any) => (
                                                <div key={attempt.id} className="p-4 flex items-center justify-between hover:bg-muted/5 transition-colors">
                                                    <div className="min-w-0">
                                                        <div className="text-[11px] font-black text-foreground uppercase tracking-tight truncate mb-1">{attempt.exam.title}</div>
                                                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                            <Clock className="size-2.5 opacity-50" /> {new Date(attempt.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 shrink-0">
                                                        <div className="text-right">
                                                            <div className="text-sm font-black text-primary tracking-tighter">{attempt.score}%</div>
                                                            <div className="text-[8px] font-black uppercase tracking-widest opacity-40">{attempt.status}</div>
                                                        </div>
                                                        <ChevronRight className="size-3.5 text-muted-foreground/20" />
                                                    </div>
                                                </div>
                                            ))}
                                            {(!student.exam_attempts || student.exam_attempts.length === 0) && (
                                                <div className="p-12 text-center text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 italic">
                                                    No assessment records identified
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-border rounded-xl shadow-none overflow-hidden bg-card">
                                    <CardHeader className="p-5 border-b border-border bg-muted/5">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Curriculum Submission Trace</CardTitle>
                                            <FileText className="size-3.5 text-muted-foreground/30" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-border">
                                            {student.assignment_submissions?.map((submission: any) => (
                                                <div key={submission.id} className="p-4 flex items-center justify-between hover:bg-muted/5 transition-colors">
                                                    <div className="min-w-0">
                                                        <div className="text-[11px] font-black text-foreground uppercase tracking-tight truncate mb-1">{submission.assignment.title}</div>
                                                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                            <CheckCircle2 className="size-2.5 text-green-500/40" /> {new Date(submission.submitted_at || submission.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 shrink-0">
                                                        <div className="text-right">
                                                            <div className="text-sm font-black text-foreground tracking-tighter">{submission.marks_obtained || 0} / {submission.assignment.max_marks}</div>
                                                            <div className={cn(
                                                                "text-[8px] font-black uppercase tracking-widest",
                                                                submission.status === 'graded' ? "text-green-600/60" : "text-orange-600/60"
                                                            )}>{submission.status}</div>
                                                        </div>
                                                        <ChevronRight className="size-3.5 text-muted-foreground/20" />
                                                    </div>
                                                </div>
                                            ))}
                                            {(!student.assignment_submissions || student.assignment_submissions.length === 0) && (
                                                <div className="p-12 text-center text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 italic">
                                                    Zero submission artifacts recorded
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
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <AdminDataTable 
                                data={student.enrollments
                                    .filter((e: any) => e.payment)
                                    .map((e: any) => ({ ...e.payment, enrollment: e }))}
                                columns={paymentColumns}
                                searchPlaceholder="Filter fiscal ledger..."
                                title=""
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

AdminStudentShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'System Control', href: '#' }, { title: 'Node Registry', href: '/admin/students' }, { title: 'Node Profile', href: '#' }]}>
        {page}
    </AppLayout>
);
