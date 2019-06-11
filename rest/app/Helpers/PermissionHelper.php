<?php

namespace App\Helpers;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\ForumPermission;
use App\EloquentModels\Group\Group;
use Illuminate\Support\Facades\Cache;

class PermissionHelper {

    private static $superSitecps = [1];

    public static function isSuperSitecp($userId) {
        return in_array($userId, self::$superSitecps);
    }

    public static function getSuperSitecps() {
        return self::$superSitecps;
    }

    public static function haveGroupOption($userId, $option) {
        $user = UserHelper::getUserFromId($userId);
        $groups = $user->userId > 0 ? $user->groups : [];

        foreach ($groups as $group) {
            if ($group->options & $option) {
                return true;
            }
        }
        return false;
    }

    public static function haveForumOption($categoryId, $option) {
        $category = Category::find($categoryId);
        return $category && $category->options & $option;
    }

    public static function haveForumPermission($userId, $permission, $categoryId) {
        $cacheString = 'forum-permission-' . $userId . '-' . $permission . '-' . $categoryId;
        if (Cache::has($cacheString)) {
            return Cache::get($cacheString);
        }
        if (self::isSuperSitecp($userId)) {
            return true;
        }

        $user = UserHelper::getUserFromId($userId);
        if (!$user) {
            return false;
        }

        $result = ForumPermission::where('categoryId', $categoryId)
                ->whereIn('groupId', $user->groupIds)
                ->whereRaw('(permissions & ' . $permission . ')')
                ->count('categoryId') > 0;

        Cache::add($cacheString, $result, 10);
        return $result;
    }

    public static function haveStaffPermission($userId, $permission) {
        return self::checkPermission('staffPermissions', $userId, $permission);
    }

    public static function haveForumPermissionWithException($userId, $permission, $categoryId, $message, $status = 403) {
        if (!self::haveForumPermission($userId, $permission, $categoryId)) {
            abort($status, $message);
        }
    }

    public static function haveSitecpPermission($userId, $permission) {
        return self::checkPermission('sitecpPermissions', $userId, $permission);
    }

    public static function nameToNumberOptions($category) {
        $options = 0;
        $categoryOptions = (array)$category->options;

        foreach (ConfigHelper::getForumOptionsConfig() as $key => $value) {
            if (isset($categoryOptions[$key]) && $categoryOptions[$key]) {
                $options += $value;
            }
        }
        return $options;
    }

    public static function getStaffMiddleware($permission) {
        if (is_array($permission)) {
            $permissions = implode('|', $permission);
            return ['staff_permission.check:' . $permissions];
        }
        return ['staff_permission.check:' . $permission];
    }

    public static function getSitecpMiddleware($permission) {
        if (is_array($permission)) {
            $permissions = implode('|', $permission);
            return ['sitecp_permission.check:' . $permissions];
        }
        return ['sitecp_permission.check:' . $permission];
    }

    private static function checkPermission($type, $userId, $permission) {
        $availableTypes = ['sitecpPermissions', 'staffPermissions'];
        if (self::isSuperSitecp($userId)) {
            return true;
        }

        $user = UserHelper::getUserFromId($userId);
        if ($user->userId == 0) {
            return false;
        }

        if (!in_array($type, $availableTypes)) {
            return false;
        }

        return Group::whereIn('groupId', $user->groupIds)
                ->whereRaw('(' . $type . ' & ' . $permission . ')')
                ->count('groupId') > 0;
    }
}
