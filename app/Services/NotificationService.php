<?php

namespace App\Services;

use App\Models\HrUser;
use App\Notifications\FcyRequestNotification;

class NotificationService
{
    /**
     * Broadcast a notification to all authorized FCY users.
     *
     * @param  array{type: string, title: string, message: string, request_id: int, request_number: string}  $data
     */
    public static function notifyAllAuthorizedUsers(array $data): void
    {
        $users = HrUser::allAuthorizedUsers();

        foreach ($users as $user) {
            $user->notify(new FcyRequestNotification($data));
        }
    }
}
