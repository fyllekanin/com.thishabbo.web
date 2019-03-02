<?php

namespace App\Factories\Notification;

class NotificationView {
    public $notificationId;
    public $type;
    public $createdAt;
    public $item;

    public function __construct ($notification, $user) {
        $this->notificationId = $notification->notificationId;
        $this->createdAt = $notification->createdAt;
        $this->type = $notification->type;
        $this->item = NotificationFactory::ofType($notification, $user);
    }
}