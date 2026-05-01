<?php

namespace Database\Factories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'slug' => str()->slug(fake()->sentence(3)),
            'type' => 'course',
            'description' => fake()->paragraph(),
            'price' => 1000,
            'meta' => null,
            'is_active' => true,
        ];
    }
}
