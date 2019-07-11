<?php

namespace App\Http\Controllers\Sitecp\Forum;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\ForumPermission;
use App\EloquentModels\Group\Group;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Utils\Condition;
use Illuminate\Http\Request;

class PermissionController extends Controller {
    private $forumService;
    private $defaultGroup = [
        'immunity' => 0,
        'groupId' => 0,
        'name' => 'Default',
        'forumPermissions' => 0,
        'isAuthOnly' => 0
    ];

    public function __construct(ForumService $forumService) {
        parent::__construct();
        $this->forumService = $forumService;
    }

    /**
     * Put request to update forum permission for user group in given category
     *
     * @param Request $request
     * @param         $categoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateGroupForumPermissions(Request $request, $categoryId) {
        $user = $request->get('auth');
        $immunity = User::getImmunity($user->userId);
        $groups = $request->input('groups');
        $cascade = $request->input('cascade');
        $isAuthOnly = $request->input('isAuthOnly');
        $permissions = $this->nameToNumberForumPermissions($request->input('permissions'));

        foreach ($groups as $grp) {
            $grp = (object)$grp;
            $groupToBeUpdated = $grp->groupId == 0 ? (object)$this->defaultGroup :
                Group::find($grp->groupId);

            Condition::precondition(!$groupToBeUpdated, 404, 'The group do not exist');
            Condition::precondition($groupToBeUpdated->immunity >= $immunity, 400, 'The group have higher immunity then you');
            PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumPermissions()->canRead, $categoryId,
                'You do not have access to this category');

            $permission = ForumPermission::where('categoryId', $categoryId)->where('groupId', $groupToBeUpdated->groupId)->first();
            $permissionsBefore = null;

            if (!$permission) {
                $perm = new ForumPermission([
                    'categoryId' => $categoryId,
                    'groupId' => $groupToBeUpdated->groupId,
                    'permissions' => $permissions,
                    'isAuthOnly' => $isAuthOnly
                ]);
                $perm->save();
            } else {
                $permissionsBefore = $this->buildForumPermissions($permission);
                $permission->permissions = $permissions;
                $permission->isAuthOnly = $isAuthOnly;
                $permission->save();
            }
            if ($cascade) {
                $this->updateCategoryAndChildrenForumPermissions($categoryId, $groupToBeUpdated->groupId, $permissions, $isAuthOnly);
            }

            Logger::sitecp($user->userId, $request->ip(), Action::UPDATED_FORUM_PERMISSIONS, [
                'wasCascade' => $cascade,
                'permissionsBefore' => $permissionsBefore,
                'permissionsAfter' => $this->buildForumPermissions((object)['permissions' => $permissions])
            ], $categoryId);
        }
        return response()->json();
    }

    /**
     * Get request to get current forum permissions for group in given category
     *
     * @param Request $request
     * @param         $categoryId
     * @param         $groupId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getGroupForumPermissions(Request $request, $categoryId, $groupId) {
        $user = $request->get('auth');
        $immunity = User::getImmunity($user->userId);
        $category = Category::select('categoryId', 'title')->where('categoryId', $categoryId)->first();

        $group = $groupId == 0 ? (object)$this->defaultGroup :
            Group::find($groupId, ['groupId', 'name', 'immunity']);
        $permissions = ForumPermission::where('categoryId', $categoryId)->where('groupId', $groupId)->first();

        Condition::precondition(!$group, 404, 'Group does not exist');
        Condition::precondition($groupId == 0 && !PermissionHelper::haveSitecpPermission($user->userId, ConfigHelper::getSitecpConfig()->canManageForumPermissions),
            400, 'You do not have permission to edit default forum permissions');

        Condition::precondition(!$category, 404, 'Either the category or group do not exist');
        Condition::precondition($group && $group->immunity >= $immunity, 400, 'The group have higher immunity then you');

        $group->forumPermissions = $this->buildForumPermissions($permissions);

        return response()->json([
            'category' => $category,
            'group' => $group,
            'groups' => Group::where('groupId', '!=', $groupId)->orderBy('name', 'ASC')->get(['groupId', 'name']),
            'isAuthOnly' => $permissions ? $permissions->isAuthOnly : 0
        ]);
    }

    /**
     * Cascade method to update child categories to same permissions as parent
     *
     * @param $categoryId
     * @param $groupId
     * @param $permissions
     * @param $isAuthOnly
     */
    private function updateCategoryAndChildrenForumPermissions($categoryId, $groupId, $permissions, $isAuthOnly) {
        $categoryIds = $this->forumService->getCategoryIdsDownStream($categoryId);

        foreach ($categoryIds as $categoryId) {
            $forumPermission = ForumPermission::where('categoryId', $categoryId)->where('groupId', $groupId)->first();

            if ($forumPermission) {
                $forumPermission->permissions = $permissions;
                $forumPermission->isAuthOnly = $isAuthOnly;
                $forumPermission->save();
            } else {
                $forumPermission = new ForumPermission([
                    'categoryId' => $categoryId,
                    'groupId' => $groupId,
                    'permissions' => $permissions,
                    'isAuthOnly' => $isAuthOnly
                ]);
                $forumPermission->save();
            }
        }
    }

    /**
     * Get method to forum permissions to names for front-end
     *
     * @param $permissions
     *
     * @return array
     */
    private function buildForumPermissions($permissions) {
        $forumPermissions = [];

        if (!isset($permissions)) {
            return $forumPermissions;
        }

        foreach (ConfigHelper::getForumPermissions() as $key => $value) {
            $forumPermissions[$key] = $permissions->permissions & $value;
        }

        return $forumPermissions;
    }

    private function nameToNumberForumPermissions($permissions) {
        $forumPermissions = 0;

        foreach (ConfigHelper::getForumPermissions() as $key => $value) {
            if (isset($permissions[$key]) && $permissions[$key]) {
                $forumPermissions += $value;
            }
        }
        return $forumPermissions;
    }
}
