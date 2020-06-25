<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\UnixTimeModel;

class TemplateData extends UnixTimeModel {

    protected $fillable = ['threadId', 'tags', 'badges', 'roomLink'];
    protected $table = 'template_data';
    protected $primaryKey = 'templateDataId';

    public function getTags() {
        if (strpos($this->tags, ',') !== false) {
            return explode(',', $this->tags);
        }
        return [$this->tags];
    }
}
