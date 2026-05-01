<?php

use App\Models\Batch;
use App\Models\Course;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('student can pay for a workshop batch enrollment end to end', function () {
    $teacherUser = User::factory()->create(['is_teacher' => true]);
    $teacher = Teacher::factory()->create([
        'user_id' => $teacherUser->id,
        'commission_percent' => 50,
        'wallet_balance' => 0,
    ]);

    $workshop = Course::factory()->for($teacher)->create([
        'type' => 'workshop',
        'price' => 1499,
        'meta' => [
            'topics' => ['Laravel', 'Inertia'],
        ],
    ]);

    $batch = Batch::create([
        'course_id' => $workshop->id,
        'name' => 'Workshop Batch 1',
        'type' => 'online',
        'start_date' => now()->addDays(3)->toDateString(),
        'starts_at' => now()->addDays(3)->setTime(10, 0),
        'capacity' => 50,
        'meta' => [
            'duration_hours' => 2,
            'starts_at' => now()->addDays(3)->setTime(10, 0)->toDateTimeString(),
            'topics' => ['Laravel', 'Inertia'],
            'venue' => 'Online',
            'capacity' => 50,
        ],
    ]);

    $student = User::factory()->create(['is_student' => true]);

    $this->actingAs($student)
        ->post(route('student.workshops.enroll', $workshop), [
            'batch_id' => $batch->id,
        ])
        ->assertRedirect(url("/workshops/{$workshop->slug}"));

    $enrollment = $student->enrollments()->where('course_id', $workshop->id)->first();

    expect($enrollment)->not->toBeNull();
    expect($enrollment->status)->toBe('pending');
    expect($enrollment->batch_id)->toBe($batch->id);

    $this->actingAs($student)
        ->post(route('student.workshops.payment', $workshop), [
            'batch_id' => $batch->id,
            'razorpay_payment_id' => 'pay_test_123',
            'razorpay_order_id' => 'order_test_123',
            'razorpay_signature' => 'sig_test_123',
        ])
        ->assertRedirect(url("/workshops/{$workshop->slug}"));

    $enrollment->refresh();

    expect($enrollment->status)->toBe('paid');
    expect($enrollment->payment)->not->toBeNull();
    expect((float) $enrollment->payment->amount)->toBe(1499.0);
    expect($enrollment->payment->invoice)->not->toBeNull();
    expect((float) $teacher->fresh()->wallet_balance)->toBe(749.5);
});

test('student cannot enroll in a workshop batch within one hour of start', function () {
    $teacherUser = User::factory()->create(['is_teacher' => true]);
    $teacher = Teacher::factory()->create([
        'user_id' => $teacherUser->id,
        'commission_percent' => 50,
        'wallet_balance' => 0,
    ]);

    $workshop = Course::factory()->for($teacher)->create([
        'type' => 'workshop',
        'price' => 999,
        'meta' => [
            'topics' => ['Testing'],
        ],
    ]);

    $batch = Batch::create([
        'course_id' => $workshop->id,
        'name' => 'Closing Batch',
        'type' => 'online',
        'start_date' => now()->addMinutes(45)->toDateString(),
        'starts_at' => now()->addMinutes(45),
        'capacity' => 10,
        'meta' => [
            'duration_hours' => 2,
            'starts_at' => now()->addMinutes(45)->toDateTimeString(),
            'topics' => ['Testing'],
            'venue' => 'Online',
            'capacity' => 10,
        ],
    ]);

    $student = User::factory()->create(['is_student' => true]);

    $this->actingAs($student)
        ->post(route('student.workshops.enroll', $workshop), [
            'batch_id' => $batch->id,
        ])
        ->assertSessionHas('error');

    expect($student->enrollments()->count())->toBe(0);
});
