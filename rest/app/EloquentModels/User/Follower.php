<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed userId
 * @property mixed targetId
 */
class Follower extends UnixTimeModel {
    protected $primaryKey = 'followerId';
    protected $fillable = ['userId', 'targetId', 'isApproved'];

    public function user() {
        return $this->hasOne('App\EloquentModels\User\User', 'userId', 'userId');
    }

    public function target() {
        return $this->hasOne('App\EloquentModels\User\User', 'userId', 'targetId');
    }

    public function scopeIsApproved(Builder $query) {
        return $query->where('isApproved', '>', 0);
    }
}
