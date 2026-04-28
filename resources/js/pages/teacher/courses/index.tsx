import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function CourseManagement({ courses }: any) {
  const { data, setData, post, processing, reset } = useForm({
    title: '',
    price: '',
    description: '',
    image: null as File | null,
  });

  const submit = (e: any) => {
    e.preventDefault();
    post(route('teacher.courses.store'), {
      onSuccess: () => reset()
    });
  };

  return (
    <>
      <Head title="Manage Courses" />
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">My Courses</h1>

        <Card className="border-0 shadow-lg">
          <CardHeader><CardTitle>Create New Course</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="flex flex-col gap-4">
              <Input placeholder="Course Title" value={data.title} onChange={e => setData('title', e.target.value)} required />
              <Input type="number" placeholder="Price (₹)" value={data.price} onChange={e => setData('price', e.target.value)} required min="0" />
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Course Description"
                value={data.description} 
                onChange={e => setData('description', e.target.value)} 
                required 
              />
              <Input type="file" accept="image/*" onChange={e => setData('image', e.target.files ? e.target.files[0] : null)} />
              <Button type="submit" disabled={processing} className="w-full">Create Course</Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {courses.map((course: any) => (
            <Card key={course.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {course.image_path ? (
                 <img src={`/storage/${course.image_path}`} className="w-full h-48 object-cover" alt="Course" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 font-medium">Placeholder Image</span>
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{course.title}</h3>
                <p className="font-medium text-emerald-600 mt-2">₹{course.price}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mt-2">{course.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
