<?php

namespace App\Repositories\Impl\CategoryRepository;

use App\Repositories\Impl\CreatedUpdatedAt;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * @property int $forumPermissionId
 * @property int $groupId
 * @property int $permissions
 * @property bool $isAuthOnly
 *
 * @method whereInGroupIds(Collection $groupIds)
 * @method isLoggedIn(bool $isAuth)
 * @method wherePermission(int $permission)
 * @method whereCategoryId(int $categoryId)
 */
class ForumPermissionDBO extends CreatedUpdatedAt {

    protected $table = 'forum_permissions';
    protected $primaryKey = 'forumPermissionId';
    protected $fillable = ['categoryId', 'groupId', 'permissions', 'isAuthOnly'];

    public function scopeWhereCategoryId(Builder $builder, int $categoryId) {
        return $builder->where('categoryId', $categoryId);
    }

    public function scopeWhereInGroupIds(Builder $builder, Collection $groupIds) {
        return $builder->whereIn('groupId', $groupIds);
    }

    public function scopeIsLoggedIn(Builder $builder, bool $isLoggedIn) {
        return $builder->where('isAuthOnly', ($isLoggedIn ? '<=' : '<'), true);
    }

    public function scopeWherePermission(Builder $builder, int $permission) {
        return $builder->whereRaw('(permissions & '.$permission.')');
    }
}
