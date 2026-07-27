<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page_from_home()
    {
        $response = $this->get(route('home'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_are_redirected_to_the_dashboard_from_home()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('home'));

        $response->assertRedirect(route('fcy.dashboard'));
    }

    public function test_fortify_redirects_authenticated_users_to_the_dashboard_after_login()
    {
        $this->assertSame('/dashboard', config('fortify.home'));
    }

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('fcy.dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('fcy.dashboard'));
        $response->assertOk();
    }
}
