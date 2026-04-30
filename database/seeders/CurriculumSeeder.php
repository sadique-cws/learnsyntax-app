<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\CourseChapter;
use Illuminate\Database\Seeder;

class CurriculumSeeder extends Seeder
{
    public function run(): void
    {
        $curriculum = [
            'full-stack-laravel-mastery' => [
                'Module 1: Getting Started with Laravel' => [
                    ['title' => 'Installation and Configuration', 'description' => 'Setting up the development environment.'],
                    ['title' => 'Routing and Controllers', 'description' => 'Defining web and API routes.'],
                    ['title' => 'Blade Templating Engine', 'description' => 'Creating dynamic views.'],
                ],
                'Module 2: Database and Eloquent' => [
                    ['title' => 'Migrations and Schema', 'description' => 'Designing the database structure.'],
                    ['title' => 'Eloquent Models and Relationships', 'description' => 'Working with related data.'],
                    ['title' => 'Factories and Seeders', 'description' => 'Generating test data.'],
                ],
                'Module 3: Frontend Integration' => [
                    ['title' => 'Inertia.js Basics', 'description' => 'The glue between Laravel and React.'],
                    ['title' => 'React Component Architecture', 'description' => 'Building reusable UI units.'],
                    ['title' => 'State Management', 'description' => 'Handling application data flow.'],
                ],
            ],
            'python-for-data-science' => [
                'Module 1: Python Essentials' => [
                    ['title' => 'Data Types and Structures', 'description' => 'Lists, Dictionaries, and Sets.'],
                    ['title' => 'Control Flow and Functions', 'description' => 'Loops and logic blocks.'],
                ],
                'Module 2: Data Manipulation with Pandas' => [
                    ['title' => 'DataFrames and Series', 'description' => 'The core data structures.'],
                    ['title' => 'Data Cleaning Techniques', 'description' => 'Handling missing values.'],
                ],
            ],
            'advanced-react-patterns' => [
                'Module 1: Advanced Hooks' => [
                    ['title' => 'useMemo and useCallback', 'description' => 'Optimizing performance.'],
                    ['title' => 'Custom Hooks', 'description' => 'Abstracting logic.'],
                ],
            ]
        ];

        foreach ($curriculum as $slug => $modules) {
            $course = Course::where('slug', $slug)->first();
            
            if (!$course) continue;

            $mOrder = 0;
            foreach ($modules as $moduleTitle => $chapters) {
                $module = $course->modules()->create([
                    'title' => $moduleTitle,
                    'sort_order' => $mOrder++
                ]);

                $cOrder = 0;
                foreach ($chapters as $chapterData) {
                    $module->chapters()->create([
                        'title' => $chapterData['title'],
                        'description' => $chapterData['description'],
                        'sort_order' => $cOrder++
                    ]);
                }
            }
        }
    }
}
