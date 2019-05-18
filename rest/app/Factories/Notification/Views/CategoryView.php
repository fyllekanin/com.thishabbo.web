<?php

namespace App\Factories\Notification\Views;

use App\EloquentModels\Forum\Thread;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;

class CategoryView {
    public $user;
    public $thread;

    /**
     * @param $notification
     * @param $user
     */
    public function __construct($notification, $user) {
        $this->user = UserHelper::getSlimUser($notification->senderId);
        $this->thread = $this->getThread($notification, $user);
    }

    private function getThread($notification, $user) {
        $thread = Thread::find($notification->contentId);
        if (!$thread || !PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canRead, $thread->categoryId)) {
            return null;
        }

        return (object) [
            'categoryTitle' => $thread->category->title,
            'threadId' => $thread->threadId,
            'title' => $thread->title
        ];
    }
}