<?php

namespace App\EloquentModels\Models;

use Illuminate\Database\Eloquent\Builder;

class LogModel extends UnixTimeModel {

    public function scopeWhereJson(Builder $query, $value, Array $path) {
        $realPath = '$.' . join('.', $path);
        return $query->whereRaw("JSON_CONTAINS(data, '" . $value . "', '" . $realPath . "')");
    }

}
