<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed badgeId
 * @property mixed name
 */
class Badge extends DeletableModel {

    protected $primaryKey = 'badgeId';
    protected $fillable = ['name', 'description', 'points', 'isSystem'];
    protected $hidden = ['isDeleted'];

    public function scopeWithName(Builder $query, $badge) {
        return $query->whereRaw('lower(name) = ?', [strtolower($badge)]);
    }
}
