<?php

namespace App\Helpers;

use App\Constants\CategoryOptions;
use App\EloquentModels\Forum\ForumPermission;
use App\EloquentModels\Group\Group;
use App\EloquentModels\User\User;
use Illuminate\Support\Facades\Cache;

class PermissionHelper {

    public static function isSuperSitecp($userId) {
        return in_array($userId, CONST_APP_SUPER_ADMINS);
    }

    public static function haveForumPermission($userId, $permission, $categoryId) {
        $cacheString = 'forum-permission-'.$userId.'-'.$permission.'-'.$categoryId;
        if (Cache::has($cacheString)) {
            return Cache::get($cacheString);
        }
        if (self::isSuperSitecp($userId)) {
            return true;
        }

        $user = User::find($userId);
        if (!$user) {
            $user = (object) [
                'groupIds' => [0]
            ];
        }

        $result = ForumPermission::where('categoryId', $categoryId)
                ->whereIn('groupId', $user->groupIds)
                ->whereRaw('(permissions & '.$permission.')')
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
        $categoryOptions = (array) $category->options;

        foreach (CategoryOptions::getAsOptions() as $key => $value) {
            if (isset($categoryOptions[$key]) && $categoryOptions[$key]) {
                $options += $value;
            }
        }
        return $options;
    }

    public static function getStaffMiddleware($permission) {
        if (is_array($permission)) {
            $permissions = implode('|', $permission);
            return ['staff_permission.check:'.$permissions];
        }
        return ['staff_permission.check:'.$permission];
    }

    public static function getSitecpMiddleware($permission) {
        if (is_array($permission)) {
            $permissions = implode('|', $permission);
            return ['sitecp_permission.check:'.$permissions];
        }
        return ['sitecp_permission.check:'.$permission];
    }

    private static function checkPermission($type, $userId, $permission) {
        $availableTypes = ['sitecpPermissions', 'staffPermissions'];
        if (self::isSuperSitecp($userId)) {
            return true;
        }

        $user = User::find($userId);
        if (!$user || $user->userId == 0) {
            return false;
        }

        if (!in_array($type, $availableTypes)) {
            return false;
        }

        return Group::whereIn('groupId', $user->groupIds)
                ->whereRaw('('.$type.' & '.$permission.')')
                ->count('groupId') > 0;
    }
}
