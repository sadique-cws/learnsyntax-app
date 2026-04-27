import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { User, Mail, BookOpen, ChevronRight, GraduationCap } from 'lucide-react';

export default function AdminStudentIndex({ students }: { students: any[] }) {
    return (
        <>
            <Head title="Manage Students" />
            
            <div className="w-full p-4 lg:p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight uppercase">Learners Directory</h1>
                        <p className="text-muted-foreground text-sm font-medium">Manage student accounts and their course progress.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {students.map((student) => (
                        <Card key={student.id} className="border-border shadow-none rounded-2xl hover:border-primary transition-all group overflow-hidden">
                            <CardContent className="p-0">
                                <Link href={`/admin/students/${student.id}`} className="flex flex-col md:flex-row items-center gap-6 p-6">
                                    <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                        <User className="size-8 text-primary" />
                                    </div>
                                    
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{student.name}</h3>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5">
                                                <Mail className="size-3.5" />
                                                {student.email}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <BookOpen className="size-3.5" />
                                                {student.enrollments.length} Courses
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {student.enrollments.slice(0, 2).map((enrollment: any) => (
                                            <div key={enrollment.id} className="px-3 py-1 bg-muted rounded-lg text-[10px] font-black uppercase tracking-tight">
                                                {enrollment.course.title}
                                            </div>
                                        ))}
                                        {student.enrollments.length > 2 && (
                                            <div className="px-3 py-1 bg-muted rounded-lg text-[10px] font-black uppercase tracking-tight">
                                                +{student.enrollments.length - 2} More
                                            </div>
                                        )}
                                    </div>

                                    <div className="hidden md:flex items-center justify-center size-10 rounded-xl bg-muted group-hover:bg-primary group-hover:text-white transition-all ml-auto">
                                        <ChevronRight className="size-5" />
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}

                    {students.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-border rounded-[2rem]">
                            <GraduationCap className="size-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No students registered yet</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

AdminStudentIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Students', href: '/admin/students' }]}>
        {page}
    </AppLayout>
);
