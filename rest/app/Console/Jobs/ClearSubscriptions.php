<?php

namespace App\Console\Jobs;

use App\EloquentModels\Shop\UserSubscription;
use App\Helpers\ConfigHelper;
use App\Jobs\UserUpdated;

class ClearSubscriptions {

    public function init() {
        $time = time();
        $userSubSql = UserSubscription::where('expiresAt', '<', $time);

        $userIds = $userSubSql->pluck('userId');
        $userSubSql->delete();

        $clearSubType = ConfigHelper::getUserUpdateTypes()->CLEAR_SUBSCRIPTION;
        foreach ($userIds as $userId) {
            UserUpdated::dispatch($userId, $clearSubType);
        }
    }
}