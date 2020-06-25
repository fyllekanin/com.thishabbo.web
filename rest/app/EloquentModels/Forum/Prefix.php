<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed prefixId
 * @property mixed text
 */
class Prefix extends DeletableModel {

    protected $table = 'prefixes';
    protected $primaryKey = 'prefixId';
    protected $fillable = ['text', 'style', 'categoryIds'];

    public function scopeAvailableForCategory(Builder $query, $categoryId) {
        return $query->whereRaw('find_in_set("'.$categoryId.'", categoryIds)')
            ->orWhereRaw('find_in_set("-1", categoryIds)');
    }
}
