<?php

namespace Tests\Feature\FCY;

use App\Models\PaymentMethod;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentMethodManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::factory()->create();
        $this->actingAs($user);
    }

    public function test_can_view_payment_methods_index(): void
    {
        PaymentMethod::factory()->count(3)->create();

        $response = $this->get('/fcy/settings/payment-methods');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('fcy/settings/payment-methods/index')
            ->has('paymentMethods.data', 3)
        );
    }

    public function test_can_search_payment_methods(): void
    {
        PaymentMethod::create(['name' => 'Letter of Credit', 'code' => 'LC']);
        PaymentMethod::create(['name' => 'Telegraphic Transfer', 'code' => 'TT']);

        $response = $this->get('/fcy/settings/payment-methods?search=Letter');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('paymentMethods.data', 1)
            ->where('paymentMethods.data.0.name', 'Letter of Credit')
        );
    }

    public function test_can_create_payment_method(): void
    {
        $response = $this->post('/fcy/settings/payment-methods', [
            'name' => 'Cash Against Documents',
            'code' => 'CAD',
        ]);

        $response->assertRedirect('/fcy/settings/payment-methods');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('payment_methods', [
            'name' => 'Cash Against Documents',
            'code' => 'CAD',
        ]);
    }

    public function test_can_create_payment_method_without_code(): void
    {
        $response = $this->post('/fcy/settings/payment-methods', [
            'name' => 'Cash in Advance',
        ]);

        $response->assertRedirect('/fcy/settings/payment-methods');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('payment_methods', [
            'name' => 'Cash in Advance',
            'code' => null,
        ]);
    }

    public function test_cannot_create_payment_method_with_duplicate_code(): void
    {
        PaymentMethod::create(['name' => 'Letter of Credit', 'code' => 'LC']);

        $response = $this->post('/fcy/settings/payment-methods', [
            'name' => 'Another LC',
            'code' => 'LC',
        ]);

        $response->assertSessionHasErrors('code');
    }

    public function test_can_update_payment_method(): void
    {
        $method = PaymentMethod::create(['name' => 'Letter of Credit', 'code' => 'LC']);

        $response = $this->put("/fcy/settings/payment-methods/{$method->id}", [
            'name' => 'Letter of Credit Updated',
            'code' => 'LC',
        ]);

        $response->assertRedirect('/fcy/settings/payment-methods');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('payment_methods', [
            'id' => $method->id,
            'name' => 'Letter of Credit Updated',
        ]);
    }

    public function test_payment_method_cannot_be_deleted(): void
    {
        $method = PaymentMethod::create(['name' => 'Letter of Credit', 'code' => 'LC']);

        $response = $this->delete("/fcy/settings/payment-methods/{$method->id}");

        $response->assertMethodNotAllowed();

        $this->assertDatabaseHas('payment_methods', ['id' => $method->id]);
    }
}
