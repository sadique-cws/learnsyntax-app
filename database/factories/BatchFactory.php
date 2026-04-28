<?php

namespace Database\Factories;

use App\Models\Batch;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Batch>
 */
class BatchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'course_id' => Course::factory(),
            'name' => 'Batch '.fake()->word(),
            'type' => 'online',
            'start_date' => now()->addDays(7),
            'capacity' => 50,
            'is_active' => true,
        ];
    }
}
