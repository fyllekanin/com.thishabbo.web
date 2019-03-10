<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

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
