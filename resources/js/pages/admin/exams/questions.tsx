import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Plus, Trash2, ChevronLeft, HelpCircle, FileJson, Search, Layers } from 'lucide-react';
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
            
            <div className="w-full p-4 space-y-3">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/academic/exams" className="p-2 hover:bg-muted rounded-sm border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0">
                            <ChevronLeft className="size-4" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">{exam.title}</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">{exam.course.title} • {exam.questions.length} questions</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60" />
                            <Input 
                                placeholder="Search questions..." 
                                className="pl-9 h-8 w-56 rounded-sm border-border text-xs shadow-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="rounded-sm h-8 px-3 shadow-none text-xs font-medium">
                                    <FileJson className="size-3.5 mr-1.5" /> Bulk Import
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl rounded-sm border border-border shadow-none p-0 overflow-hidden">
                                <DialogHeader className="px-4 py-3 border-b border-border bg-muted/5">
                                    <DialogTitle className="text-sm font-semibold">Bulk Question Import</DialogTitle>
                                    <p className="text-xs text-muted-foreground">{exam.course.title}</p>
                                </DialogHeader>
                                <div className="p-4 space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-muted-foreground">JSON Content</Label>
                                        <Textarea 
                                            className="min-h-[280px] font-mono text-[11px] rounded-sm border-border shadow-none resize-none bg-muted/5"
                                            placeholder={`[\n  {\n    "question_text": "...",\n    "options": ["...", "..."],\n    "correct_answer": "...",\n    "marks": 2\n  }\n]`}
                                            value={jsonInput}
                                            onChange={e => setJsonInput(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="px-4 py-3 border-t border-border bg-muted/5 flex flex-row gap-2">
                                    <Button variant="outline" onClick={() => setIsBulkOpen(false)} className="flex-1 rounded-sm h-9 text-xs shadow-none">Cancel</Button>
                                    <Button onClick={handleBulkSubmit} disabled={bulkProcessing || !jsonInput} className="flex-1 rounded-sm h-9 text-xs shadow-none">
                                        {bulkProcessing ? 'Importing...' : 'Start Import'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    {/* Add Question Form */}
                    <div className="lg:col-span-4">
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="px-3 py-2 border-b border-border bg-muted/5">
                                <h2 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <Plus className="size-3 text-primary" /> Add Question
                                </h2>
                            </div>
                            <form onSubmit={submit} className="p-4 space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-muted-foreground">Question Content</Label>
                                    <Textarea required className="rounded-sm border-border min-h-[80px] text-xs shadow-none resize-none" value={data.question_text} onChange={e => setData('question_text', e.target.value)} placeholder="Enter the question text..." />
                                </div>
                                
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-muted-foreground">Options (MCQ)</Label>
                                    <div className="space-y-1.5">
                                        {data.options.map((option, index) => (
                                            <div key={index} className="relative">
                                                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground/40">{String.fromCharCode(65 + index)}</div>
                                                <Input required placeholder={`Option ${index + 1}`} className="pl-7 rounded-sm border-border h-8 text-xs shadow-none" value={option} onChange={e => { const newOptions = [...data.options]; newOptions[index] = e.target.value; setData('options', newOptions); }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-muted-foreground">Correct Option</Label>
                                        <Input required placeholder="Exact match" className="rounded-sm border-border h-8 text-xs shadow-none" value={data.correct_answer} onChange={e => setData('correct_answer', e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-muted-foreground">Marks</Label>
                                        <Input type="number" required className="rounded-sm border-border h-8 text-xs shadow-none tabular-nums" value={data.marks} onChange={e => setData('marks', parseInt(e.target.value))} />
                                    </div>
                                </div>

                                <Button type="submit" disabled={processing} className="w-full h-9 rounded-sm text-xs font-medium shadow-none">
                                    {processing ? 'Processing...' : 'Register Question'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Questions List */}
                    <div className="lg:col-span-8">
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5">
                                <h2 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <Layers className="size-3.5 text-muted-foreground" /> Question Bank
                                </h2>
                                <span className="text-xs font-medium text-primary px-1.5 py-0.5 bg-primary/5 border border-primary/10 rounded-sm tabular-nums">{filteredQuestions.length} Q</span>
                            </div>
                            
                            {filteredQuestions.length > 0 ? (
                                <div className="divide-y divide-border">
                                    {filteredQuestions.map((q: any, index: number) => (
                                        <div key={q.id} className="p-4 hover:bg-muted/5 transition-colors flex gap-3">
                                            <div className="size-7 rounded-sm bg-muted/30 flex items-center justify-center text-[10px] font-medium text-muted-foreground border border-border shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 space-y-3 min-w-0">
                                                <div className="flex justify-between gap-3">
                                                    <p className="text-sm font-medium leading-relaxed text-foreground">{q.question_text}</p>
                                                    <Button variant="ghost" size="icon" className="size-7 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 shrink-0" onClick={() => handleDelete(q.id)}>
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                                
                                                {q.options && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                                        {q.options.map((opt: string, i: number) => (
                                                            <div key={i} className={cn(
                                                                "px-3 py-2 rounded-sm border text-xs font-medium",
                                                                q.correct_answer === opt ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-muted/5 border-border text-muted-foreground'
                                                            )}>
                                                                <span className="text-[10px] opacity-40 mr-1.5">{String.fromCharCode(65 + i)}</span> {opt}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center gap-3 pt-2 border-t border-border">
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-primary/5 text-primary text-[10px] font-medium border border-primary/10 tabular-nums">
                                                        {q.marks} marks
                                                    </span>
                                                    {q.correct_answer && (
                                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                            <span>Answer:</span>
                                                            <span className="font-medium text-foreground">{q.correct_answer}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-16 text-center">
                                    <HelpCircle className="size-8 text-muted-foreground/15 mx-auto mb-2" strokeWidth={1} />
                                    <h3 className="text-sm font-medium text-foreground">No Questions Found</h3>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-[280px] mx-auto">Add questions using the form or bulk import.</p>
                                </div>
                            )}
                            <div className="px-3 py-1.5 border-t border-border bg-muted/5">
                                <span className="text-[10px] text-muted-foreground">{filteredQuestions.length} of {exam.questions.length} questions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminExamQuestions.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Exams', href: '/admin/academic/exams' }, { title: 'Questions', href: '#' }]}>
        {page}
    </AppLayout>
);
