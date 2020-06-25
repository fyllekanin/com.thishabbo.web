<?php

namespace App\Jobs;

use App\Constants\Shop\SubscriptionOptions;
use App\EloquentModels\User\UserData;
use App\Helpers\UserHelper;
use App\Repositories\Impl\SubscriptionRepository\SubscriptionDBO;
use App\Repositories\Repository\AvatarRepository;
use App\Repositories\Repository\SubscriptionRepository;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

/**
 * Class SubscriptionUpdated
 *
 * This job is suppose to run when a subscription is updated or deleted which is a type of update.
 * The jobs purpose is to remove perks from a user gained by the subscription if it's changed.
 *
 * Example case:
 * User has custom name color and the subscription is updated to no longer have this options.
 * Then all users which has custom name color from this subscription needs to be updated if they don't have
 * another subscription and get the custom name removed.
 *
 * @package App\Jobs
 */
class SubscriptionUpdated implements ShouldQueue {

    private $myAvatarRepository;
    private $mySubscriptionRepository;

    private $mySubscriptionId;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(int $subscriptionId) {
        $this->mySubscriptionId = $subscriptionId;
    }

    /**
     * Executes the job
     *
     * @param  AvatarRepository  $avatarRepository
     * @param  SubscriptionRepository  $subscriptionRepository
     */
    public function handle(AvatarRepository $avatarRepository, SubscriptionRepository $subscriptionRepository) {
        $this->myAvatarRepository = $avatarRepository;
        $this->mySubscriptionRepository = $subscriptionRepository;

        $subscription = $this->mySubscriptionRepository->getSubscriptionWithId($this->mySubscriptionId);
        if (!$subscription) {
            return;
        }

        $userIds = $this->mySubscriptionRepository->getUserIdsWithSubscriptionId($this->mySubscriptionId);
        $this->handleNameColor($subscription, $userIds);
        $this->handleNamePosition($subscription, $userIds);
        $this->handleUserBar($subscription, $userIds);

        $userIds->filter(
            function ($userId) {
                return !$this->myAvatarRepository->isCurrentAvatarValidForUserId($userId);
            }
        )
            ->each(
                function ($userId) {
                    $this->myAvatarRepository->makeCurrentAvatarValid($userId);
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

    private function handleNameColor(SubscriptionDBO $subscription, Collection $userIds) {
        if ($subscription->options & SubscriptionOptions::CUSTOM_NAME_COLOR) {
            return;
        }

        $ids = $userIds->filter(
            function ($userId) {
                return !UserHelper::hasSubscriptionFeature($userId, SubscriptionOptions::CUSTOM_NAME_COLOR);
            }
        );
        UserData::whereIn('userId', $ids)->update(
            [
                'nameColor' => null
            ]
        );
    }

    private function handleNamePosition(SubscriptionDBO $subscription, Collection $userIds) {
        if ($subscription->options & SubscriptionOptions::NAME_POSITION) {
            return;
        }

        $ids = $userIds->filter(
            function ($userId) {
                return !UserHelper::hasSubscriptionFeature($userId, SubscriptionOptions::NAME_POSITION);
            }
        );
        UserData::whereIn('userId', $ids)->update(
            [
                'namePosition' => 0
            ]
        );
    }

    private function handleUserBar(SubscriptionDBO $subscription, Collection $userIds) {
        if ($subscription->options & SubscriptionOptions::CUSTOM_BAR) {
            return;
        }

        $ids = $userIds->filter(
            function ($userId) {
                return !UserHelper::hasSubscriptionFeature($userId, SubscriptionOptions::CUSTOM_BAR);
            }
        );
        UserData::whereIn('userId', $ids)->update(
            [
                'barColor' => null
            ]
        );
    }
}
