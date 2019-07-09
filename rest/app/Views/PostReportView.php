<?php

namespace App\Views;

use App\EloquentModels\Forum\Post;
use App\EloquentModels\User\User;
use App\Helpers\DataHelper;

class PostReportView {

    public static function of(User $user, Post $post, $message) {
        $threadSkeleton = new \stdClass();
        $postsBefore = Post::where('postId', '<', $post->postId)->where('threadId', $post->threadId)->count();
        $page = DataHelper::getPage($postsBefore);

        $threadSkeleton->content = "[mention]@" . $user->nickname . "[/mention] reported a post.

        [b]User reported:[/b] [mention]@" . $post->user->nickname . "[/mention]
        [b]Thread:[/b] [url=/forum/thread/" . $post->threadId . "/page/" . $page . "]Click here to go to thread.[/url]
        
        [b]Reason:[/b]
        [quote]" . $message . "[/quote]
        
        [b]Original post:[/b]
        [quote]" . $post->content . "[/quote]";
        $threadSkeleton->title = 'Report by ' . $user->nickname;

        return $threadSkeleton;
    }
}