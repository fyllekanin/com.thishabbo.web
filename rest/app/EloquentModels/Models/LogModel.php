<?php

namespace App\EloquentModels\Models;

use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed data
 */
class LogModel extends UnixTimeModel {
    private $parsedData;

    public function scopeWhereJson(Builder $query, $value, Array $path) {
        $realPath = '$.' . join('.', $path);
        return $query->whereRaw("JSON_CONTAINS(data, '" . $value . "', '" . $realPath . "')");
    }

    public function getData() {
        if ($this->parsedData) {
            return $this->parsedData;
        }

        return json_decode($this->data);
    }

}
