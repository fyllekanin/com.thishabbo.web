<?php

namespace App\EloquentModels\Shop;

use App\EloquentModels\Models\DeletableModel;

class ShopCategory extends DeletableModel {
    protected $table = 'shop_categories';
    protected $primaryKey = 'shopCategoryId';
    protected $fillable = ['title', 'description', 'displayOrder'];
}
