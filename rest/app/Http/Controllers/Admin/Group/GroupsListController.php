<?php

namespace App\Http\Controllers\Admin\Group;

use App\EloquentModels\Group;
use App\EloquentModels\GroupList;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class GroupsListController extends Controller {

    /**
     * Get request to fetch resource of all groups prioritized in the group list
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getGroupsList () {
        return response()->json(Group::leftJoin('groups_list', 'groups_list.groupId', '=', 'groups.groupId')
            ->where('groups.isDeleted', 0)
            ->select('groups.groupId', 'groups.name', 'groups_list.displayOrder', 'groups_list.color')
            ->get());
    }

    /**
     * Put request to update the prioritized group list
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function updateGroupsList (Request $request) {
        $user = Cache::get('auth');
        GroupList::truncate();
        $groups = $request->input('groups');

        foreach ($groups as $group) {
            $groupList = new GroupList([
                'groupId' => $group['groupId'],
                'displayOrder' => $group['displayOrder'],
                'color' => $group['color']
            ]);
            $groupList->save();
        }

        Logger::admin($user->userId, $request->ip(), Action::UPDATED_GROUP_LIST);
        return response()->json();
    }
}
