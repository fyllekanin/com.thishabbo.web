<?php

namespace App\EloquentModels\Infraction;

use App\EloquentModels\Models\DeletableModel;

class InfractionLevel extends DeletableModel {
    protected $table = 'infraction_levels';
    protected $primaryKey = 'infractionLevelId';
    protected $fillable = ['title', 'points', 'lifeTime'];
    protected $hidden = ['isDeleted'];
}
