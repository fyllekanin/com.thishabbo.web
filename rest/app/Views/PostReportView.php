<?php

namespace App\Views;

use App\EloquentModels\Forum\Post;
use App\EloquentModels\User\User;

class PostReportView {

    public static function of(User $user, Post $post, $message) {
        $threadSkeleton = new \stdClass();

        $threadSkeleton->content = "[mention]@" . $user->nickname . "[/mention] reported a post.

        [b]User reported:[/b] [mention]@" . $post->user->nickname . "[/mention]
        [b]Thread:[/b] [url=/forum/thread/1/page/1]Click here to go to thread.[/url]
        
        [b]Reason:[/b]
        [quote]" . $message . "[/quote]
        
        [b]Original post:[/b]
        [quote]" . $post->content . "[/quote]";
        $threadSkeleton->title = 'Report by ' . $user->nickname;

        return $threadSkeleton;
    }
}