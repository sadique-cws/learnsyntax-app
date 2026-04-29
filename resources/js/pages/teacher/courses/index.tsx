import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, IndianRupee, Image as ImageIcon, ChevronRight, Settings, Users, Clock, CheckCircle, Save } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import TeacherLayout from '@/layouts/teacher-layout';

export default function CourseManagement({ courses }: any) {
  const { data, setData, post, processing, reset } = useForm({
    title: '',
    price: '',
    description: '',
    image: null as File | null,
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  const { data: editData, setData: setEditData, post: postEdit, processing: processingEdit } = useForm({
    _method: 'PUT',
    title: '',
    price: '',
    description: '',
    image: null as File | null,
  });

  const submit = (e: any) => {
    e.preventDefault();
    post('/teacher/courses', {
      onSuccess: () => {
          reset();
          setShowAddForm(false);
      }
    });
  };

  const openCourseSheet = (course: any) => {
      setSelectedCourse(course);
      setEditData({
          _method: 'PUT',
          title: course.title,
          price: course.price,
          description: course.description,
          image: null,
      });
  };

  const submitEdit = (e: any) => {
    e.preventDefault();
    if (!selectedCourse?.id) return;
    
    postEdit(`/teacher/courses/${selectedCourse.id}`, {
        onSuccess: () => {
            // Update selectedCourse optimistically or just wait for Inertia reload
            setSelectedCourse(null);
        }
    });
  };

  return (
    <>
      <Head title="Manage Courses" />
      <div className="w-full max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-semibold mb-3">
                    <BookOpen className="size-3.5" />
                    <span>Curriculum Lab</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                    My Courses
                </h1>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                    Create new courses, manage your content, and track pricing.
                </p>
            </div>

            {!showAddForm && (
                <Button 
                    onClick={() => setShowAddForm(true)}
                    className="relative shrink-0 shadow-lg shadow-indigo-500/25 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white border-0 h-11 px-6 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:-translate-y-0.5"
                >
                    <Plus className="size-4 mr-2" />
                    Create New Course
                </Button>
            )}
        </div>

        {showAddForm && (
            <Card className="border border-indigo-500/20 shadow-xl shadow-indigo-900/5 bg-card relative overflow-hidden animate-in slide-in-from-top-4 fade-in duration-500">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-blue-500" />
                <CardHeader className="py-5 px-7 border-b border-border bg-muted/30 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                            <BookOpen className="size-4 text-indigo-500" />
                            Draft New Course
                        </CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full size-8">
                        <span className="sr-only">Close</span>
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </Button>
                </CardHeader>
                <CardContent className="p-7">
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Course Title</Label>
                                <Input 
                                    placeholder="E.g. Advanced Data Science" 
                                    className="h-11 rounded-xl bg-background focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all"
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Enrollment Price</Label>
                                <div className="relative">
                                    <Input 
                                        type="number" 
                                        placeholder="0.00" 
                                        min="0" 
                                        className="h-11 pl-10 rounded-xl bg-background focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-bold text-sm transition-all"
                                        value={data.price} 
                                        onChange={e => setData('price', e.target.value)} 
                                        required 
                                    />
                                    <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Description</Label>
                            <textarea 
                                className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                                placeholder="Describe what students will learn..."
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="space-y-2.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Cover Image</Label>
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                    <ImageIcon className="size-5 text-indigo-400" />
                                </div>
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    className="h-11 pt-2.5 rounded-xl bg-background focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                                    onChange={e => setData('image', e.target.files ? e.target.files[0] : null)} 
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full md:w-auto h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                            >
                                Publish Course
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
          {courses.map((course: any) => (
            <div onClick={() => openCourseSheet(course)} key={course.id} className="cursor-pointer group flex flex-col border border-border bg-card rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-[16/9] w-full bg-muted border-b border-border overflow-hidden">
                {course.image_path ? (
                   <img src={`/storage/${course.image_path}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Course" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ImageIcon className="size-8 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-border">
                    <span className="text-xs font-black text-emerald-500 tracking-tight">₹{course.price}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-foreground leading-tight mb-2 group-hover:text-indigo-500 transition-colors">{course.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed font-medium">{course.description}</p>
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <Users className="size-3.5" />
                        <span>{course.enrollments?.length || 0}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="size-7 rounded-lg text-muted-foreground group-hover:text-indigo-500 group-hover:bg-indigo-500/10 transition-colors">
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
              </div>
            </div>
          ))}

          {courses.length === 0 && !showAddForm && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-2xl bg-muted/30">
                  <div className="size-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                      <BookOpen className="size-8 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">No courses yet</h3>
                  <p className="text-muted-foreground text-sm mt-1 max-w-sm">You haven't created any courses. Get started by clicking the "Create New Course" button above.</p>
              </div>
          )}
        </div>
      </div>

      <Sheet open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
        <SheetContent className="sm:max-w-xl w-full border-l-0 p-0 overflow-hidden flex flex-col bg-background/95 backdrop-blur-xl">
            {selectedCourse && (
                <>
                    {/* Sheet Header Image */}
                    <div className="relative aspect-video w-full bg-muted border-b border-border shrink-0">
                        {selectedCourse.image_path ? (
                            <img src={`/storage/${selectedCourse.image_path}`} className="w-full h-full object-cover" alt="Course" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="size-10 text-muted-foreground/30" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-6">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest mb-2 backdrop-blur-md">
                                    <CheckCircle className="size-3" />
                                    Active
                                </div>
                                <SheetTitle className="text-2xl font-extrabold text-foreground">{selectedCourse.title}</SheetTitle>
                                <SheetDescription className="text-muted-foreground font-medium line-clamp-1 mt-1">₹{selectedCourse.price} • {selectedCourse.enrollments?.length || 0} Enrollments</SheetDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Edit Form */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                                <Settings className="size-4 text-indigo-500" />
                                Edit Course Details
                            </h3>
                            <form onSubmit={submitEdit} className="space-y-4 bg-card p-5 rounded-2xl border border-border">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Title</Label>
                                    <Input 
                                        className="h-10 rounded-xl bg-background"
                                        value={editData.title} 
                                        onChange={e => setEditData('title', e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Price</Label>
                                    <div className="relative">
                                        <Input 
                                            type="number" min="0"
                                            className="h-10 pl-8 rounded-xl bg-background"
                                            value={editData.price} 
                                            onChange={e => setEditData('price', e.target.value)} 
                                            required 
                                        />
                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Description</Label>
                                    <textarea 
                                        className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 resize-none"
                                        value={editData.description} 
                                        onChange={e => setEditData('description', e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Update Cover Image</Label>
                                    <Input 
                                        type="file" accept="image/*"
                                        className="h-10 pt-2 rounded-xl bg-background text-sm"
                                        onChange={e => setEditData('image', e.target.files ? e.target.files[0] : null)} 
                                    />
                                </div>
                                <div className="pt-2">
                                    <Button type="submit" disabled={processingEdit} className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                                        <Save className="size-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Students List */}
                        <div className="space-y-4 pb-8">
                            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                                <Users className="size-4 text-indigo-500" />
                                Enrolled Students ({selectedCourse.enrollments?.length || 0})
                            </h3>
                            <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
                                {(!selectedCourse.enrollments || selectedCourse.enrollments.length === 0) ? (
                                    <div className="p-8 text-center bg-muted/20">
                                        <Clock className="size-6 text-muted-foreground/50 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-foreground">No students yet</p>
                                    </div>
                                ) : (
                                    selectedCourse.enrollments.map((enrollment: any) => (
                                        <div key={enrollment.id} className="p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                                            <div className="size-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 text-indigo-600 font-bold text-sm uppercase">
                                                {enrollment.user?.name?.charAt(0) || 'S'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-foreground truncate">{enrollment.user?.name || 'Student'}</p>
                                                <p className="text-xs text-muted-foreground truncate">{enrollment.user?.email || 'No email'}</p>
                                            </div>
                                            <div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${enrollment.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                    {enrollment.status}
                                                </span>
                                            </div>
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
    <TeacherLayout breadcrumbs={[{ title: 'Instructor', href: '/teacher/dashboard' }, { title: 'Courses', href: '/teacher/courses' }]}>
        {page}
    </TeacherLayout>
);
