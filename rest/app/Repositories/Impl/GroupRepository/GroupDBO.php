<?php

namespace App\Repositories\Impl\GroupRepository;

use App\Repositories\Impl\SoftDelete;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * @property int groupId
 * @property string name
 * @property string nickname
 * @property string nameColor
 * @property string userBarStyling
 * @property int immunity
 * @property int sitecpPermissions
 * @property int staffPermissions
 * @property int options
 * @property bool isPublic
 * @property int avatarHeight
 * @property int avatarWidth
 *
 * @method whereInGroupId(Collection $groupIds)
 * @method whereGroupId(int $groupId)
 */
class GroupDBO extends SoftDelete {

    protected $table = 'groups';
    protected $primaryKey = 'groupId';
    protected $fillable = [
        'name', 'nickname', 'nameColor', 'userBarStyling', 'immunity', 'sitecpPermissions',
        'staffPermissions', 'options', 'isPublic', 'avatarHeight', 'avatarWidth'
    ];

    public function scopeWhereInGroupId(Builder $builder, Collection $groupIds) {
        return $builder->whereIn($this->primaryKey, $groupIds);
    }

    public function scopeWhereGroupId(Builder $builder, int $groupId) {
        return $builder->where($this->primaryKey, $groupId);
    }
}
