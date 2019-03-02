<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\UnixTimeModel;

class IgnoredThread extends UnixTimeModel {
    protected $table = 'ignored_threads';
    protected $fillable = ['threadId', 'userId'];

    public function thread() {
        return $this->hasOne('App\EloquentModels\Forum\Thread', 'threadId', 'threadId');
    }
}
