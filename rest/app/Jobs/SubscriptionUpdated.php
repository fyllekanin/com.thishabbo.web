<?php

namespace App\Jobs;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\Shop\UserSubscription;
use App\Helpers\UserHelper;
use App\Helpers\ConfigHelper;
use Illuminate\Support\Facades\Log;

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
        Log::info('const');
    }

    /**
     * Executes the job
     */
    public function handle () {
        Log::info('call');
        if(Subscription::find($this->subscriptionId)->options & ConfigHelper::getSubscriptionOptions()->canHaveCustomNameColor == 0) {
            $userIds = UserSubscription::where('subscriptionId', $this->subscriptionId)->pluck('userId');

            $userIds = array_filter($userIds, function($userId) {
                return !UserHelper::hasSubscriptionFeature($userId, ConfigHelper::getSubscriptionOptions()->canHaveCustomNameColor);
            });

            UserData::whereIn('userId', $userIds)->update([
                'nameColour' => null
            ]);
        }
    }
}
