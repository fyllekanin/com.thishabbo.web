<?php

namespace App\EloquentModels\Shop;

use App\EloquentModels\Models\DeletableModel;

/**
 * @property mixed shopItemId
 * @property mixed createdBy
 */
class ShopItem extends DeletableModel {

    protected $primaryKey = 'shopItemId';
    protected $table = 'shop_items';
    protected $fillable = ['title', 'description', 'rarity', 'type', 'data', 'createdBy'];
}
