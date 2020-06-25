<?php

namespace App\Repositories\Impl\GroupRepository;

use App\Repositories\Impl\CreatedUpdatedAt;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int groupListId
 * @property int groupId
 * @property int displayOrder
 * @property string color
 *
 * @method orderByDisplayOrder()
 */
class GroupListDBO extends CreatedUpdatedAt {
    protected $primaryKey = 'groupListId';
    protected $table = 'groups_list';
    protected $fillable = ['groupId', 'displayOrder', 'color'];

    public function scopeOrderByDisplayOrder(Builder $builder) {
        return $builder->orderBy('displayOrder', 'ASC');
    }
}
