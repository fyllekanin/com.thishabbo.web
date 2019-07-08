<?php

namespace App\Factories\Notification\Views;

use App\EloquentModels\Forum\Thread;
use App\Helpers\UserHelper;

class CategoryView {
    public $user;
    public $thread;

    /**
     * @param $notification
     */
    public function __construct($notification) {
        $this->user = UserHelper::getSlimUser($notification->senderId);
        $this->thread = $this->getThread($notification);
    }

    private function getThread($notification) {
        $thread = Thread::find($notification->contentId);
        if (!$thread) {
            return null;
        }

        return (object)[
            'categoryTitle' => $thread->category->title,
            'threadId' => $thread->threadId,
            'title' => $thread->title
        ];
    }
}