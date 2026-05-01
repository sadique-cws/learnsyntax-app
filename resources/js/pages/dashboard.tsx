import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Book, Receipt, Users, Award, CheckCircle2, ArrowRight, IndianRupee, BookOpen, Trophy, Flame, Star, Target, Clock, Calendar, Download, CreditCard } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

interface DashboardProps {
    auth: any;
    enrollments: any[];
    assignments: any[];
    availableExams: any[];
    stats?: any;
    streak?: any;
}

export default function Dashboard({ enrollments = [], assignments = [], availableExams = [], stats = null, streak = null }: DashboardProps) {
    if (stats) {
        // Admin Dashboard (Internal view)
        return (
            <>
                <Head title="Admin Dashboard" />
                <div className="w-full p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">Admin Overview</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">Platform metrics and user activity</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="p-4 rounded-sm border border-border bg-card">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-sm bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                    <BookOpen className="size-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Total Courses</div>
                                    <div className="text-xl font-black text-foreground tabular-nums">{stats.courses}</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-sm border border-border bg-card">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-sm bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                    <Users className="size-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Paid Enrollments</div>
                                    <div className="text-xl font-black text-foreground tabular-nums">{stats.enrollments}</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-sm border border-border bg-card">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-sm bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                                    <IndianRupee className="size-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Revenue</div>
                                    <div className="text-xl font-black text-foreground tabular-nums">₹{stats.revenue.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-sm border border-border bg-card">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-sm bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
                                    <Users className="size-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Signups (7d)</div>
                                    <div className="text-xl font-black text-foreground tabular-nums">{stats.signups_this_week}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Recent Users */}
                        <div className="rounded-sm border border-border bg-card overflow-hidden">
                            <div className="px-4 py-3 border-b border-border bg-muted/5">
                                <h3 className="text-xs font-semibold text-foreground">Recent Registrations</h3>
                            </div>
                            <div className="divide-y divide-border">
                                {stats.recent_users.map((user: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("size-8 rounded-sm flex items-center justify-center text-[10px] font-bold border", user.color)}>
                                                {user.initials}
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-foreground">{user.name}</div>
                                                <div className="text-[10px] text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-bold bg-muted/10 px-1.5 py-0.5 rounded-sm border border-border text-muted-foreground">{user.role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Streak Leaders */}
                        <div className="rounded-sm border border-border bg-card overflow-hidden">
                            <div className="px-4 py-3 border-b border-border bg-muted/5 flex items-center justify-between">
                                <h3 className="text-xs font-semibold text-foreground">Streak Leaders</h3>
                                <Trophy className="size-3.5 text-orange-500" />
                            </div>
                            <div className="divide-y divide-border">
                                {stats.streak_leaders.map((leader: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-6 rounded-sm bg-orange-50 text-orange-600 flex items-center justify-center text-[10px] font-bold border border-orange-100">
                                                {i + 1}
                                            </div>
                                            <div className="text-xs font-semibold text-foreground">{leader.name}</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Flame className="size-3 text-orange-500" />
                                            <span className="text-xs font-black text-orange-600 tabular-nums">{leader.streak}d</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Student Dashboard
    return (
        <>
            <Head title="Learning Portal" />
            <div className="w-full p-4 space-y-3">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Learning Portal</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Manage your courses, assignments, and certifications</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-muted/5">
                            <BookOpen className="size-3.5 text-muted-foreground" />
                            <span className="text-xs font-semibold text-foreground tabular-nums">{enrollments.length}</span>
                            <span className="text-[10px] text-muted-foreground">courses</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-muted/5">
                            <Trophy className="size-3.5 text-muted-foreground" />
                            <span className="text-xs font-semibold text-foreground tabular-nums">{enrollments.filter((e: any) => e.certificate).length}</span>
                            <span className="text-[10px] text-muted-foreground">certs</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    {/* Left Side: Courses & Certs */}
                    <div className="lg:col-span-8 space-y-3">
                        {/* Recent Payments Summary */}
                        <div className="rounded-sm border border-border bg-card overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                                <div className="flex items-center gap-1.5">
                                    <CreditCard className="size-3.5 text-primary" />
                                    <h2 className="text-xs font-semibold text-foreground">Recent Payments</h2>
                                </div>
                                <Button asChild variant="link" className="h-auto p-0 text-[10px] text-primary hover:no-underline">
                                    <Link href="/academic/payments">View All History</Link>
                                </Button>
                            </div>
                            <div className="divide-y divide-border">
                                {enrollments.filter((e: any) => e.payment).slice(0, 2).map((enrollment: any) => (
                                    <div key={enrollment.id} className="p-3 hover:bg-muted/5 transition-colors flex items-center justify-between">
                                        <div className="min-w-0">
                                            <div className="text-[11px] font-medium text-foreground truncate">{enrollment.course.title}</div>
                                            <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-tight mt-0.5">
                                                ₹{parseFloat(enrollment.payment.amount).toLocaleString('en-IN')} • {new Date(enrollment.payment.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {enrollment.payment.invoice && (
                                            <Button asChild variant="ghost" size="sm" className="h-7 px-3 rounded-sm text-[10px] font-medium hover:bg-primary/5 hover:text-primary">
                                                <Link href={`/academic/invoices/${enrollment.payment.invoice.id}`} target="_blank" className="flex items-center gap-1.5">
                                                    <Download className="size-3" /> Invoice
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Certifications - Win Section */}
                        {enrollments.some((e: any) => e.certificate) && (
                            <div className="rounded-sm border border-border overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                                    <div className="flex items-center gap-1.5">
                                        <Award className="size-3.5 text-primary" />
                                        <h2 className="text-xs font-semibold text-foreground">Earned Certifications</h2>
                                    </div>
                                </div>
                                <div className="divide-y divide-border">
                                    {enrollments.filter((e: any) => e.certificate || e.is_eligible).map((enrollment: any) => (
                                        <div key={enrollment.id} className="flex items-center justify-between px-3 py-3 hover:bg-muted/5 transition-colors">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="size-8 rounded-sm bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0">
                                                    <Award className="size-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-sm font-medium text-foreground truncate">{enrollment.course.title}</div>
                                                    <div className="text-[10px] text-muted-foreground">
                                                        {enrollment.certificate ? enrollment.certificate.certificate_number : 'Certification Earned'}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button asChild size="sm" className="h-7 px-3 rounded-sm text-[10px] font-medium shadow-none cursor-pointer bg-primary hover:bg-primary/90">
                                                <Link href={`/my-course/${enrollment.id}/certificate`}>Download</Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Assignments */}
                        <div id="assignments" className="scroll-mt-6 rounded-sm border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                                <div className="flex items-center gap-1.5">
                                    <BookOpen className="size-3.5 text-primary" />
                                    <h2 className="text-xs font-semibold text-foreground">My Assignments</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-muted-foreground bg-muted/10 px-1.5 py-0.5 rounded-sm tabular-nums">
                                        {assignments.length}
                                    </span>
                                    <Button asChild variant="link" className="h-auto p-0 text-[10px] text-primary hover:no-underline">
                                        <Link href="/academic/assignments">View All</Link>
                                    </Button>
                                </div>
                            </div>
                            {/* ... same content ... */}
                            {assignments.length > 0 ? (
                                <div className="divide-y divide-border">
                                    {assignments.slice(0, 5).map((assignment: any) => {
                                        const submission = assignment.submissions?.[0];
                                        const isSubmitted = !!submission;
                                        const isGraded = submission?.grade !== null && submission?.grade !== undefined;

                                        return (
                                            <div key={assignment.id} className="p-3 hover:bg-muted/5 transition-colors">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="text-sm font-medium text-foreground truncate">{assignment.title}</div>
                                                            {isGraded ? (
                                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-600 text-[9px] font-bold border border-emerald-100 uppercase">Graded</span>
                                                            ) : isSubmitted ? (
                                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-600 text-[9px] font-bold border border-blue-100 uppercase">Submitted</span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-amber-50 text-amber-600 text-[9px] font-bold border border-amber-100 uppercase">Pending</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                                <Calendar className="size-3" /> Due: {assignment.due_date || 'No date'}
                                                            </span>
                                                            <span className="text-[10px] text-primary font-bold bg-primary/5 px-1.5 rounded-sm border border-primary/10">
                                                                {isGraded ? `${submission.grade}/${assignment.max_marks}` : `${assignment.max_marks} pts`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button asChild variant={isSubmitted ? "outline" : "default"} size="sm" className="h-7 px-3 rounded-sm text-[10px] font-medium shadow-none cursor-pointer shrink-0">
                                                        <Link href={`/my-course/${assignment.enrollment_id}/assignments`}>{isSubmitted ? 'View' : 'Submit'}</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {assignments.length > 5 && (
                                        <div className="p-2 text-center bg-muted/5 border-t border-border">
                                            <Button asChild variant="ghost" size="sm" className="h-6 text-[10px] font-medium text-muted-foreground hover:text-primary cursor-pointer">
                                                <Link href="/academic/assignments">Show {assignments.length - 5} more assignments...</Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-[10px] text-muted-foreground">No assignments assigned yet</div>
                            )}
                        </div>

                        {/* Available Exams */}
                        <div id="exams" className="scroll-mt-6 rounded-sm border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                                <div className="flex items-center gap-1.5">
                                    <Trophy className="size-3.5 text-orange-500" />
                                    <h2 className="text-xs font-semibold text-foreground">Available Exams</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-sm tabular-nums border border-orange-100">
                                        {availableExams.length}
                                    </span>
                                    <Button asChild variant="link" className="h-auto p-0 text-[10px] text-orange-600 hover:no-underline">
                                        <Link href="/academic/exams">View All</Link>
                                    </Button>
                                </div>
                            </div>
                            {availableExams.length > 0 ? (
                                <div className="divide-y divide-border">
                                    {availableExams.map((exam: any) => (
                                        <div key={exam.id} className="p-3 hover:bg-muted/5 transition-colors">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <div className="text-sm font-medium text-foreground truncate">{exam.title}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                            <Clock className="size-3" /> {exam.duration} mins
                                                        </span>
                                                        <span className={cn(
                                                            "text-[10px] font-bold px-1.5 rounded-sm border uppercase",
                                                            exam.user_attempt 
                                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                                                : "bg-orange-50 text-orange-600 border-orange-100"
                                                        )}>
                                                            {exam.user_attempt ? 'Completed' : 'LIVE'}
                                                        </span>
                                                        {exam.user_attempt && (
                                                            <span className="text-[10px] font-bold text-emerald-600">
                                                                Score: {exam.user_attempt.marks_obtained}/{exam.total_marks}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button asChild size="sm" className={cn(
                                                    "h-7 px-3 rounded-sm text-[10px] font-medium shadow-none cursor-pointer",
                                                    exam.user_attempt 
                                                        ? "bg-muted text-muted-foreground border-border hover:bg-muted/80" 
                                                        : "bg-orange-500 hover:bg-orange-600 text-white border-orange-600"
                                                )}>
                                                    <Link href={`/my-course/${exam.enrollment_id}/exam`}>
                                                        {exam.user_attempt ? 'View' : 'Take Exam'}
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-[10px] text-muted-foreground">No active exams available</div>
                            )}
                        </div>

                        {/* Courses */}
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                                <h2 className="text-xs font-semibold text-foreground">My Courses</h2>
                                <span className="text-[10px] text-muted-foreground tabular-nums">{enrollments.length} Active</span>
                            </div>
                            {enrollments.length > 0 ? (
                                <div className="divide-y divide-border">
                                    {enrollments.map((enrollment: any) => (
                                        <div key={enrollment.id} className="p-4 hover:bg-muted/5 transition-colors">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] text-primary font-medium">{enrollment.batch?.type ?? 'Standard'}</span>
                                                        <span className={cn(
                                                            "inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium border",
                                                            enrollment.status === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                                        )}>
                                                            {enrollment.status}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-sm font-semibold text-foreground leading-snug">{enrollment.course.title}</h3>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{enrollment.batch?.name ?? 'Batch assignment pending'}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button asChild variant="outline" size="sm" className="flex-1 h-8 rounded-sm text-xs font-medium shadow-none cursor-pointer">
                                                    <Link href={`/my-course/${enrollment.id}/progress`}>Roadmap</Link>
                                                </Button>
                                                <Button asChild size="sm" className="flex-1 h-8 rounded-sm text-xs font-medium shadow-none cursor-pointer">
                                                    <Link href={`/my-course/${enrollment.id}/assignments`}>Continue</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <Book className="size-8 text-muted-foreground/15 mx-auto mb-2" />
                                    <h3 className="text-sm font-medium text-foreground">No courses found</h3>
                                    <Button asChild size="sm" className="h-8 mt-4 rounded-sm text-xs cursor-pointer">
                                        <Link href="/courses">Browse Catalog</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side Sidebar */}
                    <div className="lg:col-span-4 space-y-3">
                        {/* Compact Login Streak */}
                        {streak && (
                            <div className="rounded-sm border border-border overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                                    <div className="flex items-center gap-1.5">
                                        <Flame className="size-3.5 text-orange-500" />
                                        <h2 className="text-xs font-semibold text-foreground">Streak</h2>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-bold text-orange-600 tabular-nums">{streak.current_streak}</span>
                                        <span className="text-[9px] font-medium text-orange-500/60 uppercase">Days</span>
                                    </div>
                                </div>
                                <div className="p-3 space-y-3">
                                    {/* Mini Heatmap */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {(streak.week_days || []).map((day: any) => (
                                            <div key={day.date} className="text-center space-y-1">
                                                <div className={cn(
                                                    "aspect-square rounded-sm flex items-center justify-center text-[8px] font-bold border transition-colors",
                                                    day.logged 
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                                                        : day.is_weekend
                                                            ? "bg-slate-50 text-slate-300 border-slate-100"
                                                            : "bg-muted/10 text-muted-foreground/20 border-border"
                                                )}>
                                                    {day.logged ? '✓' : day.is_weekend ? 'OFF' : ''}
                                                </div>
                                                <div className={cn(
                                                    "text-[8px] font-medium",
                                                    day.is_today ? "text-primary font-bold" : "text-muted-foreground/60"
                                                )}>
                                                    {day.day.charAt(0)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Stats Row */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 rounded-sm border border-border bg-muted/5 text-center">
                                            <div className="text-[9px] text-muted-foreground mb-0.5">Best</div>
                                            <div className="text-xs font-semibold text-foreground tabular-nums">{streak.longest_streak}d</div>
                                        </div>
                                        <div className="p-2 rounded-sm border border-border bg-muted/5 text-center">
                                            <div className="text-[9px] text-muted-foreground mb-0.5">Total</div>
                                            <div className="text-xs font-semibold text-foreground tabular-nums">{streak.total_logins}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Billing Sidebar */}
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="px-3 py-2 border-b border-border bg-muted/5">
                                <div className="flex items-center gap-1.5">
                                    <Receipt className="size-3.5 text-muted-foreground" />
                                    <h2 className="text-xs font-semibold text-foreground">Billing</h2>
                                </div>
                            </div>
                            <div className="divide-y divide-border">
                                {enrollments.filter((e: any) => e.payment).map((enrollment: any) => (
                                    <div key={enrollment.payment.id} className="p-3 hover:bg-muted/5 transition-colors">
                                        <div className="flex items-center gap-2.5 mb-2.5">
                                            <div className="size-7 rounded-sm bg-muted/30 flex items-center justify-center border border-border shrink-0">
                                                <Receipt className="size-3.5 text-muted-foreground" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-medium text-foreground truncate">{enrollment.course.title}</div>
                                                <div className="text-[10px] text-muted-foreground">{enrollment.payment.invoice?.invoice_number || 'INV-PENDING'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-border">
                                            <span className="text-sm font-semibold text-foreground tabular-nums">₹{enrollment.payment.amount}</span>
                                            <Button asChild variant="outline" size="sm" className="h-6 px-2 rounded-sm text-[10px] font-medium shadow-none cursor-pointer">
                                                <Link href={enrollment.payment.invoice ? `/academic/invoices/${enrollment.payment.invoice.id}` : '#'}>Receipt</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

