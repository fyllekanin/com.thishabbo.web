<?php

namespace App\Factories\Notification\Views;

use App\EloquentModels\Forum\Post;
use App\Helpers\DataHelper;
use App\Helpers\UserHelper;

class ThreadView {
    public $user;
    public $thread;

    /**
     * @param $notification
     */
    public function __construct ($notification) {
        $this->user = UserHelper::getSlimUser($notification->senderId);
        $this->thread = $this->getThread($notification);
    }

    private function getThread ($notification) {
        $post = Post::find($notification->contentId);
        if (!$post) {
            return null;
        }

        return (object)[
            'threadId' => $post->thread->threadId,
            'title' => $post->thread->title,
            'postId' => $notification->contentId,
            'page' => DataHelper::getTotal(Post::where('threadId', $post->threadId)
                ->where('postId', '<=', $notification->contentId)
                ->count('postId'))
        ];
    }
}