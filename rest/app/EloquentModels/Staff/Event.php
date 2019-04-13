<?php

namespace App\EloquentModels\Staff;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed name
 */
class Event extends DeletableModel {
    protected $table = 'events';
    protected $primaryKey = 'eventId';
    protected $fillable = ['name'];

    public function scopeWithName(Builder $query, $name) {
        return $query->whereRaw('lower(name) = ?', [strtolower($name)]);
    }
}
