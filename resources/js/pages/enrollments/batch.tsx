import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import PublicLayout from '@/layouts/public-layout';
import { CheckCircle2, Globe, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';

export default function EnrollmentBatch({ enrollment }: { enrollment: any }) {
    const { data, setData, post, processing } = useForm({ batch_id: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/enrollments/${enrollment.id}/batch`);
    };

    return (
        <div className="w-full p-4 lg:p-6">
            <Head title="Select Your Batch" />

            <div className="max-w-lg mx-auto space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-sm border border-emerald-200 text-[10px] font-medium">
                        <CheckCircle2 className="size-3" /> Payment Successful
                    </div>
                </div>

                <div>
                    <h1 className="text-lg font-semibold text-foreground">Select Your Batch</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Choose a batch to start your learning journey for {enrollment.course.title}.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <RadioGroup value={data.batch_id} onValueChange={(val) => setData('batch_id', val)} className="space-y-2">
                        {enrollment.course.batches.map((batch: any) => (
                            <div key={batch.id} className="relative">
                                <RadioGroupItem value={batch.id.toString()} id={`batch-${batch.id}`} className="peer sr-only" />
                                <Label
                                    htmlFor={`batch-${batch.id}`}
                                    className="flex items-center gap-3 p-3.5 rounded-sm border border-border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50 transition-colors"
                                >
                                    <div className={`size-9 rounded-sm flex items-center justify-center shrink-0 transition-colors border ${data.batch_id === batch.id.toString() ? 'bg-primary text-white border-primary' : 'bg-muted border-border text-muted-foreground'}`}>
                                        {batch.type === 'online' ? <Globe className="size-4" /> : <MapPin className="size-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <span className="font-medium text-sm text-foreground truncate">{batch.name}</span>
                                            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-sm border flex-shrink-0 ${batch.type === 'online' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                                                {batch.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                            <span className="flex items-center gap-1"><Calendar className="size-3" /> {new Date(batch.start_date).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Users className="size-3" /> {batch.capacity} seats</span>
                                        </div>
                                    </div>
                                    {data.batch_id === batch.id.toString() && (
                                        <CheckCircle2 className="size-4 text-primary shrink-0" />
                                    )}
                                </Label>
                            </div>
                        ))}

                        {enrollment.course.batches.length === 0 && (
                            <div className="py-10 text-center border border-dashed border-border rounded-sm">
                                <Calendar className="size-8 text-muted-foreground/20 mx-auto mb-2" />
                                <p className="text-xs text-muted-foreground">No batches available currently</p>
                            </div>
                        )}
                    </RadioGroup>

                    <Button type="submit" className="w-full h-9 rounded-sm shadow-none font-medium" disabled={processing || !data.batch_id}>
                        {processing ? 'Saving...' : <>Finish & Go to Dashboard <ArrowRight className="ml-1.5 size-3.5" /></>}
                    </Button>
                </form>
            </div>
        </div>
    );
}

EnrollmentBatch.layout = (page: any) => (
    <PublicLayout>{page}</PublicLayout>
);
