<?php

namespace App\Http\Impl;

use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\SettingsHelper;
use App\Utils\Iterables;
use Illuminate\Support\Facades\File;

class PageControllerImpl {

    public function getCommitLogChanges($folder) {
        $fileNames = Iterables::filter(scandir(SettingsHelper::getResourcesPath('commit-logs/' . $folder)), function($fileName) {
            return preg_match('/(.*?).json/', $fileName);
        });

        return array_map(function($fileName) use ($folder) {
            $file = File::get(SettingsHelper::getResourcesPath('commit-logs/' . $folder . '/' . $fileName));
            return json_decode($file);
        }, $fileNames);
    }

    public function getStaffSpotlight() {
        $value = SettingsHelper::getSettingValue(ConfigHelper::getKeyConfig()->staffOfTheWeek);
        $parsed = json_decode($value);

        $userIds = [
            $parsed->globalManagement,
            $parsed->europeManagement,
            $parsed->oceaniaManagement,
            $parsed->northAmericanManagement,
            $parsed->europeRadio,
            $parsed->oceaniaRadio,
            $parsed->northAmericanRadio,
            $parsed->europeEvents,
            $parsed->oceaniaEvents,
            $parsed->northAmericanEvents,
            $parsed->moderation,
            $parsed->media,
            $parsed->quests,
            $parsed->graphics,
            $parsed->audioProducer
        ];

        return array_map(function ($userId) {
            return User::where('userId', $userId)->first(['nickname', 'habbo']);
        }, array_filter($userIds, function ($userId) {
            return User::where('userId', $userId)->count() > 0;
        }));
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