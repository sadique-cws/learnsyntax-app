<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Batch;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Payment;
use App\Models\User;
use App\Models\Teacher;
use App\Models\WalletTransaction;
use App\Models\WithdrawalRequest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Teacher User
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

        // 2. Create Withdrawal Requests for teacher testing
        WithdrawalRequest::create([
            'teacher_id' => $teacher->id,
            'amount' => 1500.00,
            'bank_name' => 'State Bank of India',
            'account_number' => '100020003000',
            'ifsc_code' => 'SBIN0001234',
            'account_holder_name' => 'Teacher User',
            'status' => 'approved',
            'admin_notes' => 'Processed on time.',
        ]);

        WithdrawalRequest::create([
            'teacher_id' => $teacher->id,
            'amount' => 2000.00,
            'bank_name' => 'State Bank of India',
            'account_number' => '100020003000',
            'ifsc_code' => 'SBIN0001234',
            'account_holder_name' => 'Teacher User',
            'status' => 'pending',
        ]);

        // Create a few more students
        $students = [];
        for ($i = 1; $i <= 10; $i++) {
            $students[] = User::updateOrCreate(
                ['email' => "student$i@example.com"],
                [
                    'name' => "Student $i",
                    'password' => Hash::make('password'),
                    'is_admin' => false,
                ]
            );
        }

        // 3. Get existing courses and batches (created by CourseSeeder)
        $courses = Course::all();
        if ($courses->isEmpty()) {
            $this->call(CourseSeeder::class);
            $courses = Course::all();
        }

        // Assign all courses to the teacher
        foreach ($courses as $course) {
            $course->update(['teacher_id' => $teacher->id]);

            // Create Exams for each course
            $exam = Exam::updateOrCreate(
                ['course_id' => $course->id],
                [
                    'title' => 'Final Assessment for '.$course->title,
                    'total_marks' => 100,
                    'is_active' => true,
                ]
            );

            $batches = $course->batches;
            foreach ($batches as $batch) {
                // Create Assignments for each batch
                $assignment1 = Assignment::create([
                    'batch_id' => $batch->id,
                    'title' => 'Basic Fundamentals - '.$batch->name,
                    'description' => 'Complete the basic exercises for '.$course->title,
                    'max_marks' => 100,
                    'due_date' => now()->addDays(14),
                ]);

                $assignment2 = Assignment::create([
                    'batch_id' => $batch->id,
                    'title' => 'Advanced Project - '.$batch->name,
                    'description' => 'Build a sample application using the concepts learned in '.$course->title,
                    'max_marks' => 100,
                    'due_date' => now()->addDays(30),
                ]);

                // Enroll students in these batches
                foreach ($students as $student) {
                    $enrollment = Enrollment::create([
                        'user_id' => $student->id,
                        'course_id' => $course->id,
                        'batch_id' => $batch->id,
                        'status' => 'paid',
                        'batch_type_preference' => $batch->type,
                    ]);

                    // Create Payments for these enrollments
                    $payment = Payment::create([
                        'enrollment_id' => $enrollment->id,
                        'amount' => $course->price,
                        'status' => 'paid',
                        'payment_method' => 'card',
                        'transaction_id' => 'TXN_'.uniqid(),
                        'currency' => 'INR',
                    ]);

                    // Create Invoices
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

                    // Seed wallet transactions for full tracking
                    $commissionAmount = ($course->price * $teacher->commission_percent) / 100;
                    WalletTransaction::create([
                        'teacher_id' => $teacher->id,
                        'amount' => $commissionAmount,
                        'type' => 'credit',
                        'description' => 'Commission from student purchase: '.$course->title,
                    ]);

                    // Add submissions & exam attempts to populate dashboard
                    AssignmentSubmission::create([
                        'assignment_id' => $assignment1->id,
                        'user_id' => $student->id,
                        'status' => 'graded',
                        'marks_obtained' => rand(70, 100),
                        'submitted_at' => now()->subDays(rand(1, 10)),
                    ]);

                    ExamAttempt::create([
                        'exam_id' => $exam->id,
                        'user_id' => $student->id,
                        'marks_obtained' => rand(60, 100),
                        'completed_at' => now()->subDays(rand(1, 5)),
                    ]);
                }
            }
        }
    }
}
