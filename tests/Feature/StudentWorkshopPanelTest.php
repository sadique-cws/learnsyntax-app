<?php

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Teacher;
use App\Models\User;

use function Pest\Laravel\actingAs;

it('shows only enrolled workshops in the student workshop panel', function () {
    $teacherUser = User::factory()->create(['is_teacher' => true]);
    $teacher = Teacher::factory()->create([
        'user_id' => $teacherUser->id,
        'commission_percent' => 50,
        'wallet_balance' => 0,
    ]);

    $paidWorkshop = Course::factory()->for($teacher)->create([
        'title' => 'Paid Workshop',
        'type' => 'workshop',
        'price' => 999,
        'meta' => [
            'duration_hours' => 2,
            'starts_at' => now()->addDays(2)->toDateTimeString(),
            'topics' => ['Topic A'],
            'venue' => 'Online',
            'capacity' => 25,
        ],
    ]);

    $otherWorkshop = Course::factory()->for($teacher)->create([
        'title' => 'Other Workshop',
        'type' => 'workshop',
        'price' => 799,
        'meta' => [
            'duration_hours' => 2,
            'starts_at' => now()->addDays(3)->toDateTimeString(),
            'topics' => ['Topic B'],
            'venue' => 'Online',
            'capacity' => 25,
        ],
    ]);

    $student = User::factory()->create(['is_student' => true]);

    Enrollment::create([
        'course_id' => $paidWorkshop->id,
        'user_id' => $student->id,
        'status' => 'paid',
    ]);

    actingAs($student)
        ->get(route('student.academic.workshops'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('student/academic/my-workshops')
            ->has('workshopEnrollments', 1)
        );

    expect($student->enrollments()->where('status', 'paid')->count())->toBe(1);
    expect($student->enrollments()->where('status', 'paid')->first()->course_id)->toBe($paidWorkshop->id);
    expect($otherWorkshop->id)->not->toBe($paidWorkshop->id);
});
