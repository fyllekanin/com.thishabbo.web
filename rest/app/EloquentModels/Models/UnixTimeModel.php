<?php

namespace App\EloquentModels\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class UnixTimeModel extends Model {

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    protected $dateFormat = 'U';

    public static $snakeAttributes = false;

    public function getDateFormat() {
        return 'U';
    }

    public function scopeCountPrimary(Builder $builder) {
        return $builder->count($this->primaryKey);
    }

    public function skipAppends() {
        $this->appends = [];
    }

    protected function serializeDate(DateTimeInterface $date) {
        return $date->getTimestamp();
    }
}
