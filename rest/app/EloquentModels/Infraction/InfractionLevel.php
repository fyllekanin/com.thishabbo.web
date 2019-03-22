<?php

namespace App\EloquentModels\Infraction;

use App\EloquentModels\Models\DeletableModel;

/**
 * @property mixed infractionLevelId
 * @property mixed title
 * @property mixed points
 * @property mixed lifeTime
 * @property mixed categoryId
 * @property mixed penalty
 * @property mixed isDeleted
 * @property mixed createdAt
 * @property mixed updatedAt
 */
class InfractionLevel extends DeletableModel {
    protected $table = 'infraction_levels';
    protected $primaryKey = 'infractionLevelId';
    protected $fillable = ['title', 'points', 'lifeTime', 'categoryId', 'penalty'];
    protected $hidden = ['isDeleted'];
}
