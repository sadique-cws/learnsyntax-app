import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Plus, Users, Calendar, MapPin, Globe, Trash2, Edit2, Shield } from 'lucide-react';
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

    const formatDate = (date: string) => mounted ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

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
                <div className="flex items-center gap-2.5 py-1">
                    <div className="size-8 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center font-black text-primary text-[10px] shrink-0">
                        {batch.type === 'online' ? <Globe className="size-3" /> : <MapPin className="size-3" />}
                    </div>
                    <div>
                        <div className="font-black text-[12px] text-slate-900 leading-tight uppercase tracking-tight">{batch.name}</div>
                        <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-0.5 opacity-60">{batch.course.title}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (batch) => (
                <div className="px-2 py-0.5 bg-muted rounded-sm text-[9px] font-black uppercase tracking-[0.2em] inline-block text-muted-foreground border border-border">
                    {batch.type}
                </div>
            )
        },
        {
            key: 'start_date',
            label: 'Starts',
            sortable: true,
            render: (batch) => (
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
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
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
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
                    "px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-[0.2em] inline-block border",
                    batch.is_active ? "bg-green-100 text-green-700 border-green-200" : "bg-rose-100 text-rose-700 border-rose-200"
                )}>
                    {batch.is_active ? 'Active' : 'Inactive'}
                </div>
            )
        }
    ];

    return (
        <>
            <Head title="Manage Batches" />
            
            <div className="w-full p-4 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-border pb-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-1.5">
                            <Shield className="size-3" /> Core Registry
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Session Protocols</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Assigning deployment batches and synchronizing enrollment limits.</p>
                    </div>
                </div>

                <div className="bg-background rounded-sm border border-border shadow-none overflow-hidden">
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
                        searchPlaceholder="Filter batches by metadata..."
                        onAdd={openCreateModal}
                        addLabel="Initialize Batch"
                        actions={(batch) => (
                            <div className="flex items-center justify-end gap-1.5">
                                <Button variant="ghost" size="icon" className="size-7 rounded-sm hover:bg-primary/10 hover:text-primary shadow-none" onClick={() => handleEdit(batch)}>
                                    <Edit2 className="size-3" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-7 rounded-sm hover:bg-rose-50 hover:text-rose-600 shadow-none"
                                    onClick={() => handleDelete(batch.id)}
                                >
                                    <Trash2 className="size-3" />
                                </Button>
                            </div>
                        )}
                    />
                </div>

                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogContent className="sm:max-w-md rounded-sm p-0 overflow-hidden border border-border shadow-none">
                        <DialogHeader className="p-4 bg-muted/20 border-b border-border">
                            <DialogTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-600">
                                {editingBatch ? 'Modify Protocol' : 'Initialize Protocol'}
                            </DialogTitle>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">Batch configuration parameters</p>
                        </DialogHeader>
                        
                        <form onSubmit={submit} className="p-4 space-y-4 bg-background">
                            <div className="space-y-3">
                                {!editingBatch && (
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Select Module</Label>
                                        <Select value={data.course_id} onValueChange={(v) => setData('course_id', v)}>
                                            <SelectTrigger className="h-9 rounded-sm bg-muted/10 border-border font-bold text-xs shadow-none">
                                                <SelectValue placeholder="Select a course module" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-sm border-border shadow-none">
                                                {courses.map(course => (
                                                    <SelectItem key={course.id} value={course.id.toString()} className="font-bold text-xs">{course.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.course_id && <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest mt-1 ml-1">{errors.course_id}</p>}
                                    </div>
                                )}
                                
                                <div className="space-y-1">
                                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Batch Identifier</Label>
                                    <Input 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                        placeholder="e.g. JUL_2024_EVENING" 
                                        className="h-9 rounded-sm border-border bg-muted/10 font-bold text-xs shadow-none uppercase"
                                    />
                                    {errors.name && <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest mt-1 ml-1">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Protocol Type</Label>
                                        <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                            <SelectTrigger className="h-9 rounded-sm bg-muted/10 border-border font-bold text-xs shadow-none uppercase">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-sm border-border shadow-none">
                                                <SelectItem value="online" className="font-bold text-xs uppercase tracking-widest">Online</SelectItem>
                                                <SelectItem value="offline" className="font-bold text-xs uppercase tracking-widest">Offline</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Capacity Limit</Label>
                                        <Input 
                                            type="number" 
                                            value={data.capacity} 
                                            onChange={e => setData('capacity', parseInt(e.target.value))} 
                                            className="h-9 rounded-sm border-border bg-muted/10 font-black text-xs shadow-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Deployment Date</Label>
                                    <Input 
                                        type="date" 
                                        value={data.start_date} 
                                        onChange={e => setData('start_date', e.target.value)} 
                                        className="h-9 rounded-sm border-border bg-muted/10 font-black text-xs shadow-none uppercase"
                                    />
                                    {errors.start_date && <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest mt-1 ml-1">{errors.start_date}</p>}
                                </div>
                            </div>

                            <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2 sm:justify-start">
                                <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="flex-1 h-9 rounded-sm font-black uppercase tracking-widest text-[9px] border border-border">Abort</Button>
                                <Button type="submit" disabled={processing} className="flex-1 h-9 rounded-sm font-black uppercase tracking-widest text-[9px] bg-primary text-white hover:bg-primary/90 shadow-none">Commit Details</Button>
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
