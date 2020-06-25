<?php

namespace App\Repositories\Impl\SubscriptionRepository;

use App\Repositories\Impl\SoftDelete;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int subscriptionId
 * @property string title
 * @property int avatarWidth
 * @property int avatarHeight
 * @property int credits
 * @property int pounds
 * @property int options
 *
 * @method whereInSubscriptionId(array $subscriptionIds)
 */
class SubscriptionDBO extends SoftDelete {

    protected $table = 'subscriptions';
    protected $primaryKey = 'subscriptionId';
    protected $fillable = ['title', 'avatarWidth', 'avatarHeight', 'credits', 'pounds', 'options'];

    public function scopeWhereInSubscriptionId(Builder $builder, $subscriptionIds) {
        return $builder->whereIn($this->primaryKey, $subscriptionIds);
    }
}
