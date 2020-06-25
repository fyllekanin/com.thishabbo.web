<?php

namespace App\Factories\Notification\Views;

use App\Constants\NotificationTypes;
use App\EloquentModels\Staff\RadioRequest;
use App\Helpers\UserHelper;

class UserView {

    public $user;
    public $customData;
    public $nickname;

    /**
     * @param $notification
     */
    public function __construct($notification) {
        $this->user = UserHelper::getSlimUser($notification->senderId);

        switch ($notification->type) {
            case NotificationTypes::SENT_CREDITS:
                $this->customData = $notification->contentId;
                break;
            case NotificationTypes::RADIO_REQUEST:
                $this->customData = RadioRequest::where('requestId', $notification->contentId)->value('nickname');
                break;
            default:
                $this->customData = null;
        }
    }
}
