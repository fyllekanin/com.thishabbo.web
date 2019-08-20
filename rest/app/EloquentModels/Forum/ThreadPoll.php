<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\DeletableModel;

class ThreadPoll extends DeletableModel {
    protected $table = 'thread_polls';
    protected $primaryKey = 'threadPollId';
    protected $fillable = ['threadId', 'question', 'options', 'isResultPublic'];

    public function thread() {
        return $this->belongsTo('App\EloquentModels\Forum\Thread', 'threadId', 'threadId');
    }

    public function answers() {
        return $this->hasMany('App\EloquentModels\Forum\ThreadPollAnswer', 'threadPollId', 'threadPollId');
    }
}
