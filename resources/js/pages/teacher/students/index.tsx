import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Users, Search, BookOpen, Calendar, Award, Star } from 'lucide-react';
import TeacherLayout from '@/layouts/teacher-layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function EnrolledStudentsPage({ enrollments, courses, filters }: any) {
  const [selectedCourse, setSelectedCourse] = React.useState(filters.course_id || 'all');
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleCourseChange = (val: string) => {
    setSelectedCourse(val);
    router.get('/teacher/students', 
      { course_id: val === 'all' ? '' : val }, 
      { preserveState: true, preserveScroll: true }
    );
  };

  const filteredEnrollments = enrollments.filter((enrollment: any) => 
    enrollment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.student_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head title="Enrolled Students" />
      <div className="w-full max-w-6xl mx-auto p-4 lg:p-8 space-y-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                    <Users className="size-8 text-indigo-500" />
                    Enrolled Students
                </h1>
                <p className="text-sm text-muted-foreground mt-1 font-medium">Monitor student academic growth and course assignments.</p>
            </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 items-end bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="w-full md:w-1/3 space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Search Students</label>
                <div className="relative">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground/60" />
                    <Input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        className="h-10 pl-10 rounded-xl text-sm font-medium border-border bg-background/50 focus:bg-background"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="w-full md:w-1/4 space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Filter By Course</label>
                <Select value={selectedCourse} onValueChange={handleCourseChange}>
                    <SelectTrigger className="h-10 rounded-xl border-border bg-background/50 text-sm font-medium">
                        <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all" className="text-xs font-medium">All Courses</SelectItem>
                        {courses.map((course: any) => (
                            <SelectItem key={course.id} value={course.id.toString()} className="text-xs font-medium">
                                {course.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Students List Grid/Table */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-muted/40 border-b border-border text-xs font-bold text-muted-foreground tracking-wider uppercase">
                            <th className="p-5 font-bold">Student</th>
                            <th className="p-5 font-bold">Course & Batch</th>
                            <th className="p-5 font-bold text-center">Performance</th>
                            <th className="p-5 font-bold text-right">Enrolled</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm font-medium text-foreground">
                        {filteredEnrollments.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-muted-foreground">
                                    <Users className="size-10 mx-auto text-muted-foreground/30 mb-3" />
                                    <p className="font-semibold text-foreground">No active enrollments found</p>
                                    <p className="text-xs mt-1">Try adjusting your search or filter queries.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredEnrollments.map((enrollment: any) => (
                                <tr key={enrollment.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs font-bold uppercase">
                                                {enrollment.student_name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{enrollment.student_name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{enrollment.student_email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="size-4 text-indigo-500/60 shrink-0" />
                                            <div>
                                                <p className="font-bold text-foreground text-xs">{enrollment.course_title}</p>
                                                <span className="inline-block text-[10px] font-bold text-muted-foreground mt-0.5">
                                                    Batch: {enrollment.batch_name}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 
                                                ${enrollment.overall_average >= 75 ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : ''}
                                                ${enrollment.overall_average >= 50 && enrollment.overall_average < 75 ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20' : ''}
                                                ${enrollment.overall_average < 50 ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : ''}
                                            `}>
                                                <Star className="size-3 fill-current" />
                                                {Math.round(enrollment.overall_average)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground font-medium">
                                            <Calendar className="size-3.5 opacity-60" />
                                            {enrollment.enroll_date}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </>
  );
}

EnrolledStudentsPage.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Instructor', href: '/teacher/dashboard' }, { title: 'Enrolled Students', href: '#' }]}>
        {page}
    </TeacherLayout>
);
