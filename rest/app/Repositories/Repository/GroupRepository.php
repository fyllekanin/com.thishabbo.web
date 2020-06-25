<?php

namespace App\Repositories\Repository;

use App\Repositories\Impl\GroupRepository\GroupDBO;
use Illuminate\Support\Collection;

interface GroupRepository {


    /**
     * Check if the provided users content needs approval
     * before approved.
     *
     * @param  int  $userId
     *
     * @return bool
     */
    public function doUsersContentNeedApproval(int $userId);

    /**
     * Get list of all groups the user is in
     *
     * @param  int  $userId
     *
     * @return Collection of GroupDBO
     */
    public function getUsersGroupsByUserId(int $userId);

    /**
     * Get list of all userIds that has the given group id
     *
     * @param  int  $groupId
     *
     * @return Collection of userIds
     */
    public function getUserIdsWithGroupId(int $groupId);

    /**
     * Get a collection of groupIds that the given user
     * is part of.
     *
     * @param  int  $userId
     *
     * @return Collection of group ids
     */
    public function getGroupIdsForUserId(int $userId);

    /**
     * Returns all the group lists ordered by display order
     *
     * @return Collection of GroupListDBO
     */
    public function getGroupListsOrdered();

    /**
     * Get a group by provided ID
     *
     * @param  int  $groupId
     *
     * @return GroupDBO
     */
    public function getGroupById(int $groupId);
}
