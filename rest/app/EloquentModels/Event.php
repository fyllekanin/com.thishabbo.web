<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

class Event extends DeletableModel {
    protected $table = 'events';
    protected $primaryKey = 'eventId';
    protected $fillable = ['name'];

    public function scopeWithName(Builder $query, $name) {
        return $query->whereRaw('lower(name) = ?', [strtolower($name)]);
    }
}
