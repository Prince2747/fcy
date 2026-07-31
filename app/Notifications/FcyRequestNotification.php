<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class FcyRequestNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @param  array{type: string, title: string, message: string, request_id: int, request_number: string}  $data
     */
    public function __construct(
        public array $data,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array{type: string, title: string, message: string, request_id: int, request_number: string}
     */
    public function toDatabase(object $notifiable): array
    {
        return $this->data;
    }
}
