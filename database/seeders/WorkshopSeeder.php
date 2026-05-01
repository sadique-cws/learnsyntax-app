<?php

namespace Database\Seeders;

use App\Models\Batch;
use App\Models\Course;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class WorkshopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a teacher for workshops
        $teacherUser = User::updateOrCreate(
            ['email' => 'teacher@learnsyntax.com'],
            [
                'name' => 'Teacher User',
                'password' => Hash::make('password'),
                'is_admin' => false,
                'is_teacher' => true,
            ]
        );

        $teacher = Teacher::updateOrCreate(
            ['user_id' => $teacherUser->id],
            [
                'commission_percent' => 80.00,
                'wallet_balance' => 5000.00,
            ]
        );

        $workshops = [
            [
                'title' => 'React Hooks Deep Dive',
                'description' => 'Master React hooks and functional component patterns.',
                'fee' => 2999.00,
                'duration_hours' => 16.0,
                'starts_at' => now()->addDays(5)->toDateString(),
                'topics' => 'useState, useEffect, useContext, useReducer, Custom Hooks',
                'venue' => 'Mumbai Tech Hub, Building A, 3rd Floor',
                'capacity' => 30,
            ],
            [
                'title' => 'Laravel Security Best Practices',
                'description' => 'Learn how to secure your Laravel applications against common vulnerabilities.',
                'fee' => 3499.00,
                'duration_hours' => 20.0,
                'starts_at' => now()->addDays(10)->toDateString(),
                'topics' => 'CSRF Protection, SQL Injection, XSS, Authentication, Authorization, CORS',
                'venue' => 'Bangalore Innovation Park, Tower 5',
                'capacity' => 25,
            ],
            [
                'title' => 'Database Optimization & Query Tuning',
                'description' => 'Learn techniques to optimize database queries and improve application performance.',
                'fee' => 2499.00,
                'duration_hours' => 12.0,
                'starts_at' => now()->addDays(15)->toDateString(),
                'topics' => 'Indexes, Query Optimization, N+1 Problems, Caching Strategies',
                'venue' => 'Delhi Business Center, New Delhi',
                'capacity' => 40,
            ],
            [
                'title' => 'Full Stack Testing: Unit, Integration & E2E',
                'description' => 'Comprehensive guide to testing modern full-stack applications.',
                'fee' => 3999.00,
                'duration_hours' => 24.0,
                'starts_at' => now()->addDays(20)->toDateString(),
                'topics' => 'Pest, PHPUnit, Vitest, Playwright, Test Driven Development',
                'venue' => 'Online Virtual Classroom',
                'capacity' => 50,
            ],
        ];

        foreach ($workshops as $workshopData) {
            // Create workshop as Course record with type='workshop'
            $workshop = $teacher->courses()->create([
                'title' => $workshopData['title'],
                'slug' => Str::slug($workshopData['title']).'-'.uniqid(),
                'type' => 'workshop',
                'description' => $workshopData['description'],
                'price' => $workshopData['fee'],
                'meta' => null,
                'is_active' => true,
            ]);

            // Create initial batch with meta containing workshop details
            Batch::create([
                'course_id' => $workshop->id,
                'name' => $workshopData['title'].' - Batch 1',
                'type' => 'online',
                'start_date' => $workshopData['starts_at'],
                'capacity' => $workshopData['capacity'],
                'meta' => [
                    'duration_hours' => (float) $workshopData['duration_hours'],
                    'starts_at' => $workshopData['starts_at'],
                    'topics' => array_map('trim', explode(',', $workshopData['topics'])),
                    'venue' => $workshopData['venue'],
                    'capacity' => $workshopData['capacity'],
                ],
            ]);

            // Create a second batch for each workshop
            Batch::create([
                'course_id' => $workshop->id,
                'name' => $workshopData['title'].' - Batch 2',
                'type' => 'offline',
                'start_date' => now()->addDays(30)->toDateString(),
                'capacity' => $workshopData['capacity'],
                'meta' => [
                    'duration_hours' => (float) $workshopData['duration_hours'],
                    'starts_at' => now()->addDays(30)->toDateString(),
                    'topics' => array_map('trim', explode(',', $workshopData['topics'])),
                    'venue' => 'Additional venue - TBA',
                    'capacity' => $workshopData['capacity'],
                ],
            ]);
        }
    }
}
