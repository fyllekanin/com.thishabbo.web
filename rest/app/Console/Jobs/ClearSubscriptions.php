<?php

namespace App\Console\Jobs;

use App\Constants\User\UserJobEventType;
use App\EloquentModels\Shop\UserSubscription;
use App\Jobs\UserUpdated;

class ClearSubscriptions {


    public function init() {
        $time = time();
        $userSubSql = UserSubscription::where('expiresAt', '<', $time);

        $userIds = $userSubSql->pluck('userId');
        $userSubSql->delete();

        foreach ($userIds as $userId) {
            UserUpdated::dispatch($userId, UserJobEventType::CLEAR_SUBSCRIPTION);
        }
    }
}
