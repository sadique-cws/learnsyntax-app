<?php

namespace Tests\Feature\Admin;

use App\Models\Batch;
use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['is_admin' => true]);
    }

    public function test_admin_can_update_student_profile()
    {
        $student = User::factory()->create(['is_admin' => false]);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.students.update', $student), [
                'name' => 'Updated Name',
                'email' => 'updated@example.com',
                'phone' => '1234567890',
                'qualification' => 'Master of Computer Applications',
            ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('users', [
            'id' => $student->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'qualification' => 'Master of Computer Applications',
        ]);
    }

    public function test_admin_can_manually_enroll_student()
    {
        $student = User::factory()->create(['is_admin' => false]);
        $course = Course::factory()->create(['price' => 5000]);
        $batch = Batch::factory()->create(['course_id' => $course->id]);

        $response = $this->actingAs($this->admin)
            ->post(route('admin.students.manual-enroll', $student), [
                'course_id' => $course->id,
                'batch_id' => $batch->id,
                'amount' => 5000,
                'payment_method' => 'cash',
                'transaction_id' => 'CASH-TEST',
            ]);

        $response->assertStatus(302);
        
        $this->assertDatabaseHas('enrollments', [
            'user_id' => $student->id,
            'course_id' => $course->id,
            'batch_id' => $batch->id,
        ]);

        $this->assertDatabaseHas('payments', [
            'amount' => 5000,
            'status' => 'completed',
            'transaction_id' => 'CASH-TEST',
        ]);

        $this->assertDatabaseHas('invoices', [
            'amount' => 5000,
        ]);
    }
}
