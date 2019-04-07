<?php

namespace App\Http\Controllers\Admin\User;

use App\EloquentModels\Group;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserGroup;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class UserGroupsController extends Controller {

    /**
     * Update the groups a user have
     *
     * @param Request $request
     * @param         $userId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateUserGroups (Request $request, $userId) {
        $user = Cache::get('auth');
        $current = UserHelper::getUserFromId($userId);
        Condition::precondition(!$current, 404, 'User do not exist');

        $myImmunity = User::getImmunity($user->userId);
        Condition::precondition(!UserHelper::canManageUser($user, $userId), 400, 'Not high enough immunity');

        $groupIds = $request->input('groupIds');
        $displayGroupId = $request->input('displayGroupId');
        Condition::precondition(!$groupIds, 400, 'Group ids are missing');

        $before = $current->groups->map(function($group) {
            return Group::where('groupId', $group->groupId)->first()->name;
        });
        $groups = Group::whereIn('groupId', $groupIds)->get()->toArray();
        Condition::precondition(Iterables::filter($groups, function ($group) use ($myImmunity) {
            return $group['immunity'] >= $myImmunity;
        }), 400, 'Can not give groups with higher immunity');

        Condition::precondition($displayGroupId > 0 && !in_array($displayGroupId, $groupIds), 400, 'Display group is not one of the possible groups');

        UserGroup::where('userId', $userId)->delete();
        foreach ($groupIds as $groupId) {
            $userGroup = new UserGroup([
                'userId' => $userId,
                'groupId' => $groupId
            ]);
            $userGroup->save();
        }

        $current->displayGroupId = $displayGroupId;
        $current->save();

        Logger::admin($user->userId, $request->ip(), Action::UPDATED_USERS_GROUPS,  $current->userId, [
            'name' => $current->nickname,
            'before' => $before->toArray(),
            'after' => $current->groups->map(function($group) {
                return Group::where('groupId', $group->groupId)->first()->name;
            })->toArray()
        ]);
        return response()->json();
    }

    /**
     * Get the page model controller user groups of a user
     *
     * @param         $userId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserGroups ($userId) {
        $user = Cache::get('auth');
        $current = UserHelper::getUserFromId($userId);
        Condition::precondition(!$current, 404, 'User do not exist');

        $myImmunity = User::getImmunity($user->userId);
        Condition::precondition(!UserHelper::canManageUser($user, $userId), 400, 'Not high enough immunity');

        $possibleGroups = Group::where('immunity', '<', $myImmunity)->select('name', 'groupId')->get()->toArray();

        return response()->json([
            'nickname' => $current->nickname,
            'userId' => $current->userId,
            'displayGroupId' => $current->displayGroupId,
            'groups' => UserGroup::where('userId', $userId)->get()->map(function ($userGroup) {
                return [
                    'name' => $userGroup->group->name,
                    'groupId' => $userGroup->groupId
                ];
            }),
            'possibleGroups' => $possibleGroups
        ]);
    }
}
