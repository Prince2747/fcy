<?php

namespace Tests\Feature\FCY;

use App\Models\FcyRequest;
use App\Models\FcyRole;
use App\Models\HrUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FcyRequestAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles
        FcyRole::create(['name' => 'fcymaker']);
        FcyRole::create(['name' => 'fcychecker']);
        FcyRole::create(['name' => 'fcyapprover']);
        FcyRole::create(['name' => 'super_admin']);
    }

    public function test_maker_can_create_fcy_request(): void
    {
        $maker = HrUser::factory()->create();
        $maker->roles()->attach(FcyRole::where('name', 'fcymaker')->first());
        $this->actingAs($maker);

        $response = $this->get(route('fcy.requests.create'));

        $response->assertOk();
    }

    public function test_non_maker_cannot_create_fcy_request(): void
    {
        $user = HrUser::factory()->create();
        $user->roles()->attach(FcyRole::where('name', 'fcychecker')->first());
        $this->actingAs($user);

        $response = $this->get(route('fcy.requests.create'));

        $response->assertForbidden();
    }

    public function test_forbidden_inertia_request_returns_toast_redirect(): void
    {
        $user = HrUser::factory()->create();
        $user->roles()->attach(FcyRole::where('name', 'fcychecker')->first());
        $this->actingAs($user);

        $response = $this->withHeader('X-Inertia', 'true')
            ->get(route('fcy.requests.create'));

        $response->assertRedirect();
        $response->assertSessionHas('toast', function ($toast) {
            return $toast['type'] === 'error'
                && str_contains($toast['message'], 'authorized');
        });
    }

    public function test_maker_can_edit_own_draft_request(): void
    {
        $maker = HrUser::factory()->create();
        $maker->roles()->attach(FcyRole::where('name', 'fcymaker')->first());
        $request = FcyRequest::factory()->create([
            'maker_id' => (string) $maker->id,
            'status' => FcyRequest::STATUS_DRAFT,
        ]);
        $this->actingAs($maker);

        $response = $this->get(route('fcy.requests.edit', $request));

        $response->assertOk();
    }

    public function test_maker_cannot_edit_other_makers_request(): void
    {
        $maker1 = HrUser::factory()->create();
        $maker1->roles()->attach(FcyRole::where('name', 'fcymaker')->first());
        $maker2 = HrUser::factory()->create();
        $maker2->roles()->attach(FcyRole::where('name', 'fcymaker')->first());
        $request = FcyRequest::factory()->create([
            'maker_id' => (string) $maker1->id,
            'status' => FcyRequest::STATUS_DRAFT,
        ]);
        $this->actingAs($maker2);

        $response = $this->get(route('fcy.requests.edit', $request));

        $response->assertForbidden();
    }

    public function test_unauthorized_inertia_edit_returns_toast_redirect(): void
    {
        $maker1 = HrUser::factory()->create();
        $maker1->roles()->attach(FcyRole::where('name', 'fcymaker')->first());
        $maker2 = HrUser::factory()->create();
        $maker2->roles()->attach(FcyRole::where('name', 'fcymaker')->first());
        $request = FcyRequest::factory()->create([
            'maker_id' => (string) $maker1->id,
            'status' => FcyRequest::STATUS_DRAFT,
        ]);
        $this->actingAs($maker2);

        $response = $this->withHeader('X-Inertia', 'true')
            ->get(route('fcy.requests.edit', $request));

        $response->assertRedirect();
        $response->assertSessionHas('toast', function ($toast) {
            return $toast['type'] === 'error';
        });
    }

    public function test_maker_can_submit_own_draft_request(): void
    {
        $maker = HrUser::factory()->create();
        $maker->roles()->attach(FcyRole::where('name', 'fcymaker')->first());
        $request = FcyRequest::factory()->create([
            'maker_id' => (string) $maker->id,
            'status' => FcyRequest::STATUS_DRAFT,
        ]);
        $this->actingAs($maker);

        $response = $this->post(route('fcy.requests.submit', $request));

        $response->assertRedirect(route('fcy.requests.show', $request));
        $response->assertSessionHas('success');
    }

    public function test_checker_can_check_pending_request(): void
    {
        $maker = HrUser::factory()->create();
        $maker->roles()->attach(FcyRole::where('name', 'fcymaker')->first());
        $checker = HrUser::factory()->create();
        $checker->roles()->attach(FcyRole::where('name', 'fcychecker')->first());
        $request = FcyRequest::factory()->create([
            'maker_id' => (string) $maker->id,
            'status' => FcyRequest::STATUS_PENDING_CHECKER,
        ]);
        $this->actingAs($checker);

        $response = $this->post(route('fcy.requests.check', $request), [
            'checker_notes' => 'Looks good',
        ]);

        $response->assertRedirect(route('fcy.requests.show', $request));
        $response->assertSessionHas('success');
    }

    public function test_checker_cannot_check_own_request(): void
    {
        $maker = HrUser::factory()->create();
        $maker->roles()->attach(FcyRole::where('name', 'fcymaker')->first());
        $maker->roles()->attach(FcyRole::where('name', 'fcychecker')->first());
        $request = FcyRequest::factory()->create([
            'maker_id' => (string) $maker->id,
            'status' => FcyRequest::STATUS_PENDING_CHECKER,
        ]);
        $this->actingAs($maker);

        $response = $this->post(route('fcy.requests.check', $request), [
            'checker_notes' => 'Looks good',
        ]);

        $response->assertForbidden();
    }

    public function test_unauthorized_inertia_check_returns_toast_redirect(): void
    {
        $maker = HrUser::factory()->create();
        $maker->roles()->attach(FcyRole::where('name', 'fcymaker')->first());
        $maker->roles()->attach(FcyRole::where('name', 'fcychecker')->first());
        $request = FcyRequest::factory()->create([
            'maker_id' => (string) $maker->id,
            'status' => FcyRequest::STATUS_PENDING_CHECKER,
        ]);
        $this->actingAs($maker);

        $response = $this->withHeader('X-Inertia', 'true')
            ->post(route('fcy.requests.check', $request), [
                'checker_notes' => 'Looks good',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('toast', function ($toast) {
            return $toast['type'] === 'error';
        });
    }

    public function test_approver_can_approve_pending_request(): void
    {
        $maker = HrUser::factory()->create();
        $maker->roles()->attach(FcyRole::where('name', 'fcymaker')->first());
        $checker = HrUser::factory()->create();
        $checker->roles()->attach(FcyRole::where('name', 'fcychecker')->first());
        $approver = HrUser::factory()->create();
        $approver->roles()->attach(FcyRole::where('name', 'fcyapprover')->first());
        $request = FcyRequest::factory()->create([
            'maker_id' => (string) $maker->id,
            'checker_id' => (string) $checker->id,
            'status' => FcyRequest::STATUS_PENDING_APPROVER,
        ]);
        $this->actingAs($approver);

        $response = $this->post(route('fcy.requests.approve', $request), [
            'approver_notes' => 'Approved',
        ]);

        $response->assertRedirect(route('fcy.requests.show', $request));
        $response->assertSessionHas('success');
    }

    public function test_super_admin_can_approve_request(): void
    {
        $maker = HrUser::factory()->create();
        $maker->roles()->attach(FcyRole::where('name', 'fcymaker')->first());
        $superAdmin = HrUser::factory()->create();
        $superAdmin->roles()->attach(FcyRole::where('name', 'super_admin')->first());
        $request = FcyRequest::factory()->create([
            'maker_id' => (string) $maker->id,
            'status' => FcyRequest::STATUS_PENDING_APPROVER,
        ]);
        $this->actingAs($superAdmin);

        $response = $this->post(route('fcy.requests.approve', $request), [
            'approver_notes' => 'Approved by super admin',
        ]);

        $response->assertRedirect(route('fcy.requests.show', $request));
        $response->assertSessionHas('success');
    }

    public function test_maker_cannot_approve_request(): void
    {
        $maker = HrUser::factory()->create();
        $maker->roles()->attach(FcyRole::where('name', 'fcymaker')->first());
        $request = FcyRequest::factory()->create([
            'maker_id' => (string) $maker->id,
            'status' => FcyRequest::STATUS_PENDING_APPROVER,
        ]);
        $this->actingAs($maker);

        $response = $this->post(route('fcy.requests.approve', $request), [
            'approver_notes' => 'Approved',
        ]);

        $response->assertForbidden();
    }

    public function test_unauthorized_inertia_approve_returns_toast_redirect(): void
    {
        $maker = HrUser::factory()->create();
        $maker->roles()->attach(FcyRole::where('name', 'fcymaker')->first());
        $request = FcyRequest::factory()->create([
            'maker_id' => (string) $maker->id,
            'status' => FcyRequest::STATUS_PENDING_APPROVER,
        ]);
        $this->actingAs($maker);

        $response = $this->withHeader('X-Inertia', 'true')
            ->post(route('fcy.requests.approve', $request), [
                'approver_notes' => 'Approved',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('toast', function ($toast) {
            return $toast['type'] === 'error';
        });
    }
}
