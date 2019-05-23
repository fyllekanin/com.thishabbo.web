<?php

namespace App\EloquentModels\Shop;

use App\EloquentModels\Models\DeletableModel;

/**
 * @property mixed subscriptionId
 */
class Subscription extends DeletableModel {
    protected $primaryKey = 'subscriptionId';
    protected $table = 'subscriptions';
    protected $fillable = ['title', 'avatarWidth', 'avatarHeight', 'credits', 'pounds', 'options', 'isActive'];

    public function scopeActive(Builder $query) {
        return $query->where('isActive', 1);
    }
}
