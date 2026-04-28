<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExamQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $exams = \App\Models\Exam::all();
        $topics = ['PHP', 'Laravel', 'React', 'TypeScript', 'Tailwind', 'SQL', 'Git', 'Docker'];

        foreach ($exams as $exam) {
            $currentCount = $exam->questions()->count();
            $needed = 50 - $currentCount;

            if ($needed <= 0) continue;

            for ($i = 1; $i <= $needed; $i++) {
                $topic = $topics[array_rand($topics)];
                $exam->questions()->create([
                    'question_text' => "What is " . $topic . " Question #" . ($currentCount + $i) . "?",
                    'options' => [
                        "Option A for " . $topic,
                        "Option B for " . $topic,
                        "Option C for " . $topic,
                        "Option D for " . $topic
                    ],
                    'correct_answer' => "Option A for " . $topic,
                    'marks' => rand(1, 4),
                ]);
            }
        }
    }
}
