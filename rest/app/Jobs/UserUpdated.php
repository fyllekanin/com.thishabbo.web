<?php

namespace App\Jobs;

use App\EloquentModels\User\UserData;
use App\Helpers\ConfigHelper;
use App\Helpers\UserHelper;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Class UserUpdated
 *
 * This jobs purpose is to be ran whenever a user is updated regarding usergroups or subscriptions.
 * Mainly this is regarding whenever a subscription is removed from a user or when their usergroups gets
 * updated. And this to look at their perks to see if any were removed.
 *
 *
 * @package App\Jobs
 */
class UserUpdated implements ShouldQueue {
    private $userId;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * SubscriptionUpdated constructor
     *
     * @param $userId
     */
    public function __construct($userId) {
        $this->userId = $userId;
    }

    /**
     * Executes the job
     */
    public function handle() {
        $userData = UserData::where('userId', $this->userId)->first();
        if ($userData && $userData->nameColour) {
            if (!UserHelper::hasSubscriptionFeature($this->userId, ConfigHelper::getSubscriptionOptions()->canHaveCustomNameColour)) {
                $userData->update([
                    'nameColour' => null
                ]);
            }
        }
    }
}
