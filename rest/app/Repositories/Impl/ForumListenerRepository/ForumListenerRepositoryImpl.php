<?php

namespace App\Repositories\Impl\NotificationRepository;

use App\Repositories\Repository\ForumListenerRepository;
use Illuminate\Support\Collection;

class ForumListenerRepositoryImpl implements ForumListenerRepository {

    private $myCategorySubscriptionDBO;
    private $myThreadSubscriptionDBO;

    public function __construct() {
        $this->myCategorySubscriptionDBO = new CategorySubscriptionDBO();
        $this->myThreadSubscriptionDBO = new ThreadSubscriptionDBO();
    }

    public function isUserSubscribedToCategory(int $userId, int $categoryid) {
        return $this->myCategorySubscriptionDBO->query()
                ->whereCategoryId($categoryid)
                ->whereUserId($userId)
                ->countPrimary() > 0;
    }

    public function getUserIdsSubscribedToCategoryId(int $categoryId, Collection $excludeIds = null) {
        return $this->myCategorySubscriptionDBO->query()
            ->whereCategoryId($categoryId)
            ->whereNotInUserId($excludeIds)
            ->pluck('userId');
    }

    public function getUserIdsSubscribedToThreadId(int $threadId, Collection $excludeIds = null) {
        return $this->myThreadSubscriptionDBO->query()
            ->whereThreadId($threadId)
            ->whereNotInUserId($excludeIds)
            ->pluck('userId');
    }
}
