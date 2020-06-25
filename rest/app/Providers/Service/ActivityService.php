<?php

namespace App\Providers\Service;

use Illuminate\Support\Collection;

interface ActivityService {


    /**
     * Get the last 5 activities in the system based on
     * categories to include and ignored thread id's
     *
     * If $byUserId is set then all activies will be by
     * this user
     *
     * @param  int  $user
     * @param  Collection  $categoryIds
     * @param  array  $ignoredThreadIds
     * @param  int  $byUserId
     *
     * @return array
     */
    public function getLatestActivities(int $user, Collection $categoryIds, array $ignoredThreadIds, int $byUserId = 0);
}
