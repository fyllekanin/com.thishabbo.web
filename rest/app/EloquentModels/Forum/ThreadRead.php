<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\UnixTimeModel;

class ThreadRead extends UnixTimeModel {

    protected $primaryKey = 'threadReadId';
    protected $table = 'thread_read';
    protected $fillable = ['threadId', 'userId'];
}
