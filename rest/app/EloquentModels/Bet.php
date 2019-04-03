<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\DeletableModel;
use App\EloquentModels\User\UserBet;

/**
 * @property mixed betId
 */
class Bet extends DeletableModel {
    protected $table = 'bets';
    protected $primaryKey = 'betId';
    protected $fillable = ['name', 'betCategoryId', 'leftSide', 'rightSide', 'isFinished', 'result', 'isSuspended'];
    protected $hidden = ['isDeleted'];

    public function category() {
        return $this->hasOne('App\EloquentModels\BetCategory', 'betCategoryId', 'betCategoryId');
    }

    public function userbets() {
        return $this->hasMany('App\EloquentModels\User\UserBet', 'betId');
    }

    public function getCategoryAttribute() {
        return $this->category();
    }

    public function getBackersCountAttribute() {
        return UserBet::where('betId', $this->betId)->count();
    }
}
