<?php

namespace App\Repositories\Impl\NotificationRepository;

use App\Repositories\Impl\CreatedUpdatedAt;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * @property int $threadSubscriptionId
 * @property int $userId
 * @property int $threadId
 *
 * @method whereThreadId(int $threadId)
 * @method whereNotInUserId(Collection $userIds)
 */
class ThreadSubscriptionDBO extends CreatedUpdatedAt {

    protected $table = 'thread_subscriptions';
    protected $primaryKey = 'threadSubscriptionId';
    protected $fillable = ['userId', 'threadId'];

    public function scopeWhereThreadId(Builder $builder, int $threadId) {
        return $builder->where('threadId', $threadId);
    }

    public function scopeWhereNotInUserId(Builder $builder, Collection $userIds) {
        return $builder->whereNotIn('userId', $userIds);
    }
}
