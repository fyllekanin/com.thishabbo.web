<?php

namespace App\Repositories\Impl\CategoryRepository;

use App\Repositories\Impl\SoftDelete;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int $categoryId
 * @property int $parentId
 * @property string $title
 * @property string $description
 * @property int $options
 * @property int $displayOrder
 * @property string $template
 * @property bool $isOpen
 * @property bool $isHidden
 * @property string $link
 * @property int $lastPostId
 * @property string $icon
 * @property int $credits
 * @property int $xp
 *
 * @method whereParentId(int $parentId)
 * @method makeTopParent()
 * @method setParentId(int $parentId)
 */
class CategoryDBO extends SoftDelete {

    protected $table = 'categories';
    protected $primaryKey = 'categoryId';
    protected $fillable = [
        'parentId', 'title', 'description', 'options', 'displayOrder',
        'template', 'isOpen', 'isHidden', 'link', 'lastPostId', 'icon', 'credits', 'xp'
    ];

    public function scopeWhereParentId(Builder $builder, int $parentId) {
        return $builder->where('parentId', $parentId);
    }

    public function scopeMakeTopParent(Builder $builder) {
        $this->scopeSetParentId($builder, -1);
    }

    public function scopeSetParentId(Builder $builder, int $parentId) {
        $builder->update(['parentId' => $parentId]);
    }
}
