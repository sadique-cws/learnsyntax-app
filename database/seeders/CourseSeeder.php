<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            [
                'title' => 'Full Stack Laravel Mastery',
                'slug' => 'full-stack-laravel-mastery',
                'description' => 'Learn to build modern web applications with Laravel, Inertia, and React.',
                'price' => 499.00,
                'is_active' => true,
            ],
            [
                'title' => 'Python for Data Science',
                'slug' => 'python-for-data-science',
                'description' => 'Master Python and its libraries for data analysis and machine learning.',
                'price' => 399.00,
                'is_active' => true,
            ],
            [
                'title' => 'Advanced React Patterns',
                'slug' => 'advanced-react-patterns',
                'description' => 'Deep dive into React hooks, context, and performance optimization.',
                'price' => 299.00,
                'is_active' => true,
            ],
        ];

        foreach ($courses as $courseData) {
            $course = \App\Models\Course::create($courseData);

            // Online Batch
            \App\Models\Batch::create([
                'course_id' => $course->id,
                'name' => 'Online Evening Batch',
                'type' => 'online',
                'start_date' => now()->addDays(7),
                'capacity' => 50,
            ]);

            // Offline Batch
            \App\Models\Batch::create([
                'course_id' => $course->id,
                'name' => 'Offline Weekend Batch',
                'type' => 'offline',
                'start_date' => now()->addDays(14),
                'capacity' => 20,
            ]);
        }

        // Create Admin User
        \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin@learnsyntax.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'is_admin' => true,
        ]);

        // Create Student User
        \App\Models\User::create([
            'name' => 'Student User',
            'email' => 'student@learnsyntax.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'is_admin' => false,
        ]);
    }
}
