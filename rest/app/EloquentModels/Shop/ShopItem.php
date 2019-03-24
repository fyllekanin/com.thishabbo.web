<?php

namespace App\EloquentModels\Shop;

use App\EloquentModels\Models\DeletableModel;

class ShopItem extends DeletableModel {
    protected $primaryKey = 'shopItemId';
    protected $fillable = ['title', 'description', 'rarity', 'type'];

}
