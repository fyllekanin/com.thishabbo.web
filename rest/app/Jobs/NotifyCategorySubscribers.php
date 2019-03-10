<?php

namespace App\Jobs;

use App\EloquentModels\CategorySubscription;
use App\Models\Notification\Type;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class NotifyCategorySubscribers implements ShouldQueue {
    private $categoryId;
    private $userId;
    private $threadId;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * NotifyThreadSubscribers constructor.
     *
     * @param $categoryId
     * @param $userId
     * @param $threadId
     */
    public function __construct ($categoryId, $userId, $threadId) {
        $this->categoryId = $categoryId;
        $this->userId = $userId;
        $this->threadId = $threadId;
    }

    /**
     * Executes the job
     */
    public function handle () {
        $subscribeType = Type::getType(Type::CATEGORY_SUBSCRIPTION);

        $alreadyNotified = DB::table('notifications')->where('type', $subscribeType)->where('contentId', $this->threadId)->pluck('userId');
        $userIds = CategorySubscription::where('categoryId', $this->categoryId)->whereNotIn('userId', $alreadyNotified)->pluck('userId');

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
