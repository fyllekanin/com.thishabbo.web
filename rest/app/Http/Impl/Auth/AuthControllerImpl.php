<?php

namespace App\Http\Impl\Auth;

use App\EloquentModels\Forum\ForumPermission;
use App\EloquentModels\Theme;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\SettingsHelper;
use App\Helpers\UserHelper;
use App\Utils\Value;

class AuthControllerImpl {

    /**
     * Get the navigation from the settings
     *
     * @return array|mixed
     */
    public function getNavigation() {
        try {
            return json_decode(SettingsHelper::getSettingValue(ConfigHelper::getKeyConfig()->navigation));
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Get the theme for a user, if not logged in we get the default
     *
     * @param $user
     *
     * @return mixed
     */
    public function getTheme($user) {
        if (!UserHelper::isUserLoggedIn($user)) {
            return Theme::where('isDefault', true)
                ->first();
        }
        $themeId = Value::objectProperty($user, 'theme', 0);
        return Theme::where('themeId', $themeId)
            ->orWhere('isDefault', true)
            ->first();
    }

    /**
     * @param $user
     *
     * @return array
     */
    public function buildStaffPermissions($user) {
        $obj = [];
        $staffPermissions = ConfigHelper::getStaffConfig();

        foreach ($staffPermissions as $key => $value) {
            $obj[$key] = PermissionHelper::haveStaffPermission($user->userId, $value);
        }

        foreach ($obj as $key => $value) {
            if ($value) {
                $obj['isStaff'] = true;
                break;
            }
        }

        return $obj;
    }

    /**
     * @param $user
     *
     * @return array
     */
    public function buildSitecpPermissions($user) {
        $obj = ['isSitecp' => false];
        $sitecpPermissions = ConfigHelper::getSitecpConfig();
        $forumPermissions = ConfigHelper::getForumPermissions();

        // General sitecp permissions
        foreach ($sitecpPermissions as $key => $value) {
            $obj[$key] = PermissionHelper::haveSitecpPermission($user->userId, $value);
        }

        // Moderation permissions
        $obj['canModerateThreads'] = PermissionHelper::isSuperSitecp($user->userId) ||
            ForumPermission::withGroups($user->groupIds)
                ->withPermission($forumPermissions->canApproveThreads)
                ->count('categoryId') > 0;
        $obj['canModeratePosts'] = PermissionHelper::isSuperSitecp($user->userId) ||
            ForumPermission::withGroups($user->groupIds)
                ->withPermission($forumPermissions->canApprovePosts)
                ->count('categoryId') > 0;
        $obj['canManagePolls'] = PermissionHelper::isSuperSitecp($user->userId) ||
            ForumPermission::withGroups($user->groupIds)
                ->withPermission($forumPermissions->canManagePolls)
                ->count('categoryId') > 0;

        foreach ($obj as $key => $value) {
            if ($value) {
                $obj['isSitecp'] = true;
                break;
            }
        }

        return $obj;
    }
}