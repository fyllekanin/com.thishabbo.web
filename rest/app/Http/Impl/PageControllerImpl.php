<?php

namespace App\Http\Impl;

use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\SettingsHelper;
use App\Utils\Iterables;
use App\Utils\Value;
use Illuminate\Support\Facades\File;

class PageControllerImpl {

    public function getCommitLogChanges($folder) {
        $fileNames = Iterables::filter(scandir(SettingsHelper::getResourcesPath('commit-logs/' . $folder)), function ($fileName) {
            return preg_match('/(.*?).json/', $fileName);
        });

        return array_map(function ($fileName) use ($folder) {
            $file = File::get(SettingsHelper::getResourcesPath('commit-logs/' . $folder . '/' . $fileName));
            return json_decode($file);
        }, $fileNames);
    }

    public function getStaffSpotlight() {
        $value = SettingsHelper::getSettingValue(ConfigHelper::getKeyConfig()->staffOfTheWeek);
        $parsed = json_decode($value);

        $userIds = [
            (object)['role' => 'Global Management', 'userId' => Value::objectProperty($parsed, 'globalManagement', null)],
            (object)['role' => 'EU Management', 'userId' => Value::objectProperty($parsed, 'europeManagement', null)],
            (object)['role' => 'OC Management', 'userId' => Value::objectProperty($parsed, 'oceaniaManagement', null)],
            (object)['role' => 'NA Management', 'userId' => Value::objectProperty($parsed, 'northAmericanManagement', null)],
            (object)['role' => 'EU Radio', 'userId' => Value::objectProperty($parsed, 'europeRadio', null)],
            (object)['role' => 'OC Radio', 'userId' => Value::objectProperty($parsed, 'oceaniaRadio', null)],
            (object)['role' => 'NA Radio', 'userId' => Value::objectProperty($parsed, 'northAmericanRadio', null)],
            (object)['role' => 'EU Events', 'userId' => Value::objectProperty($parsed, 'europeEvents', null)],
            (object)['role' => 'OC Events', 'userId' => Value::objectProperty($parsed, 'oceaniaEvents', null)],
            (object)['role' => 'NA Events', 'userId' => Value::objectProperty($parsed, 'northAmericanEvents', null)],
            (object)['role' => 'Moderation', 'userId' => Value::objectProperty($parsed, 'moderation', null)],
            (object)['role' => 'Media', 'userId' => Value::objectProperty($parsed, 'media', null)],
            (object)['role' => 'Quests', 'userId' => Value::objectProperty($parsed, 'quests', null)],
            (object)['role' => 'Graphics', 'userId' => Value::objectProperty($parsed, 'graphics', null)],
            (object)['role' => 'Audio Producer', 'userId' => Value::objectProperty($parsed, 'audioProducer', null)],
            (object)['role' => 'Community Events', 'userId' => Value::objectProperty($parsed, 'communityEvents', null)],
            (object)['role' => 'Builder', 'userId' => Value::objectProperty($parsed, 'builder', null)]
        ];

        return array_values(array_map(function ($data) {
            $temp = User::where('userId', $data->userId)->first(['nickname', 'habbo']);
            $temp->role = $data->role;
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
