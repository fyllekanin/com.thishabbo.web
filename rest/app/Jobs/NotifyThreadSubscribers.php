<?php

namespace App\Jobs;

use App\EloquentModels\Forum\ThreadSubscription;
use App\Models\Notification\Type;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

/**
 * Class NotifyThreadSubscribers
 *
 * Purpose of the job is to notify all the users which are subscribed to the specified thread.
 * This job will send out notifications to all users which are subscribed to the thread.
 *
 * @package App\Jobs
 */
class NotifyThreadSubscribers implements ShouldQueue {
    private $threadId;
    private $userId;
    private $postId;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * NotifyThreadSubscribers constructor.
     *
     * @param $threadId
     * @param $userId
     * @param $postId
     */
    public function __construct($threadId, $userId, $postId) {
        $this->threadId = $threadId;
        $this->userId = $userId;
        $this->postId = $postId;
    }

    /**
     * Executes the job
     */
    public function handle() {
        $subscribeType = Type::getType(Type::THREAD_SUBSCRIPTION);

        $alreadyNotified = DB::table('notifications')->where('type', $subscribeType)->where('contentId', $this->postId)->pluck('userId');
        $userIds = ThreadSubscription::where('threadId', $this->threadId)->whereNotIn('userId', $alreadyNotified)->pluck('userId');

        $inserts = [];
        foreach ($userIds as $userId) {
            if ($userId == $this->userId) {
                continue;
            }
            $inserts[] = [
                'userId' => $userId,
                'senderId' => $this->userId,
                'type' => $subscribeType,
                'contentId' => $this->threadId,
                'createdAt' => time()
            ];
        }

        DB::table('notifications')->insert($inserts);
    }
}
