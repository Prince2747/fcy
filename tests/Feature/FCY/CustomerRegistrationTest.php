<?php

namespace Tests\Feature\FCY;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerRegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    public function test_can_view_customer_registration_page(): void
    {
        $response = $this->get(route('fcy.customers.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('fcy/customers/index'));
    }

    public function test_can_register_new_customer(): void
    {
        $response = $this->post(route('fcy.customers.store'), [
            'branch' => 'Addis Ababa Main',
            'importer_name' => 'Test Importer Ltd',
            'nbe_account_no' => 'NBE-TEST123',
            'tin_number' => '1234-5678-9012',
        ]);

        $response->assertOk();
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('customers', [
            'importer_name' => 'Test Importer Ltd',
            'nbe_account_no' => 'NBE-TEST123',
            'tin_number' => '1234-5678-9012',
            'status' => 'active',
        ]);
    }

    public function test_cannot_register_customer_with_duplicate_nbe_account(): void
    {
        Customer::factory()->create([
            'nbe_account_no' => 'NBE-DUP123',
        ]);

        $response = $this->post(route('fcy.customers.store'), [
            'branch' => 'Addis Ababa Main',
            'importer_name' => 'Another Importer',
            'nbe_account_no' => 'NBE-DUP123',
            'tin_number' => '9999-9999-9999',
        ]);

        $response->assertSessionHasErrors('nbe_account_no');
    }

    public function test_cannot_register_customer_with_duplicate_tin(): void
    {
        Customer::factory()->create([
            'tin_number' => 'TIN-DUP123',
        ]);

        $response = $this->post(route('fcy.customers.store'), [
            'branch' => 'Addis Ababa Main',
            'importer_name' => 'Another Importer',
            'nbe_account_no' => 'NBE-UNIQUE',
            'tin_number' => 'TIN-DUP123',
        ]);

        $response->assertSessionHasErrors('tin_number');
    }

    public function test_customer_registration_requires_all_fields(): void
    {
        $response = $this->post(route('fcy.customers.store'), []);

        $response->assertSessionHasErrors(['branch', 'importer_name', 'nbe_account_no', 'tin_number']);
    }

    public function test_nbe_account_no_is_normalized_before_storing(): void
    {
        $response = $this->post(route('fcy.customers.store'), [
            'branch' => 'Addis Ababa Main',
            'importer_name' => 'Normalization Test Ltd',
            'nbe_account_no' => 'nbe-001 234',
            'tin_number' => '1234-5678-9012',
        ]);

        $response->assertOk();
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('customers', [
            'importer_name' => 'Normalization Test Ltd',
            'nbe_account_no' => 'NBE001234',
        ]);
    }

    public function test_tin_number_is_normalized_before_storing(): void
    {
        $response = $this->post(route('fcy.customers.store'), [
            'branch' => 'Addis Ababa Main',
            'importer_name' => 'TIN Normalization Test',
            'nbe_account_no' => 'NBE-UNIQUE-001',
            'tin_number' => '1234 5678 9012',
        ]);

        $response->assertOk();
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('customers', [
            'importer_name' => 'TIN Normalization Test',
            'tin_number' => '123456789012',
        ]);
    }

    public function test_duplicate_nbe_account_detected_after_normalization(): void
    {
        Customer::factory()->create([
            'nbe_account_no' => 'NBE001234',
        ]);

        $response = $this->post(route('fcy.customers.store'), [
            'branch' => 'Addis Ababa Main',
            'importer_name' => 'Duplicate Test Importer',
            'nbe_account_no' => 'nbe-001 234',
            'tin_number' => '9999-9999-9999',
        ]);

        $response->assertSessionHasErrors('nbe_account_no');
    }

    public function test_duplicate_tin_detected_after_normalization(): void
    {
        Customer::factory()->create([
            'tin_number' => '123456789012',
        ]);

        $response = $this->post(route('fcy.customers.store'), [
            'branch' => 'Addis Ababa Main',
            'importer_name' => 'Duplicate TIN Test',
            'nbe_account_no' => 'NBE-UNIQUE-002',
            'tin_number' => '1234-5678-9012',
        ]);

        $response->assertSessionHasErrors('tin_number');
    }
}
