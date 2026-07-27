<?php

namespace Database\Factories;

use App\Models\FcyRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FcyRequest>
 */
class FcyRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'request_number' => 'GDA-FCY-' . fake()->unique()->numerify('0000000000'),
            'customer_id' => \App\Models\Customer::factory(),
            'proforma_invoice_number' => fake()->numerify('PI-########'),
            'proforma_invoice_date' => fake()->date(),
            'payment_method_id' => \App\Models\PaymentMethod::factory(),
            'currency_id' => \App\Models\Currency::factory(),
            'fcy_amount_requested' => fake()->randomFloat(2, 1000, 100000),
            'total_amount_in_usd' => fake()->randomFloat(2, 1000, 100000),
            'importing_items' => fake()->sentence(),
            'supplier_country' => fake()->country(),
            'status' => FcyRequest::STATUS_DRAFT,
            'maker_id' => '1',
        ];
    }
}
