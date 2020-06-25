<?php

namespace App\Jobs;

use App\Constants\NotificationTypes;
use App\Repositories\Repository\ForumListenerRepository;
use App\Repositories\Repository\NotificationRepository;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Class NotifyCategorySubscribers
 *
 * Purpose of the job is to notify all users which are subscribed to a category
 * whenever a new thread is created in the category.
 *
 * @package App\Jobs
 */
class NotifyCategorySubscribers implements ShouldQueue {

    private $myCategoryId;
    private $myUserId;
    private $myThreadId;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct($categoryId, $userId, $threadId) {
        $this->myCategoryId = $categoryId;
        $this->myUserId = $userId;
        $this->myThreadId = $threadId;
    }

    /**
     * @param  NotificationRepository  $notificationRepository
     * @param  ForumListenerRepository  $forumListenerRepository
     */
    public function handle(NotificationRepository $notificationRepository, ForumListenerRepository $forumListenerRepository) {
        $notifiedUserIds = $notificationRepository
            ->getNotifiedUserIdsForTypeAndContent(NotificationTypes::CATEGORY_SUBSCRIPTION, $this->myThreadId);
        $notifiedUserIds->push($this->myUserId);

        $forumListenerRepository->getUserIdsSubscribedToCategoryId($this->myCategoryId, $notifiedUserIds)->each(
            function ($userId) use ($notificationRepository) {
                $notificationRepository->createNotification(
                    $userId,
                    $this->myUserId,
                    NotificationTypes::CATEGORY_SUBSCRIPTION,
                    $this->myThreadId
                );
            }
        );
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
}
