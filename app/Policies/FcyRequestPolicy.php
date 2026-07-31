<?php

namespace App\Policies;

use App\Models\FcyRequest;
use App\Models\HrUser;

class FcyRequestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(HrUser $user): bool
    {
        // Super admin can do everything
        if ($this->isSuperAdmin($user)) {
            return true;
        }

        // All authenticated FCY users can view the list (filtering is done in controller)
        return $user->hasRole('fcymaker') || $user->hasRole('fcychecker') || $user->hasRole('fcyapprover');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(HrUser $user, FcyRequest $fcyRequest): bool
    {
        // Super admin can do everything
        if ($this->isSuperAdmin($user)) {
            return true;
        }

        // All FCY users can view any request
        return $user->hasRole('fcymaker') || $user->hasRole('fcychecker') || $user->hasRole('fcyapprover');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(HrUser $user): bool
    {
        // Super admin can do everything
        if ($this->isSuperAdmin($user)) {
            return true;
        }

        // Only makers can create FCY requests
        return $user->hasRole('fcymaker');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(HrUser $user, FcyRequest $fcyRequest): bool
    {
        // Super admin can do everything
        if ($this->isSuperAdmin($user)) {
            return true;
        }

        // Only the maker can update, and only in draft or rejected_by_checker status
        if (! $user->hasRole('fcymaker')) {
            return false;
        }

        if ((string) $user->id !== $fcyRequest->maker_id) {
            return false;
        }

        return in_array($fcyRequest->status, [
            FcyRequest::STATUS_DRAFT,
            FcyRequest::STATUS_REJECTED_BY_CHECKER,
        ]);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(HrUser $user, FcyRequest $fcyRequest): bool
    {
        // Super admin can do everything
        if ($this->isSuperAdmin($user)) {
            return true;
        }

        // Only makers can delete their own draft requests
        if (! $user->hasRole('fcymaker')) {
            return false;
        }

        return (string) $user->id === $fcyRequest->maker_id
            && $fcyRequest->status === FcyRequest::STATUS_DRAFT;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(HrUser $user, FcyRequest $fcyRequest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(HrUser $user, FcyRequest $fcyRequest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can submit the request for checker review.
     */
    public function submit(HrUser $user, FcyRequest $fcyRequest): bool
    {
        // Super admin can do everything
        if ($this->isSuperAdmin($user)) {
            return true;
        }

        // Only the maker can submit, and only draft or rejected_by_checker requests
        if (! $user->hasRole('fcymaker')) {
            return false;
        }

        if ((string) $user->id !== $fcyRequest->maker_id) {
            return false;
        }

        return in_array($fcyRequest->status, [
            FcyRequest::STATUS_DRAFT,
            FcyRequest::STATUS_REJECTED_BY_CHECKER,
        ]);
    }

    /**
     * Determine whether the user can check (review) the request.
     */
    public function check(HrUser $user, FcyRequest $fcyRequest): bool
    {
        // Super admin can do everything
        if ($this->isSuperAdmin($user)) {
            return true;
        }

        // Only checkers can check requests
        if (! $user->hasRole('fcychecker')) {
            return false;
        }

        // Checker cannot be the same person as the maker
        if ((string) $user->id === $fcyRequest->maker_id) {
            return false;
        }

        return $fcyRequest->status === FcyRequest::STATUS_PENDING_CHECKER;
    }

    /**
     * Determine whether the user can reject at checker stage.
     */
    public function rejectCheck(HrUser $user, FcyRequest $fcyRequest): bool
    {
        // Same authorization as check()
        return $this->check($user, $fcyRequest);
    }

    /**
     * Determine whether the user can approve the request.
     */
    public function approve(HrUser $user, FcyRequest $fcyRequest): bool
    {
        // Super admin can do everything
        if ($this->isSuperAdmin($user)) {
            return true;
        }

        // Only approvers can approve requests
        if (! $user->hasRole('fcyapprover')) {
            return false;
        }

        return $fcyRequest->status === FcyRequest::STATUS_PENDING_APPROVER;
    }

    /**
     * Determine whether the user can reject at approver stage.
     */
    public function reject(HrUser $user, FcyRequest $fcyRequest): bool
    {
        // Same authorization as approve()
        return $this->approve($user, $fcyRequest);
    }

    /**
     * Check if the user is a super admin.
     */
    private function isSuperAdmin(HrUser $user): bool
    {
        return $user->hasRole('SuperAdmin');
    }
}
