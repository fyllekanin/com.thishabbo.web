<?php

namespace App\Services;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\Models\Notification\Type;

class NotificationService {
    private $forumService;

    public function __construct(ForumService $forumService) {
        $this->forumService = $forumService;
    }

    public function isNotificationValid($contentId, $type) {
        switch ($type) {
            case Type::getType(Type::MENTION):
            case Type::getType(Type::QUOTE):
                return Post::where('posts.postId', $contentId)
                        ->where('posts.isApproved', true)
                        ->join('threads', 'threads.threadId', '=', 'posts.threadId')
                        ->where('threads.isDeleted', false)
                        ->count('postId') > 0;
                break;
            case Type::getType(Type::THREAD_SUBSCRIPTION):
                return Thread::where('threadId', $contentId)
                        ->isApproved()
                        ->count('threadId') > 0;
                break;
            case Type::getType(Type::CATEGORY_SUBSCRIPTION):
                return Category::where('categoryId', $contentId)
                        ->count('categoryId') > 0;
                break;
        }

        return true;
    }
}
