<?php

namespace App\Services;

use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Models\Notification\Type;

class NotificationService {
    private $forumService;

    public function __construct(ForumService $forumService) {
        $this->forumService = $forumService;
    }

    public function isNotificationValid($contentId, $type, $user) {
        switch ($type) {
            case Type::getType(Type::MENTION):
            case Type::getType(Type::QUOTE):
            case Type::getType(Type::LIKE_POST):
                return $this->isPostNotificationValid($contentId, $user);
            case Type::getType(Type::THREAD_SUBSCRIPTION):
            case Type::getType(Type::CATEGORY_SUBSCRIPTION):
                return $this->isThreadNotificationValid($contentId, $user);
        }

        return true;
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
        $canRead = PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canRead, $thread->categoryId);
        $canViewOthersThread = PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canViewOthersThreads, $thread->categoryId);

        return $canRead && ($thread->userId == $user->userId || $canViewOthersThread);
    }
}
