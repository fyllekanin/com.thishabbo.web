<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\UnixTimeModel;

class CategoryRead extends UnixTimeModel {

    protected $primaryKey = 'categoryReadId';
    protected $table = 'category_read';
    protected $fillable = ['categoryId', 'userId'];
}
