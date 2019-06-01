<?php

namespace App\EloquentModels\Group;

use App\EloquentModels\Models\UnixTimeModel;

class GroupRequest extends UnixTimeModel {
    protected $table = 'group_requests';
    protected $primaryKey = 'groupRequestId';
    protected $fillable = ['userId', 'groupId'];
    protected $appends = ['name', 'nickname'];

    public function group() {
        return $this->hasOne('App\EloquentModels\Group\Group', 'groupId', 'groupId');
    }

    public function user() {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId', 'userId');
    }

    public function getNameAttribute() {
        return $this->group->name;
    }

    public function getnicknameAttribute() {
        return $this->user->nickname;
    }
}
