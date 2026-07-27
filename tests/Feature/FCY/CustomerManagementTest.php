<?php

namespace Tests\Feature\FCY;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    public function test_can_view_dashboard(): void
    {
        Customer::factory()->count(3)->create();

        $response = $this->get(route('fcy.dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('fcy/dashboard'));
    }

    public function test_dashboard_shows_correct_stats(): void
    {
        Customer::factory()->count(2)->create();
        Customer::factory()->active()->count(1)->create();
        Customer::factory()->inactive()->count(1)->create();

        $response = $this->get(route('fcy.dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('stats'));
    }

    public function test_can_search_customers_by_name(): void
    {
        Customer::factory()->create(['importer_name' => 'Alpha Trading']);
        Customer::factory()->create(['importer_name' => 'Beta Importers']);

        $response = $this->get(route('fcy.customers.index', ['search' => 'Alpha']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('customers.data', 1));
    }

    public function test_can_filter_customers_by_branch(): void
    {
        Customer::factory()->create(['branch' => 'Addis Ababa Main']);
        Customer::factory()->create(['branch' => 'Bole']);

        $response = $this->get(route('fcy.customers.index', ['branch' => 'Addis Ababa Main']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('customers.data', 1));
    }

    public function test_can_filter_customers_by_status(): void
    {
        Customer::factory()->active()->count(2)->create();
        Customer::factory()->inactive()->count(1)->create();

        $response = $this->get(route('fcy.customers.index', ['status' => 'active']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('customers.data', 2));
    }

    public function test_can_deactivate_customer(): void
    {
        $customer = Customer::factory()->active()->create();

        $response = $this->delete(route('fcy.customers.destroy', $customer));

        $response->assertRedirect(route('fcy.customers.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('customers', [
            'id' => $customer->id,
            'status' => 'inactive',
        ]);
    }
}
