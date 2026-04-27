import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLogoIcon from '@/components/app-logo-icon';
import { CheckCircle2, Globe, Users, Calendar } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

export default function CourseShow({ course }: { course: any }) {
    const { post, processing } = useForm();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleEnroll = () => {
        post(`/enroll/${course.id}`);
    };

    const formatDate = (dateString: string) => {
        if (!mounted) return '';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <>
            <Head title={course.title} />
            
            <div className="w-full p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2">
                        <div className="mb-8">
                            <h1 className="text-3xl font-extrabold tracking-tight mb-4">{course.title}</h1>
                            <p className="text-lg text-muted-foreground">{course.description}</p>
                        </div>

                        <div className="aspect-video bg-muted rounded-3xl mb-8 flex items-center justify-center border border-border">
                            <AppLogoIcon className="size-32 opacity-10" />
                        </div>

                        <div className="space-y-8">
                            <section>
                                <h2 className="text-xl font-bold mb-4">What you'll learn</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="flex items-start gap-2">
                                            <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                                            <span className="text-sm">Advanced concepts and industry best practices.</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4">Available Batches</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {course.batches.map((batch: any) => (
                                        <Card key={batch.id} className="border-border shadow-none rounded-2xl">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold">{batch.name}</span>
                                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">{batch.type}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                                    <Calendar className="size-3.5" />
                                                    <span>Starts {formatDate(batch.start_date)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Users className="size-3.5" />
                                                    <span>{batch.capacity} Seats Total</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {course.batches.length === 0 && (
                                        <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-2xl">
                                            <Calendar className="size-8 text-muted-foreground mx-auto mb-3 opacity-20" />
                                            <p className="text-sm text-muted-foreground">New batches starting soon. Stay tuned!</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Right Sidebar - Pricing & Enroll */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 border-border shadow-none rounded-3xl overflow-hidden">
                            <CardContent className="p-6">
                                <div className="text-3xl font-bold mb-1">${course.price}</div>
                                <div className="text-sm text-muted-foreground mb-6">One-time payment for lifetime access</div>
                                
                                <Button size="lg" className="w-full rounded-xl font-bold h-12 mb-4 shadow-none" onClick={handleEnroll} disabled={processing}>
                                    Enroll Now
                                </Button>
                                
                                <p className="text-center text-xs text-muted-foreground mb-6">30-Day Money-Back Guarantee</p>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Globe className="size-4 text-muted-foreground" />
                                        <span>Full Lifetime Access</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Users className="size-4 text-muted-foreground" />
                                        <span>Community Support</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

CourseShow.layout = (page: any) => (
    <PublicLayout>
        {page}
    </PublicLayout>
);
