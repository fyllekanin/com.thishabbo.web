<?php

namespace App\Helpers;

use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\Shop\UserSubscription;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserData;
use App\EloquentModels\User\UserGroup;
use App\Utils\BBcodeUtil;
use App\Utils\Value;
use Illuminate\Support\Facades\Cache;

class UserHelper {

    public static function isUserLoggedIn($user) {
        return $user && $user->userId > 0;
    }

    /**
     * @param $userId
     *
     * @return mixed|null
     */
    public static function getSlimUser($userId) {
        if (!$userId && !is_int($userId)) {
            return null;
        }

        if (Cache::has('slim-user-' . $userId)) {
            return Cache::get('slim-user-' . $userId);
        }

        $slimUser = User::where('users.userId', $userId)
            ->leftJoin('groups', 'groups.groupId', '=', 'users.displayGroupId')
            ->leftJoin('userdata', 'userdata.userId', '=', 'users.userId')
            ->select('users.userId', 'users.nickname', 'users.habbo', 'users.createdAt',
                'users.displayGroupId', 'users.posts', 'users.likes', 'userdata.avatarUpdatedAt',
                'userdata.nameColor AS customColor', 'groups.nameColor AS groupColor',
                'userdata.iconId', 'userdata.iconPosition', 'userdata.effectId')->first();

        if (!$slimUser) {
            Cache::add('slim-user-' . $userId, null, 5);
            return null;
        }

        $slimUser->nameColor = $slimUser->customColor ? $slimUser->customColor : $slimUser->groupColor;
        $slimUser->nameColor = Value::objectJsonProperty($slimUser, 'nameColor', []);

        Cache::add('slim-user-' . $userId, $slimUser, 5);

        return $slimUser;
    }

    /**
     * @param $userId
     *
     * @return null|\stdClass
     */
    public static function getUser($userId) {
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
        $postBit = (object)self::getUserPostBit($userdata);

        $user = new \stdClass();
        $user->userId = $userId;
        $user->nickname = $userObj->nickname;
        $user->userBars = self::getUserBars($userId);
        $user->habbo = Value::objectProperty($userObj, 'habbo', '');
        $user->createdAt = $userObj->createdAt->timestamp;
        $user->posts = $userObj->posts;
        $user->likes = $userObj->likes;
        $user->postBitSettings = $postBit;
        $user->badgeIds = Value::objectJsonProperty($userdata, 'activeBadges', []);

        if (isset($userdata->nameColor)) {
            $user->nameColor = $userdata->nameColor;
        } else if (isset($userObj->displayGroup)) {
            $user->nameColor = $userObj->displayGroup->nameColor;
        }

        $user->nameColor = Value::objectJsonProperty($user, 'nameColor', []);

        $user = self::setUserDataFields($user, $userdata, $postBit);

        Cache::add('fe-user-' . $userId, $user, 5);
        return $user;
    }

    /**
     * @param $userId
     *
     * @return object
     */
    public static function getUserFromId($userId) {
        $defaultUser = (object)[
            'userId' => 0,
            'groupIds' => [0],
            'nickname' => 'no-one',
            'createdAt' => (object)['timestamp' => 0],
            'posts' => 0,
            'likes' => 0,
            'lastActivity' => 0,
            'save' => function () {
            }
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
    public static function getUserDataOrCreate($userId) {
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
    public static function getUserPostBit($userdata) {
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
    public static function canManageUser($user, $currentId) {
        return $user->userId == $currentId ||
            User::getImmunity($user->userId) > User::getImmunity($currentId);
    }


    public static function hasSubscriptionFeature($userId, $feature) {
        $userSubscriptionIds = UserSubscription::where('userId', $userId)->pluck('subscriptionId');
        return Subscription::whereIn('subscriptionId', $userSubscriptionIds)
                ->whereRaw('(options & ' . $feature . ')')
                ->count() > 0;
    }

    private static function getUserBars($userId) {
        return UserGroup::where('userId', $userId)->where('isBarActive', 1)->get()->map(function ($userGroup) {
            return [
                'name' => !empty($userGroup->group->nickname) ? $userGroup->group->nickname : $userGroup->group->name,
                'styling' => $userGroup->group->userBarStyling
            ];
        });
    }

    private static function setUserDataFields($user, $userdata, $postBit) {
        $user->signature = BBcodeUtil::bbcodeParser($userdata->signature);
        $user->avatarUpdatedAt = $userdata->avatarUpdatedAt;
        $user->namePosition = $userdata->namePosition;
        $user->iconId = $userdata->iconId;
        $user->iconPosition = $userdata->iconPosition;
        $user->effectId = $userdata->effectId;
        $user->barColor = Value::objectJsonProperty($userdata, 'barColor', null);
        $user->social = $userdata && !$postBit->hideSocials ? (object)[
            'discord' => $userdata->discord,
            'twitter' => $userdata->twitter
        ] : null;

        return $user;
    }
}
