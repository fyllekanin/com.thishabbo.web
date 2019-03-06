<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;
use Illuminate\Database\Eloquent\Builder;

class UserData extends UnixTimeModel {
    protected $table = 'userdata';
    protected $primaryKey = 'userdataId';
    protected $fillable = [
        'userId',
        'signature',
        'avatarUpdatedAt',
        'postBit',
        'credits',
        'homePage',
        'discord',
        'twitter',
        'badges'
    ];

    public function user () {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId', 'userId');
    }

    public function scopeUserId (Builder $query, $userId) {
        return $query->where('userId', $userId);
    }
}
