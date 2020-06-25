<?php


namespace App\Repositories\Impl;

use Illuminate\Database\Eloquent\Builder;

class SoftDelete extends CreatedUpdatedAt {

    protected static function boot() {
        parent::boot();
        static::addGlobalScope(
            'nonHardDeleted',
            function (Builder $builder) {
                $builder->where($builder->getModel()->getTable().'.isDeleted', '<', 1);
            }
        );
    }
}
