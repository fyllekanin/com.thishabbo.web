<?php

namespace App\Repositories\Impl;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Class BaseModel
 *
 * @package App\Repositories\Impl
 *
 * @method countPrimary()
 */
class BaseModel extends Model {

    public static $snakeAttributes = false;

    public function getDateFormat() {
        return 'U';
    }

    public function scopeCountPrimary(Builder $builder) {
        return $builder->count($this->primaryKey);
    }

    protected function serializeDate(DateTimeInterface $date) {
        return $date->getTimestamp();
    }
}
