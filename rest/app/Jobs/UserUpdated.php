<?php

namespace App\Jobs;


use App\EloquentModels\User\UserData;
use App\Helpers\AvatarHelper;
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
    private $updateType;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * SubscriptionUpdated constructor
     *
     * @param $userId
     * @param $updateType
     */
    public function __construct($userId, $updateType) {
        $this->userId = $userId;
        $this->updateType = $updateType;
    }

    /**
     * Executes the job
     */
    public function handle() {
        switch ($this->updateType) {
            case ConfigHelper::getUserUpdateTypes()->CLEAR_SUBSCRIPTION:
                $this->handleClearedSubscription();
                breaK;
        }

        AvatarHelper::clearAvatarIfInvalid($this->userId);
    }

    private function handleClearedSubscription() {
        $userData = UserData::where('userId', $this->userId)->first();
        if (!$userData) {
            return;
        }
        $nameColor = $userData->nameColor;
        $namePosition = $userData->namePosition;
        $barColor = $userData->barColor;
        if ($userData->nameColor && !UserHelper::hasSubscriptionFeature($this->userId, ConfigHelper::getSubscriptionOptions()->canHaveCustomNameColor)) {
            $nameColor = null;
        }

        if ($userData->namePosition && !UserHelper::hasSubscriptionFeature($this->userId, ConfigHelper::getSubscriptionOptions()->canMoveNamePosition)) {
            $namePosition = 0;
        }

        if ($userData->barColor && !UserHelper::hasSubscriptionFeature($this->userId, ConfigHelper::getSubscriptionOptions()->canHaveCustomBar)) {
            $barColor = null;
        }
        $userData->update([
            'nameColor' => $nameColor,
            'namePosition' => $namePosition,
            'barColor' => $barColor
        ]);
    }
}
