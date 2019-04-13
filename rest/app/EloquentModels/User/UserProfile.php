<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed userProfileId
 * @property mixed userId
 * @property mixed createdAt
 * @property mixed updatedAt
 */
class UserProfile extends UnixTimeModel {
    protected $table = 'user_profile';
    protected $primaryKey = 'userProfileId';
    protected $fillable = [
        'userId',
        'youtube',
        'isPrivate',
        'friends'
    ];

    public function user () {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId', 'userId');
    }
}
