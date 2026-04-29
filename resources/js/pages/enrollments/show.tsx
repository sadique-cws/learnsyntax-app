import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { CreditCard, ShieldCheck, Zap, ArrowRight, Loader2, Receipt } from 'lucide-react';
import { useState, useEffect } from 'react';

declare global { interface Window { Razorpay: any; } }

export default function EnrollmentShow({ enrollment, razorpay_key, razorpay_order, auth }: any) {
    const { post, processing } = useForm();
    const [isPaying, setIsPaying] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [gstNumber, setGstNumber] = useState('');

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);
    }, []);

    const handlePayment = () => {
        if (!scriptLoaded || !window.Razorpay) { alert('Payment gateway is still loading. Please try again.'); return; }
        setIsPaying(true);
        const options = {
            key: razorpay_key,
            amount: razorpay_order.amount,
            currency: razorpay_order.currency,
            name: 'Learn Syntax',
            description: `Enrollment for ${enrollment.course.title}`,
            image: '/images/app_logo.png',
            order_id: razorpay_order.id,
            handler: (response: any) => {
                router.post(`/enrollments/${enrollment.id}/payment`, {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    gst_number: gstNumber,
                }, { onFinish: () => setIsPaying(false) });
            },
            prefill: { name: auth.user.name, email: auth.user.email, contact: auth.user.phone || '' },
            theme: { color: '#2563eb' },
            modal: { ondismiss: () => setIsPaying(false) }
        };
        new window.Razorpay(options).open();
    };

    return (
        <div className="w-full p-4 lg:p-6">
            <Head title={`Checkout - ${enrollment.course.title}`} />

            <div className="max-w-md mx-auto space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                    <div className="size-8 rounded-sm bg-primary flex items-center justify-center text-white shrink-0">
                        <Zap className="size-4 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold text-foreground">Confirm Enrollment</h1>
                        <p className="text-[10px] text-muted-foreground">Secure checkout powered by Razorpay</p>
                    </div>
                </div>

                {/* Course Info */}
                <div className="flex items-center gap-3 p-3 rounded-sm border border-border bg-muted/20">
                    <div className="size-12 rounded-sm border border-border overflow-hidden shrink-0">
                        <img src="/images/ai_cover.png" alt={enrollment.course.title} className="size-full object-cover opacity-80" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-foreground truncate">{enrollment.course.title}</h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Professional Certification</p>
                    </div>
                </div>

                {/* Pricing */}
                <div className="rounded-sm border border-border overflow-hidden">
                    <div className="px-3 py-2 bg-muted/5 border-b border-border">
                        <span className="text-xs font-semibold">Order Summary</span>
                    </div>
                    <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-muted-foreground">Course Fee</span>
                            <span>₹{enrollment.course.price}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-muted-foreground">GST</span>
                            <span className="text-emerald-600 text-[10px] font-medium">Included</span>
                        </div>
                        <div className="pt-2 border-t border-border flex items-center justify-between">
                            <span className="text-sm font-semibold">Total</span>
                            <span className="text-lg font-semibold text-primary tabular-nums">₹{enrollment.course.price}</span>
                        </div>
                    </div>
                </div>

                {/* Security notice */}
                <div className="flex items-center gap-2 p-2.5 rounded-sm border border-border bg-muted/10">
                    <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
                    <div className="text-[10px] text-muted-foreground leading-snug">
                        <span className="font-medium text-foreground">100% Secure</span> — protected with 256-bit SSL encryption
                    </div>
                </div>

                {/* GST Input */}
                <div className="rounded-sm border border-border overflow-hidden">
                    <div className="px-3 py-2 bg-muted/5 border-b border-border flex items-center gap-1.5">
                        <Receipt className="size-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">GST Number <span className="text-[10px] opacity-60">(Optional)</span></span>
                    </div>
                    <div className="p-3">
                        <input
                            type="text"
                            placeholder="Enter GSTIN for B2B invoice"
                            className="w-full h-8 rounded-sm bg-muted/20 border border-border text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary/30 font-medium"
                            value={gstNumber}
                            onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                        />
                        <p className="text-[9px] text-muted-foreground mt-1.5">Provide GSTIN if you require a business invoice with tax credit.</p>
                    </div>
                </div>

                {/* CTA */}
                <Button
                    size="default"
                    className="w-full h-9 rounded-sm shadow-none font-medium"
                    onClick={handlePayment}
                    disabled={isPaying || processing || !scriptLoaded}
                >
                    {isPaying
                        ? <span className="flex items-center gap-2"><Loader2 className="size-3.5 animate-spin" /> Verifying...</span>
                        : <span className="flex items-center gap-2">Pay Now <ArrowRight className="size-3.5" /></span>
                    }
                </Button>

                {!scriptLoaded && (
                    <p className="text-[10px] text-center text-muted-foreground animate-pulse">Initializing payment gateway...</p>
                )}

                <div className="flex items-center justify-center gap-4 opacity-30 pt-1">
                    <CreditCard className="size-5" />
                    <span className="text-xs font-medium">RAZORPAY</span>
                    <Zap className="size-5" />
                </div>
            </div>
        </div>
    );
}

EnrollmentShow.layout = (page: any) => (
    <PublicLayout>{page}</PublicLayout>
);
