<?php

namespace App\EloquentModels\Group;

use App\EloquentModels\Models\UnixTimeModel;

class GroupList extends UnixTimeModel {

    protected $primaryKey = 'groupListId';
    protected $table = 'groups_list';
    protected $fillable = ['groupId', 'displayOrder', 'color'];

    public function group() {
        return $this->hasOne('App\EloquentModels\Group\Group', 'groupId', 'groupId');
    }
}
