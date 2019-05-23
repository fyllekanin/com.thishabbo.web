<?php

namespace App\EloquentModels\Shop;

use App\EloquentModels\Models\UnixTimeModel;
use Illuminate\Database\Eloquent\Builder;

class UserSubscription extends UnixTimeModel {
    protected $primaryKey = 'userSubscriptionId';
    protected $table = 'user_subscriptions';
    protected $fillable = ['subscriptionId', 'userId', 'expiresAt'];

    public function subscription() {
        return $this->belongsTo('App\EloquentModels\Shop\Subscription', 'subscriptionId', 'subscriptionId');
    }
}
