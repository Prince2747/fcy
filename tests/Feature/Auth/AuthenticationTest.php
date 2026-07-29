<?php

namespace Tests\Feature\Auth;

use App\Models\FcyRole;
use App\Models\HrUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        FcyRole::create(['name' => 'fcymaker']);
        FcyRole::create(['name' => 'fcychecker']);
        FcyRole::create(['name' => 'fcyapprover']);
        FcyRole::create(['name' => 'super_admin']);
    }

    public function test_login_screen_can_be_rendered()
    {
        $response = $this->get(route('login'));

        $response->assertOk();
    }

    public function test_user_with_fcymaker_role_can_authenticate()
    {
        $user = HrUser::factory()->create();
        $user->roles()->attach(FcyRole::where('name', 'fcymaker')->first());

        $response = $this->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_user_with_fcychecker_role_can_authenticate()
    {
        $user = HrUser::factory()->create();
        $user->roles()->attach(FcyRole::where('name', 'fcychecker')->first());

        $response = $this->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_user_with_fcyapprover_role_can_authenticate()
    {
        $user = HrUser::factory()->create();
        $user->roles()->attach(FcyRole::where('name', 'fcyapprover')->first());

        $response = $this->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_user_with_super_admin_role_can_authenticate()
    {
        $user = HrUser::factory()->create();
        $user->roles()->attach(FcyRole::where('name', 'super_admin')->first());

        $response = $this->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_user_without_fcy_role_cannot_authenticate()
    {
        $user = HrUser::factory()->create();

        $response = $this->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors(['username']);
    }

    public function test_users_can_not_authenticate_with_invalid_password()
    {
        $user = HrUser::factory()->create();
        $user->roles()->attach(FcyRole::where('name', 'fcymaker')->first());

        $this->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout()
    {
        $user = HrUser::factory()->create();
        $user->roles()->attach(FcyRole::where('name', 'fcymaker')->first());

        $response = $this->actingAs($user)->post(route('logout'));

        $response->assertRedirect(route('home'));

        $this->assertGuest();
    }

    public function test_users_are_rate_limited()
    {
        $user = HrUser::factory()->create();
        $user->roles()->attach(FcyRole::where('name', 'fcymaker')->first());

        RateLimiter::increment(md5('login'.implode('|', [$user->username, '127.0.0.1'])), amount: 5);

        $response = $this->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'wrong-password',
        ]);

        $response->assertTooManyRequests();
    }
}