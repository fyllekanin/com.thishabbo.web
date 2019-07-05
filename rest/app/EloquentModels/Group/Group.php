<?php

namespace App\EloquentModels\Group;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed groupId
 * @property mixed name
 */
class Group extends DeletableModel {
    protected $primaryKey = 'groupId';
    protected $fillable = ['name', 'nickname', 'nameColor', 'userBarStyling', 'immunity', 'sitecpPermissions', 'staffPermissions',
        'options', 'isPublic', 'avatarHeight', 'avatarWidth'];

    public function scopeWithName(Builder $query, $name) {
        return $query->whereRaw('lower(name) = ?', [strtolower($name)]);
    }

    public function userGroup() {
        return $this->hasMany('App\EloquentModels\User\UserGroup', 'groupId');
    }
}
