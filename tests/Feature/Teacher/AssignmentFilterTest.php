<?php

use App\Models\Batch;
use App\Models\Course;
use App\Models\Teacher;
use App\Models\User;

use function Pest\Laravel\actingAs;

it('filters teacher assignment batches by course type', function () {
    $user = User::factory()->create(['is_teacher' => true]);
    $teacher = Teacher::factory()->create(['user_id' => $user->id]);

    $course = Course::factory()->for($teacher)->create([
        'type' => 'course',
        'title' => 'Laravel Course',
    ]);

    $workshop = Course::factory()->for($teacher)->create([
        'type' => 'workshop',
        'title' => 'React Workshop',
    ]);

    $courseBatch = Batch::factory()->create([
        'course_id' => $course->id,
        'name' => 'Course Batch',
    ]);

    $workshopBatch = Batch::factory()->create([
        'course_id' => $workshop->id,
        'name' => 'Workshop Batch',
    ]);

    actingAs($user)
        ->get(route('teacher.assignments.index', ['type' => 'course']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('teacher/assignments/index')
            ->where('selectedType', 'course')
            ->has('batches', 1)
            ->where('batches.0.id', $courseBatch->id)
        );

    actingAs($user)
        ->get(route('teacher.assignments.index', ['type' => 'workshop']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('teacher/assignments/index')
            ->where('selectedType', 'workshop')
            ->has('batches', 1)
            ->where('batches.0.id', $workshopBatch->id)
        );
});
