<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;

/**
 * @property mixed accoladeId
 */
class UserBadgeCompleted extends UnixTimeModel {

    protected $fillable = ['userId', 'habboBadgeId'];
    protected $table = 'user_badge_completed';
}
