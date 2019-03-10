<?php

namespace App\EloquentModels\Infraction;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

class Infraction extends DeletableModel {
    protected $table = 'infractions';
    protected $primaryKey = 'infractionId';
    protected $fillable = ['infractionLevelId', 'infractedId', 'reason', 'userId', 'expiresAt'];
    protected $hidden = ['expiresAt'];

    public function level() {
        return $this->hasOne('App\EloquentModels\Infraction\InfractionLevel',
            'infractionLevelId', 'infractionLevelId')
            ->withoutGlobalScope('nonHardDeleted');
    }

    public function scopeIsActive(Builder $query) {
        return $query->where('expiresAt', '>', time());
    }
}
