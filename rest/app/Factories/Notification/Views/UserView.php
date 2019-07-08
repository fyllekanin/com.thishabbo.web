<?php

namespace App\Factories\Notification\Views;

use App\Helpers\UserHelper;

class UserView {
    public $user;

    /**
     * @param $notification
     */
    public function __construct($notification) {
        $this->user = UserHelper::getSlimUser($notification->senderId);
    }
}