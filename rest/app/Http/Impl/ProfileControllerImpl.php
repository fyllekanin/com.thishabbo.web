<?php

namespace App\Http\Impl;

use App\Constants\Permission\SiteCpPermissions;
use App\EloquentModels\User\Follower;
use App\EloquentModels\User\User;
use App\Helpers\PermissionHelper;
use App\Utils\Condition;

class ProfileControllerImpl {


    public function getUser($request) {
        $target = User::find($request->input('userId'));
        Condition::precondition(!$target, 404, 'No user with that ID');
        return $target;
    }

    public function throwIfFollowing($user, $target) {
        $isFollowing = Follower::userId($user->userId)->targetId($target->userId)->count('followerId') > 0;
        Condition::precondition($isFollowing, 400, 'You are already following this user');
    }

    public function getFollow($user, $targetId) {
        $follow = Follower::userId($user->userId)->targetId($targetId)->first();
        Condition::precondition(!$follow, 404, 'You are not following this user');
        return $follow;
    }

    public function getNewFollow($user, $target) {
        $follower = new Follower();
        $follower->userId = $user->userId;
        $follower->targetId = $target->userId;
        $follower->isApproved = !($target->profile && $target->profile->isPrivate);

        $follower->save();
        return $follower;
    }

    public function canPostVisitorMessage($user, $profile, $parentMessage, $data) {
        Condition::precondition($this->isPrivate($user, $profile), 400, 'You are not an approved follower, you can not post here!');
        Condition::precondition(isset($data->parentId) && !$parentMessage, 404, 'The parent visitor message do not exist');
        Condition::precondition($parentMessage && $parentMessage->hostId != $profile->userId, 400, 'Parent message and host do not match');
        Condition::precondition(!isset($data->content) || empty($data->content), 400, 'Message can not be empty');
    }

    /**
     * @param $user
     * @param $profile
     *
     * @return bool
     */
    public function isPrivate($user, $profile) {
        if ($user->userId == $profile->userId) {
            return false;
        }

        if (PermissionHelper::haveSitecpPermission($user->userId, SiteCpPermissions::CAN_PASS_PRIVATE_PROFILES)) {
            return false;
        }

        if (!$profile->profile || !$profile->profile->isPrivate) {
            return false;
        }

        return Follower::userId($user->userId)->targetId($profile->userId)->isApproved()->count('followerId') === 0;
    }
}
