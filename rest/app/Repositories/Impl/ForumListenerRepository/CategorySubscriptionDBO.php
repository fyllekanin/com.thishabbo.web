<?php

namespace App\Repositories\Impl\NotificationRepository;

use App\Repositories\Impl\CreatedUpdatedAt;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * @property int $threadSubscriptionId
 * @property int $userId
 * @property int $categoryId
 *
 * @method whereCategoryId(int $categoryId)
 * @method whereUserId(int $userId)
 * @method whereNotInUserId(Collection $userIds)
 */
class CategorySubscriptionDBO extends CreatedUpdatedAt {

    protected $table = 'category_subscriptions';
    protected $primaryKey = 'categorySubscriptionId';
    protected $fillable = ['userId', 'categoryId'];

    public function scopeWhereCategoryId(Builder $builder, int $categoryId) {
        return $builder->where('categoryId', $categoryId);
    }

    public function scopeWhereUserId(Builder $builder, int $userId) {
        return $builder->where('userId', $userId);
    }

    public function scopeWhereNotInUserId(Builder $builder, Collection $userIds) {
        return $builder->whereNotIn('userId', $userIds);
    }
}
