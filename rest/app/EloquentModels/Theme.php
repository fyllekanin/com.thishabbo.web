<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\DeletableModel;

class Theme extends DeletableModel {
    protected $table = 'themes';
    protected $primaryKey = 'themeId';
    protected $fillable = ['title', 'isDefault', 'minified', 'css'];
}
