<?php

namespace Tests\Feature\Admin;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['is_admin' => true]);
    }

    public function test_admin_can_view_teachers_index(): void
    {
        Teacher::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->get(route('admin.teachers.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('admin/teachers/index'));
    }

    public function test_admin_can_onboard_teacher(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->admin)->post(route('admin.teachers.store'), [
            'user_id' => $user->id,
            'commission_percent' => 30,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('teachers', [
            'user_id' => $user->id,
            'commission_percent' => 30,
        ]);
        $this->assertTrue($user->fresh()->is_teacher);
    }

    public function test_admin_can_update_commission(): void
    {
        $teacher = Teacher::factory()->create(['commission_percent' => 20]);

        $response = $this->actingAs($this->admin)->put(route('admin.teachers.update', $teacher), [
            'commission_percent' => 45,
        ]);

        $response->assertRedirect();
        $this->assertEquals(45, $teacher->fresh()->commission_percent);
    }

    public function test_admin_can_login_as_teacher(): void
    {
        $teacher = Teacher::factory()->create();

        $response = $this->actingAs($this->admin)->post(route('admin.teachers.login-as', $teacher));

        $response->assertRedirect(route('teacher.dashboard'));
        $this->assertEquals($teacher->user_id, auth()->id());
    }
}
