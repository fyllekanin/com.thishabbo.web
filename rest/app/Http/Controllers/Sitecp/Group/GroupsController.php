<?php

namespace App\Http\Controllers\Sitecp\Group;

use App\Constants\GroupOptions;
use App\Constants\LogType;
use App\Constants\Permission\SiteCpPermissions;
use App\Constants\Permission\StaffPermissions;
use App\EloquentModels\Group\Group;
use App\EloquentModels\Group\GroupList;
use App\EloquentModels\Group\GroupRequest;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserGroup;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Jobs\GroupUpdated;
use App\Logger;
use App\Repositories\Repository\GroupRepository;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GroupsController extends Controller {
    private $myGroupRepository;

    public function __construct(GroupRepository $groupRepository) {
        parent::__construct();
        $this->myGroupRepository = $groupRepository;
    }

    /**
     * Post request to approve a group application to a public user group
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function approveGroupApplication(Request $request) {
        $user = $request->get('auth');
        $groupRequestId = $request->input('groupRequestId');

        $groupRequest = GroupRequest::find($groupRequestId);
        Condition::precondition(!$groupRequest, 404, 'The group request do not exist');
        $group = Group::find($groupRequest->groupId);
        if (!$group) {
            $groupRequest->delete();
            Condition::precondition(true, 404, 'Group do not exist');
        }

        $affectedUser = User::find($groupRequest->userId);
        $userGroup = new UserGroup(['userId' => $affectedUser->userId, 'groupId' => $group->groupId]);
        $userGroup->save();

        $groupRequest->delete();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::APPROVED_GROUP_APPLICATION,
            [
                'group' => $group->name,
                'name' => $affectedUser->nickname
            ]
        );
        return response()->json();
    }

    /**
     * Delete request to deny a group application
     *
     * @param  Request  $request
     * @param $groupRequestId
     *
     * @return JsonResponse
     */
    public function denyGroupApplication(Request $request, $groupRequestId) {
        $user = $request->get('auth');

        $groupRequest = GroupRequest::find($groupRequestId);
        Condition::precondition(!$groupRequest, 404, 'The group request do not exist');
        $affectedUser = User::find($groupRequest->userId);
        $group = Group::find($groupRequest->groupId);
        if (!$group) {
            $groupRequest->delete();
            Condition::precondition(true, 404, 'Group does not exist');
        }

        $groupRequest->delete();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::DENIED_GROUP_APPLICATION,
            [
                'group' => $group->name,
                'name' => $affectedUser->nickname
            ]
        );
        return response()->json();
    }

    /**
     * Get request to fetch all group applications awaiting approval/denial
     *
     * @return JsonResponse
     */
    public function getGroupApplications() {
        return response()->json(GroupRequest::all());
    }

    /**
     * Delete request to delete given group
     *
     * @param  Request  $request
     * @param $groupId
     *
     * @return JsonResponse
     */
    public function deleteGroup(Request $request, $groupId) {
        $user = $request->get('auth');
        $immunity = User::getImmunity($user->userId);

        $group = Group::find($groupId);
        Condition::precondition($group->immunity >= $immunity, 400, 'This group have higher immunity then u!');
        $group->isDeleted = true;
        $group->save();

        UserGroup::where('groupId', $groupId)->delete();
        User::where('displayGroupId', $groupId)->update(['displayGroupId' => 0]);

        GroupList::where('groupId', $groupId)->delete();
        Logger::sitecp($user->userId, $request->ip(), LogType::DELETED_GROUP, ['group' => $group->name], $group->groupId);
        GroupUpdated::dispatch($groupId);
        return response()->json();
    }

    /**
     * Post request to create a new user group
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createGroup(Request $request) {
        $user = $request->get('auth');
        $group = (object) $request->input('group');
        $immunity = User::getImmunity($user->userId);

        Condition::precondition(empty($group->name), 400, 'A group needs to have a name!');
        Condition::precondition($group->immunity >= $immunity || $group->immunity < 0, 400, 'Immunity can only be 0 to');

        $nameIsUnique = Group::withName($group->name)->count('groupId') == 0;
        Condition::precondition(!$nameIsUnique, 400, 'Name needs to be unique');

        Condition::precondition($group->nameColor && !Value::validateHexColors([$group->nameColor]), 400, 'Invalid Hex Color!');
        $group->nameColor = json_encode([$group->nameColor]);

        $group->sitecpPermissions = $this->convertSitecpPermissions($user, $group, null);
        $group->staffPermissions = $this->convertStaffPermissions($user, $group, null);
        $group->options = $this->convertGroupOptions($group);

        $group = new Group(
            [
                'name' => $group->name,
                'nickname' => Value::objectProperty($group, 'nickname', ''),
                'nameColor' => Value::objectProperty($group, 'nameColor', ''),
                'userBarStyling' => Value::objectProperty($group, 'userBarStyling', ''),
                'immunity' => $group->immunity,
                'sitecpPermissions' => $group->sitecpPermissions,
                'staffPermissions' => $group->staffPermissions,
                'options' => $group->options,
                'isPublic' => Value::objectProperty($group, 'isPublic', 0),
                'avatarHeight' => Value::objectProperty($group, 'avatarHeight', 0),
                'avatarWidth' => Value::objectProperty($group, 'avatarWidth', 0)
            ]
        );
        $group->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::CREATED_GROUP, ['group' => $group->name], $group->groupId);
        return $this->getGroup($request, $group->groupId);
    }

    /**
     * Put request to update given group
     *
     * @param  Request  $request
     * @param $groupId
     *
     * @return JsonResponse
     */
    public function updateGroup(Request $request, $groupId) {
        $user = $request->get('auth');
        $newGroup = (object) $request->input('group');
        $immunity = User::getImmunity($user->userId);

        $group = Group::find($groupId);

        Condition::precondition(!$group, 404, 'Group do not exist');
        Condition::precondition($group->immunity >= $immunity, 400, 'This group have higher immunity then u!');
        Condition::precondition(
            $newGroup->immunity >= $immunity || $newGroup->immunity < 0,
            404,
            'Immunity can only be 0 to '.($immunity - 1)
        );
        Condition::precondition(empty($newGroup->name), 400, 'A group needs to have a name!');

        $nameIsUnique = Group::withName($newGroup->name)->where('groupId', '!=', $groupId)->count('groupId') == 0;
        Condition::precondition(!$nameIsUnique, 400, 'Name needs to be unique');

        $isNameColorSet = isset($newGroup->nameColor) && !empty($newGroup->nameColor);
        Condition::precondition($isNameColorSet && !Value::validateHexColors([$newGroup->nameColor]), 400, 'Invalid Hex Color!');
        $newGroup->nameColor = $isNameColorSet ? json_encode([$newGroup->nameColor]) : '';

        $newGroup->sitecpPermissions = $this->convertSitecpPermissions($user, $newGroup, $group->sitecpPermissions);
        $newGroup->staffPermissions = $this->convertStaffPermissions($user, $newGroup, $group->staffPermissions);
        $newGroup->options = $this->convertGroupOptions($newGroup);

        Group::where('groupId', $groupId)->update(
            [
                'name' => $newGroup->name,
                'nickname' => Value::objectProperty($newGroup, 'nickname', ''),
                'nameColor' => Value::objectProperty($newGroup, 'nameColor', $group->nameColor),
                'userBarStyling' => Value::objectProperty($newGroup, 'userBarStyling', $group->userBarStyling),
                'immunity' => $newGroup->immunity,
                'sitecpPermissions' => $newGroup->sitecpPermissions,
                'staffPermissions' => $newGroup->staffPermissions,
                'options' => $newGroup->options,
                'isPublic' => Value::objectProperty($newGroup, 'isPublic', $group->isPublic),
                'avatarHeight' => Value::objectProperty($newGroup, 'avatarHeight', 0),
                'avatarWidth' => Value::objectProperty($newGroup, 'avatarWidth', 0)
            ]
        );

        GroupUpdated::dispatch($groupId);

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_GROUP,
            [
                'group' => $group->name,
                'sitecpPermissionsBefore' => $this->buildSitecpPermissions($user, $group),
                'sitecpPermissionsAfter' => $this->buildSitecpPermissions($user, $newGroup),
                'staffcpPermissionsBefore' => $this->buildStaffPermissions($user, $group),
                'staffcpPermissionsAfter' => $this->buildStaffPermissions($user, $newGroup)
            ],
            $group->groupId
        );
        return $this->getGroup($request, $groupId);
    }

    /**
     * Get request to fetch resource of given group
     *
     * @param  Request  $request
     * @param $groupId
     *
     * @return JsonResponse
     */
    public function getGroup(Request $request, $groupId) {
        $user = $request->get('auth');
        $immunity = User::getImmunity($user->userId);
        $group = Group::find($groupId);
        $group = $group ? $group : $this->getDefaultGroup($user, $immunity);

        Condition::precondition($group->immunity >= $immunity, 400, 'This group have higher immunity then you!');
        $group->maxImmunity = $immunity - 1;
        $group->sitecpPermissions = $this->buildSitecpPermissions($user, $group);
        $group->staffPermissions = $this->buildStaffPermissions($user, $group);
        $group->options = $this->buildGroupOptions($group);

        $group->nameColor = Value::objectJsonProperty($group, 'nameColor', '');
        $group->nameColor = $group->nameColor == '' ? '' : $group->nameColor[0];

        return response()->json($group);
    }

    /**
     * Get request to fetch array of all groups the user have access to with immunity
     *
     * @param  Request  $request
     * @param $page
     *
     * @return JsonResponse
     */
    public function getGroups(Request $request, $page) {
        $filter = $request->input('filter');
        $user = $request->get('auth');
        $immunity = User::getImmunity($user->userId);

        $getGroupSql = Group::where('immunity', '<', $immunity)
            ->where('name', 'LIKE', Value::getFilterValue($request, $filter))
            ->orderBy('name', 'ASC');

        $total = PaginationUtil::getTotalPages($getGroupSql->count('groupId'));
        $groups = $getGroupSql->take($this->perPage)->skip(PaginationUtil::getOffset($page))->get();

        foreach ($groups as $group) {
            $group->sitecpPermissions = $this->buildSitecpPermissions($user, $group);
        }

        return response()->json(
            [
                'groups' => $groups,
                'page' => $page,
                'total' => $total
            ]
        );
    }

    /**
     * Get method to convert option names to bitwise numbers
     *
     * @param $group
     *
     * @return int
     */
    private function convertGroupOptions($group) {
        $options = 0;
        $groupOptions = (array) $group->options;

        foreach (GroupOptions::getAsOptions() as $key => $value) {
            if (isset($groupOptions[$key]) && $groupOptions[$key]) {
                $options += $value;
            }
        }
        return $options;
    }

    /**
     * Get method to convert option names to bitwise numbers
     *
     * @param $user
     * @param $group
     *
     * @param  null  $permissionsBefore
     *
     * @return int
     */
    private function convertSitecpPermissions($user, $group, $permissionsBefore = null) {
        $options = 0;
        $groupSitecpPerm = (array) $group->sitecpPermissions;

        foreach (SiteCpPermissions::getAsOptions() as $key => $value) {
            if (isset($groupSitecpPerm[$key]) && $groupSitecpPerm[$key] && $groupSitecpPerm[$key]['isActive']) {
                if (PermissionHelper::haveSitecpPermission($user->userId, $value)) {
                    $options += $value;
                } else {
                    $options += $permissionsBefore && $permissionsBefore & $value ? $value : 0;
                }
            }
        }
        return $options;
    }

    /**
     * Get method to convert option names to bitwise numbers
     *
     * @param $user
     * @param $group
     *
     * @param  null  $permissionsBefore
     *
     * @return int
     */
    private function convertStaffPermissions($user, $group, $permissionsBefore = null) {
        $options = 0;
        $groupStaffPerm = (array) $group->staffPermissions;
        foreach (StaffPermissions::getAsOptions() as $key => $value) {
            $isKeySetAndActive = isset($groupStaffPerm[$key]) && $groupStaffPerm[$key] && $groupStaffPerm[$key]['isActive'];
            if ($isKeySetAndActive && PermissionHelper::haveStaffPermission($user->userId, $value)) {
                if (PermissionHelper::haveStaffPermission($user->userId, $value)) {
                    $options += $value;
                } else {
                    $options += $permissionsBefore && $permissionsBefore & $value ? $value : 0;
                }
            }
        }
        return $options;
    }

    /**
     * Get method to convert bitwise numbers to names for the front-end
     *
     * @param $group
     *
     * @return array
     */
    private function buildGroupOptions($group) {
        $obj = [];

        foreach (GroupOptions::getAsOptions() as $key => $value) {
            $obj[$key] = $group->options & $value;
        }

        return $obj;
    }

    /**
     * Get method to convert bitwise numbers to names for the front-end
     *
     * @param $user
     * @param $group
     *
     * @return array
     */
    private function buildSitecpPermissions($user, $group) {
        $obj = [];
        $groups = $this->myGroupRepository->getUsersGroupsByUserId($user->userId);

        foreach (SiteCpPermissions::getAsOptions() as $key => $value) {
            $havePermission = $groups->contains(function ($group) use ($value) {
                return $group->sitecpPermissions & $value;
            });
            $obj[$key] = [
                'isActive' => $group->sitecpPermissions & $value,
                'isDisabled' => !PermissionHelper::isSuperSitecp($user->userId) && !$havePermission
            ];
        }

        return $obj;
    }

    /**
     * Get method to convert bitwise numbers to names for the front-end
     *
     * @param $user
     * @param $group
     *
     * @return array
     */
    private function buildStaffPermissions($user, $group) {
        $obj = [];
        $groups = $this->myGroupRepository->getUsersGroupsByUserId($user->userId);

        foreach (StaffPermissions::getAsOptions() as $key => $value) {
            $havePermission = $groups->contains(function ($group) use ($value) {
                return $group->staffPermissions & $value;
            });
            $obj[$key] = [
                'isActive' => $group->staffPermissions & $value,
                'isDisabled' => !PermissionHelper::isSuperSitecp($user->userId) && !$havePermission
            ];
        }

        return $obj;
    }

    private function getDefaultGroup($user, $immunity) {
        return (object) [
            'immunity' => 0,
            'sitecpPermissions' => 0,
            'options' => 0,
            'staffPermissions' => 0,
            'groups' => Group::where('immunity', '<', $immunity)->orderBy('name', 'ASC')->get()->map(
                function ($group) use ($user) {
                    $nameColor = Value::objectJsonProperty($group, 'nameColor', '');
                    return [
                        'sitecpPermissions' => $this->buildSitecpPermissions($user, $group),
                        'staffPermissions' => $this->buildStaffPermissions($user, $group),
                        'options' => $this->buildGroupOptions($group),
                        'name' => $group->name,
                        'immunity' => $group->immunity,
                        'nameColor' => $nameColor == '' ? '' : $group->nameColor[0]
                    ];
                }
            )
        ];
    }
}
