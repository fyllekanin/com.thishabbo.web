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
    protected $fillable = ['name', 'nameStyling', 'userBarStyling', 'immunity', 'adminPermissions', 'staffPermissions',
        'options', 'isPublic', 'avatarHeight', 'avatarWidth'];

    public function scopeWithName (Builder $query, $name) {
        return $query->whereRaw('lower(name) = ?', [strtolower($name)]);
    }

    public function userGroup () {
        return $this->hasMany('App\EloquentModels\User\UserGroup', 'groupId');
    }
}