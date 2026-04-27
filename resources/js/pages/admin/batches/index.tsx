import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Plus, Users, Calendar, MapPin, Globe, Trash2, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminBatchIndex({ batches, courses }: { batches: any[], courses: any[] }) {
    const [mounted, setMounted] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<any>(null);

    useEffect(() => setMounted(true), []);

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        course_id: '',
        name: '',
        type: 'online',
        start_date: '',
        capacity: 30,
        is_active: true
    });

    const formatDate = (date: string) => mounted ? new Date(date).toLocaleDateString() : '';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBatch) {
            patch(`/admin/batches/${editingBatch.id}`, {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    setEditingBatch(null);
                    reset();
                }
            });
        } else {
            post('/admin/batches', {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleEdit = (batch: any) => {
        setEditingBatch(batch);
        setData({
            course_id: batch.course_id.toString(),
            name: batch.name,
            type: batch.type,
            start_date: batch.start_date.split('T')[0], // Extract date only
            capacity: batch.capacity,
            is_active: !!batch.is_active
        });
        setIsCreateModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this batch?')) {
            destroy(`/admin/batches/${id}`);
        }
    };

    const openCreateModal = () => {
        setEditingBatch(null);
        reset();
        setIsCreateModalOpen(true);
    };

    return (
        <>
            <Head title="Manage Batches" />
            
            <div className="w-full p-4 lg:p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manage Batches</h1>
                        <p className="text-muted-foreground text-sm">Assign students to online or offline sessions.</p>
                    </div>
                    
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-lg shadow-none" onClick={openCreateModal}>
                                <Plus className="size-4 mr-2" />
                                Create Batch
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-2xl">
                            <form onSubmit={submit}>
                                <DialogHeader>
                                    <DialogTitle>{editingBatch ? 'Edit Batch' : 'Create New Batch'}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    {!editingBatch && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="course">Course</Label>
                                            <Select value={data.course_id} onValueChange={(v) => setData('course_id', v)}>
                                                <SelectTrigger className="rounded-xl shadow-none">
                                                    <SelectValue placeholder="Select a course" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl shadow-none">
                                                    {courses.map(course => (
                                                        <SelectItem key={course.id} value={course.id.toString()}>{course.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.course_id && <p className="text-xs text-red-500">{errors.course_id}</p>}
                                        </div>
                                    )}
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Batch Name</Label>
                                        <Input 
                                            id="name" 
                                            value={data.name} 
                                            onChange={e => setData('name', e.target.value)} 
                                            placeholder="e.g. July 2024 Evening Batch" 
                                            className="rounded-xl shadow-none"
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="type">Type</Label>
                                            <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                                <SelectTrigger className="rounded-xl shadow-none">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl shadow-none">
                                                    <SelectItem value="online">Online</SelectItem>
                                                    <SelectItem value="offline">Offline</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="capacity">Capacity</Label>
                                            <Input 
                                                id="capacity" 
                                                type="number" 
                                                value={data.capacity} 
                                                onChange={e => setData('capacity', parseInt(e.target.value))} 
                                                className="rounded-xl shadow-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="date">Start Date</Label>
                                        <Input 
                                            id="date" 
                                            type="date" 
                                            value={data.start_date} 
                                            onChange={e => setData('start_date', e.target.value)} 
                                            className="rounded-xl shadow-none"
                                        />
                                        {errors.start_date && <p className="text-xs text-red-500">{errors.start_date}</p>}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="rounded-xl w-full shadow-none" disabled={processing}>
                                        {editingBatch ? 'Update Batch' : 'Create Batch'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {batches.map((batch) => (
                        <Card key={batch.id} className="group border-border shadow-none rounded-xl overflow-hidden hover:border-primary transition-all">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        {batch.type === 'online' ? <Globe className="size-5 text-primary" /> : <MapPin className="size-5 text-primary" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${batch.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {batch.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-1">{batch.name}</h3>
                                <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">{batch.course.title}</p>
                                
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="size-4" />
                                        <span>Starts {formatDate(batch.start_date)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="size-4" />
                                        <span>Capacity: {batch.capacity} Seats</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="secondary" className="flex-1 rounded-lg shadow-none text-xs">
                                        Manage Students
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-lg shadow-none" onClick={() => handleEdit(batch)}>
                                        <Edit2 className="size-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-lg shadow-none text-destructive hover:bg-destructive/10" onClick={() => handleDelete(batch.id)}>
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {batches.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-2xl">
                            <Users className="size-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground font-medium">No batches created yet.</p>
                        </div>
                    )}
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
