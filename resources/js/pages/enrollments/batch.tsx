import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import PublicLayout from '@/layouts/public-layout';
import { CheckCircle2, Globe, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';

export default function EnrollmentBatch({ enrollment }: { enrollment: any }) {
    const { data, setData, post, processing } = useForm({
        batch_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/enrollments/${enrollment.id}/batch`);
    };

    return (
        <div className="w-full p-4 lg:p-6 font-sans selection:bg-primary/20">
            <Head title="Select Your Batch" />
            
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black   mb-4">
                        <CheckCircle2 className="size-3" /> Payment Successful
                    </div>
                    <h1 className="text-4xl font-black  mb-2">One Last Step!</h1>
                    <p className="text-muted-foreground font-medium">Please select your preferred batch to start learning.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <RadioGroup 
                        value={data.batch_id} 
                        onValueChange={(val) => setData('batch_id', val)}
                        className="grid grid-cols-1 gap-4"
                    >
                        {enrollment.course.batches.map((batch: any) => (
                            <div key={batch.id} className="relative">
                                <RadioGroupItem
                                    value={batch.id.toString()}
                                    id={`batch-${batch.id}`}
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor={`batch-${batch.id}`}
                                    className="flex items-center gap-4 p-6 rounded-3xl border-2 border-border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/[0.03] hover:border-primary/50 transition-all group"
                                >
                                    <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${data.batch_id === batch.id.toString() ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                                        {batch.type === 'online' ? <Globe className="size-6" /> : <MapPin className="size-6" />}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-black text-lg  ">{batch.name}</span>
                                            <span className={`text-[9px] font-black  px-2 py-0.5 rounded  ${batch.type === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {batch.type}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                                                <Calendar className="size-3.5" />
                                                <span>Starts {new Date(batch.start_date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                                                <Users className="size-3.5" />
                                                <span>{batch.capacity} Seats</span>
                                            </div>
                                        </div>
                                    </div>

                                    {data.batch_id === batch.id.toString() && (
                                        <div className="absolute top-4 right-4">
                                            <CheckCircle2 className="size-6 text-primary fill-current text-white" />
                                        </div>
                                    )}
                                </Label>
                            </div>
                        ))}

                        {enrollment.course.batches.length === 0 && (
                            <div className="p-12 text-center border-2 border-dashed border-border rounded-[2rem]">
                                <Calendar className="size-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                <p className="text-muted-foreground font-bold   text-xs">No batches available currently</p>
                            </div>
                        )}
                    </RadioGroup>

                    <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full rounded-2xl h-14 font-black  bg-primary hover:bg-primary/90 text-white   text-sm"
                        disabled={processing || !data.batch_id}
                    >
                        {processing ? 'Saving...' : 'Finish & Go to Dashboard'}
                        <ArrowRight className="ml-2 size-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}

EnrollmentBatch.layout = (page: any) => (
    <PublicLayout>
        {page}
    </PublicLayout>
);
