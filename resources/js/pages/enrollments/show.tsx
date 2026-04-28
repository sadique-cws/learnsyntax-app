import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import { CreditCard, ShieldCheck, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
}

export default function EnrollmentShow({ enrollment, razorpay_key, razorpay_order, auth }: { enrollment: any, razorpay_key: string, razorpay_order: RazorpayOrder, auth: any }) {
    const { post, processing } = useForm();
    const [isPaying, setIsPaying] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);
    }, []);

    const handlePayment = () => {
        if (!scriptLoaded || !window.Razorpay) {
            alert('Razorpay SDK is still loading. Please try again in a moment.');
            return;
        }

        setIsPaying(true);

        const options = {
            key: razorpay_key,
            amount: razorpay_order.amount,
            currency: razorpay_order.currency,
            name: 'Learn Syntax',
            description: `Enrollment for ${enrollment.course.title}`,
            image: '/images/app_logo.png',
            order_id: razorpay_order.id,
            handler: function (response: any) {
                router.post(`/enrollments/${enrollment.id}/payment`, {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                }, {
                    onFinish: () => setIsPaying(false),
                });
            },
            prefill: {
                name: auth.user.name,
                email: auth.user.email,
                contact: auth.user.phone || '',
            },
            theme: {
                color: '#2563eb', // Using primary blue
            },
            modal: {
                ondismiss: function () {
                    setIsPaying(false);
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div className="w-full p-4 lg:p-6 font-sans selection:bg-primary/20">
            <Head title={`Checkout - ${enrollment.course.title}`} />
            
            <div className="max-w-xl mx-auto space-y-6">
                <Card className="border-border  rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-primary/5 p-8 border-b border-border/50">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white">
                                <Zap className="size-5 fill-current" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Secure Checkout</span>
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tight leading-none">Confirm Enrollment</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-8 space-y-8">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                            <div className="size-16 rounded-xl bg-background border border-border flex items-center justify-center overflow-hidden">
                                <img 
                                    src="/images/ai_cover.png" 
                                    alt={enrollment.course.title}
                                    className="size-full object-cover opacity-80" 
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg leading-tight">{enrollment.course.title}</h3>
                                <p className="text-xs text-muted-foreground uppercase font-medium tracking-wider mt-1">Professional Certification</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-muted-foreground">Course Fee</span>
                                <span>₹{enrollment.course.price}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-muted-foreground">Platform Taxes (GST)</span>
                                <span className="text-green-600">INCLUDED</span>
                            </div>
                            <div className="pt-4 border-t border-border flex items-center justify-between">
                                <span className="font-black text-lg uppercase tracking-tight">Total Amount</span>
                                <span className="text-3xl font-black text-primary">₹{enrollment.course.price}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/20">
                                <ShieldCheck className="size-5 text-green-600" />
                                <div className="text-[11px] leading-snug">
                                    <span className="font-bold block">100% Secure Payment</span>
                                    <span className="text-muted-foreground">Your transaction is protected with 256-bit encryption</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="p-8 pt-0 flex flex-col gap-4">
                        <Button 
                            size="lg" 
                            className="w-full rounded-2xl h-14 font-black  bg-primary hover:bg-primary/90 text-white uppercase tracking-widest text-sm" 
                            onClick={handlePayment}
                            disabled={isPaying || processing || !scriptLoaded}
                        >
                            {isPaying ? (
                                <span className="flex items-center gap-2"><Loader2 className="size-4 animate-spin" /> Verifying...</span>
                            ) : (
                                <span className="flex items-center gap-2">Pay Now <ArrowRight className="size-4" /></span>
                            )}
                        </Button>
                        {!scriptLoaded && (
                            <p className="text-[10px] text-center font-bold text-muted-foreground uppercase animate-pulse">Initializing Gateway...</p>
                        )}
                        <div className="flex items-center justify-center gap-6 opacity-40">
                            <CreditCard className="size-6" />
                            <div className="font-black italic text-sm">RAZORPAY</div>
                            <Zap className="size-6" />
                        </div>
                    </CardFooter>
                </Card>

                <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    Secured by Razorpay • India's Leading Payment Gateway
                </p>
            </div>
        </div>
    );
}

EnrollmentShow.layout = (page: any) => (
    <PublicLayout>
        {page}
    </PublicLayout>
);
