import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Plus, Users, Calendar, MapPin, Globe } from 'lucide-react';

export default function AdminBatchIndex({ batches, courses }: { batches: any[], courses: any[] }) {
    return (
        <>
            <Head title="Manage Batches" />
            
            <div className="w-full p-4 lg:p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manage Batches</h1>
                        <p className="text-muted-foreground text-sm">Assign students to online or offline sessions.</p>
                    </div>
                    <Button className="rounded-lg shadow-none">
                        <Plus className="size-4 mr-2" />
                        Create Batch
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {batches.map((batch) => (
                        <Card key={batch.id} className="border-border shadow-none rounded-xl overflow-hidden">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        {batch.type === 'online' ? <Globe className="size-5 text-primary" /> : <MapPin className="size-5 text-primary" />}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${batch.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {batch.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg mb-1">{batch.name}</h3>
                                <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">{batch.course.title}</p>
                                
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="size-4" />
                                        <span>Starts {new Date(batch.start_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="size-4" />
                                        <span>Capacity: {batch.capacity} Seats</span>
                                    </div>
                                </div>

                                <Button variant="secondary" className="w-full rounded-lg shadow-none">
                                    Manage Students
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

AdminBatchIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Manage Batches', href: '/admin/batches' }]}>
        {page}
    </AppLayout>
);
