<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\UnixTimeModel;

/**
 * @property mixed gameId
 * @property mixed userId
 */
class HabboBadge extends UnixTimeModel {

    protected $fillable = ['habboBadgeId', 'description'];
}
