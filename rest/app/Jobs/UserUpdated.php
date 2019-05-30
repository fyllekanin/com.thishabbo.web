<?php

namespace App\Jobs;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use App\EloquentModels\Shop\Subscription;
use App\Helpers\UserHelper;
use App\Helpers\ConfigHelper;

class UserUpdated implements ShouldQueue {
    private $userId;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * SubscriptionUpdated constructor
     *
     * @param $subscription
     */
    public function __construct($userId) {
        $this->userId = $userId;
    }

    /**
     * Executes the job
     */
    public function handle () {
        $userData = UserData::where('userId', $this->userId)->first();
        if($userData && $userData->nameColour) {
            if(!UserHelper::hasSubscriptionFeature($this->userId, ConfigHelper::getSubscriptionOptions()->canHaveCustomNameColour)) {
                $userData->update([
                    'nameColour' => null
                ]);
            }
        }
    }
}