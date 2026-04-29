import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, IndianRupee, Image as ImageIcon, ChevronRight, Settings, Users, Clock, CheckCircle, Save, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import TeacherLayout from '@/layouts/teacher-layout';

export default function CourseManagement({ courses }: any) {
    const { data, setData, post, processing, reset } = useForm({
        title: '', price: '', description: '', image: null as File | null,
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const { data: editData, setData: setEditData, post: postEdit, processing: processingEdit } = useForm({
        _method: 'PUT', title: '', price: '', description: '', image: null as File | null,
    });

    const submit = (e: any) => {
        e.preventDefault();
        post('/teacher/courses', { onSuccess: () => { reset(); setShowAddForm(false); } });
    };
    const openCourseSheet = (course: any) => {
        setSelectedCourse(course);
        setEditData({ _method: 'PUT', title: course.title, price: course.price, description: course.description, image: null });
    };
    const submitEdit = (e: any) => {
        e.preventDefault();
        if (!selectedCourse?.id) return;
        postEdit(`/teacher/courses/${selectedCourse.id}`, { onSuccess: () => setSelectedCourse(null) });
    };

    return (
        <>
            <Head title="My Courses" />
            <div className="w-full p-4 lg:p-6 space-y-4">

                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">My Courses</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Create and manage your course catalog</p>
                    </div>
                    {!showAddForm && (
                        <Button onClick={() => setShowAddForm(true)} size="sm" className="h-7 px-3 rounded-sm text-xs shadow-none font-medium">
                            <Plus className="size-3 mr-1.5" /> New Course
                        </Button>
                    )}
                </div>

                {/* Add Form */}
                {showAddForm && (
                    <div className="rounded-sm border border-border overflow-hidden">
                        <div className="px-3 py-2.5 border-b border-border bg-muted/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BookOpen className="size-3.5 text-primary" />
                                <span className="text-xs font-semibold">New Course</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)} className="size-6 rounded-sm text-muted-foreground hover:text-foreground">
                                <X className="size-3.5" />
                            </Button>
                        </div>
                        <div className="p-4">
                            <form onSubmit={submit} className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-muted-foreground">Course Title</Label>
                                        <Input placeholder="E.g. Advanced Data Science" className="h-8 rounded-sm text-sm" value={data.title} onChange={e => setData('title', e.target.value)} required />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-muted-foreground">Price</Label>
                                        <div className="relative">
                                            <Input type="number" placeholder="0.00" min="0" className="h-8 pl-7 rounded-sm text-sm" value={data.price} onChange={e => setData('price', e.target.value)} required />
                                            <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                                    <textarea className="w-full min-h-[80px] rounded-sm border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none" placeholder="Describe what students will learn..." value={data.description} onChange={e => setData('description', e.target.value)} required />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-muted-foreground">Cover Image</Label>
                                    <Input type="file" accept="image/*" className="h-8 pt-1.5 rounded-sm text-sm" onChange={e => setData('image', e.target.files ? e.target.files[0] : null)} />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing} size="sm" className="h-8 px-4 rounded-sm text-xs shadow-none font-medium">Publish Course</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {courses.map((course: any) => (
                        <div onClick={() => openCourseSheet(course)} key={course.id} className="cursor-pointer group flex flex-col border border-border bg-card rounded-sm overflow-hidden hover:border-primary/50 transition-colors">
                            <div className="relative aspect-[16/9] w-full bg-muted border-b border-border overflow-hidden">
                                {course.image_path ? (
                                    <img src={`/storage/${course.image_path}`} className="w-full h-full object-cover" alt="Course" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="size-6 text-muted-foreground/30" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-background border border-border rounded-sm">
                                    <span className="text-[10px] font-medium text-foreground">₹{course.price}</span>
                                </div>
                            </div>
                            <div className="p-3 flex flex-col flex-1">
                                <h3 className="font-medium text-sm text-foreground leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h3>
                                <p className="text-[10px] text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{course.description}</p>
                                <div className="mt-auto pt-2.5 border-t border-border flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                        <Users className="size-3" />
                                        <span>{course.enrollments?.length || 0} enrolled</span>
                                    </div>
                                    <Button asChild variant="ghost" className="h-6 px-2 text-[10px] font-medium text-primary hover:bg-primary/5 rounded-sm" onClick={(e) => e.stopPropagation()}>
                                        <Link href={`/teacher/courses/${course.id}`}>Batches <ChevronRight className="size-3 ml-0.5" /></Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {courses.length === 0 && !showAddForm && (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-sm">
                            <BookOpen className="size-8 text-muted-foreground/20 mx-auto mb-3" />
                            <p className="text-sm font-medium text-foreground">No courses yet</p>
                            <p className="text-xs text-muted-foreground mt-1">Create your first course to get started</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Sheet */}
            <Sheet open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
                <SheetContent className="sm:max-w-md w-full border-l border-border p-0 flex flex-col">
                    {selectedCourse && (
                        <>
                            <SheetHeader className="px-4 py-3 border-b border-border bg-muted/5 shrink-0">
                                <SheetTitle className="text-sm font-semibold">{selectedCourse.title}</SheetTitle>
                                <SheetDescription className="text-[10px]">₹{selectedCourse.price} · {selectedCourse.enrollments?.length || 0} enrollments</SheetDescription>
                            </SheetHeader>
                            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                                {/* Edit Form */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                                        <Settings className="size-3.5 text-muted-foreground" /> Edit Details
                                    </div>
                                    <form onSubmit={submitEdit} className="space-y-3 p-3 rounded-sm border border-border bg-background">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-muted-foreground">Title</Label>
                                            <Input className="h-8 rounded-sm text-sm" value={editData.title} onChange={e => setEditData('title', e.target.value)} required />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-muted-foreground">Price</Label>
                                            <div className="relative">
                                                <Input type="number" min="0" className="h-8 pl-7 rounded-sm text-sm" value={editData.price} onChange={e => setEditData('price', e.target.value)} required />
                                                <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                                            <textarea className="w-full min-h-[70px] rounded-sm border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none" value={editData.description} onChange={e => setEditData('description', e.target.value)} required />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-muted-foreground">Update Cover Image</Label>
                                            <Input type="file" accept="image/*" className="h-8 pt-1.5 rounded-sm text-sm" onChange={e => setEditData('image', e.target.files ? e.target.files[0] : null)} />
                                        </div>
                                        <Button type="submit" disabled={processingEdit} size="sm" className="w-full h-8 rounded-sm text-xs shadow-none">
                                            <Save className="size-3 mr-1.5" /> Save Changes
                                        </Button>
                                    </form>
                                </div>

                                {/* Enrolled Students */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                                        <Users className="size-3.5 text-muted-foreground" /> Students ({selectedCourse.enrollments?.length || 0})
                                    </div>
                                    <div className="rounded-sm border border-border overflow-hidden divide-y divide-border">
                                        {(!selectedCourse.enrollments || selectedCourse.enrollments.length === 0) ? (
                                            <div className="py-8 text-center">
                                                <Clock className="size-5 text-muted-foreground/30 mx-auto mb-1.5" />
                                                <p className="text-xs text-muted-foreground">No students enrolled yet</p>
                                            </div>
                                        ) : (
                                            selectedCourse.enrollments.map((enrollment: any) => (
                                                <div key={enrollment.id} className="px-3 py-2.5 flex items-center gap-2.5 hover:bg-muted/20 transition-colors">
                                                    <div className="size-7 rounded-sm bg-muted border border-border flex items-center justify-center shrink-0 text-xs font-medium text-muted-foreground uppercase">
                                                        {enrollment.user?.name?.charAt(0) || 'S'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-medium text-foreground truncate">{enrollment.user?.name || 'Student'}</p>
                                                        <p className="text-[10px] text-muted-foreground truncate">{enrollment.user?.email || 'No email'}</p>
                                                    </div>
                                                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-sm border ${enrollment.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                        {enrollment.status}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
}

CourseManagement.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Dashboard', href: '/teacher/dashboard' }, { title: 'Courses', href: '/teacher/courses' }]}>
        {page}
    </TeacherLayout>
);
