<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\DeletableModel;

/**
 * @property mixed accoladeId
 */
class Accolade extends DeletableModel {

    protected $table = 'accolades';
    protected $primaryKey = 'accoladeId';
    protected $fillable = ['userId', 'role', 'start', 'end', 'type'];

    public function user() {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId', 'userId');
    }
}
