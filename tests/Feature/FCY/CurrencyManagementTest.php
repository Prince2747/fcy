<?php

namespace Tests\Feature\FCY;

use App\Models\Currency;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CurrencyManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::factory()->create();
        $this->actingAs($user);
    }

    public function test_can_view_currencies_index(): void
    {
        Currency::factory()->count(3)->create();

        $response = $this->get('/fcy/settings/currencies');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('fcy/settings/currencies/index')
            ->has('currencies.data', 3)
        );
    }

    public function test_can_search_currencies(): void
    {
        Currency::create(['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$']);
        Currency::create(['code' => 'EUR', 'name' => 'Euro', 'symbol' => '€']);

        $response = $this->get('/fcy/settings/currencies?search=USD');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('currencies.data', 1)
            ->where('currencies.data.0.code', 'USD')
        );
    }

    public function test_can_create_currency(): void
    {
        $currencyData = [
            'code' => 'GBP',
            'name' => 'British Pound',
            'symbol' => '£',
        ];

        $response = $this->post('/fcy/settings/currencies', $currencyData);

        $response->assertRedirect('/fcy/settings/currencies');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('currencies', $currencyData);
    }

    public function test_cannot_create_currency_with_duplicate_code(): void
    {
        Currency::create(['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$']);

        $response = $this->post('/fcy/settings/currencies', [
            'code' => 'USD',
            'name' => 'US Dollar Duplicate',
            'symbol' => '$',
        ]);

        $response->assertSessionHasErrors('code');
    }

    public function test_can_update_currency(): void
    {
        $currency = Currency::create(['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$']);

        $response = $this->put("/fcy/settings/currencies/{$currency->id}", [
            'code' => 'USD',
            'name' => 'US Dollar Updated',
            'symbol' => '$',
        ]);

        $response->assertRedirect('/fcy/settings/currencies');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('currencies', [
            'id' => $currency->id,
            'name' => 'US Dollar Updated',
        ]);
    }

    public function test_currency_cannot_be_deleted(): void
    {
        $currency = Currency::create(['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$']);

        $response = $this->delete("/fcy/settings/currencies/{$currency->id}");

        $response->assertMethodNotAllowed();

        $this->assertDatabaseHas('currencies', ['id' => $currency->id]);
    }
}
