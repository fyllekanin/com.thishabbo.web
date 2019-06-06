<?php

namespace App\Http\Impl;

use App\EloquentModels\User\Follower;
use App\EloquentModels\User\User;
use App\Utils\Condition;

class ProfileControllerImpl {

    public function getUser($request) {
        $target = User::find($request->input('userId'));
        Condition::precondition(!$target, 404, 'No user with that ID');
        return $target;
    }

    public function throwIfFollowing($user, $target) {
        $isFollowing = Follower::where('userId', $user->userId)->where('targetId', $target->userId)->count('followerId') > 0;
        Condition::precondition($isFollowing, 400, 'You are already following this user');
    }

    public function getFollow($user, $targetId) {
        $follow = Follower::where('userId', $user->userId)->where('targetId', $targetId)->first();
        Condition::precondition(!$follow, 404, 'You are not following this user');
        return $follow;
    }

    public function getNewFollow($user, $target) {
        $follow = new Follower([
            'userId' => $user->userId,
            'targetId' => $target->userId,
            'isApproved' => !($target->profile && $target->profile->isPrivate)
        ]);
        $follow->save();
        return $follow;
    }

    public function canPostVisitorMessage($user, $profile, $parentMessage, $data) {
        Condition::precondition($this->isPrivate($user, $profile), 400, 'You are not an approved follower, you can not post here!');
        Condition::precondition(isset($data->parentId) && !$parentMessage, 404, 'The parent visitor message do not exist');
        Condition::precondition($parentMessage && $parentMessage->hostId != $profile->userId, 400, 'Parent message and host do not match');
        Condition::precondition(!isset($data->content) || empty($data->content), 400, 'Message can not be empty');
    }
}