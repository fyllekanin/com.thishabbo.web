<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\UnixTimeModel;

class BBcode extends UnixTimeModel {
    protected $table = 'bbcodes';
    protected $primaryKey = 'bbcodeId';
    protected $fillable = ['name', 'isEmoji', 'example', 'pattern', 'replace', 'content', 'isSystem'];
}
