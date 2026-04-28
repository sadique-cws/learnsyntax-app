<?php

namespace Tests\Feature\Admin;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['is_admin' => true]);
    }

    public function test_admin_can_view_courses_index()
    {
        Course::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.courses.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/courses/index')
            ->has('courses', 3)
        );
    }

    public function test_admin_can_create_course()
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.courses.store'), [
                'title' => 'New Course',
                'description' => 'Course Description',
                'price' => 1000,
            ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('courses', [
            'title' => 'New Course',
            'price' => 1000,
        ]);
    }

    public function test_admin_can_update_course()
    {
        $course = Course::factory()->create();

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.courses.update', $course), [
                'title' => 'Updated Title',
                'description' => 'Updated Description',
                'price' => 2000,
                'is_active' => false,
            ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('courses', [
            'id' => $course->id,
            'title' => 'Updated Title',
            'is_active' => false,
        ]);
    }

    public function test_admin_can_delete_course()
    {
        $course = Course::factory()->create();

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.courses.destroy', $course));

        $response->assertStatus(302);
        $this->assertDatabaseMissing('courses', [
            'id' => $course->id,
        ]);
    }
}
