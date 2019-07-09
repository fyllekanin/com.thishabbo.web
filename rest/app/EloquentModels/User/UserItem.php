<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;
use App\Helpers\ConfigHelper;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed userItemId
 * @property mixed userId
 * @property mixed createdAt
 */
class UserItem extends UnixTimeModel {
    private $itemTypes;

    protected $table = 'user_items';
    protected $primaryKey = 'userItemId';
    protected $fillable = ['type', 'userId', 'itemId', 'isActive'];

    public function __construct(array $attributes = []) {
        parent::__construct($attributes);
        $this->itemTypes = ConfigHelper::getTypesConfig();
    }

    public function user() {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId', 'userId');
    }

    public function scopeBadge(Builder $query) {
        return $query->where('type', $this->itemTypes->badge);
    }

    public function scopeIsActive(Builder $query) {
        return $query->where('isActive', '>', 0);
    }
}
