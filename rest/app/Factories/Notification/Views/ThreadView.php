<?php

namespace App\Factories\Notification\Views;

use App\EloquentModels\Forum\Post;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;

class ThreadView {
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
        $post = Post::find($notification->contentId);
        if (!$post || !PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canRead, $post->thread->categoryId)) {
            return null;
        }

        $canApprovePosts = PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canApprovePosts, $post->thread->categoryId);
        return (object)[
            'threadId' => $post->thread->threadId,
            'title' => $post->thread->title,
            'postId' => $notification->contentId,
            'page' => DataHelper::getPage(Post::where('threadId', $post->threadId)
                ->where('postId', '<=', $notification->contentId)
                ->isApproved($canApprovePosts)
                ->count('postId'))
        ];
    }
}