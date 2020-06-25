<?php

namespace App\Repositories\Repository;

use Illuminate\Support\Collection;

interface NotificationRepository {


    /**
     * Get collection of userIds that have an existing
     * notification for provided type and content int.
     *
     * @param  int  $type
     * @param  int  $contentId
     *
     * @return Collection of userIds
     */
    public function getNotifiedUserIdsForTypeAndContent(int $type, int $contentId);

    /**
     * Create a notification
     *
     * @param  int  $userId
     * @param  int  $senderId
     * @param  int  $type
     * @param  int  $contentId
     */
    public function createNotification(int $userId, int $senderId, int $type, int $contentId);
}
