<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\UnixTimeModel;

class IgnoredCategory extends UnixTimeModel {

    protected $table = 'ignored_categories';
    protected $primaryKey = 'ignoredCategoryId';
    protected $fillable = ['categoryId', 'userId'];

    public function category() {
        return $this->hasOne('App\EloquentModels\Forum\Category', 'categoryId', 'categoryId');
    }
}
