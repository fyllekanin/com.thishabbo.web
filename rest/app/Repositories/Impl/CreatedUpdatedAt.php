<?php

namespace App\Repositories\Impl;

use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed createdAt
 * @property mixed updatedAt
 *
 * @method orderByLatestUpdate()
 */
class CreatedUpdatedAt extends BaseModel {

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    public function scopeOrderByLatestUpdate(Builder $builder) {
        return $builder->orderBy(self::UPDATED_AT, 'desc');
    }
}
