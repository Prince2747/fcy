<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $branches = ['Addis Ababa Main', 'Bole', 'Merkato', 'Piassa', 'Kazanchis', 'CMC', 'Bishoftu', 'Bahir Dar', 'Hawassa', 'Dire Dawa'];

        return [
            'branch' => $this->faker->randomElement($branches),
            'importer_name' => $this->faker->company(),
            'nbe_account_no' => 'NBE-'.strtoupper($this->faker->bothify('??##??##')),
            'tin_number' => $this->faker->numerify('####-####-####'),
            'status' => $this->faker->randomElement(['active', 'active', 'active', 'inactive']),
        ];
    }

    /**
     * Indicate that the customer is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the customer is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }
}
