<?php

namespace App\Repositories\Impl\SubscriptionRepository;

use App\Repositories\Impl\CreatedUpdatedAt;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int userSubscriptionId
 * @property int subscriptionId
 * @property int userId
 * @property int expiresAt
 *
 * @method forUserId(int $userId)
 * @method isActive()
 * @method whereSubscriptionId(int $subscriptionId)
 */
class UserSubscriptionDBO extends CreatedUpdatedAt {

    protected $table = 'user_subscriptions';
    protected $primaryKey = 'userSubscriptionId';
    protected $fillable = ['subscriptionId', 'userId', 'expiresAt'];

    public function scopeIsActive(Builder $builder) {
        return $builder->where('expiresAt', '>', time());
    }

    public function scopeForUserId(Builder $builder, int $userId) {
        return $builder->where('userId', $userId);
    }

    public function scopeWhereSubscriptionId(Builder $builder, int $subscriptionId) {
        return $builder->where('subscriptionId', $subscriptionId);
    }
}
