import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    IndianRupee,
    Loader2,
    MapPin,
    Receipt,
    ShieldCheck,
    Sparkles,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';

declare global {
    interface Window {
        Razorpay: any;
    }
}

function formatDateTime(value: string): string {
    return new Date(value).toLocaleString();
}

export default function WorkshopShow({ workshop, enrollment, can_enroll, enrollment_deadline, razorpay_key, razorpay_order, auth }: any) {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const user = auth?.user;
    const topics = useMemo(() => {
        if (Array.isArray(workshop.topics)) {
            return workshop.topics;
        }

        if (typeof workshop.topics === 'string') {
            return workshop.topics.split(',').map((topic: string) => topic.trim()).filter(Boolean);
        }

        return [];
    }, [workshop.topics]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);
    }, []);

    const handleEnroll = () => {
        router.post(`/workshops/${workshop.id}/enroll`);
    };

    const handlePayment = () => {
        if (!scriptLoaded || !window.Razorpay || !razorpay_key || !razorpay_order) {
            return;
        }

        setIsPaying(true);

        const options = {
            key: razorpay_key,
            amount: razorpay_order.amount,
            currency: razorpay_order.currency,
            name: 'Learn Syntax',
            description: `Workshop enrollment for ${workshop.title}`,
            image: '/images/app_logo.png',
            order_id: razorpay_order.id,
            handler: (response: any) => {
                router.post(`/workshops/${workshop.id}/payment`, {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                }, {
                    onFinish: () => setIsPaying(false),
                });
            },
            prefill: {
                name: user?.name || '',
                email: user?.email || '',
                contact: user?.phone || '',
            },
            theme: { color: '#2563eb' },
            modal: {
                ondismiss: () => setIsPaying(false),
            },
        };

        new window.Razorpay(options).open();
    };

    return (
        <PublicLayout>
            <Head title={workshop.title} />
            <div className="pb-16 bg-background">
                <section className="border-b border-border bg-muted/5">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-10">
                        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-3">
                                    <Button asChild variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:bg-muted border border-border shrink-0 shadow-none">
                                        <Link href="/workshops"><ArrowLeft className="size-3.5" /></Link>
                                    </Button>
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
                                        <Sparkles className="size-3.5" /> Live Workshop
                                    </div>
                                </div>

                                <div className="space-y-3 max-w-3xl">
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">
                                        {workshop.title}
                                    </h1>
                                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
                                        {workshop.description || 'A short, practical live workshop designed to help you learn fast and apply immediately.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl">
                                    {[
                                        { label: 'Fee', value: `₹${Number(workshop.fee).toLocaleString('en-IN')}`, icon: IndianRupee },
                                        { label: 'Duration', value: `${workshop.duration_hours} hrs`, icon: Clock3 },
                                        { label: 'Starts', value: formatDateTime(workshop.starts_at), icon: CalendarDays },
                                        { label: 'Seats', value: workshop.capacity ? `${workshop.capacity}` : 'Open', icon: Users },
                                    ].map(({ label, value, icon: Icon }) => (
                                        <div key={label} className="rounded-sm border border-border bg-background p-3">
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                <Icon className="size-3.5 text-primary" />
                                                {label}
                                            </div>
                                            <div className={cn('mt-1 text-xs font-semibold text-foreground', label === 'Starts' && 'break-words leading-relaxed')}>
                                                {value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <aside className="w-full lg:w-[360px] shrink-0">
                                <div className="rounded-sm border border-border bg-card p-4 space-y-4 lg:sticky lg:top-16">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Enrollment</div>
                                            <div className="text-2xl font-bold text-foreground mt-1">₹{Number(workshop.fee).toLocaleString('en-IN')}</div>
                                        </div>
                                        <div className="rounded-sm border border-border bg-muted/10 px-2 py-1 text-[10px] font-bold text-foreground">
                                            {workshop.paid_enrollments_count || 0} Enrolled
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="size-3.5 text-primary" />
                                            <span>{workshop.venue || 'Venue not set'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock3 className="size-3.5 text-primary" />
                                            <span>Enrollment closes 1 hour before start</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="size-3.5 text-emerald-600" />
                                            <span>Secure checkout powered by Razorpay</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-1">
                                        {enrollment?.status === 'paid' ? (
                                            <div className="flex items-center gap-2 rounded-sm border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                                                <CheckCircle2 className="size-3.5" />
                                                You are enrolled in this workshop.
                                            </div>
                                        ) : enrollment?.status === 'pending' ? (
                                            <>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                    <Receipt className="size-3.5" />
                                                    Complete payment to confirm your seat.
                                                </div>

                                                <Button
                                                    size="lg"
                                                    className="h-10 px-6 rounded-sm text-sm font-medium shadow-none w-full"
                                                    onClick={handlePayment}
                                                    disabled={isPaying || !scriptLoaded || !razorpay_key || !razorpay_order}
                                                >
                                                    {isPaying ? (
                                                        <span className="flex items-center gap-2"><Loader2 className="size-3.5 animate-spin" /> Processing...</span>
                                                    ) : (
                                                        <span className="flex items-center gap-2"><CreditCard className="size-3.5" /> Pay Now</span>
                                                    )}
                                                </Button>
                                            </>
                                        ) : user ? (
                                            <Button size="lg" className="h-10 px-6 rounded-sm text-sm font-medium shadow-none w-full" onClick={handleEnroll} disabled={!can_enroll}>
                                                {can_enroll ? 'Enroll Now' : 'Enrollment Closed'}
                                            </Button>
                                        ) : (
                                            <Button asChild size="lg" className="h-10 px-6 rounded-sm text-sm font-medium shadow-none w-full">
                                                <Link href="/login" className="flex items-center justify-center gap-2">
                                                    Login to Enroll <ArrowRight className="size-3.5" />
                                                </Link>
                                            </Button>
                                        )}

                                        {enrollment?.status === 'pending' && (!razorpay_key || !razorpay_order) && (
                                            <p className="text-[10px] text-amber-600">
                                                Payment gateway is not fully configured. Please check Razorpay keys in your environment.
                                            </p>
                                        )}

                                        {!scriptLoaded && enrollment?.status === 'pending' && razorpay_key && razorpay_order && (
                                            <p className="text-[10px] text-muted-foreground animate-pulse">Initializing payment gateway...</p>
                                        )}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="rounded-sm border border-border bg-card p-4 space-y-4">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    <BookOpen className="size-3.5 text-primary" /> About this workshop
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    This workshop is designed to give you focused, hands-on learning in a short format. You’ll get practical insights, clear topics, and a guided session with the instructor.
                                </p>
                                {topics.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {topics.map((topic: string) => (
                                            <span key={topic} className="inline-flex items-center rounded-sm border border-border bg-muted/10 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-sm border border-border bg-card p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        <Users className="size-3.5 text-primary" /> Instructor
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-foreground">{workshop.teacher?.user?.name || 'Instructor'}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">{workshop.teacher?.user?.email || 'Instructor details will be shared soon'}</div>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Guided by an experienced trainer with practical teaching style and workshop-based learning.
                                    </p>
                                </div>

                                <div className="rounded-sm border border-border bg-card p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        <CalendarDays className="size-3.5 text-primary" /> Schedule
                                    </div>
                                    <div className="space-y-2 text-xs text-muted-foreground">
                                        <div className="flex items-center justify-between gap-3"><span>Starts at</span><span className="font-medium text-foreground">{formatDateTime(workshop.starts_at)}</span></div>
                                        <div className="flex items-center justify-between gap-3"><span>Enrollment cutoff</span><span className="font-medium text-foreground">{enrollment_deadline}</span></div>
                                        <div className="flex items-center justify-between gap-3"><span>Venue</span><span className="font-medium text-foreground">{workshop.venue || 'Online'}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-4">
                            <div className="rounded-sm border border-border bg-card p-4 space-y-3">
                                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What you’ll get</div>
                                <ul className="space-y-2 text-xs text-muted-foreground">
                                    {[
                                        'Live guided session',
                                        'Practical workshop topics',
                                        'Secure online payment flow',
                                        'Enrollment only till 1 hour before start',
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <CheckCircle2 className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="rounded-sm border border-border bg-card p-4 space-y-3">
                                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick facts</div>
                                <div className="space-y-2 text-xs text-muted-foreground">
                                    <div className="flex items-center justify-between gap-3"><span>Duration</span><span className="font-medium text-foreground">{workshop.duration_hours} hrs</span></div>
                                    <div className="flex items-center justify-between gap-3"><span>Fee</span><span className="font-medium text-foreground">₹{Number(workshop.fee).toLocaleString('en-IN')}</span></div>
                                    <div className="flex items-center justify-between gap-3"><span>Seats filled</span><span className="font-medium text-foreground">{workshop.paid_enrollments_count || 0}</span></div>
                                    <div className="flex items-center justify-between gap-3"><span>Deadline</span><span className="font-medium text-foreground">1 hour before start</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
