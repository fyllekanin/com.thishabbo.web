<?php

namespace App\Factories\Notification\Views;

use App\Helpers\UserHelper;
use App\Models\Notification\Type;

class UserView {
    public $user;
    public $customData;

    /**
     * @param $notification
     */
    public function __construct($notification) {
        $this->user = UserHelper::getSlimUser($notification->senderId);

        switch ($notification->type) {
            case Type::getType(Type::SENT_THC):
                $this->customData = $notification->contentId;
                break;
            default:
                $this->customData = null;
        }
    }
}