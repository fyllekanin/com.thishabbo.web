<?php

namespace App\Factories\Notification;

class NotificationView {
    public $notificationId;
    public $type;
    public $createdAt;
    public $item;
    public $isRead;

    public function __construct($notification) {
        $this->notificationId = $notification->notificationId;
        $this->createdAt = $notification->createdAt;
        $this->type = $notification->type;
        $this->isRead = (boolean)$notification->readAt;
        $this->item = NotificationFactory::ofType($notification);
    }
}