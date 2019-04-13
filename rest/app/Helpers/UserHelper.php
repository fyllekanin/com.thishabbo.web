<?php

namespace App\Helpers;

use App\EloquentModels\Group\Group;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserData;
use App\EloquentModels\User\UserGroup;
use App\Utils\BBcodeUtil;
use App\Utils\Value;
use Illuminate\Support\Facades\Cache;

class UserHelper {

    /**
     * @param $userId
     *
     * @return mixed|null
     */
    public static function getSlimUser ($userId) {
        if (!$userId && $userId != 0) {
            return null;
        }

        if (Cache::has('slim-user-' . $userId)) {
            return Cache::get('slim-user-' . $userId);
        }

        $slimUser = User::where('users.userId', $userId)
            ->leftJoin('groups', 'groups.groupId', '=', 'users.displayGroupId')
            ->leftJoin('userdata', 'userdata.userId', '=', 'users.userId')
            ->select('users.userId', 'users.nickname', 'users.createdAt',
                'users.displayGroupId', 'groups.nameStyling as styling', 'userdata.avatarUpdatedAt')
            ->first();

        if (!$slimUser) {
            Cache::add('slim-user-' . $userId, null, 5);
            return null;
        }

        Cache::add('slim-user-' . $userId, $slimUser, 5);

        return $slimUser;
    }

    /**
     * @param $userId
     *
     * @return null|\stdClass
     */
    public static function getUser ($userId) {
        if (!$userId) {
            return null;
        }

        if (Cache::has('fe-user-' . $userId)) {
            return Cache::get('fe-user-' . $userId);
        }

        $userObj = self::getUserFromId($userId);
        if (!$userObj) {
            Cache::add('fe-user-' . $userId, null, 5);
            return null;
        }

        $userdata = self::getUserDataOrCreate($userId);
        $postBit = (object) self::getUserPostBit($userdata);

        $user = new \stdClass();
        $user->userId = $userId;
        $user->nickname = $userObj->nickname;
        $user->styling = self::getNicknameStylingFromId($userId);
        $user->userBars = self::getUserBars($userId);
        $user->createdAt = $postBit->hideJoinDate ? null : $userObj->createdAt->timestamp;
        $user->posts = $postBit->hidePostCount ? null : $userObj->posts;
        $user->likes = $postBit->hideLikesCount ? null : $userObj->likes;

        $user = self::setUserDataFields($user, $userdata, $postBit);

        Cache::add('fe-user-' . $userId, $user, 5);
        return $user;
    }

    /**
     * @param $userId
     *
     * @return mixed|string
     */
    public static function getNicknameStylingFromId ($userId) {
        $user = self::getUserFromId($userId);
        $displayGroupId = Value::objectProperty($user, 'displayGroupId', 0);
        $group = Group::find($displayGroupId);

        return $group ? $group->nameStyling : '';
    }

    /**
     * @param $userId
     *
     * @return object
     */
    public static function getUserFromId ($userId) {
        $defaultUser = (object)[
            'userId' => 0,
            'groupIds' => [0],
            'nickname' => 'no-one',
            'createdAt' => (object)['timestamp' => 0],
            'posts' => 0,
            'likes' => 0,
            'lastActivity' => 0,
            'save' => function() {}
        ];

        if ($userId == 0) {
            return $defaultUser;
        }

        if (Cache::has('user-' . $userId)) {
            return Cache::get('user-' . $userId);
        }

        $user = User::where('users.userId', $userId)
            ->leftJoin('userdata', 'users.userId', '=', 'userdata.userId')
            ->select('users.*', 'userdata.userId', 'userdata.avatarUpdatedAt')
            ->first();

        if (!$user) {
            return $defaultUser;
        }

        Cache::add('user-' . $userId, $user, 1);
        return $user;
    }

    /**
     * @param $userId
     *
     * @return UserData
     */
    public static function getUserDataOrCreate ($userId) {
        $userData = UserData::userId($userId)->first();

        if ($userData) {
            return $userData;
        }

        $new = new UserData([
            'userId' => $userId
        ]);
        $new->save();
        return $new;
    }

    /**
     * @param $userdata
     *
     * @return array
     */
    public static function getUserPostBit ($userdata) {
        $obj = [];
        $postBitOptions = ConfigHelper::getPostBitConfig();

        foreach ($postBitOptions as $key => $value) {
            $obj[$key] = $userdata->postBit & $value;
        }

        return $obj;
    }

    /**
     * @param $user - Logged in user
     * @param $currentId - user to be managed
     *
     * @return bool
     */
    public static function canManageUser ($user, $currentId) {
        return $user->userId == $currentId ||
            User::getImmunity($user->userId) > User::getImmunity($currentId);
    }

    private static function getUserBars ($userId) {
        return UserGroup::where('userId', $userId)->get()->map(function ($userGroup) {
            return [
                'name' => $userGroup->group->name,
                'styling' => $userGroup->group->userBarStyling
            ];
        });
    }

    private static function setUserDataFields ($user, $userdata, $postBit) {
        $user->signature = $userdata ? BBcodeUtil::bbcodeParser($userdata->signature) : '';
        $user->social = $userdata && !$postBit->hideSocials ? (object) [
            'discord' => $userdata->discord,
            'twitter' => $userdata->twitter
        ] : null;

        return $user;
    }
}
