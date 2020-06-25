<?php

namespace App\Factories\Notification\Views;

use App\EloquentModels\User\Follower;
use App\Helpers\UserHelper;

class FollowerView {

    public $user;
    public $isApproved;

    /**
     * @param $notification
     */
    public function __construct($notification) {
        $this->user = UserHelper::getSlimUser($notification->senderId);
        $this->isApproved = $this->isFollowerApproved($notification);
    }

    private function isFollowerApproved($notification) {
        $follower = Follower::where('userId', $notification->senderId)->where('targetId', $notification->userId)->first();
        return $follower ? $follower->isApproved : true;
    }
}
