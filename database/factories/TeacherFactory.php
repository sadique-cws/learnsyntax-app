<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeacherFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'commission_percent' => 50,
            'wallet_balance' => 0,
        ];
    }
}
