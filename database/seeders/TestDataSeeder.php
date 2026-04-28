<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\Batch;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create a few more students
        $students = [];
        for ($i = 1; $i <= 5; $i++) {
            $students[] = User::updateOrCreate(
                ['email' => "student$i@example.com"],
                [
                    'name' => "Student $i",
                    'password' => Hash::make('password'),
                    'is_admin' => false,
                ]
            );
        }

        // 2. Get existing courses and batches (created by CourseSeeder)
        $courses = Course::all();
        if ($courses->isEmpty()) {
            $this->call(CourseSeeder::class);
            $courses = Course::all();
        }

        foreach ($courses as $course) {
            // 3. Create Exams for each course
            $exam = Exam::create([
                'course_id' => $course->id,
                'title' => 'Final Assessment for '.$course->title,
                'total_marks' => 100,
                'is_active' => true,
            ]);

            $midterm = Exam::create([
                'course_id' => $course->id,
                'title' => 'Midterm Quiz - '.$course->title,
                'total_marks' => 50,
                'is_active' => true,
            ]);

            $batches = $course->batches;
            foreach ($batches as $batch) {
                // 4. Create Assignments for each batch
                Assignment::create([
                    'batch_id' => $batch->id,
                    'title' => 'Basic Fundamentals - '.$batch->name,
                    'description' => 'Complete the basic exercises for '.$course->title,
                    'max_marks' => 100,
                    'due_date' => now()->addDays(14),
                ]);

                Assignment::create([
                    'batch_id' => $batch->id,
                    'title' => 'Advanced Project - '.$batch->name,
                    'description' => 'Build a sample application using the concepts learned in '.$course->title,
                    'max_marks' => 100,
                    'due_date' => now()->addDays(30),
                ]);

                // 5. Enroll some students in these batches
                foreach (array_slice($students, 0, 2) as $student) {
                    $enrollment = Enrollment::create([
                        'user_id' => $student->id,
                        'course_id' => $course->id,
                        'batch_id' => $batch->id,
                        'status' => 'paid',
                        'batch_type_preference' => $batch->type,
                    ]);

                    // 6. Create Payments for these enrollments
                    $payment = Payment::create([
                        'enrollment_id' => $enrollment->id,
                        'amount' => $course->price,
                        'status' => 'paid',
                        'payment_method' => 'card',
                        'transaction_id' => 'TXN_'.uniqid(),
                        'currency' => 'INR',
                    ]);

                    // 7. Create Invoices for these payments (to populate GST report)
                    $taxableAmount = round($payment->amount / 1.18, 2);
                    $gstAmount = round($payment->amount - $taxableAmount, 2);
                    $splitGst = round($gstAmount / 2, 2);

                    $payment->invoice()->create([
                        'invoice_number' => 'INV-'.strtoupper(str()->random(8)),
                        'amount' => $payment->amount,
                        'taxable_amount' => $taxableAmount,
                        'cgst' => $splitGst,
                        'sgst' => $splitGst,
                        'igst' => 0,
                        'sac_code' => '9992',
                        'status' => 'paid',
                        'issued_at' => now(),
                    ]);
                }
            }
        }
    }
}
