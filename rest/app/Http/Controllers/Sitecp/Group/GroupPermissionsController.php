<?php

namespace App\Http\Controllers\Sitecp\Group;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\ForumPermission;
use App\EloquentModels\Group\Group;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Http\Controllers\Controller;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\Request;

class GroupPermissionsController extends Controller {
    private $forumPermissions;

    public function __construct() {
        parent::__construct();
        $this->forumPermissions = ConfigHelper::getForumPermissions();
    }

    public function getGroupForumPermissions(Request $request, $groupId) {
        $user = $request->get('auth');
        $group = Group::find($groupId);

        Condition::precondition(!$group, 404, 'There is no group with that ID');
        Condition::precondition($group->immunity >= User::getImmunity($user->userId), 400, 'You can not see this group');

        $categoryIds = ForumPermission::where('groupId', $groupId)
            ->whereRaw('(permissions & ' . $this->forumPermissions->canRead . ')')
            ->pluck('categoryId');

        return response()->json([
            'name' => $group->name,
            'children' => $this->getChildren(-1, $group->groupId, $categoryIds)
        ]);
    }

    private function getChildren($parentId, $groupId, $categoryIds) {
        $categories = Category::where('parentId', $parentId)->whereIn('categoryId', $categoryIds)->get(['categoryId', 'title']);

        return $categories->map(function ($category) use ($groupId, $categoryIds) {
            $children = $this->getChildren($category->categoryId, $groupId, $categoryIds);
            $children[] = $this->getPermissions($category->categoryId, $groupId);
            return [
                'name' => $category->title,
                'children' => $children
            ];
        });
    }

    private function getPermissions($categoryId, $groupId) {
        $permissions = [
            (object)['name' => 'Can access', 'value' => $this->forumPermissions->canRead],
            (object)['name' => 'Can post', 'value' => $this->forumPermissions->canPost],
            (object)['name' => 'Can post in others threads', 'value' => $this->forumPermissions->canPostInOthersThreads],
            (object)['name' => 'Can create threads', 'value' => $this->forumPermissions->canCreateThreads],
            (object)['name' => 'Can view threads', 'value' => $this->forumPermissions->canViewThreadContent],
            (object)['name' => 'Can view others threads', 'value' => $this->forumPermissions->canViewOthersThreads],
            (object)['name' => 'Can open/close own thread', 'value' => $this->forumPermissions->canOpenCloseOwnThread],

            (object)['name' => 'Can edit others threads/posts', 'value' => $this->forumPermissions->canEditOthersPosts],
            (object)['name' => 'Can move threads', 'value' => $this->forumPermissions->canMoveThreads],
            (object)['name' => 'Can open/close threads', 'value' => $this->forumPermissions->canCloseOpenThread],
            (object)['name' => 'Can approve/unapprove threads', 'value' => $this->forumPermissions->canApproveThreads],
            (object)['name' => 'Can approve/unapprove posts', 'value' => $this->forumPermissions->canApprovePosts],
            (object)['name' => 'Can merge threads and posts', 'value' => $this->forumPermissions->canMergeThreadsAndPosts],
            (object)['name' => 'Can change owner', 'value' => $this->forumPermissions->canChangeOwner],
            (object)['name' => 'Can sticky threads', 'value' => $this->forumPermissions->canStickyThread],
            (object)['name' => 'Can delete threads/posts', 'value' => $this->forumPermissions->canDeletePosts],
            (object)['name' => 'Can manage polls', 'value' => $this->forumPermissions->canManagePolls],
        ];

        $permission = ForumPermission::where('categoryId', $categoryId)->where('groupId', $groupId)->value('permissions');

        return [
            'name' => 'Permissions',
            'children' => array_map(function ($item) {
                return ['name' => $item->name, 'children' => []];
            }, Iterables::filter($permissions, function ($item) use ($permission) {
                return $permission & $item->value;
            }))
        ];
    }
}
