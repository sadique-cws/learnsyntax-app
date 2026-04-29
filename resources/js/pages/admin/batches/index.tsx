import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Plus, Users, Calendar, Globe, MapPin, Trash2, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';

function cn(...classes: any[]) { return classes.filter(Boolean).join(' '); }

export default function AdminBatchIndex({ batches, courses }: { batches: any[], courses: any[] }) {
    const [mounted, setMounted] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<any>(null);
    useEffect(() => setMounted(true), []);

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        course_id: '', name: '', type: 'online', start_date: '', capacity: 30, is_active: true
    });

    const formatDate = (date: string) => mounted ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBatch) {
            patch(`/admin/batches/${editingBatch.id}`, { onSuccess: () => { setIsCreateModalOpen(false); setEditingBatch(null); reset(); } });
        } else {
            post('/admin/batches', { onSuccess: () => { setIsCreateModalOpen(false); reset(); } });
        }
    };

    const handleEdit = (batch: any) => {
        setEditingBatch(batch);
        setData({ course_id: batch.course_id.toString(), name: batch.name, type: batch.type, start_date: batch.start_date.split('T')[0], capacity: batch.capacity, is_active: !!batch.is_active });
        setIsCreateModalOpen(true);
    };

    const handleDelete = (id: number) => { if (confirm('Delete this batch?')) destroy(`/admin/batches/${id}`); };
    const openCreateModal = () => { setEditingBatch(null); reset(); setIsCreateModalOpen(true); };

    const columns: Column<any>[] = [
        {
            key: 'name', label: 'Batch', sortable: true,
            render: (batch) => (
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        {batch.type === 'online' ? <Globe className="size-3.5" /> : <MapPin className="size-3.5" />}
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{batch.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{batch.course.title}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'type', label: 'Type', sortable: true,
            render: (batch) => (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-slate-50 text-slate-600 text-[10px] font-medium border border-slate-100 capitalize">{batch.type}</span>
            )
        },
        {
            key: 'start_date', label: 'Start Date', sortable: true,
            render: (batch) => <span className="text-xs text-muted-foreground tabular-nums">{formatDate(batch.start_date)}</span>
        },
        {
            key: 'capacity', label: 'Capacity', sortable: true,
            render: (batch) => (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="size-3" /><span className="tabular-nums">{batch.capacity}</span>
                </div>
            )
        },
        {
            key: 'is_active', label: 'Status', sortable: true,
            render: (batch) => (
                <span className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium border",
                    batch.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                )}>{batch.is_active ? 'Active' : 'Inactive'}</span>
            )
        }
    ];

    return (
        <>
            <Head title="Batches" />
            <div className="w-full p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Batches</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{batches.length} training batches</p>
                    </div>
                    <Button onClick={openCreateModal} size="sm" className="h-8 px-3 rounded-sm text-xs font-medium shadow-none">
                        <Plus className="size-3.5 mr-1.5" /> New Batch
                    </Button>
                </div>
                <div className="rounded-sm border border-border overflow-hidden">
                    <AdminDataTable title="All Batches" data={batches} columns={columns}
                        filterableColumns={[
                            { key: 'type', label: 'Type', options: [{ label: 'Online', value: 'online' }, { label: 'Offline', value: 'offline' }] },
                            { key: 'is_active', label: 'Status', options: [{ label: 'Active', value: 1 }, { label: 'Inactive', value: 0 }] }
                        ]}
                        searchPlaceholder="Search batches..."
                        actions={(batch) => (
                            <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => handleEdit(batch)}><Edit2 className="size-3" /></Button>
                                <Button variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5" onClick={() => handleDelete(batch.id)}><Trash2 className="size-3" /></Button>
                            </div>
                        )}
                    />
                </div>

                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogContent className="sm:max-w-md rounded-sm p-0 overflow-hidden border border-border shadow-none">
                        <DialogHeader className="px-4 py-3 border-b border-border">
                            <DialogTitle className="text-sm font-semibold">{editingBatch ? 'Edit Batch' : 'Create Batch'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={submit} className="p-4 space-y-3">
                            {!editingBatch && (
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-muted-foreground">Course</Label>
                                    <Select value={data.course_id} onValueChange={(v) => setData('course_id', v)}>
                                        <SelectTrigger className="h-9 rounded-sm text-sm shadow-none"><SelectValue placeholder="Select course" /></SelectTrigger>
                                        <SelectContent className="rounded-sm shadow-none">{courses.map(c => <SelectItem key={c.id} value={c.id.toString()} className="text-sm">{c.title}</SelectItem>)}</SelectContent>
                                    </Select>
                                    {errors.course_id && <p className="text-xs text-destructive mt-1">{errors.course_id}</p>}
                                </div>
                            )}
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Batch Name</Label>
                                <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. July 2024 Evening" className="h-9 rounded-sm text-sm shadow-none" />
                                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-muted-foreground">Type</Label>
                                    <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                        <SelectTrigger className="h-9 rounded-sm text-sm shadow-none"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-sm shadow-none">
                                            <SelectItem value="online" className="text-sm">Online</SelectItem>
                                            <SelectItem value="offline" className="text-sm">Offline</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-muted-foreground">Capacity</Label>
                                    <Input type="number" value={data.capacity} onChange={e => setData('capacity', parseInt(e.target.value))} className="h-9 rounded-sm text-sm shadow-none" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Start Date</Label>
                                <Input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className="h-9 rounded-sm text-sm shadow-none" />
                                {errors.start_date && <p className="text-xs text-destructive mt-1">{errors.start_date}</p>}
                            </div>
                            <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="flex-1 h-9 rounded-sm text-xs shadow-none">Cancel</Button>
                                <Button type="submit" disabled={processing} className="flex-1 h-9 rounded-sm text-xs shadow-none">{editingBatch ? 'Update' : 'Create'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

AdminBatchIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Batches', href: '/admin/batches' }]}>{page}</AppLayout>
);
