<?php

namespace App\Factories\Notification\Views;

use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Post;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Utils\PaginationUtil;

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
        if (!$post) {
            return null;
        }

        return (object) [
            'threadId' => $post->thread->threadId,
            'title' => $post->thread->title,
            'postId' => $notification->contentId,
            'page' => PaginationUtil::getTotalPages(
                Post::where('threadId', $post->threadId)
                    ->where('postId', '<=', $notification->contentId)
                    ->isApproved(
                        PermissionHelper::haveForumPermission(
                            $user->userId,
                            CategoryPermissions::CAN_APPROVE_THREADS,
                            $post->thread->categoryId
                        )
                    )
                    ->count('postId')
            )
        ];
    }
}
