<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed siteMessageId
 */
class SiteMessage extends DeletableModel {
    protected $table = 'site_messages';
    protected $primaryKey = 'siteMessageId';
    protected $fillable = ['title', 'type', 'isActive', 'content'];

    public function scopeIsActive(Builder $query) {
        return $query->where('isActive', '>', 0);
    }
}
