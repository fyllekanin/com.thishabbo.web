<?php

namespace App\Jobs;

use App\EloquentModels\User\UserData;
use App\Helpers\ConfigHelper;
use App\Helpers\UserHelper;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

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
