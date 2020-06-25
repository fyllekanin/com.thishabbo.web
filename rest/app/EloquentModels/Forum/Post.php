<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\DeletableModel;
use App\Helpers\UserHelper;
use App\Providers\Service\ContentService;
use App\Utils\PaginationUtil;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\App;

/**
 * @property mixed postId
 * @property mixed userId
 * @property mixed threadId
 * @property mixed content
 * @property mixed thread
 * @property mixed user
 */
class Post extends DeletableModel {

    /**
     *
     *
     * @var ContentService
     */
    private $myContentService;

    protected $fillable = ['threadId', 'userId', 'content', 'isApproved'];
    protected $primaryKey = 'postId';
    protected $appends = ['parsedContent', 'likers', 'user'];

    public function __construct(array $attributes = []) {
        parent::__construct($attributes);
        $this->myContentService = App::make(ContentService::class);
    }

    public function thread() {
        return $this->belongsTo('App\EloquentModels\Forum\Thread', 'threadId');
    }

    public function user() {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId');
    }

    public function likes() {
        return $this->hasMany('App\EloquentModels\Forum\PostLike', 'postId');
    }

    public function getPrefixAttribute() {
        return $this->thread->prefix;
    }

    public function getLikersAttribute() {
        return $this->likes()->orderBy('createdAt', 'DESC')->get()->map(
            function ($like) {
                return UserHelper::getSlimUser($like->user->userId);
            }
        );
    }

    public function getUserAttribute() {
        return UserHelper::getUser($this->userId);
    }

    public function getParsedContentAttribute() {
        return $this->myContentService->getParsedContent($this->content);
    }

    public function getPage($canApprove = false) {
        return PaginationUtil::getTotalPages(Post::isApproved($canApprove)
            ->where('postId', '<', $this->postId)
            ->where('threadId', $this->threadId)
            ->count('postId'));
    }

    public function scopeIsApproved(Builder $query, $canApprove = false) {
        return $query->where('isApproved', ($canApprove ? '<=' : '='), 1);
    }
}
