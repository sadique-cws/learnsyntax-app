import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Plus, Trash2, ChevronLeft, HelpCircle, FileJson, Search, BookOpen, Layers } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function AdminExamQuestions({ exam }: { exam: any }) {
    const { data, setData, post, processing, reset, delete: destroy } = useForm({
        question_text: '',
        marks: 1,
        options: ['', '', '', ''],
        correct_answer: '',
    });

    const [isBulkOpen, setIsBulkOpen] = useState(false);
    const [jsonInput, setJsonInput] = useState('');
    const [bulkProcessing, setBulkProcessing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/academic/exams/${exam.id}/questions`, {
            onSuccess: () => reset(),
        });
    };

    const handleBulkSubmit = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            const questions = Array.isArray(parsed) ? parsed : [parsed];
            setBulkProcessing(true);
            post(`/admin/academic/exams/${exam.id}/questions/bulk`, {
                data: { questions },
                onSuccess: () => { setIsBulkOpen(false); setJsonInput(''); setBulkProcessing(false); },
                onError: () => setBulkProcessing(false),
            });
        } catch (e) { alert('Invalid JSON format. Please check your input.'); }
    };

    const handleDelete = (id: number) => { if (confirm('Delete this question?')) destroy(`/admin/academic/questions/${id}`); };

    const filteredQuestions = exam.questions.filter((q: any) => q.question_text.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <>
            <Head title={`Questions | ${exam.title}`} />
            
            <div className="w-full p-4 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Link href="/admin/academic/exams" className="size-7 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                                <ChevronLeft className="size-3.5" />
                            </Link>
                            <div>
                                <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <HelpCircle className="size-4 text-primary" /> {exam.title}
                                </h1>
                                <p className="text-xs text-muted-foreground">{exam.course.title} • {exam.questions.length} questions total</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60" />
                            <Input 
                                placeholder="Search questions..." 
                                className="pl-9 h-8 w-64 rounded-sm border-border text-xs shadow-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="rounded-sm h-8 px-3 border-border shadow-none text-xs">
                                    <FileJson className="size-3.5 mr-1.5" /> Bulk Import
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl rounded-sm border border-border shadow-none p-0 overflow-hidden">
                                <DialogHeader className="px-4 py-3 border-b border-border">
                                    <DialogTitle className="text-sm font-semibold">Bulk Question Import</DialogTitle>
                                </DialogHeader>
                                <div className="p-4 space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-muted-foreground">JSON Content</Label>
                                        <Textarea 
                                            className="min-h-[300px] font-mono text-[11px] rounded-sm border-border shadow-none resize-none bg-muted/5"
                                            placeholder={`[\n  {\n    "question_text": "...",\n    "options": ["...", "..."],\n    "correct_answer": "...",\n    "marks": 2\n  }\n]`}
                                            value={jsonInput}
                                            onChange={e => setJsonInput(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="px-4 py-3 border-t border-border bg-muted/5">
                                    <Button variant="outline" onClick={() => setIsBulkOpen(false)} className="rounded-sm h-9 text-xs shadow-none">Cancel</Button>
                                    <Button onClick={handleBulkSubmit} disabled={bulkProcessing || !jsonInput} className="rounded-sm h-9 px-6 text-xs shadow-none">
                                        {bulkProcessing ? 'Importing...' : 'Start Import'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 space-y-4">
                        <div className="rounded-sm border border-border bg-background overflow-hidden shadow-sm">
                            <div className="px-4 py-3 border-b border-border bg-muted/5">
                                <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                                    <Plus className="size-3 text-primary" /> Add New Question
                                </h2>
                            </div>
                            <form onSubmit={submit} className="p-4 space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Question Content</Label>
                                    <Textarea required className="rounded-sm border-border min-h-[80px] text-xs shadow-none resize-none" value={data.question_text} onChange={e => setData('question_text', e.target.value)} placeholder="Enter the question text..." />
                                </div>
                                
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Options (MCQ)</Label>
                                    <div className="space-y-2">
                                        {data.options.map((option, index) => (
                                            <div key={index} className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40">{index + 1}</div>
                                                <Input required placeholder={`Option ${index + 1}`} className="pl-7 rounded-sm border-border h-8 text-xs shadow-none" value={option} onChange={e => { const newOptions = [...data.options]; newOptions[index] = e.target.value; setData('options', newOptions); }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-muted-foreground">Correct Option</Label>
                                        <Input required placeholder="Exact match" className="rounded-sm border-border h-8 text-xs shadow-none" value={data.correct_answer} onChange={e => setData('correct_answer', e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-muted-foreground">Marks</Label>
                                        <Input type="number" required className="rounded-sm border-border h-8 text-xs shadow-none tabular-nums" value={data.marks} onChange={e => setData('marks', parseInt(e.target.value))} />
                                    </div>
                                </div>

                                <Button type="submit" disabled={processing} className="w-full h-9 rounded-sm text-xs font-medium shadow-none mt-2">
                                    {processing ? 'Processing...' : 'Register Question'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-[11px] font-bold text-muted-foreground  flex items-center gap-2">
                                <Layers className="size-3.5" /> Exam Paper Distribution
                            </h2>
                            <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/5 border border-primary/10 rounded-sm uppercase">{filteredQuestions.length} Questions</span>
                        </div>
                        
                        {filteredQuestions.length > 0 ? (
                            <div className="space-y-3">
                                {filteredQuestions.map((q: any, index: number) => (
                                    <div key={q.id} className="rounded-sm border border-border bg-background p-4 hover:border-primary/20 transition-all group shadow-sm flex gap-4">
                                        <div className="size-8 rounded-sm bg-muted/50 flex items-center justify-center text-[10px] font-bold border border-border shrink-0 h-fit">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 space-y-4 min-w-0">
                                            <div className="flex justify-between gap-4">
                                                <p className="text-sm font-medium leading-relaxed text-foreground">{q.question_text}</p>
                                                <Button variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 shrink-0" onClick={() => handleDelete(q.id)}>
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                            
                                            {q.options && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {q.options.map((opt: string, i: number) => (
                                                        <div key={i} className={cn(
                                                            "px-3 py-2 rounded-sm border text-xs font-medium transition-colors",
                                                            q.correct_answer === opt ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-muted/5 border-border/60 text-muted-foreground'
                                                        )}>
                                                            <span className="text-[10px] opacity-40 mr-2 uppercase">{String.fromCharCode(65 + i)}</span> {opt}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center gap-4 pt-2 border-t border-border/40">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-primary/5 text-primary text-[10px] font-bold border border-primary/10 uppercase tracking-tight">
                                                    {q.marks} Marks
                                                </span>
                                                {q.correct_answer && (
                                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                                                        <span className="uppercase opacity-60">Validation:</span>
                                                        <span className="text-foreground font-bold">{q.correct_answer}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center border border-dashed border-border/80 bg-muted/5 rounded-sm">
                                <HelpCircle className="size-10 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
                                <h3 className="text-sm font-bold text-foreground">Question Repository Empty</h3>
                                <p className="text-xs text-muted-foreground mt-1 max-w-[280px] mx-auto">No questions match your criteria. Add new questions or perform a bulk import.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

AdminExamQuestions.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Exams', href: '/admin/academic/exams' }, { title: 'Questions', href: '#' }]}>
        {page}
    </AppLayout>
);
