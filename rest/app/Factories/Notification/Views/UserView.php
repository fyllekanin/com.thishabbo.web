<?php

namespace App\Factories\Notification\Views;

use App\EloquentModels\Staff\RadioRequest;
use App\Helpers\UserHelper;
use App\Models\Notification\Type;

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
            case Type::getType(Type::SENT_THC):
                $this->customData = $notification->contentId;
                break;
            case Type::getType(Type::RADIO_REQUEST):
                $this->customData = RadioRequest::where('requestId', $notification->contentId)->value('nickname');
                break;
            default:
                $this->customData = null;
        }
    }
}