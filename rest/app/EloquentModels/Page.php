<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\DeletableModel;

class Page extends DeletableModel {
    protected $table = 'pages';
    protected $primaryKey = 'pageId';
    protected $fillable = ['path', 'title', 'content', 'isSystem'];
}
