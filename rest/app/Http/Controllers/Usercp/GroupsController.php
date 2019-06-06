<?php

namespace App\Http\Controllers\Usercp;

use App\EloquentModels\Group\Group;
use App\EloquentModels\Group\GroupRequest;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserGroup;
use App\Helpers\ConfigHelper;
use App\Http\Controllers\Controller;
use App\Jobs\UserUpdated;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\Request;

class GroupsController extends Controller {

    public function __construct(Request $request) {
        parent::__construct($request);
    }

    /**
     * Post request to perform a application for a public user group
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function applyForGroup(Request $request) {
        $groupId = $request->input('groupId');

        $group = Group::find($groupId);
        Condition::precondition(!$group, 404, 'Group does not exist');
        Condition::precondition(in_array($groupId, $this->user->groupIds), 400, 'You are already in this group');
        $haveApplied = GroupRequest::where('userId', $this->user->userId)->where('groupId', $groupId)->count('groupRequestId') > 0;
        Condition::precondition($haveApplied, 400, 'You have already have a pending application');

        $groupRequest = new GroupRequest([
            'userId' => $this->user->userId,
            'groupId' => $groupId
        ]);

        $groupRequest->save();

        Logger::user($this->user->userId, $request->ip(), Action::APPLIED_FOR_GROUP, ['name' => $group->name]);
        return response()->json();
    }

    /**
     * Delete request for leaving user group which the user is a part of
     *
     * @param Request $request
     * @param         $groupId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function leaveGroup(Request $request, $groupId) {
        $group = Group::find($groupId);
        Condition::precondition(!$group, 404, 'Group does not exist');
        Condition::precondition(!in_array($groupId, $this->user->groupIds), 400, 'You are not in this group');
        Condition::precondition(!$group->isPublic, 400, 'You can only leave public groups');

        UserGroup::where('groupId', $groupId)->where('userId', $this->user->userId)->delete();
        User::where('userId', $this->user->userId)->update([
            'displayGroupId' => $this->user->displayGroupId == $groupId ? 0 : $this->user->displayGroupId
        ]);

        UserUpdated::dispatch($this->user->userId, ConfigHelper::getUserUpdateTypes()->CLEAR_GROUP);

        Logger::user($this->user->userId, $request->ip(), Action::LEFT_GROUP, ['name' => $group->name]);
        return response()->json();
    }

    /**
     * Get an array of all the public user groups the user is a part of
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getGroups() {
        $groups = Group::select('groupId', 'name', 'isPublic')
            ->get();

        foreach ($groups as $group) {
            $group->isMember = in_array($group->groupId, $this->user->groupIds);
            $group->haveApplied = $group->isMember ? false : GroupRequest::where('userId', $this->user->userId)
                    ->where('groupId', $group->groupId)->count('groupRequestId') > 0;
        }

        return response()->json([
            'displayGroup' => Iterables::find($groups, function ($group) {
                return $group->groupId == $this->user->displayGroupId;
            }),
            'groups' => $groups
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateDisplayGroup(Request $request) {
        $groupId = $request->input('groupId');
        $group = Group::find($groupId);

        Condition::precondition(!$group, 404, 'Group with that ID do not exist');
        Condition::precondition(!in_array($groupId, $this->user->groupIds), 400, 'You are not part of this group');

        $this->user->displayGroupId = $groupId;
        $this->user->save();

        Logger::user($this->user->userId, $request->ip(), Action::UPDATED_DISPLAY_GROUP, ['group' => $group->name]);
        return response()->json();
    }
}
