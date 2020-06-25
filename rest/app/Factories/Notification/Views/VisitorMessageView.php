<?php

namespace App\Factories\Notification\Views;

use App\EloquentModels\User\VisitorMessage;
use App\Helpers\UserHelper;
use App\Utils\PaginationUtil;

class VisitorMessageView {

    public $user;
    public $page;
    public $host;
    public $subjectId;

    /**
     * @param $notification
     */
    public function __construct($notification) {
        $this->user = UserHelper::getSlimUser($notification->senderId);
        $this->page = $this->getVisitorMessagePage($notification->contentId);
    }

    private function getVisitorMessagePage($visitorMessageId) {
        $visitorMessage = VisitorMessage::find($visitorMessageId);
        if (!$visitorMessage) {
            $this->host = null;
            $this->subjectId = 0;
            return 0;
        }
        $this->host = UserHelper::getSlimUser($visitorMessage->hostId);

        $this->subjectId = $visitorMessage->isComment() ? $visitorMessage->parentId : $visitorMessage->visitorMessageId;
        return PaginationUtil::getTotalPages(
            VisitorMessage::isSubject()
                ->where('visitorMessageId', '>', $this->subjectId)
                ->where('hostId', $visitorMessage->hostId)
                ->count('visitorMessageId')
        );
    }
}
