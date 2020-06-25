<?php

namespace App\EloquentModels\Models;

use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed data
 */
class LogModel extends UnixTimeModel {

    private $parsedData;

    public function scopeWhereJson(Builder $query, $value, Array $path) {
        $realPath = '$.'.join('.', $path);
        return $query->whereRaw("JSON_CONTAINS(data, '".$value."', '".$realPath."')");
    }

    public function scopeOrderByCreatedDesc(Builder $query) {
        return $query->orderBy('createdAt', 'desc');
    }

    public function scopeWhereAction(Builder $query, $value) {
        return $query->where('action', $value);
    }

    public function scopeWhereInUserIds(Builder $query, $userIds) {
        return $query->whereIn('userId', $userIds);
    }

    public function scopeWhereContentId(Builder $query, $contentId) {
        return $query->where('contentId', $contentId);
    }

    public function getData() {
        if ($this->parsedData) {
            return $this->parsedData;
        }

        return json_decode($this->data);
    }
}
