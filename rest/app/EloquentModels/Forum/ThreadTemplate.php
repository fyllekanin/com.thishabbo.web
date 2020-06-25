<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed threadTemplateId
 * @property mixed name
 * @property mixed content
 * @property mixed categoryIds
 */
class ThreadTemplate extends DeletableModel {

    protected $table = 'thread_templates';
    protected $primaryKey = 'threadTemplateId';
    protected $fillable = ['name', 'content', 'categoryIds'];

    public function scopeAvailableForCategory(Builder $query, $categoryId) {
        return $query->whereRaw('find_in_set("'.$categoryId.'", categoryIds)')
            ->orWhereRaw('find_in_set("-1", categoryIds)');
    }
}
