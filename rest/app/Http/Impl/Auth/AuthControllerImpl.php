<?php

namespace App\Http\Impl\Auth;

use App\Constants\Permission\CategoryPermissions;
use App\Constants\Permission\SiteCpPermissions;
use App\Constants\Permission\StaffPermissions;
use App\Constants\SettingsKeys;
use App\EloquentModels\Forum\ForumPermission;
use App\EloquentModels\Theme;
use App\Helpers\PermissionHelper;
use App\Repositories\Repository\SettingRepository;
use App\Utils\Value;
use Exception;

class AuthControllerImpl {

    private $mySettingRepository;

    public function __construct(SettingRepository $settingRepository) {
        $this->mySettingRepository = $settingRepository;
    }

    /**
     * Get the navigation from the settings
     *
     * @return array|mixed
     */
    public function getNavigation() {
        try {
            return $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::NAVIGATION);
        } catch (Exception $e) {
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
        if (!$user || $user->userId == 0) {
            return Theme::where('isDefault', true)
                ->first();
        }
        $themeId = Value::objectProperty($user, 'theme', 0);
        return Theme::where('themeId', $themeId)
            ->orWhere(
                function ($query) use ($themeId) {
                    if ($themeId >= 0) {
                        $query->where('isDefault', true);
                    }
                }
            )
            ->value('minified');
    }

    /**
     * @param $user
     *
     * @return array
     */
    public function buildStaffPermissions($user) {
        $obj = [];
        foreach (StaffPermissions::getAsOptions() as $key => $value) {
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

        // General sitecp permissions
        foreach (SiteCpPermissions::getAsOptions() as $key => $value) {
            $obj[$key] = PermissionHelper::haveSitecpPermission($user->userId, $value);
        }

        // Moderation permissions
        $obj['canModerateThreads'] = PermissionHelper::isSuperSitecp($user->userId) ||
            ForumPermission::withGroups($user->groupIds)
                ->withPermission(CategoryPermissions::CAN_APPROVE_THREADS)
                ->count('categoryId') > 0;
        $obj['canModeratePosts'] = PermissionHelper::isSuperSitecp($user->userId) ||
            ForumPermission::withGroups($user->groupIds)
                ->withPermission(CategoryPermissions::CAN_APPROVE_POSTS)
                ->count('categoryId') > 0;
        $obj['canManagePolls'] = PermissionHelper::isSuperSitecp($user->userId) ||
            ForumPermission::withGroups($user->groupIds)
                ->withPermission(CategoryPermissions::CAN_MANAGE_POLLS)
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
