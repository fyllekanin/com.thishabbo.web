<?php

namespace App\EloquentModels\Forum;

use Illuminate\Database\Eloquent\Model;

class TemplateData extends Model {
    public $timestamps = false;
    protected $fillable = ['threadId', 'tags', 'badge'];
    protected $table = 'template_data';
    protected $primaryKey = 'templateDataId';
}
