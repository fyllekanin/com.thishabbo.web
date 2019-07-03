<?php

namespace App\EloquentModels\Shop;

use App\EloquentModels\Models\DeletableModel;

class LootBox extends DeletableModel {
    protected $primaryKey = 'lootBoxId';
    protected $table = 'loot_boxes';
    protected $fillable = ['title', 'items', 'boxId', 'credits', 'isDeleted'];
}
