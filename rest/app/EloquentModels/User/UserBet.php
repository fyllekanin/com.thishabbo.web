<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\DeletableModel;

class UserBet extends DeletableModel {
    protected $table = 'user_bets';
    protected $primaryKey = 'userBetId';
    protected $fillable = ['userId', 'betId', 'leftSide', 'rightSide', 'amount'];

    public function bet() {
        return $this->hasOne('App\EloquentModels\Bet', 'betId', 'betId');
    }
}
