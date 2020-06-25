<?php

namespace App\Jobs;

use App\Constants\Shop\SubscriptionOptions;
use App\Constants\User\UserJobEventType;
use App\Helpers\UserHelper;
use App\Repositories\Repository\AvatarRepository;
use App\Repositories\Repository\UserRepository;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Class UserUpdated
 *
 * This jobs purpose is to be ran whenever a user is updated regarding usergroups or subscriptions.
 * Mainly this is regarding whenever a subscription is removed from a user or when their usergroups gets
 * updated. And this to look at their perks to see if any were removed.
 *
 * @package App\Jobs
 */
class UserUpdated implements ShouldQueue {
    private $myAvatarRepository;
    private $myUserRepository;

    private $myUserId;
    private $myUpdateType;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct($userId, $updateType) {
        $this->myUserId = $userId;
        $this->myUpdateType = $updateType;
    }

    /**
     * Executes the job
     *
     * @param  AvatarRepository  $avatarRepository
     * @param  UserRepository  $userRepository
     */
    public function handle(AvatarRepository $avatarRepository, UserRepository $userRepository) {
        $this->myAvatarRepository = $avatarRepository;
        $this->myUserRepository = $userRepository;

        switch ($this->myUpdateType) {
            case UserJobEventType::CLEAR_SUBSCRIPTION:
                $this->handleClearedSubscription();
                break;
        }

        if (!$this->myAvatarRepository->isCurrentAvatarValidForUserId($this->myUserId)) {
            $this->myAvatarRepository->makeCurrentAvatarValid($this->myUserId);
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

    private function handleClearedSubscription() {
        $userData = $this->myUserRepository->getUserDataForUserId($this->myUserId);
        if (!$userData->nameColor && !$userData->namePosition && !$userData->barColor) {
            return;
        }
        if ($userData->nameColor && !UserHelper::hasSubscriptionFeature($this->myUserId, SubscriptionOptions::CUSTOM_NAME_COLOR)) {
            $userData->nameColor = null;
        }

        if ($userData->namePosition && !UserHelper::hasSubscriptionFeature($this->myUserId, SubscriptionOptions::NAME_POSITION)) {
            $userData->namePosition = 0;
        }

        if ($userData->barColor && !UserHelper::hasSubscriptionFeature($this->myUserId, SubscriptionOptions::CUSTOM_BAR)) {
            $userData->barColor = null;
        }
        $this->myUserRepository->updateUserData($userData);
    }
}
