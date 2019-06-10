<?php

namespace App\Jobs;

use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\Shop\UserSubscription;
use App\EloquentModels\User\UserData;
use App\Helpers\AvatarHelper;
use App\Helpers\ConfigHelper;
use App\Helpers\UserHelper;
use App\Utils\Iterables;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Class SubscriptionUpdated
 *
 * This job is suppose to run when a subscription is updated or deleted which is a type of update.
 * The jobs purpose is to remove perks from a user gained by the subscription if it's changed.
 *
 * Example case:
 * User has custom name colour and the subscription is updated to no longer have this options.
 * Then all users which has custom name colour from this subscription needs to be updated if they don't have
 * another subscription and get the custom name removed.
 *
 * @package App\Jobs
 */
class SubscriptionUpdated implements ShouldQueue {
    private $subscriptionId;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * SubscriptionUpdated constructor
     *
     * @param $subscriptionId
     */
    public function __construct($subscriptionId) {
        $this->subscriptionId = $subscriptionId;
    }

    /**
     * Executes the job
     */
    public function handle() {
        $subscription = Subscription::find($this->subscriptionId);
        if (!$subscription) {
            return;
        }

        $userIds = UserSubscription::where('subscriptionId', $this->subscriptionId)->pluck('userId')->toArray();
        $this->handleNameColor($subscription, $userIds);
        $this->handleNamePosition($subscription, $userIds);

        foreach ($userIds as $userId) {
            AvatarHelper::clearAvatarIfInvalid($userId);
        }
    }

    private function handleNameColor($subscription, $userIds) {
        if ($subscription->options & ConfigHelper::getSubscriptionOptions()->canHaveCustomNameColor) {
            return;
        }

        $ids = Iterables::filter($userIds, function ($userId) {
            return !UserHelper::hasSubscriptionFeature($userId, ConfigHelper::getSubscriptionOptions()->canHaveCustomNameColor);
        });
        UserData::whereIn('userId', $ids)->update([
            'nameColour' => null
        ]);
    }

    private function handleNamePosition($subscription, $userIds) {
        if ($subscription->options & ConfigHelper::getSubscriptionOptions()->canMoveNamePosition) {
            return;
        }

        $ids = Iterables::filter($userIds, function ($userId) {
            return !UserHelper::hasSubscriptionFeature($userId, ConfigHelper::getSubscriptionOptions()->canMoveNamePosition);
        });
        UserData::whereIn('userId', $ids)->update([
            'namePosition' => 0
        ]);
    }
}
