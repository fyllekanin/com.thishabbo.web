<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\UnixTimeModel;

class ThreadSubscription extends UnixTimeModel {
    protected $table = 'thread_subscriptions';
    protected $fillable = ['userId', 'threadId'];

    public function thread () {
        return $this->belongsTo('App\EloquentModels\Forum\Thread', 'threadId', 'threadId');
    }
}
