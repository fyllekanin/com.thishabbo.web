<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * Class SiteMessage
 *
 * @package App\EloquentModels
 *
 * @property mixed siteMessageId
 * @property mixed title
 * @property mixed type
 * @property mixed content
 * @property mixed expiresAt
 *
 * @method mixed isActive
 */
class SiteMessage extends DeletableModel {

    protected $table = 'site_messages';
    protected $primaryKey = 'siteMessageId';
    protected $fillable = ['title', 'type', 'content', 'expiresAt'];

    public function scopeIsActive(Builder $query) {
        return $query->where('expiresAt', '>', time());
    }
}
