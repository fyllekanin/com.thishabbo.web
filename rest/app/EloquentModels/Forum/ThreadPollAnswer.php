<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

class ThreadPollAnswer extends DeletableModel {
    protected $table = 'poll_answers';
    protected $primaryKey = 'threadPollId';
    protected $fillable = ['threadPollId', 'userId', 'answer'];

    public function scopeWhereUserId(Builder $builder, $userId) {
        return $builder->where('userId', $userId);
    }
}
