<?php

namespace App\Http\Controllers\Sitecp\User;

use App\Constants\LogType;
use App\Constants\User\UserJobEventType;
use App\EloquentModels\Group\Group;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserGroup;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Jobs\UserUpdated;
use App\Logger;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserGroupsController extends Controller {

    /**
     * Update the groups a user have
     *
     * @param  Request  $request
     * @param $userId
     *
     * @return JsonResponse
     */
    public function updateUserGroups(Request $request, $userId) {
        $user = $request->get('auth');
        $groupIds = $request->input('groupIds');
        $displayGroupId = $request->input('displayGroupId');

        $current = User::find($userId);
        Condition::precondition(!$current, 404, 'User do not exist');

        $myImmunity = User::getImmunity($user->userId);
        Condition::precondition(!UserHelper::canManageUser($user, $userId), 400, 'Not high enough immunity');
        Condition::precondition(!is_array($groupIds), 400, 'Group ids are missing');

        $currentGroups = $current->groups->map(
            function ($group) {
                return Group::where('groupId', $group->groupId)->first();
            }
        );
        $before = $currentGroups->map(
            function ($group) {
                return $group->groupId;
            }
        );
        $highImmunityGroupIds = $currentGroups->filter(
            function ($group) use ($myImmunity) {
                return $group->immunity >= $myImmunity;
            }
        )->map(
            function ($group) {
                return $group->groupId;
            }
        );

        $groups = Group::whereIn('groupId', $groupIds)->whereNotIn('groupId', $highImmunityGroupIds)->get()->toArray();
        $alreadyAddedGroupIds = UserGroup::where('userId', $current->userId)->pluck('groupId')->toArray();

        Condition::precondition(
            Iterables::filter(
                $groups,
                function ($group) use ($myImmunity) {
                    return $group['immunity'] >= $myImmunity;
                }
            ),
            400,
            'Can not give groups with higher immunity'
        );
        $hiddenBars = UserGroup::where('userId', $userId)->where('isBarActive', 0)->pluck('groupId')->toArray();

        UserGroup::where('userId', $userId)->whereNotIn('groupId', $highImmunityGroupIds)->delete();
        foreach ($groups as $group) {
            Condition::precondition(
                $group['isPublic'] && !in_array($group['groupId'], $alreadyAddedGroupIds),
                404,
                'You are not allowed to add public usergroups through this interface'
            );

            $userGroup = new UserGroup(
                [
                    'userId' => $userId,
                    'groupId' => $group['groupId'],
                    'isBarActive' => !in_array($group['groupId'], $hiddenBars)
                ]
            );
            $userGroup->save();
        }

        Condition::precondition(
            $displayGroupId > 0 && UserGroup::where('userId', $userId)->where('groupId', $displayGroupId)->count() == 0,
            400,
            'The display group is not a group the user have'
        );
        $current->displayGroupId = $displayGroupId;
        $current->save();

        UserUpdated::dispatch($userId, UserJobEventType::CLEAR_GROUP);

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_USERS_GROUPS,
            [
                'before' => $before->toArray(),
                'after' => UserGroup::where('userId', $current->userId)->pluck('groupId')->toArray()
            ],
            $current->userId
        );
        return response()->json();
    }

    /**
     * Get the page model controller user groups of a user
     *
     * @param  Request  $request
     * @param $userId
     *
     * @return JsonResponse
     */
    public function getUserGroups(Request $request, $userId) {
        $user = $request->get('auth');
        $current = User::find($userId);
        Condition::precondition(!$current, 404, 'User do not exist');

        $myImmunity = User::getImmunity($user->userId);
        Condition::precondition(!UserHelper::canManageUser($user, $userId), 400, 'Not high enough immunity');

        $possibleGroups = Group::where('immunity', '<', $myImmunity)->select('name', 'groupId', 'isPublic')->get()->toArray();

        return response()->json(
            [
                'nickname' => $current->nickname,
                'userId' => $current->userId,
                'displayGroupId' => $current->displayGroupId,
                'groups' => UserGroup::where('userId', $userId)->get()->map(
                    function ($userGroup) {
                        return [
                            'name' => $userGroup->group->name,
                            'groupId' => $userGroup->groupId,
                            'isPublic' => $userGroup->group->isPublic
                        ];
                    }
                ),
                'possibleGroups' => $possibleGroups
            ]
        );
    }
}
