<?php

namespace Database\Seeders;

use App\Models\Batch;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\CourseChapter;
use App\Models\DailyLearningLog;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProgressLogSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Promote Student 4 to Teacher
        $user = User::updateOrCreate(
            ['email' => 'student4@example.com'],
            [
                'name' => 'Student 4',
                'password' => Hash::make('password'),
                'is_teacher' => true,
            ]
        );

        $teacher = Teacher::updateOrCreate(
            ['user_id' => $user->id],
            [
                'commission_percent' => 70.00,
                'wallet_balance' => 0.00,
                'kyc_status' => 'approved',
            ]
        );

        // 2. Add a Course for this teacher
        $course = Course::updateOrCreate(
            ['slug' => 'practical-logic-and-syntax'],
            [
                'teacher_id' => $teacher->id,
                'title' => 'Practical Logic & Syntax',
                'description' => 'A masterclass on programming logic and syntax patterns.',
                'price' => 4999.00,
                'is_active' => true,
            ]
        );

        // 3. Add Chapters and Modules
        $module = CourseModule::updateOrCreate(
            ['course_id' => $course->id, 'title' => 'Phase 1: Foundations'],
            ['sort_order' => 1]
        );

        $chapters = [
            'Introduction to Syntax Structures',
            'Variable Lifecycles & Memory',
            'Conditional Flow Control',
            'Iteration and Recursion Patterns',
        ];

        $chapterModels = [];
        foreach ($chapters as $index => $title) {
            $chapterModels[] = CourseChapter::updateOrCreate(
                ['course_module_id' => $module->id, 'title' => $title],
                ['sort_order' => $index + 1, 'description' => "Deep dive into $title"]
            );
        }

        // 4. Create a Batch for this course
        $batch = Batch::updateOrCreate(
            ['course_id' => $course->id, 'name' => 'Batch Alpha'],
            [
                'type' => 'online',
                'start_date' => now()->subDays(10),
                'capacity' => 50,
                'is_active' => true,
            ]
        );

        // 5. Add Daily Logs
        $logs = [
            ['date' => now()->subDays(4), 'chapter' => $chapterModels[0], 'remarks' => 'Introduced the core concept of syntax vs logic. Students understood the difference between compilation and execution.'],
            ['date' => now()->subDays(3), 'chapter' => $chapterModels[1], 'remarks' => 'Explained stack vs heap. Conducted a live debug session on memory leaks.'],
            ['date' => now()->subDays(2), 'chapter' => $chapterModels[2], 'remarks' => 'Covered nested conditionals and guard clauses. Optimization of if-else ladders.'],
            ['date' => now()->subDays(1), 'chapter' => $chapterModels[3], 'remarks' => 'Loops and higher-order functions. Most students cleared the recursion challenge.'],
        ];

        foreach ($logs as $log) {
            DailyLearningLog::updateOrCreate(
                [
                    'batch_id' => $batch->id,
                    'course_chapter_id' => $log['chapter']->id,
                    'date' => $log['date']->format('Y-m-d'),
                ],
                [
                    'teacher_id' => $teacher->id,
                    'remarks' => $log['remarks'],
                ]
            );
        }
    }
}
