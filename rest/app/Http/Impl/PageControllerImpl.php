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
            (object) ['role' => 'Global Management', 'userId' => $parsed->globalManagement],
            (object) ['role' => 'EU Management', 'userId' => $parsed->europeManagement],
            (object) ['role' => 'OC Management', 'userId' => $parsed->oceaniaManagement],
            (object) ['role' => 'NA Management', 'userId' => $parsed->northAmericanManagement],
            (object) ['role' => 'EU Radio', 'userId' => $parsed->europeRadio],
            (object) ['role' => 'OC Radio', 'userId' => $parsed->oceaniaRadio],
            (object) ['role' => 'NA Radio', 'userId' => $parsed->northAmericanRadio],
            (object) ['role' => 'EU Events', 'userId' => $parsed->europeEvents],
            (object) ['role' => 'OC Events', 'userId' => $parsed->oceaniaEvents],
            (object) ['role' => 'NA Events', 'userId' => $parsed->northAmericanEvents],
            (object) ['role' => 'Moderation', 'userId' => $parsed->moderation],
            (object) ['role' => 'Media', 'userId' => $parsed->media],
            (object) ['role' => 'Quests', 'userId' => $parsed->quests],
            (object) ['role' => 'Graphics', 'userId' => $parsed->graphics],
            (object) ['role' => 'Audio Producer', 'userId' => $parsed->audioProducer]
        ];

        return array_values(array_map(function ($data) {
            $temp = User::where('userId', $data->userId)->first(['nickname', 'habbo']);
            $temp->role = $data->Role;
            return $temp;
        }, array_filter($userIds, function ($data) {
            return User::where('userId', $data->userId)->count() > 0;
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