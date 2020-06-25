<?php

namespace App\Providers\Impl;

use App\Constants\NotificationTypes;
use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\Helpers\PermissionHelper;
use App\Providers\Service\NotificationService;

class NotificationServiceImpl implements NotificationService {
    private $myForumService;

    public function __construct(ForumServiceImpl $forumService) {
        $this->myForumService = $forumService;
    }

    public function isNotificationValid($contentId, $type, $user) {
        switch ($type) {
            case NotificationTypes::MENTION:
            case NotificationTypes::QUOTE:
            case NotificationTypes::LIKE_POST:
            case NotificationTypes::THREAD_SUBSCRIPTION:
                return $this->isPostNotificationValid($contentId, $user);
            case NotificationTypes::CATEGORY_SUBSCRIPTION:
                return $this->isThreadNotificationValid($contentId, $user);
            default:
                return true;
        }
    }

    private function isThreadNotificationValid($threadId, $user) {
        $thread = Thread::where('threadId', $threadId)->first();
        if (!$thread) {
            return false;
        }

        return $this->canUserAccessThread($thread, $user);
    }

    private function isPostNotificationValid($postId, $user) {
        $post = Post::where('postId', $postId)->with('thread')->first();
        if (!$post || !$post->thread || $post->thread->isDeleted) {
            return false;
        }

        return $this->canUserAccessThread($post->thread, $user);
    }

    private function canUserAccessThread($thread, $user) {
        $canRead = PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_READ, $thread->categoryId);
        $canViewOthersThread
            = PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_VIEW_OTHERS_THREADS, $thread->categoryId);

        return $canRead && ($thread->userId == $user->userId || $canViewOthersThread);
    }
}
