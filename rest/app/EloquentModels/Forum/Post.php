<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\DeletableModel;
use App\Helpers\UserHelper;
use App\Utils\BBcodeUtil;
use Illuminate\Database\Eloquent\Builder;

class Post extends DeletableModel
{
    protected $fillable = ['threadId', 'userId', 'content', 'isApproved'];
    protected $primaryKey = 'postId';
    protected $appends = ['parsedContent', 'likers', 'user'];

    public function thread() {
        return $this->belongsTo('App\EloquentModels\Forum\Thread', 'threadId');
    }

    public function user() {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId');
    }

    public function likes() {
        return $this->hasMany('App\EloquentModels\Forum\PostLike','postId');
    }

    public function getPrefixAttribute() {
        return $this->thread->prefix;
    }

    public function getLikersAttribute() {
        return $this->likes()->get()->map(function($like) {
            return $like->user;
        });
    }

    public function getUserAttribute() {
        return UserHelper::getUser($this->userId);
    }

    public function getParsedContentAttribute() {
        return BBcodeUtil::bbcodeParser($this->content);
    }

    public function scopeIsApproved(Builder $query, $canApprove = false) {
        return $query->where('isApproved', ($canApprove ? '<=' : '='), 1);
    }

}
