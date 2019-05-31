<?php

namespace App\Jobs;

use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\Shop\UserSubscription;
use App\EloquentModels\User\UserData;
use App\Helpers\ConfigHelper;
use App\Helpers\UserHelper;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

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
        if (Subscription::find($this->subscriptionId)->options & ConfigHelper::getSubscriptionOptions()->canHaveCustomNameColor == 0) {
            $userIds = UserSubscription::where('subscriptionId', $this->subscriptionId)->pluck('userId');

            $userIds = array_filter($userIds, function ($userId) {
                return !UserHelper::hasSubscriptionFeature($userId, ConfigHelper::getSubscriptionOptions()->canHaveCustomNameColor);
            });

            UserData::whereIn('userId', $userIds)->update([
                'nameColour' => null
            ]);
        }
    }
}
