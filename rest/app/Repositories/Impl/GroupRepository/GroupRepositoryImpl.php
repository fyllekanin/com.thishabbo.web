<?php

namespace App\Repositories\Impl\SettingRepository;

use App\Constants\GroupOptions;
use App\Repositories\Impl\GroupRepository\GroupDBO;
use App\Repositories\Impl\GroupRepository\GroupListDBO;
use App\Repositories\Impl\GroupRepository\UserGroupDBO;
use App\Repositories\Repository\GroupRepository;
use Illuminate\Support\Facades\Cache;

class GroupRepositoryImpl implements GroupRepository {
    private $myGroupDBO;
    private $myUserGroupDBO;
    private $myGroupListDBO;

    public function __construct() {
        $this->myGroupDBO = new GroupDBO();
        $this->myUserGroupDBO = new UserGroupDBO();
        $this->myGroupListDBO = new GroupListDBO();
    }

    public function doUsersContentNeedApproval(int $userId) {
        $groups = $this->getUsersGroupsByUserId($userId);
        return $groups->contains(
            function ($group) {
                return $group->options & GroupOptions::CONTENT_NEED_APPROVAL;
            }
        );
    }

    public function getUsersGroupsByUserId(int $userId) {
        return $this->myGroupDBO->query()
            ->whereInGroupId($this->getGroupIdsForUserId($userId))
            ->get();
    }

    public function getGroupIdsForUserId(int $userId) {
        if ($userId < 1) {
            return collect([0]);
        }
        if (Cache::has("group-ids-{$userId}")) {
            return Cache::get("group-ids-{$userId}");
        }
        $groupIds = $this->myUserGroupDBO->query()
            ->forUserId($userId)
            ->select('groupId')
            ->pluck('groupId');
        $groupIds->push(0);
        Cache::put("group-ids-{$userId}", $groupIds, 30);
        return $groupIds;
    }

    public function getUserIdsWithGroupId(int $groupId) {
        return $this->myUserGroupDBO->query()->whereGroupId($groupId)->pluck('userId');
    }

    public function getGroupListsOrdered() {
        return $this->myGroupListDBO->query()->orderByDisplayOrder()->get();
    }

    public function getGroupById(int $groupId) {
        return $this->myGroupDBO->query()->whereGroupId($groupId)->first();
    }
}
