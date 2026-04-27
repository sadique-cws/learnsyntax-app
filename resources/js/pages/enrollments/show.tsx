import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AppLayout from '@/layouts/app-layout';
import { Wallet, CreditCard, Receipt } from 'lucide-react';

export default function EnrollmentShow({ enrollment }: { enrollment: any }) {
    const { data, setData, patch, processing } = useForm({
        batch_id: '',
        payment_method: 'credit_card',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/enrollments/${enrollment.id}`);
    };

    return (
        <>
            <Head title={`Enrollment - ${enrollment.course.title}`} />
            
            <div className="w-full p-4 lg:p-6">
                <Card className="max-w-4xl mx-auto border-border shadow-none rounded-3xl overflow-hidden">
                    <CardHeader className="bg-primary text-primary-foreground p-8">
                        <CardTitle className="text-2xl">Complete Enrollment</CardTitle>
                        <p className="opacity-80">Finalize your course selection and payment</p>
                    </CardHeader>
                    
                    <form onSubmit={handleSubmit}>
                        <CardContent className="p-8 space-y-8">
                            {/* Batch Selection */}
                            <section>
                                <h3 className="text-lg font-bold mb-4">1. Select Your Batch</h3>
                                <RadioGroup 
                                    value={data.batch_id} 
                                    onValueChange={(val) => setData('batch_id', val)}
                                    className="grid grid-cols-1 gap-3"
                                >
                                    {enrollment.course.batches.map((batch: any) => (
                                        <div key={batch.id}>
                                            <RadioGroupItem
                                                value={batch.id.toString()}
                                                id={`batch-${batch.id}`}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={`batch-${batch.id}`}
                                                className="flex items-center justify-between p-4 rounded-xl border border-border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50 transition-all"
                                            >
                                                <div>
                                                    <div className="font-bold">{batch.name}</div>
                                                    <div className="text-xs text-muted-foreground uppercase">{batch.type}</div>
                                                </div>
                                                <div className="text-sm font-medium">Starts {new Date(batch.start_date).toLocaleDateString()}</div>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </section>

                            {/* Payment Method */}
                            <section>
                                <h3 className="text-lg font-bold mb-4">2. Payment Method</h3>
                                <RadioGroup 
                                    value={data.payment_method} 
                                    onValueChange={(val) => setData('payment_method', val)}
                                    className="grid grid-cols-2 gap-3"
                                >
                                    <div>
                                        <RadioGroupItem value="credit_card" id="cc" className="peer sr-only" />
                                        <Label htmlFor="cc" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all text-center">
                                            <CreditCard className="size-6 mb-1" />
                                            <span className="text-sm font-medium">Credit Card</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                                        <Label htmlFor="upi" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all text-center">
                                            <Wallet className="size-6 mb-1" />
                                            <span className="text-sm font-medium">UPI / Wallet</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </section>

                            {/* Order Summary */}
                            <section className="bg-muted/50 p-4 rounded-2xl border border-border">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Course Fee</span>
                                    <span className="font-medium">${enrollment.course.price}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Platform Fee</span>
                                    <span className="font-medium">$0.00</span>
                                </div>
                                <div className="pt-2 mt-2 border-t border-border flex items-center justify-between font-bold">
                                    <span>Total Amount</span>
                                    <span className="text-primary text-xl">${enrollment.course.price}</span>
                                </div>
                            </section>
                        </CardContent>

                        <CardFooter className="p-8 pt-0 flex flex-col gap-4">
                            <Button size="lg" className="w-full rounded-xl h-12 font-bold shadow-none" disabled={processing || !data.batch_id}>
                                {processing ? 'Processing...' : `Pay $${enrollment.course.price} & Enroll`}
                            </Button>
                            <p className="text-center text-[10px] text-muted-foreground px-4">
                                By clicking the button above, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </>
    );
}

EnrollmentShow.layout = (page: React.ReactNode, { enrollment }: { enrollment: any }) => (
    <AppLayout breadcrumbs={[{ title: 'Enrollment', href: '#' }, { title: enrollment.course.title, href: '#' }]}>
        {page}
    </AppLayout>
);
