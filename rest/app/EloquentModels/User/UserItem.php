<?php

namespace App\EloquentModels\User;

use App\Constants\Shop\ShopItemTypes;
use App\EloquentModels\Models\UnixTimeModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed userItemId
 * @property mixed userId
 * @property mixed createdAt
 */
class UserItem extends UnixTimeModel {

    protected $table = 'user_items';
    protected $primaryKey = 'userItemId';
    protected $fillable = ['type', 'userId', 'itemId', 'isActive'];

    public function user() {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId', 'userId');
    }

    public function scopeBadge(Builder $query) {
        return $query->where('type', ShopItemTypes::BADGE);
    }

    public function scopeIsActive(Builder $query) {
        return $query->where('isActive', '>', 0);
    }
}
