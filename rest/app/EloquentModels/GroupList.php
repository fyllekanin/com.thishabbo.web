<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\UnixTimeModel;

class GroupList extends UnixTimeModel {
	protected $primaryKey = 'groupListId';
    protected $table = 'groups_list';
    protected $fillable = ['groupId', 'displayOrder'];
}
