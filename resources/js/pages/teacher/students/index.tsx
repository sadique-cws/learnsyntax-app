import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Users, Search, BookOpen, Calendar, Star } from 'lucide-react';
import TeacherLayout from '@/layouts/teacher-layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function EnrolledStudentsPage({ enrollments, courses, filters }: any) {
    const [selectedCourse, setSelectedCourse] = React.useState(filters.course_id || 'all');
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleCourseChange = (val: string) => {
        setSelectedCourse(val);
        router.get('/teacher/students', { course_id: val === 'all' ? '' : val }, { preserveState: true, preserveScroll: true });
    };

    const filteredEnrollments = enrollments.filter((enrollment: any) =>
        enrollment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.student_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Head title="Enrolled Students" />
            <div className="w-full p-4 lg:p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Enrolled Students</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{enrollments.length} students across your courses</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground/40" />
                        <Input type="text" placeholder="Search by name or email..." className="h-8 pl-8 rounded-sm text-xs border border-border bg-background" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <Select value={selectedCourse} onValueChange={handleCourseChange}>
                        <SelectTrigger className="h-8 rounded-sm text-xs border-border w-auto min-w-[160px]">
                            <SelectValue placeholder="All Courses" />
                        </SelectTrigger>
                        <SelectContent className="rounded-sm">
                            <SelectItem value="all" className="text-xs">All Courses</SelectItem>
                            {courses.map((course: any) => (
                                <SelectItem key={course.id} value={course.id.toString()} className="text-xs">{course.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-sm border border-border overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="px-3 py-2 text-[11px] font-semibold text-muted-foreground">Student</th>
                                <th className="px-3 py-2 text-[11px] font-semibold text-muted-foreground">Course / Batch</th>
                                <th className="px-3 py-2 text-[11px] font-semibold text-muted-foreground text-center">Score</th>
                                <th className="px-3 py-2 text-[11px] font-semibold text-muted-foreground text-right">Enrolled</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredEnrollments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-3 py-12 text-center text-muted-foreground">
                                        <Users className="size-7 text-muted-foreground/20 mx-auto mb-2" />
                                        <p className="text-xs">No students found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredEnrollments.map((enrollment: any) => (
                                    <tr key={enrollment.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-7 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-semibold shrink-0">
                                                    {enrollment.student_name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground leading-none">{enrollment.student_name}</p>
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">{enrollment.student_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center gap-1.5">
                                                <BookOpen className="size-3 text-muted-foreground/40 shrink-0" />
                                                <div>
                                                    <p className="text-xs font-medium text-foreground">{enrollment.course_title}</p>
                                                    <span className="text-[10px] text-muted-foreground">{enrollment.batch_name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm border ${enrollment.overall_average >= 75 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : enrollment.overall_average >= 50 ? 'bg-primary/5 text-primary border-primary/10' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                <Star className="size-2.5 inline fill-current mr-0.5" />{Math.round(enrollment.overall_average)}%
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-right">
                                            <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                                                <Calendar className="size-3" /> {enrollment.enroll_date}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

EnrolledStudentsPage.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Dashboard', href: '/teacher/dashboard' }, { title: 'Students', href: '#' }]}>
        {page}
    </TeacherLayout>
);
