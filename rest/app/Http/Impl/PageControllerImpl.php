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
            ["Global Management", $parsed->globalManagement],
            ["EU Management", $parsed->europeManagement],
            ["OC Management", $parsed->oceaniaManagement],
            ["NA Management", $parsed->northAmericanManagement],
            ["EU Radio", $parsed->europeRadio],
            ["OC Radio", $parsed->oceaniaRadio],
            ["NA Radio", $parsed->northAmericanRadio],
            ["EU Events", $parsed->europeEvents],
            ["OC Events", $parsed->oceaniaEvents],
            ["NA Events", $parsed->northAmericanEvents],
            ["Moderation", $parsed->moderation],
            ["Media", $parsed->media],
            ["Quests", $parsed->quests],
            ["Graphics", $parsed->graphics],
            ["Audio Producer", $parsed->audioProducer]
        ];

        return array_values(array_map(function ($userId) {
            $temp = User::where('userId', $userId[1])->first(['nickname', 'habbo']);
            $temp["role"] = $userId[0];
            return $temp;
        }, array_filter($userIds, function ($userId) {
            return User::where('userId', $userId[1])->count() > 0;
        })));
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