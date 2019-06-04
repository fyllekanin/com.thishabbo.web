<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;

/**
 * @property mixed accoladeId
 * @property mixed avatarId
 */
class Avatar extends UnixTimeModel {
    protected $table = 'avatars';
    protected $primaryKey = 'avatarId';
    protected $fillable = ['userId', 'width', 'height'];

    public function user() {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId', 'userId');
    }
}
