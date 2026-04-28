import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Plus, Users, Calendar, MapPin, Globe, Trash2, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

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
            start_date: batch.start_date.split('T')[0],
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

    const columns: Column<any>[] = [
        {
            key: 'name',
            label: 'Batch Details',
            sortable: true,
            render: (batch) => (
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded bg-primary/5 border border-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0 ">
                        {batch.type === 'online' ? <Globe className="size-4" /> : <MapPin className="size-4" />}
                    </div>
                    <div>
                        <div className="font-bold text-sm text-foreground">{batch.name}</div>
                        <div className="text-[11px] text-muted-foreground font-medium tracking-tight">{batch.course.title}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (batch) => (
                <div className="px-2 py-0.5 bg-muted rounded text-[10px] font-bold  tracking-wider inline-block text-muted-foreground">
                    {batch.type}
                </div>
            )
        },
        {
            key: 'start_date',
            label: 'Starts',
            sortable: true,
            render: (batch) => (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Calendar className="size-3" />
                    {formatDate(batch.start_date)}
                </div>
            )
        },
        {
            key: 'capacity',
            label: 'Seats',
            sortable: true,
            render: (batch) => (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Users className="size-3" />
                    {batch.capacity} Max
                </div>
            )
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (batch) => (
                <div className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold  tracking-wider inline-block",
                    batch.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                    {batch.is_active ? 'Active' : 'Inactive'}
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Manage Batches" />
            
            <div className="w-full p-4 lg:p-6">
                <AdminDataTable 
                    title="Session Management"
                    subtitle="Assign students to online or offline batches"
                    data={batches}
                    columns={columns}
                    filterableColumns={[
                        {
                            key: 'type',
                            label: 'Batch Type',
                            options: [
                                { label: 'Online', value: 'online' },
                                { label: 'Offline', value: 'offline' },
                            ]
                        },
                        {
                            key: 'is_active',
                            label: 'Status',
                            options: [
                                { label: 'Active', value: 1 },
                                { label: 'Inactive', value: 0 },
                            ]
                        }
                    ]}
                    searchPlaceholder="Search batches..."
                    onAdd={openCreateModal}
                    addLabel="Create Batch"
                    actions={(batch) => (
                        <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="size-8 rounded hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => handleEdit(batch)}>
                                <Edit2 className="size-3.5" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="size-8 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                                onClick={() => handleDelete(batch.id)}
                            >
                                <Trash2 className="size-3.5" />
                            </Button>
                        </div>
                    )}
                />

                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogContent className="sm:max-w-[425px] rounded border border-border">
                        <form onSubmit={submit} className="space-y-6">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black  ">{editingBatch ? 'Edit Batch' : 'New Batch'}</DialogTitle>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                                {!editingBatch && (
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black  ">Select Course</Label>
                                        <Select value={data.course_id} onValueChange={(v) => setData('course_id', v)}>
                                            <SelectTrigger className="rounded bg-card border-border h-10">
                                                <SelectValue placeholder="Select a course" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded border-border">
                                                {courses.map(course => (
                                                    <SelectItem key={course.id} value={course.id.toString()}>{course.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.course_id && <p className="text-[10px] text-red-500 font-bold ">{errors.course_id}</p>}
                                    </div>
                                )}
                                
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black  ">Batch Name</Label>
                                    <Input 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                        placeholder="e.g. July 2024 Evening" 
                                        className="rounded bg-card border-border h-10"
                                    />
                                    {errors.name && <p className="text-[10px] text-red-500 font-bold ">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black  ">Type</Label>
                                        <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                            <SelectTrigger className="rounded bg-card border-border h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded border-border">
                                                <SelectItem value="online">Online</SelectItem>
                                                <SelectItem value="offline">Offline</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black  ">Capacity</Label>
                                        <Input 
                                            type="number" 
                                            value={data.capacity} 
                                            onChange={e => setData('capacity', parseInt(e.target.value))} 
                                            className="rounded bg-card border-border h-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black  ">Start Date</Label>
                                    <Input 
                                        type="date" 
                                        value={data.start_date} 
                                        onChange={e => setData('start_date', e.target.value)} 
                                        className="rounded bg-card border-border h-10"
                                    />
                                    {errors.start_date && <p className="text-[10px] text-red-500 font-bold ">{errors.start_date}</p>}
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" className="rounded w-full h-11 font-black   text-xs" disabled={processing}>
                                    {editingBatch ? 'Save Changes' : 'Create Session'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

AdminBatchIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Manage Batches', href: '/admin/batches' }]}>
        {page}
    </AppLayout>
);
