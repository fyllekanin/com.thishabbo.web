<?php

namespace App\Http\Impl;

use App\EloquentModels\Theme;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\SettingsHelper;
use App\Helpers\UserHelper;
use App\Utils\Iterables;
use App\Utils\Value;

class PageControllerImpl {

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
     * Filter out categories which the user can't read
     *
     * @param $categoryIds
     * @param $user
     *
     * @return array
     */
    public function getFilteredCategoryIds($categoryIds, $user) {
        $canRead = ConfigHelper::getForumPermissions()->canRead;
        return Iterables::filter($categoryIds, function ($categoryId) use ($user, $canRead) {
            return PermissionHelper::haveForumPermission($user->userId, $canRead, $categoryId);
        });
    }
}