<?php

namespace App\Helpers;

use App\EloquentModels\User\Avatar;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserData;
use App\Utils\Value;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;

class AvatarHelper {

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

    public static function getCurrentAvatar($userId) {
        $avatar = Avatar::where('userId', $userId)->orderBy('updatedAt', 'DESC')->first();
        return (object)[
            'userId' => Value::objectProperty($avatar, 'userId', 0),
            'avatarId' => Value::objectProperty($avatar, 'avatarId', 0),
            'width' => Value::objectProperty($avatar, 'width', 0),
            'height' => Value::objectProperty($avatar, 'height', 0)
        ];
    }

    public static function clearAvatarIfInvalid($userId) {
        $currentAvatar = self::getCurrentAvatar($userId);
        $maxAvSize = self::getMaxAvatarSize($userId);
        if ($currentAvatar->width <= $maxAvSize->width && $currentAvatar->height <= $maxAvSize->height) {
            return;
        }

        self::backupAvatarIfExists($currentAvatar);

        $image = Image::make(base_path('public/rest/resources/images/old-avatars/' . $currentAvatar->avatarId . '.gif'))
            ->resize($maxAvSize->width, $maxAvSize->height)
            ->save(base_path('public/rest/resources/images/users/' . $userId . '.gif'));

        $newAvatar = new Avatar([
            'userId' => $userId,
            'width' => $image->width(),
            'height' => $image->height()
        ]);
        $newAvatar->save();
        UserData::where('userId', $userId)->update(['avatarUpdatedAt' => time()]);
    }

    public static function backupAvatarIfExists($currentAvatar) {
        if ($currentAvatar->avatarId == 0
            || !File::exists(base_path('public/rest/resources/images/users/' . $currentAvatar->userId . '.gif'))) {
            return;
        }

        File::move(base_path('public/rest/resources/images/users/' . $currentAvatar->userId . '.gif'),
            base_path('public/rest/resources/images/old-avatars/') . $currentAvatar->avatarId . '.gif');
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

}