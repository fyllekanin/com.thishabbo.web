<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\UnixTimeModel;
use Illuminate\Database\Eloquent\Builder;

class ForumPermission extends UnixTimeModel {

    protected $table = 'forum_permissions';
    protected $primaryKey = 'forumPermissionId';
    protected $fillable = ['categoryId', 'groupId', 'permissions', 'isAuthOnly'];

    public function scopeWithGroups(Builder $query, $groupIds) {
        return $query->whereIn('groupId', $groupIds);
    }

    public function scopeWithPermission(Builder $query, $permission) {
        return $query->whereRaw('(permissions & '.$permission.')');
    }
}
