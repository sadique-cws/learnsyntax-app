import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Plus, Trash2, ChevronLeft, HelpCircle, FileJson, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

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
                onSuccess: () => {
                    setIsBulkOpen(false);
                    setJsonInput('');
                    setBulkProcessing(false);
                },
                onError: () => setBulkProcessing(false),
            });
        } catch (e) {
            alert('Invalid JSON format. Please check your input.');
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this question?')) {
            destroy(`/admin/academic/questions/${id}`);
        }
    };

    return (
        <>
            <Head title={`Questions: ${exam.title}`} />
            
            <div className="w-full p-4 lg:p-6">
                <div className="mb-8">
                    <Link href="/admin/academic/exams" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
                        <ChevronLeft className="size-4 mr-1" /> Back to Exams
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="text-[10px] font-medium text-primary mb-2 block">{exam.course.title}</span>
                            <h1 className="text-3xl font-medium tracking-tight leading-none">{exam.title}</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="rounded border-border bg-card">
                                        <FileJson className="size-4 mr-2" /> Bulk Import
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl rounded-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-medium">Bulk Question Import</DialogTitle>
                                        <p className="text-xs text-muted-foreground mt-1">Paste a JSON array of questions to import them all at once.</p>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-medium">JSON Data</Label>
                                            <Textarea 
                                                className="min-h-[300px] font-mono text-xs rounded-xl"
                                                placeholder={`[
  {
    "question_text": "What is React?",
    "options": ["Library", "Framework", "Language", "Database"],
    "correct_answer": "Library",
    "marks": 2
  }
]`}
                                                value={jsonInput}
                                                onChange={e => setJsonInput(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" onClick={() => setIsBulkOpen(false)} className="rounded-xl">Cancel</Button>
                                        <Button 
                                            onClick={handleBulkSubmit} 
                                            disabled={bulkProcessing || !jsonInput}
                                            className="rounded-xl px-8"
                                        >
                                            {bulkProcessing ? 'Importing...' : 'Start Import'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <div className="flex items-center gap-4 bg-muted/50 p-4 rounded border border-border/50">
                                <div className="text-right">
                                    <div className="text-[9px] font-medium text-muted-foreground">Total Questions</div>
                                    <div className="text-xl font-medium text-foreground">{exam.questions.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Question Form */}
                    <div className="lg:col-span-1">
                        <Card className="border-border rounded bg-card sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-lg font-medium">Add New Question</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium">Question Text</Label>
                                        <Textarea 
                                            required 
                                            className="rounded border-border min-h-[100px]"
                                            value={data.question_text}
                                            onChange={e => setData('question_text', e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium">Options (MCQ)</Label>
                                        {data.options.map((option, index) => (
                                            <Input 
                                                key={index}
                                                placeholder={`Option ${index + 1}`}
                                                className="rounded border-border h-9 text-sm"
                                                value={option}
                                                onChange={e => {
                                                    const newOptions = [...data.options];
                                                    newOptions[index] = e.target.value;
                                                    setData('options', newOptions);
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-medium">Correct Answer</Label>
                                            <Input 
                                                placeholder="e.g. Option 1"
                                                className="rounded border-border h-10"
                                                value={data.correct_answer}
                                                onChange={e => setData('correct_answer', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-medium">Marks</Label>
                                            <Input 
                                                type="number"
                                                required
                                                className="rounded border-border h-10"
                                                value={data.marks}
                                                onChange={e => setData('marks', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={processing} className="w-full h-11 rounded font-medium text-sm mt-2">
                                        {processing ? 'Adding...' : 'Add Question'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Questions List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-sm font-medium text-muted-foreground ml-1">Exam Paper</h2>
                        {exam.questions.length > 0 ? exam.questions.map((q: any, index: number) => (
                            <Card key={q.id} className="border-border rounded bg-card hover:border-primary/20 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="size-8 rounded bg-muted flex items-center justify-center shrink-0 border border-border">
                                                <span className="text-xs font-medium">{index + 1}</span>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-sm font-medium leading-relaxed">{q.question_text}</p>
                                                
                                                {q.options && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {q.options.map((opt: string, i: number) => (
                                                            <div key={i} className={`px-3 py-2 rounded border text-xs font-medium ${q.correct_answer === opt ? 'bg-green-50 border-green-100 text-green-700' : 'bg-muted/30 border-border text-muted-foreground'}`}>
                                                                {opt}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center gap-4 text-[10px] font-medium text-muted-foreground">
                                                    <span className="px-2 py-0.5 bg-primary/5 text-primary rounded border border-primary/10">{q.marks} Marks</span>
                                                    {q.correct_answer && <span>Correct: <span className="text-foreground">{q.correct_answer}</span></span>}
                                                </div>
                                            </div>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                                            onClick={() => handleDelete(q.id)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <div className="py-24 text-center border border-dashed border-border bg-card rounded">
                                <HelpCircle className="size-12 text-muted-foreground/20 mx-auto mb-4" />
                                <p className="text-sm text-muted-foreground font-medium">No questions added yet.</p>
                                <p className="text-[10px] text-muted-foreground mt-1">Use the form on the left to start building the exam.</p>
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
