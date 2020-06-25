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
 * Class NotifyThreadSubscribers
 *
 * Purpose of the job is to notify all the users which are subscribed to the specified thread.
 * This job will send out notifications to all users which are subscribed to the thread.
 *
 * @package App\Jobs
 */
class NotifyThreadSubscribers implements ShouldQueue {
    private $myThreadId;
    private $myUserId;
    private $myPostId;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct($threadId, $userId, $postId) {
        $this->myThreadId = $threadId;
        $this->myUserId = $userId;
        $this->myPostId = $postId;
    }

    /**
     * @param  NotificationRepository  $notificationRepository
     * @param  ForumListenerRepository  $forumListenerRepository
     */
    public function handle(NotificationRepository $notificationRepository, ForumListenerRepository $forumListenerRepository) {
        $notifiedUserIds = $notificationRepository
            ->getNotifiedUserIdsForTypeAndContent(NotificationTypes::THREAD_SUBSCRIPTION, $this->myPostId);
        $notifiedUserIds->push($this->myUserId);

        $forumListenerRepository->getUserIdsSubscribedToThreadId($this->myThreadId, $notifiedUserIds)->each(
            function ($userId) use ($notificationRepository) {
                $notificationRepository->createNotification(
                    $userId,
                    $this->myUserId,
                    NotificationTypes::THREAD_SUBSCRIPTION,
                    $this->myPostId
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
