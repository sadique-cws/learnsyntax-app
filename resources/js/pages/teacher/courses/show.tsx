import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, GraduationCap, Calendar, Plus, UserCheck, Users, BarChart3, Layers, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TeacherLayout from '@/layouts/teacher-layout';

export default function TeacherCourseShow({ course }: any) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '', type: 'online', start_date: '', capacity: 30,
    });
    const [showBatchForm, setShowBatchForm] = useState(false);

    const submitBatch = (e: any) => {
        e.preventDefault();
        post(`/teacher/courses/${course.id}/batches`, { onSuccess: () => { reset(); setShowBatchForm(false); } });
    };

    const calculateBatchSales = (batch: any) => {
        return batch.enrollments?.reduce((acc: number, en: any) => {
            if (en.payment?.amount) acc += parseFloat(en.payment.amount);
            return acc;
        }, 0) || 0;
    };

    return (
        <>
            <Head title={`Manage: ${course.title}`} />
            <div className="w-full p-4 lg:p-6 space-y-4">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:bg-muted border border-border shrink-0">
                        <Link href="/teacher/courses"><ArrowLeft className="size-3.5" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold text-foreground leading-none">{course.title}</h1>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <GraduationCap className="size-3" /> ₹{course.price.toLocaleString()} per enrollment
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Left Panel — Stats + Batch Form */}
                    <div className="space-y-3">
                        {/* Stats */}
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="px-3 py-2 border-b border-border bg-muted/5 flex items-center gap-1.5">
                                <BarChart3 className="size-3.5 text-muted-foreground" />
                                <span className="text-xs font-semibold">Course Performance</span>
                            </div>
                            <div className="p-3 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">Total Batches</span>
                                    <span className="text-sm font-semibold tabular-nums">{course.batches?.length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-border pt-3">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1"><UserCheck className="size-3" /> Students</span>
                                    <span className="text-sm font-semibold tabular-nums">
                                        {course.batches?.reduce((acc: number, b: any) => acc + (b.enrollments?.length || 0), 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-t border-border pt-3">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1"><IndianRupee className="size-3" /> Revenue</span>
                                    <span className="text-sm font-semibold text-emerald-600 tabular-nums">
                                        ₹{course.batches?.reduce((acc: number, b: any) => acc + calculateBatchSales(b), 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Create Batch */}
                        {!showBatchForm ? (
                            <Button onClick={() => setShowBatchForm(true)} size="sm" className="w-full h-8 rounded-sm text-xs shadow-none font-medium">
                                <Plus className="size-3 mr-1.5" /> Create New Batch
                            </Button>
                        ) : (
                            <div className="rounded-sm border border-border overflow-hidden">
                                <div className="px-3 py-2 border-b border-border bg-muted/5 flex items-center justify-between">
                                    <span className="text-xs font-semibold flex items-center gap-1.5"><Layers className="size-3.5" /> New Batch</span>
                                    <button onClick={() => setShowBatchForm(false)} className="text-[10px] text-muted-foreground hover:text-foreground">Cancel</button>
                                </div>
                                <div className="p-3">
                                    <form onSubmit={submitBatch} className="space-y-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-muted-foreground">Batch Name</Label>
                                            <Input placeholder="E.g., Morning Batch" className="h-8 rounded-sm text-sm" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                            {errors.name && <span className="text-[10px] text-red-500">{errors.name}</span>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-muted-foreground">Mode</Label>
                                            <Select value={data.type} onValueChange={(val: any) => setData('type', val)}>
                                                <SelectTrigger className="h-8 rounded-sm text-xs"><SelectValue /></SelectTrigger>
                                                <SelectContent className="rounded-sm">
                                                    <SelectItem value="online" className="text-xs">Online</SelectItem>
                                                    <SelectItem value="offline" className="text-xs">In-Person</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-muted-foreground">Start Date</Label>
                                                <Input type="date" className="h-8 rounded-sm text-xs" value={data.start_date} onChange={e => setData('start_date', e.target.value)} required />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs font-medium text-muted-foreground">Capacity</Label>
                                                <Input type="number" className="h-8 rounded-sm text-xs" value={data.capacity} onChange={e => setData('capacity', e.target.value as any)} min="1" required />
                                            </div>
                                        </div>
                                        <Button type="submit" disabled={processing} size="sm" className="w-full h-8 rounded-sm text-xs shadow-none">Publish Batch</Button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel — Batch Listing */}
                    <div className="lg:col-span-2">
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="px-3 py-2 border-b border-border bg-muted/5 flex items-center gap-1.5">
                                <Layers className="size-3.5 text-muted-foreground" />
                                <span className="text-xs font-semibold">Batches</span>
                                <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">{course.batches?.length || 0} total</span>
                            </div>
                            <div className="divide-y divide-border">
                                {course.batches?.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <Layers className="size-7 mx-auto text-muted-foreground/20 mb-2" />
                                        <p className="text-xs text-muted-foreground">No batches yet. Create one to get started.</p>
                                    </div>
                                ) : (
                                    course.batches.map((batch: any) => (
                                        <div key={batch.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/10 transition-colors">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-foreground">{batch.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-sm border ${batch.type === 'online' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                        {batch.type}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                        <Calendar className="size-3" /> {new Date(batch.start_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 bg-muted/20 px-3 py-2 rounded-sm border border-border/50">
                                                <div className="text-center">
                                                    <span className="text-[9px] text-muted-foreground block mb-0.5 flex items-center gap-1"><Users className="size-2.5" />Students</span>
                                                    <span className="text-sm font-semibold tabular-nums">{batch.enrollments?.length || 0}<span className="text-muted-foreground text-xs">/{batch.capacity}</span></span>
                                                </div>
                                                <div className="w-px h-6 bg-border" />
                                                <div>
                                                    <span className="text-[9px] text-muted-foreground block mb-0.5">Revenue</span>
                                                    <span className="text-sm font-semibold text-emerald-600 tabular-nums">₹{calculateBatchSales(batch).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

TeacherCourseShow.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Dashboard', href: '/teacher/dashboard' }, { title: 'Courses', href: '/teacher/courses' }, { title: 'Manage Batch', href: '#' }]}>
        {page}
    </TeacherLayout>
);
