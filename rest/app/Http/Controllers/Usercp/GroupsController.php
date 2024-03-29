<?php

namespace App\Http\Controllers\Usercp;

use App\Constants\LogType;
use App\Constants\User\UserJobEventType;
use App\EloquentModels\Group\Group;
use App\EloquentModels\Group\GroupRequest;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserGroup;
use App\Http\Controllers\Controller;
use App\Jobs\UserUpdated;
use App\Logger;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GroupsController extends Controller {

    public function showUserBar(Request $request, $groupId) {
        $user = $request->get('auth');
        $userGroup = UserGroup::where('userId', $user->userId)->where('groupId', $groupId)->first();
        Condition::precondition(!$userGroup, 404, 'You do not have this group');

        $userGroup->isBarActive = 1;
        $userGroup->save();

        Logger::user($user->userId, $request->ip(), LogType::SHOWED_USER_BAR, [], $userGroup->groupId);
        return response()->json();
    }

    public function hideUserBar(Request $request, $groupId) {
        $user = $request->get('auth');
        $userGroup = UserGroup::where('userId', $user->userId)->where('groupId', $groupId)->first();
        Condition::precondition(!$userGroup, 404, 'You do not have this group');

        $userGroup->isBarActive = 0;
        $userGroup->save();

        Logger::user($user->userId, $request->ip(), LogType::HIDDEN_USER_BAR, [], $userGroup->groupId);
        return response()->json();
    }

    /**
     * Post request to perform a application for a public user group
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function applyForGroup(Request $request) {
        $user = $request->get('auth');
        $groupId = $request->input('groupId');

        $group = Group::find($groupId);
        Condition::precondition(!$group, 404, 'Group does not exist');
        Condition::precondition(in_array($groupId, $user->groupIds), 400, 'You are already in this group');
        $haveApplied = GroupRequest::where('userId', $user->userId)->where('groupId', $groupId)->count('groupRequestId') > 0;
        Condition::precondition($haveApplied, 400, 'You have already have a pending application');

        $groupRequest = new GroupRequest(
            [
                'userId' => $user->userId,
                'groupId' => $groupId
            ]
        );

        $groupRequest->save();

        Logger::user($user->userId, $request->ip(), LogType::APPLIED_FOR_GROUP, ['name' => $group->name], $group->groupId);
        return response()->json();
    }

    /**
     * Delete request for leaving user group which the user is a part of
     *
     * @param  Request  $request
     * @param $groupId
     *
     * @return JsonResponse
     */
    public function leaveGroup(Request $request, $groupId) {
        $user = $request->get('auth');

        $group = Group::find($groupId);
        Condition::precondition(!$group, 404, 'Group does not exist');
        Condition::precondition(!in_array($groupId, $user->groupIds), 400, 'You are not in this group');
        Condition::precondition(!$group->isPublic, 400, 'You can only leave public groups');

        UserGroup::where('groupId', $groupId)->where('userId', $user->userId)->delete();
        User::where('userId', $user->userId)->update(
            [
                'displayGroupId' => $user->displayGroupId == $groupId ? 0 : $user->displayGroupId
            ]
        );

        UserUpdated::dispatch($user->userId, UserJobEventType::CLEAR_GROUP);

        Logger::user($user->userId, $request->ip(), LogType::LEFT_GROUP, ['name' => $group->name], $group->groupId);
        return response()->json();
    }

    /**
     * Get an array of all the public user groups the user is a part of
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getGroups(Request $request) {
        $user = $request->get('auth');
        $groups = Group::select('groupId', 'name', 'isPublic')
            ->get();

        foreach ($groups as $group) {
            $group->isMember = in_array($group->groupId, $user->groupIds);
            $group->haveApplied = $group->isMember ? false : GroupRequest::where('userId', $user->userId)
                    ->where('groupId', $group->groupId)->count('groupRequestId') > 0;
            $group->isBarActive = UserGroup::where('groupId', $group->groupId)->where('userId', $user->userId)->value('isBarActive');
        }

        return response()->json(
            [
                'displayGroup' => Iterables::find(
                    $groups,
                    function ($group) use ($user) {
                        return $group->groupId == $user->displayGroupId;
                    }
                ),
                'groups' => $groups
            ]
        );
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function updateDisplayGroup(Request $request) {
        $user = $request->get('auth');
        $groupId = $request->input('groupId');
        $group = Group::find($groupId);

        Condition::precondition(!$group && $groupId != 0, 404, 'Group with that ID do not exist');
        Condition::precondition(!in_array($groupId, $user->groupIds) && $groupId != 0, 400, 'You are not part of this group');

        $user->displayGroupId = $groupId;
        $user->save();

        Logger::user(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_DISPLAY_GROUP,
            ['group' => $groupId != 0 ? $group->name : 'No Display Group']
        );
        return response()->json();
    }
}
