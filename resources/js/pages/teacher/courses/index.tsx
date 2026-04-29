import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, IndianRupee, Image as ImageIcon, ChevronRight } from 'lucide-react';
import TeacherLayout from '@/layouts/teacher-layout';

export default function CourseManagement({ courses }: any) {
  const { data, setData, post, processing, reset } = useForm({
    title: '',
    price: '',
    description: '',
    image: null as File | null,
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const submit = (e: any) => {
    e.preventDefault();
    post('/teacher/courses', {
      onSuccess: () => {
          reset();
          setShowAddForm(false);
      }
    });
  };

  return (
    <>
      <Head title="Manage Courses" />
      <div className="w-full max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-3">
                    <BookOpen className="size-3.5" />
                    <span>Curriculum Lab</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    My Courses
                </h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">
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
            <Card className="border border-indigo-100 shadow-xl shadow-indigo-900/5 bg-white relative overflow-hidden animate-in slide-in-from-top-4 fade-in duration-500">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-blue-500" />
                <CardHeader className="py-5 px-7 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <BookOpen className="size-4 text-indigo-500" />
                            Draft New Course
                        </CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full size-8">
                        <span className="sr-only">Close</span>
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </Button>
                </CardHeader>
                <CardContent className="p-7">
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Course Title</Label>
                                <Input 
                                    placeholder="E.g. Advanced Data Science" 
                                    className="h-11 rounded-xl border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm transition-all hover:border-slate-300"
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Enrollment Price</Label>
                                <div className="relative">
                                    <Input 
                                        type="number" 
                                        placeholder="0.00" 
                                        min="0" 
                                        className="h-11 pl-10 rounded-xl border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-bold text-sm transition-all hover:border-slate-300"
                                        value={data.price} 
                                        onChange={e => setData('price', e.target.value)} 
                                        required 
                                    />
                                    <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Description</Label>
                            <textarea 
                                className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all hover:border-slate-300 resize-none"
                                placeholder="Describe what students will learn..."
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="space-y-2.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Cover Image</Label>
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                    <ImageIcon className="size-5 text-indigo-400" />
                                </div>
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    className="h-11 pt-2.5 rounded-xl border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all hover:border-slate-300"
                                    onChange={e => setData('image', e.target.files ? e.target.files[0] : null)} 
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full md:w-auto h-11 px-8 bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
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
            <div key={course.id} className="group flex flex-col border border-slate-200/60 bg-white rounded-2xl overflow-hidden hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-[16/9] w-full bg-slate-100 border-b border-slate-100 overflow-hidden">
                {course.image_path ? (
                   <img src={`/storage/${course.image_path}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Course" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      <ImageIcon className="size-8 text-slate-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-white/20">
                    <span className="text-xs font-black text-emerald-600 tracking-tight">₹{course.price}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-medium">{course.description}</p>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active</span>
                    <Button variant="ghost" size="icon" className="size-7 rounded-lg text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
              </div>
            </div>
          ))}

          {courses.length === 0 && !showAddForm && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <div className="size-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                      <BookOpen className="size-8 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">No courses yet</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-sm">You haven't created any courses. Get started by clicking the "Create New Course" button above.</p>
              </div>
          )}
        </div>
      </div>
    </>
  );
}

CourseManagement.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Instructor', href: '/teacher/dashboard' }, { title: 'Courses', href: '/teacher/courses' }]}>
        {page}
    </TeacherLayout>
);
