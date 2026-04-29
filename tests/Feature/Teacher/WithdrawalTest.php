<?php

namespace Tests\Feature\Teacher;

use App\Models\Teacher;
use App\Models\User;
use App\Models\WithdrawalRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WithdrawalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create(['is_teacher' => true]);
        $this->teacher = Teacher::factory()->create(['user_id' => $this->user->id, 'wallet_balance' => 5000]);
        $this->admin = User::factory()->create(['is_admin' => true]);
    }

    public function test_teacher_can_view_wallet(): void
    {
        $response = $this->actingAs($this->user)->get(route('teacher.wallet'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('teacher/wallet/index'));
    }

    public function test_teacher_can_request_withdrawal(): void
    {
        $response = $this->actingAs($this->user)->post(route('teacher.wallet.withdraw'), [
            'amount' => 1000,
            'bank_name' => 'State Bank',
            'account_number' => '1234567890',
            'ifsc_code' => 'SBI0012345',
            'account_holder_name' => 'John Doe',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('withdrawal_requests', [
            'teacher_id' => $this->teacher->id,
            'amount' => 1000,
            'status' => 'pending',
        ]);
    }

    public function test_admin_can_approve_withdrawal_and_deduct_balance(): void
    {
        $withdrawal = WithdrawalRequest::factory()->create([
            'teacher_id' => $this->teacher->id,
            'amount' => 2000,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.withdrawals.status', $withdrawal), [
            'status' => 'approved',
            'admin_notes' => 'Paid successfully',
        ]);

        $response->assertRedirect();
        $this->assertEquals('approved', $withdrawal->fresh()->status);
        $this->assertEquals(3000, $this->teacher->fresh()->wallet_balance);
        $this->assertDatabaseHas('wallet_transactions', [
            'teacher_id' => $this->teacher->id,
            'amount' => 2000,
            'type' => 'debit',
        ]);
    }

    public function test_admin_cannot_approve_if_insufficient_balance(): void
    {
        $this->teacher->update(['wallet_balance' => 500]);

        $withdrawal = WithdrawalRequest::factory()->create([
            'teacher_id' => $this->teacher->id,
            'amount' => 1000,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.withdrawals.status', $withdrawal), [
            'status' => 'approved',
        ]);

        $response->assertSessionHasErrors(['amount']);
        $this->assertEquals('pending', $withdrawal->fresh()->status);
        $this->assertEquals(500, $this->teacher->fresh()->wallet_balance);
    }
}
