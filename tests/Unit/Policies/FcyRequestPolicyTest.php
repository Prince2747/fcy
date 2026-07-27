<?php

namespace Tests\Unit\Policies;

use App\Models\FcyRequest;
use App\Models\HrUser;
use App\Policies\FcyRequestPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FcyRequestPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_maker_can_create_request(): void
    {
        $maker = $this->createMockUser('fcymaker', 1);
        $policy = new FcyRequestPolicy;

        $this->assertTrue($policy->create($maker));
    }

    public function test_checker_cannot_create_request(): void
    {
        $checker = $this->createMockUser('fcychecker', 2);
        $policy = new FcyRequestPolicy;

        $this->assertFalse($policy->create($checker));
    }

    public function test_super_admin_can_create_request(): void
    {
        $superAdmin = $this->createMockUser('super_admin', 3);
        $policy = new FcyRequestPolicy;

        $this->assertTrue($policy->create($superAdmin));
    }

    public function test_maker_can_update_own_draft_request(): void
    {
        $maker = $this->createMockUser('fcymaker', 1);
        $request = FcyRequest::factory()->create([
            'maker_id' => '1',
            'status' => FcyRequest::STATUS_DRAFT,
        ]);
        $policy = new FcyRequestPolicy;

        $this->assertTrue($policy->update($maker, $request));
    }

    public function test_maker_cannot_update_other_makers_request(): void
    {
        $maker1 = $this->createMockUser('fcymaker', 1);
        $maker2 = $this->createMockUser('fcymaker', 2);
        $request = FcyRequest::factory()->create([
            'maker_id' => '1',
            'status' => FcyRequest::STATUS_DRAFT,
        ]);
        $policy = new FcyRequestPolicy;

        $this->assertFalse($policy->update($maker2, $request));
    }

    public function test_maker_can_submit_own_draft_request(): void
    {
        $maker = $this->createMockUser('fcymaker', 1);
        $request = FcyRequest::factory()->create([
            'maker_id' => '1',
            'status' => FcyRequest::STATUS_DRAFT,
        ]);
        $policy = new FcyRequestPolicy;

        $this->assertTrue($policy->submit($maker, $request));
    }

    public function test_checker_can_check_pending_request(): void
    {
        $maker = $this->createMockUser('fcymaker', 1);
        $checker = $this->createMockUser('fcychecker', 2);
        $request = FcyRequest::factory()->create([
            'maker_id' => '1',
            'status' => FcyRequest::STATUS_PENDING_CHECKER,
        ]);
        $policy = new FcyRequestPolicy;

        $this->assertTrue($policy->check($checker, $request));
    }

    public function test_checker_cannot_check_own_request(): void
    {
        $maker = $this->createMockUserWithMultipleRoles(['fcymaker', 'fcychecker'], 1);
        $request = FcyRequest::factory()->create([
            'maker_id' => '1',
            'status' => FcyRequest::STATUS_PENDING_CHECKER,
        ]);
        $policy = new FcyRequestPolicy;

        $this->assertFalse($policy->check($maker, $request));
    }

    public function test_approver_can_approve_pending_request(): void
    {
        $maker = $this->createMockUser('fcymaker', 1);
        $approver = $this->createMockUser('fcyapprover', 2);
        $request = FcyRequest::factory()->create([
            'maker_id' => '1',
            'status' => FcyRequest::STATUS_PENDING_APPROVER,
        ]);
        $policy = new FcyRequestPolicy;

        $this->assertTrue($policy->approve($approver, $request));
    }

    public function test_maker_cannot_approve_request(): void
    {
        $maker = $this->createMockUser('fcymaker', 1);
        $request = FcyRequest::factory()->create([
            'maker_id' => '1',
            'status' => FcyRequest::STATUS_PENDING_APPROVER,
        ]);
        $policy = new FcyRequestPolicy;

        $this->assertFalse($policy->approve($maker, $request));
    }

    public function test_super_admin_can_approve_request(): void
    {
        $maker = $this->createMockUser('fcymaker', 1);
        $superAdmin = $this->createMockUser('super_admin', 2);
        $request = FcyRequest::factory()->create([
            'maker_id' => '1',
            'status' => FcyRequest::STATUS_PENDING_APPROVER,
        ]);
        $policy = new FcyRequestPolicy;

        $this->assertTrue($policy->approve($superAdmin, $request));
    }

    private function createMockUser(string $roleName, int $userId): HrUser
    {
        return new class($roleName, $userId) extends HrUser
        {
            private string $roleName;

            private int $userId;

            public function __construct(string $roleName, int $userId)
            {
                $this->roleName = $roleName;
                $this->userId = $userId;
            }

            public function hasRole(string $roleName): bool
            {
                if ($this->roleName === 'super_admin') {
                    return $roleName === 'super_admin';
                }

                return $roleName === $this->roleName;
            }

            public function getAttribute($key)
            {
                if ($key === 'id') {
                    return $this->userId;
                }

                return parent::getAttribute($key);
            }
        };
    }

    private function createMockUserWithMultipleRoles(array $roles, int $userId): HrUser
    {
        return new class($roles, $userId) extends HrUser
        {
            private array $roles;

            private int $userId;

            public function __construct(array $roles, int $userId)
            {
                $this->roles = $roles;
                $this->userId = $userId;
            }

            public function hasRole(string $roleName): bool
            {
                return in_array($roleName, $this->roles);
            }

            public function getAttribute($key)
            {
                if ($key === 'id') {
                    return $this->userId;
                }

                return parent::getAttribute($key);
            }
        };
    }
}
