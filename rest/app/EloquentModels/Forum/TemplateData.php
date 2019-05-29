<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\UnixTimeModel;

class TemplateData extends UnixTimeModel {
    protected $fillable = ['threadId', 'tags', 'badge', 'roomLink'];
    protected $table = 'template_data';
    protected $primaryKey = 'templateDataId';
}
