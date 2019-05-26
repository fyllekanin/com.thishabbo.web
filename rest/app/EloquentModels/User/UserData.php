<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed userdataId
 * @property mixed userId
 * @property mixed signature
 * @property mixed avatarUpdatedAt
 * @property mixed postBit
 * @property mixed credits
 * @property mixed homePage
 * @property mixed discord
 * @property mixed twitter
 * @property mixed badges
 * @property mixed createdAt
 * @property mixed updatedAt
 */
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
        'badges',
        'nameColours'
    ];

    public function user () {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId', 'userId');
    }

    public function scopeUserId (Builder $query, $userId) {
        return $query->where('userId', $userId);
    }
}
