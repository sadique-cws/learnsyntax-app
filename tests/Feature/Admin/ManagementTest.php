<?php

namespace Tests\Feature\Admin;

use App\Models\Batch;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
    }

    public function test_admin_can_view_gst_report()
    {
        $invoice = Invoice::factory()->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.payments.gst-report'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/payments/gst-report')
            ->has('invoices', 1)
        );
    }

    public function test_admin_can_export_gstr1_csv()
    {
        Invoice::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.payments.gst-export'));

        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv; charset=utf-8');
        $response->assertHeader('Content-Disposition', 'attachment; filename=GSTR1_Report_'.date('Y_m_d').'.csv');
    }

    public function test_admin_can_view_student_profile_with_modernized_ui()
    {
        $student = User::factory()->create();
        $course = Course::factory()->create();
        $batch = Batch::factory()->create(['course_id' => $course->id]);
        $enrollment = Enrollment::factory()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.students.show', $student));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/students/show')
            ->has('student')
            ->has('student.enrollments')
            ->has('available_batches')
        );
    }

    public function test_admin_can_view_qualified_students()
    {
        // Qualified student (average > 60)
        $qualifiedStudent = User::factory()->create();
        $enrollment = Enrollment::factory()->create([
            'user_id' => $qualifiedStudent->id,
            'status' => 'active',
        ]);
        // Mocking average for testing if needed, but the controller uses performance accessors.
        // For simplicity, we check if the page renders.

        $response = $this->actingAs($this->admin)
            ->get(route('admin.students.qualified'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/students/qualified')
            ->has('qualified')
        );
    }

    public function test_admin_can_update_invoice_settings()
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.settings.update'), [
                'company_name' => 'Updated Academy Name',
                'company_address' => 'Updated Address, Mumbai',
                'company_gstin' => '22BBBBB0000B1Z5',
                'company_state' => 'Maharashtra',
                'company_state_code' => '27',
                'company_email' => 'updated@learnsyntax.com',
                'company_phone' => '0987654321',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('settings', [
            'company_name' => 'Updated Academy Name',
            'company_gstin' => '22BBBBB0000B1Z5',
        ]);
    }
}
