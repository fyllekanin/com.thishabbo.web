<?php

namespace App\Http\Controllers\Sitecp\Group;

use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\ForumPermission;
use App\EloquentModels\Group\Group;
use App\EloquentModels\User\User;
use App\Http\Controllers\Controller;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\Request;

class GroupPermissionsController extends Controller {

    public function getGroupForumPermissions(Request $request, $groupId) {
        $user = $request->get('auth');
        $group = Group::find($groupId);

        Condition::precondition(!$group, 404, 'There is no group with that ID');
        Condition::precondition($group->immunity >= User::getImmunity($user->userId), 400, 'You can not see this group');

        $categoryIds = ForumPermission::where('groupId', $groupId)
            ->whereRaw('(permissions & '.CategoryPermissions::CAN_READ.')')
            ->pluck('categoryId');

        return response()->json(
            [
                'name' => $group->name,
                'children' => $this->getChildren(-1, $group->groupId, $categoryIds)
            ]
        );
    }

    private function getChildren($parentId, $groupId, $categoryIds) {
        $categories = Category::where('parentId', $parentId)->whereIn('categoryId', $categoryIds)->get(['categoryId', 'title']);

        return $categories->map(
            function ($category) use ($groupId, $categoryIds) {
                $children = $this->getChildren($category->categoryId, $groupId, $categoryIds);
                $children[] = $this->getPermissions($category->categoryId, $groupId);
                return [
                    'name' => $category->title,
                    'children' => $children
                ];
            }
        );
    }

    private function getPermissions($categoryId, $groupId) {
        $permissions = [
            (object) ['name' => 'Can access', 'value' => CategoryPermissions::CAN_READ],
            (object) ['name' => 'Can post', 'value' => CategoryPermissions::CAN_POST],
            (object) ['name' => 'Can post in others threads', 'value' => CategoryPermissions::CAN_POST_IN_OTHERS_THREADS],
            (object) ['name' => 'Can create threads', 'value' => CategoryPermissions::CAN_CREATE_THREADS],
            (object) ['name' => 'Can view threads', 'value' => CategoryPermissions::CAN_VIEW_THREAD_CONTENT],
            (object) ['name' => 'Can view others threads', 'value' => CategoryPermissions::CAN_VIEW_OTHERS_THREADS],
            (object) ['name' => 'Can open/close own thread', 'value' => CategoryPermissions::CAN_OPEN_CLOSE_OWN_THREAD],

            (object) ['name' => 'Can edit others threads/posts', 'value' => CategoryPermissions::CAN_EDIT_OTHERS_POSTS],
            (object) ['name' => 'Can move threads', 'value' => CategoryPermissions::CAN_MOVE_THREADS],
            (object) ['name' => 'Can open/close threads', 'value' => CategoryPermissions::CAN_CLOSE_OPEN_THREAD],
            (object) ['name' => 'Can approve/unapprove threads', 'value' => CategoryPermissions::CAN_APPROVE_THREADS],
            (object) ['name' => 'Can approve/unapprove posts', 'value' => CategoryPermissions::CAN_APPROVE_POSTS],
            (object) ['name' => 'Can merge threads and posts', 'value' => CategoryPermissions::CAN_MERGE_THREADS_AND_POSTS],
            (object) ['name' => 'Can change owner', 'value' => CategoryPermissions::CAN_CHANGE_OWNER],
            (object) ['name' => 'Can sticky threads', 'value' => CategoryPermissions::CAN_STICKY_THREAD],
            (object) ['name' => 'Can delete threads/posts', 'value' => CategoryPermissions::CAN_DELETE_POSTS],
            (object) ['name' => 'Can manage polls', 'value' => CategoryPermissions::CAN_MANAGE_POLLS],
        ];

        $permission = ForumPermission::where('categoryId', $categoryId)->where('groupId', $groupId)->value('permissions');

        return [
            'name' => 'Permissions',
            'children' => array_map(
                function ($item) {
                    return ['name' => $item->name, 'children' => []];
                },
                Iterables::filter(
                    $permissions,
                    function ($item) use ($permission) {
                        return $permission & $item->value;
                    }
                )
            )
        ];
    }
}
