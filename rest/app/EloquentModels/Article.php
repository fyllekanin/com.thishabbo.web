<?php

namespace App;


use App\EloquentModels\Models\UnixTimeModel;

class Article extends UnixTimeModel {
    protected $primaryKey = 'articleId';
    protected $fillable = ['title', 'content', 'userId'];
}
