<?php

namespace App\Repositories\Impl\PageRepository;

use App\Repositories\Impl\SoftDelete;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int $pageId
 * @property string $path
 * @property string $title
 * @property string $content
 * @property boolean $isSystem
 * @property boolean $canEdit
 *
 * @method wherePath(string $path)
 */
class PageDBO extends SoftDelete {
    protected $table = 'pages';
    protected $primaryKey = 'pageId';
    protected $fillable = ['path', 'title', 'content', 'isSystem', 'canEdit'];

    public function scopeWherePath(Builder $builder, string $path) {
        return $builder->whereRaw('lower(path) = ?', [strtolower($path)]);
    }
}
