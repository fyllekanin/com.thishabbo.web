<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\DeletableModel;

class ThreadPollAnswer extends DeletableModel {
    protected $table = 'poll_answers';
    protected $primaryKey = 'threadPollId';
    protected $fillable = ['threadPollId', 'userId', 'answer'];
}
