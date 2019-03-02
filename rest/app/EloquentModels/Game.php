<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\UnixTimeModel;
use App\Helpers\UserHelper;

class Game extends UnixTimeModel {
    protected $primaryKey = 'gameId';
    protected $fillable = ['userId', 'gameType', 'isFinished', 'score'];
    protected $appends = ['user'];

    public function getUserAttribute() {
        return UserHelper::getSlimUser($this->userId);
    }
}
