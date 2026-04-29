import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, GraduationCap, Calendar, Plus, UserCheck, Users, BarChart3, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TeacherLayout from '@/layouts/teacher-layout';

export default function TeacherCourseShow({ course }: any) {
  const { data, setData, post, processing, reset, errors } = useForm({
    name: '',
    type: 'online',
    start_date: '',
    capacity: 30,
  });

  const [showBatchForm, setShowBatchForm] = useState(false);

  const submitBatch = (e: any) => {
    e.preventDefault();
    post(`/teacher/courses/${course.id}/batches`, {
      onSuccess: () => {
        reset();
        setShowBatchForm(false);
      }
    });
  };

  const calculateBatchSales = (batch: any) => {
    return batch.enrollments?.reduce((acc: number, en: any) => {
        if (en.payment?.amount) acc += parseFloat(en.payment.amount);
        return acc;
    }, 0) || 0;
  };

  return (
    <>
      <Head title={`Manage Course: ${course.title}`} />
      
      <div className="w-full max-w-6xl mx-auto p-4 lg:p-8 space-y-8">
        
        {/* Header / Back Nav */}
        <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="size-10 rounded-xl text-muted-foreground hover:bg-muted border border-border/40">
                <Link href="/teacher/courses">
                    <ArrowLeft className="size-4" />
                </Link>
            </Button>
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                    {course.title}
                </h1>
                <p className="text-xs font-medium text-muted-foreground mt-0.5 flex items-center gap-1">
                    <GraduationCap className="size-3.5 text-indigo-500" />
                    Unit Cost: ₹{course.price.toLocaleString()}
                </p>
            </div>
        </div>

        {/* Grid Splits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Panel - Quick stats */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
                    <CardHeader className="p-6">
                        <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                            <BarChart3 className="size-4 text-indigo-500" />
                            Course Performance
                        </CardTitle>
                        <CardDescription className="text-xs">Aggregated metrics over active cycles.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 pt-2 space-y-4 text-xs font-medium">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total Cohorts:</span>
                            <span className="font-bold text-foreground text-sm">{course.batches?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-border/40 pt-3">
                            <span className="text-muted-foreground">Students Enrolled:</span>
                            <span className="font-bold text-foreground text-sm flex items-center gap-1">
                                <UserCheck className="size-3.5 text-emerald-500" />
                                {course.batches?.reduce((acc: number, b: any) => acc + (b.enrollments?.length || 0), 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-t border-border/40 pt-3">
                            <span className="text-muted-foreground">Gross Earnings:</span>
                            <span className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                                ₹{course.batches?.reduce((acc: number, b: any) => acc + calculateBatchSales(b), 0).toLocaleString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {!showBatchForm ? (
                    <Button 
                        onClick={() => setShowBatchForm(true)}
                        className="w-full h-12 rounded-xl shadow-md shadow-indigo-500/10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                    >
                        <Plus className="size-4" />
                        Create New Batch
                    </Button>
                ) : (
                    <Card className="border border-border bg-card rounded-2xl shadow-sm relative overflow-hidden animate-in fade-in duration-300">
                        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
                        <CardHeader className="p-5">
                            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                                <Layers className="size-4 text-indigo-500" />
                                Create Cohort
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 pb-5 pt-0">
                            <form onSubmit={submitBatch} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Batch Name</Label>
                                    <Input 
                                        placeholder="E.g., Morning Bootcamp"
                                        className="h-10 text-xs font-medium rounded-xl border-border bg-background"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <span className="text-[10px] text-red-500 font-bold">{errors.name}</span>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location Format</Label>
                                    <Select value={data.type} onValueChange={(val: any) => setData('type', val)}>
                                        <SelectTrigger className="h-10 text-xs font-medium rounded-xl border-border bg-background">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="online" className="text-xs font-medium">Online / Virtual</SelectItem>
                                            <SelectItem value="offline" className="text-xs font-medium">In-Person Classroom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Start Date</Label>
                                        <Input 
                                            type="date"
                                            className="h-10 text-xs font-medium rounded-xl border-border bg-background"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Capacity</Label>
                                        <Input 
                                            type="number"
                                            className="h-10 text-xs font-medium rounded-xl border-border bg-background"
                                            value={data.capacity}
                                            onChange={e => setData('capacity', e.target.value as any)}
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button 
                                        type="submit" 
                                        disabled={processing} 
                                        className="flex-1 h-10 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        Publish
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        onClick={() => setShowBatchForm(false)}
                                        className="h-10 text-xs font-bold rounded-xl"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Right Panel - Batch listing */}
            <div className="lg:col-span-2">
                <Card className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden">
                    <CardHeader className="p-6 border-b border-border bg-muted/20">
                        <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                            <Layers className="size-4 text-indigo-500" />
                            Assigned Batches
                        </CardTitle>
                        <CardDescription className="text-xs">Review specific student classroom groups.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 divide-y divide-border">
                        {course.batches?.length === 0 ? (
                            <div className="p-16 text-center text-muted-foreground">
                                <Layers className="size-10 mx-auto text-muted-foreground/30 mb-3" />
                                <p className="font-semibold text-foreground text-sm">No active batches assigned.</p>
                                <p className="text-xs mt-1">Initiate class groups to trigger user registration pools.</p>
                            </div>
                        ) : (
                            course.batches.map((batch: any) => (
                                <div key={batch.id} className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-muted/10 transition-colors">
                                    <div className="space-y-1">
                                        <p className="font-bold text-sm text-foreground">{batch.name}</p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wide
                                                ${batch.type === 'online' ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}
                                            `}>
                                                {batch.type}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="size-3 text-muted-foreground/60" />
                                                Start: {new Date(batch.start_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 bg-muted/30 px-4 py-2 rounded-xl border border-border/30">
                                        <div className="text-center">
                                            <span className="text-[9px] font-bold uppercase text-muted-foreground block tracking-wider">Students</span>
                                            <span className="text-sm font-extrabold text-foreground flex items-center gap-1 justify-center mt-0.5">
                                                <Users className="size-3 text-muted-foreground" />
                                                {batch.enrollments?.length || 0} / {batch.capacity}
                                            </span>
                                        </div>
                                        <div className="w-px h-6 bg-border/40" />
                                        <div className="text-right">
                                            <span className="text-[9px] font-bold uppercase text-muted-foreground block tracking-wider">Yield</span>
                                            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">
                                                ₹{calculateBatchSales(batch).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>

      </div>
    </>
  );
}

TeacherCourseShow.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Instructor', href: '/teacher/dashboard' }, { title: 'Courses', href: '/teacher/courses' }, { title: 'Manage Batch', href: '#' }]}>
        {page}
    </TeacherLayout>
);
