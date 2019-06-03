<?php

namespace App\Helpers;

use App\EloquentModels\Badge;
use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\Shop\UserSubscription;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserData;
use App\EloquentModels\User\UserGroup;
use App\EloquentModels\User\UserItem;
use App\Utils\BBcodeUtil;
use App\Utils\Value;
use Illuminate\Support\Facades\Cache;

class UserHelper {

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
            ->select('users.userId', 'users.nickname', 'users.createdAt',
                'users.displayGroupId', 'userdata.avatarUpdatedAt',
                'userdata.nameColour AS customColour', 'groups.nameColour AS groupColour')->first();
        

        $slimUser->nameColour = $slimUser->customColour ? $slimUser->customColour : $slimUser->groupColour;
        $slimUser->nameColour = Value::objectJsonProperty($slimUser, 'nameColour', []);

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
        $user->createdAt = $postBit->hideJoinDate ? null : $userObj->createdAt->timestamp;
        $user->posts = $postBit->hidePostCount ? null : $userObj->posts;
        $user->likes = $postBit->hideLikesCount ? null : $userObj->likes;
        $user->badges = UserItem::badge()->where('userId', $user->userId)->isActive()->pluck('itemId')->map(function ($badgeId) {
            $badge = Badge::find($badgeId);
            return [
                'badgeId' => $badgeId,
                'name' => $badge->name,
                'description' => $badge->description,
                'updatedAt' => $badge->updatedAt
            ];
        });

        if (isset($userdata->nameColour)) {
            $user->nameColour = $userdata->nameColour;
        } else if (isset($userObj->displayGroup)) {
            $user->nameColour = $userObj->displayGroup->nameColour;
        }

        $user->nameColour = Value::objectJsonProperty($user, 'nameColour', []);

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

    public static function getMaxAvatarSize($userId) {
        $user = User::find($userId);
        if (!$user) {
            return (object)['width' => 200, 'height' => 200];
        }
        return (object)[
            'width' => self::getMaxAvatarWidth($user),
            'height' => self::getMaxAvatarHeight($user)
        ];
    }

    public static function hasSubscriptionFeature($userId, $feature) {
        $userSubscriptionIds = UserSubscription::where('userId', $userId)->pluck('subscriptionId');
        return Subscription::whereIn('subscriptionId', $userSubscriptionIds)
                ->whereRaw('(options & ' . $feature . ')')
                ->count() > 0;
    }


    private static function getMaxAvatarWidth($user) {
        $size = 200;

        foreach ($user->groups as $group) {
            $size = $group->avatarWidth > $size ? $group->avatarWidth : $size;
        }

        foreach ($user->subscriptions as $subscription) {
            $size = $subscription->avatarWidth > $size ? $subscription->avatarWidth : $size;
        }
        return $size;
    }

    private static function getMaxAvatarHeight($user) {
        $size = 200;

        foreach ($user->groups as $group) {
            $size = $group->avatarHeight > $size ? $group->avatarHeight : $size;
        }

        foreach ($user->subscriptions as $subscription) {
            $size = $subscription->avatarHeight > $size ? $subscription->avatarHeight : $size;
        }
        return $size;
    }

    private static function getUserBars($userId) {
        return UserGroup::where('userId', $userId)->get()->map(function ($userGroup) {
            return [
                'name' => $userGroup->group->name,
                'styling' => $userGroup->group->userBarStyling
            ];
        });
    }

    private static function setUserDataFields($user, $userdata, $postBit) {
        $user->signature = $userdata ? BBcodeUtil::bbcodeParser($userdata->signature) : '';
        $user->social = $userdata && !$postBit->hideSocials ? (object)[
            'discord' => $userdata->discord,
            'twitter' => $userdata->twitter
        ] : null;

        return $user;
    }
}
