<?php

namespace App\EloquentModels\Models;

use Illuminate\Database\Eloquent\Builder;

class DeletableModel extends UnixTimeModel {

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
