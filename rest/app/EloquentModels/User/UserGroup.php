<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;

class UserGroup extends UnixTimeModel {
    protected $table = 'user_groups';
    protected $primaryKey = 'userGroupId';
    protected $fillable = ['userId', 'groupId'];

    public function user () {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId', 'userId');
    }

    public function group () {
        return $this->belongsTo('App\EloquentModels\Group', 'groupId', 'groupId');
    }
}
