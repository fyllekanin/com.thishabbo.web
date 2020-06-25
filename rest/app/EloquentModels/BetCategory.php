<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed betCategoryId
 * @property mixed name
 */
class BetCategory extends DeletableModel {

    protected $table = 'bet_categories';
    protected $primaryKey = 'betCategoryId';
    protected $fillable = ['name', 'displayOrder'];
    protected $hidden = ['isDeleted'];

    public function bets() {
        return $this->hasMany('App\EloquentModels\Bet', 'betCategoryId');
    }

    public function scopeWithName(Builder $query, $name) {
        return $query->whereRaw('lower(name) = ?', [strtolower($name)]);
    }

    public function getActiveBetsAttribute() {
        return Bet::where('isFinished', 0)->where('betCategoryId', $this->betCategoryId)->get()->map(
            function ($bet) {
                $bet->append('backersCount');
                return $bet;
            }
        );
    }
}
