<?php

use App\Models\Course;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('student can pay for a workshop enrollment end to end', function () {
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
            'duration_hours' => 2,
            'starts_at' => now()->addDays(3)->toDateTimeString(),
            'topics' => ['Laravel', 'Inertia'],
            'venue' => 'Online',
            'capacity' => 50,
        ],
    ]);

    $student = User::factory()->create(['is_student' => true]);

    $this->actingAs($student)
        ->post(route('student.workshops.enroll', $workshop))
        ->assertRedirect(url("/workshops/{$workshop->slug}"));

    $enrollment = $student->enrollments()->where('course_id', $workshop->id)->first();

    expect($enrollment)->not->toBeNull();
    expect($enrollment->status)->toBe('pending');

    $this->actingAs($student)
        ->post(route('student.workshops.payment', $workshop), [
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
