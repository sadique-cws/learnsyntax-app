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
      <Head title="Subscriber Registry" />
      <div className="w-full p-4 lg:p-6 space-y-6">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-border pb-6">
            <div>
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                    <Users className="size-3" /> Core Registry
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Enrolled Students</h1>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1.5 italic">Synchronizing academic growth and course assignment protocols.</p>
            </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-3 items-end bg-background border border-border rounded-xl p-3 shadow-none">
            <div className="w-full md:w-1/3 space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Identity Filter</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60" />
                    <Input 
                        type="text" 
                        placeholder="SEARCH_BY_ID_OR_EMAIL..." 
                        className="h-9 pl-10 rounded-lg text-[11px] font-bold border-border bg-muted/10 focus:bg-background shadow-none uppercase placeholder:text-muted-foreground/30"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="w-full md:w-1/4 space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Sector Protocol</label>
                <Select value={selectedCourse} onValueChange={handleCourseChange}>
                    <SelectTrigger className="h-9 rounded-lg border-border bg-muted/10 text-[10px] font-black uppercase tracking-widest shadow-none">
                        <SelectValue placeholder="All Sectors" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border shadow-none">
                        <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest py-2">All Sectors</SelectItem>
                        {courses.map((course: any) => (
                            <SelectItem key={course.id} value={course.id.toString()} className="text-[10px] font-black uppercase tracking-widest py-2">
                                {course.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Students List Grid/Table */}
        <div className="bg-background border border-border rounded-xl shadow-none overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-muted/30 border-b border-border">
                            <th className="px-4 py-3 text-[9px] font-black tracking-[0.2em] uppercase text-muted-foreground/60">Node Identity</th>
                            <th className="px-4 py-3 text-[9px] font-black tracking-[0.2em] uppercase text-muted-foreground/60">Deployment Module</th>
                            <th className="px-4 py-3 text-[9px] font-black tracking-[0.2em] uppercase text-muted-foreground/60 text-center">Yield Analysis</th>
                            <th className="px-4 py-3 text-[9px] font-black tracking-[0.2em] uppercase text-muted-foreground/60 text-right">Registry Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredEnrollments.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-20 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="size-12 rounded-2xl bg-muted/30 flex items-center justify-center border border-dashed border-border">
                                            <Users className="size-5 text-muted-foreground/30" />
                                        </div>
                                        <div className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] italic">Null_Result_Set</div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredEnrollments.map((enrollment: any) => (
                                <tr key={enrollment.id} className="hover:bg-muted/10 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-black uppercase tracking-tighter shrink-0">
                                                {enrollment.student_name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-[13px] uppercase tracking-tight leading-tight">{enrollment.student_name}</p>
                                                <p className="text-[10px] text-muted-foreground font-bold lowercase mt-0.5 opacity-60 italic">{enrollment.student_email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="size-3.5 text-primary/40 shrink-0" />
                                            <div>
                                                <p className="font-black text-slate-700 text-[11px] uppercase tracking-tight">{enrollment.course_title}</p>
                                                <span className="inline-block text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-50">
                                                    Batch_ID: {enrollment.batch_name}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded border uppercase tracking-widest flex items-center gap-1.5 
                                                ${enrollment.overall_average >= 75 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : ''}
                                                ${enrollment.overall_average >= 50 && enrollment.overall_average < 75 ? 'bg-primary/5 text-primary border-primary/10' : ''}
                                                ${enrollment.overall_average < 50 ? 'bg-rose-50 text-rose-600 border-rose-200' : ''}
                                            `}>
                                                <Star className="size-2.5 fill-current" />
                                                {Math.round(enrollment.overall_average)}% Yield
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <Calendar className="size-3 opacity-60" />
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
    <TeacherLayout breadcrumbs={[{ title: 'Core Protocol', href: '/teacher/dashboard' }, { title: 'Subscriber Registry', href: '#' }]}>
        {page}
    </TeacherLayout>
);
