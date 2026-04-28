<?php

namespace Database\Factories;

use App\Models\Setting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Setting>
 */
class SettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_name' => 'Learn Syntax Academy',
            'company_address' => 'Test Address, Raipur, Chhattisgarh',
            'company_gstin' => '22AAAAA0000A1Z5',
            'company_state' => 'Chhattisgarh',
            'company_state_code' => '22',
            'company_email' => 'support@learnsyntax.com',
            'company_phone' => '1234567890',
            'bank_name' => 'SBI',
            'bank_account_no' => '123456789012',
            'bank_ifsc' => 'SBIN0000001',
            'bank_branch' => 'Raipur',
        ];
    }
}
