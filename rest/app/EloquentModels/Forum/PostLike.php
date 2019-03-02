<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\UnixTimeModel;

class PostLike extends UnixTimeModel {
    protected $table = 'post_likes';
    protected $primaryKey = 'postLikeId';
    protected $fillable = ['postId', 'userId'];

    public function getUpdatedAtColumn() {
        return null;
    }

    public function user() {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId');
    }
}
