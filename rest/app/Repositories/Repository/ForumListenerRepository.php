<?php

namespace App\Repositories\Repository;

use Illuminate\Support\Collection;

interface ForumListenerRepository {


    /**
     * Check if the provided user is subscribed currently to
     * the given category
     *
     * @param  int  $userId
     * @param  int  $categoryId
     *
     * @return bool
     */
    public function isUserSubscribedToCategory(int $userId, int $categoryId);

    /**
     * Get a collection of user ids that is subscribed
     * to given category.
     *
     * @param  int  $categoryId
     * @param  Collection|null  $excludeIds
     *
     * @return Collection of userIds
     */
    public function getUserIdsSubscribedToCategoryId(int $categoryId, Collection $excludeIds = null);

    /**
     * Get a collection of user ids that is subscribed
     * to given thread.
     *
     * @param  int  $threadId
     * @param  Collection|null  $excludeIds
     *
     * @return Collection of userIds
     */
    public function getUserIdsSubscribedToThreadId(int $threadId, Collection $excludeIds = null);
}
