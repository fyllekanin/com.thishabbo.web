<?php

namespace App\Jobs;

use App\EloquentModels\Group\Group;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserGroup;
use App\Helpers\ConfigHelper;
use App\Models\Notification\Type;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class NotifyMentionsInPost implements ShouldQueue {
    private $quoteRegex = '/\[quotepost=(.*?)\](.*?)\[\/quotepost\]/si';
    private $mentionRegex = '/\[mention]@(.*?)\[\/mention\]/si';

    private $mentionTypeUser = 'user';
    private $mentionTypeGroup = 'group';

    private $ignoredNotificationTypes;
    private $content;
    private $postId;
    private $userId;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * NotifyMentionsInPost constructor.
     *
     * @param $content
     * @param $postId
     * @param $userId
     */
    public function __construct($content, $postId, $userId) {
        $this->content = $content;
        $this->postId = $postId;
        $this->userId = $userId;
        $this->ignoredNotificationTypes = ConfigHelper::getIgnoredNotificationsConfig();
    }

    /**
     * Executes the job
     */
    public function handle() {
        $quotedPostIds = $this->getQuotedUserIds($this->content);
        $content = preg_replace($this->quoteRegex, '', $this->content);
        $mentionedIds = $this->getMentionedIds($content, $this->mentionTypeUser);
        $mentionedIds = $this->addTaggedGroupMembers($content, $mentionedIds);

        $quotedPosts = DB::table('posts')->select('userId')->whereIn('postId', $quotedPostIds)->get()->toArray();
        $quotedUserIds = array_map(function ($post) {
            return $post->userId;
        }, $quotedPosts);

        $mentionType = Type::getType(Type::MENTION);
        $quoteType = Type::getType(Type::QUOTE);
        $notifiedUsers = DB::table('notifications')
            ->select('userId', 'type')
            ->where('contentId', $this->postId)
            ->whereIn('type', [$mentionType, $quoteType])
            ->get()->toArray();

        $mentionedFromEarlier = array_map(function ($notification) {
            return $notification->userId;
        }, array_filter($notifiedUsers, function ($notification) use ($mentionType) {
            return $notification->type == $mentionType;
        }));

        $quotedFromEarlier = array_map(function ($notification) {
            return $notification->userId;
        }, array_filter($notifiedUsers, function ($notification) use ($quoteType) {
            return $notification->type == $quoteType;
        }));

        $quoteInserts = $this->createNotificationInserts($quotedUserIds, $this->userId, $quoteType, $this->postId, $quotedFromEarlier);
        $mentionInserts = $this->createNotificationInserts($mentionedIds, $this->userId, $mentionType, $this->postId, $mentionedFromEarlier);
        $inserts = array_merge($quoteInserts, $mentionInserts);

        DB::table('notifications')->insert($inserts);
    }

    private function createNotificationInserts($userIds, $senderId, $type, $postId, $earlier) {
        $inserts = [];
        foreach ($userIds as $mentionedId) {
            $ignoredNotifications = $this->isUserIgnoringNotification($mentionedId, $type);
            if (!in_array($mentionedId, $earlier) && $mentionedId != $senderId && !$ignoredNotifications) {
                $inserts[] = [
                    'userId' => $mentionedId,
                    'senderId' => $senderId,
                    'type' => $type,
                    'contentId' => $postId,
                    'createdAt' => time()
                ];
            }
        }
        return $inserts;
    }

    private function isUserIgnoringNotification($userId, $type) {
        $notificationType = $type == Type::getType(Type::MENTION) ?
            $this->ignoredNotificationTypes->MENTION_NOTIFICATIONS :
            $this->ignoredNotificationTypes->QUOTE_NOTIFICATIONS;
        return User::where('userId', $userId)
                ->whereRaw('(ignoredNotifications & ' . $notificationType . ')')->count('userId') > 0;
    }

    private function getQuotedUserIds($content) {
        if (preg_match_all($this->quoteRegex, $content, $matches)) {
            return $matches[1];
        }
        return [];
    }

    private function getMentionedIds($content, $mentionType) {
        if ($mentionType == $this->mentionTypeUser && preg_match_all($this->mentionRegex, $content, $matches)) {
            return User::whereIn('nickname', $matches[1])->pluck('userId');
        }

        if ($mentionType == $this->mentionTypeGroup && preg_match_all($this->mentionRegex, $content, $matches)) {
            return Group::whereIn('name', $matches[1])->pluck('groupId');
        }

        return [];
    }

    private function addTaggedGroupMembers($content, $mentionedIds) {
        $groupIds = $this->getMentionedIds($content, $this->mentionTypeGroup);
        $groupOptions = ConfigHelper::getGroupOptionsConfig();

        foreach ($groupIds as $groupId) {
            $group = Group::find($groupId);
            if (!$group || !($group->options & $groupOptions->canBeTagged)) {
                continue;
            }

            $groupMembers = UserGroup::where('groupId', $groupId)->select('userId')->get()->toArray();
            $groupMemberIds = array_map(function ($groupMember) {
                return $groupMember['userId'];
            }, array_filter($groupMembers, function ($groupMember) use ($mentionedIds) {
                return !in_array($groupMember['userId'], $mentionedIds);
            }));
            $mentionedIds = array_merge($mentionedIds, $groupMemberIds);
        }
        return $mentionedIds;
    }
}
