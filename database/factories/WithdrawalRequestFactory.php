<?php

namespace Database\Factories;

use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

class WithdrawalRequestFactory extends Factory
{
    public function definition(): array
    {
        return [
            'teacher_id' => Teacher::factory(),
            'amount' => 1000,
            'bank_name' => $this->faker->company,
            'account_number' => $this->faker->bankAccountNumber,
            'ifsc_code' => 'IFSC0123456',
            'account_holder_name' => $this->faker->name,
            'status' => 'pending',
        ];
    }
}
