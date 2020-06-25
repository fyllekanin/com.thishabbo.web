<?php

namespace App\Jobs;

use App\Constants\NotificationTypes;
use App\Constants\User\UserIgnoredNotifications;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\User\User;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Class NotifyMentionsInPost
 *
 * Purpose of this job is to send notifications to all users  which were mentioned
 * in the provided post/thread.
 *
 * @package App\Jobs
 */
class NotifyMentionsInPost implements ShouldQueue {
    private $myQuoteRegex = '/\[quotepost=(.*?)\](.*?)\[\/quotepost\]/si';
    private $myMentionRegex = '/@([a-zA-Z0-9]+)/si';
    private $myMentionTypeUser = 'user';

    private $myContent;
    private $myPostId;
    private $myUserId;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct($content, $postId, $userId) {
        $this->myContent = $content;
        $this->myPostId = $postId;
        $this->myUserId = $userId;
    }

    /**
     * Executes the job
     */
    public function handle() {
        $quotedPostIds = $this->getQuotedPostIds($this->myContent);
        $mentionedIds = $this->getUserIds($this->myContent);
        $quotedUserIds = Post::whereIn('postId', $quotedPostIds)->pluck('userId')->toArray();

        foreach ($mentionedIds as $userId) {
            if ($this->myUserId == $userId ||
                $this->isUserIgnoringNotification($userId, NotificationTypes::MENTION) ||
                $this->haveGottenNotification($userId, NotificationTypes::MENTION)
            ) {
                continue;
            }

            DB::table('notifications')->insert(
                [
                    'userId' => $userId,
                    'senderId' => $this->myUserId,
                    'type' => NotificationTypes::MENTION,
                    'contentId' => $this->myPostId,
                    'createdAt' => time()
                ]
            );
        }

        foreach ($quotedUserIds as $userId) {
            if ($this->myUserId == $userId ||
                $this->isUserIgnoringNotification($userId, NotificationTypes::QUOTE) ||
                $this->haveGottenNotification($userId, NotificationTypes::QUOTE)
            ) {
                continue;
            }

            DB::table('notifications')->insert(
                [
                    'userId' => $userId,
                    'senderId' => $this->myUserId,
                    'type' => NotificationTypes::QUOTE,
                    'contentId' => $this->myPostId,
                    'createdAt' => time()
                ]
            );
        }
    }

    /**
     * The job failed to process.
     *
     * @param  Exception  $exception
     *
     * @return void
     */
    public function failed(Exception $exception) {
        Log::channel('que')->error(
            '
        [b]File:[/b] '.$exception->getFile().'#'.$exception->getLine().'
        
        [b]Message:[/b]
'.$exception->getMessage().'
        '
        );
    }


    private function haveGottenNotification($userId, $type) {
        return DB::table('notifications')
                ->where('userId', $userId)
                ->where('contentId', $this->myPostId)
                ->where('type', $type)
                ->count() > 0;
    }


    private function isUserIgnoringNotification($userId, $type) {
        $isMention = $type == NotificationTypes::MENTION;
        $notificationType = $isMention ? UserIgnoredNotifications::MENTION_NOTIFICATIONS : UserIgnoredNotifications::QUOTE_NOTIFICATIONS;
        return User::where('userId', $userId)
                ->whereRaw('(ignoredNotifications & '.$notificationType.')')->count('userId') > 0;
    }

    private function getQuotedPostIds($content) {
        $matches = [];
        if (preg_match_all($this->myQuoteRegex, $content, $matches)) {
            return $matches[1];
        }
        return [];
    }

    private function getUserIds($content) {
        $userIds = [];
        $matches = [];
        $content = preg_replace($this->myQuoteRegex, '', $content);
        preg_match_all($this->myMentionRegex, $content, $matches);
        if ($matches && count($matches) > 0 && count($matches[1]) > 0) {
            $results = array_map(
                function ($match) {
                    return "'".strtolower(str_replace('_', ' ', $match))."'";
                },
                $matches[1]
            );

            $userIds = User::whereRaw('lower(nickname) IN ('.join(',', $results).')')
                ->pluck('userId')->toArray();
        }

        return $userIds;
    }
}
