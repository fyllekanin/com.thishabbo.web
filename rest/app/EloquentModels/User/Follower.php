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


    public function scopeIsApproved(Builder $query) {
        return $query->where('isApproved', true);
    }
}
