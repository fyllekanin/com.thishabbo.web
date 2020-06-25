<?php

namespace App\Repositories\Impl\NotificationRepository;

use App\Repositories\Repository\NotificationRepository;

class NotificationRepositoryImpl implements NotificationRepository {

    private $myNotificationDBO;

    public function __construct() {
        $this->myNotificationDBO = new NotificationDBO();
    }

    public function getNotifiedUserIdsForTypeAndContent(int $type, int $contentId) {
        return $this->myNotificationDBO->query()
            ->whereType($type)
            ->whereContentId($contentId)
            ->pluck('userId');
    }

    public function createNotification(int $userId, int $senderId, int $type, int $contentId) {
        $item = $this->myNotificationDBO->newInstance();
        $item->userId = $userId;
        $item->senderId = $senderId;
        $item->type = $type;
        $item->contentId = $contentId;
        $item->createdAt = time();
        $item->save();
    }
}
