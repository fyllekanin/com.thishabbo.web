<?php

namespace App\Http\Controllers\Sitecp\Group;

use App\Constants\LogType;
use App\EloquentModels\Group\Group;
use App\EloquentModels\Group\GroupList;
use App\Http\Controllers\Controller;
use App\Logger;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GroupsListController extends Controller {

    /**
     * Get request to fetch resource of all groups prioritized in the group list
     *
     * @return JsonResponse
     */
    public function getGroupsList() {
        return response()->json(
            Group::leftJoin('groups_list', 'groups_list.groupId', '=', 'groups.groupId')
                ->where('groups.isDeleted', 0)
                ->select('groups.groupId', 'groups.name', 'groups_list.displayOrder', 'groups_list.color')
                ->get()
        );
    }

    /**
     * Put request to update the prioritized group list
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     * @throws Exception
     */
    public function updateGroupsList(Request $request) {
        $user = $request->get('auth');
        GroupList::truncate();
        $groups = $request->input('groups');

        foreach ($groups as $group) {
            $groupList = new GroupList(
                [
                    'groupId' => $group['groupId'],
                    'displayOrder' => $group['displayOrder'],
                    'color' => $group['color']
                ]
            );
            $groupList->save();
        }

        Logger::sitecp($user->userId, $request->ip(), LogType::UPDATED_GROUP_LIST);
        return response()->json();
    }
}
