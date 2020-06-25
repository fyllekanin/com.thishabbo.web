<?php

namespace App\Repositories\Impl\GroupRepository;

use App\Repositories\Impl\CreatedUpdatedAt;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int userGroupId
 * @property int userId
 * @property int groupId
 * @property bool isBarActive
 *
 * @method forUserId(int $userId)
 * @method groupId(int $groupId)
 */
class UserGroupDBO extends CreatedUpdatedAt {

    protected $table = 'user_groups';
    protected $primaryKey = 'userGroupId';
    protected $fillable = ['userId', 'groupId', 'isBarActive'];

    public function scopeForUserId(Builder $builder, int $userId) {
        return $builder->where('userId', $userId);
    }

    public function scopeWhereGroupId(Builder $builder, int $groupId) {
        return $builder->where('groupId', $groupId);
    }
}
