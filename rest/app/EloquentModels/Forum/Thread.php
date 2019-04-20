<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\DeletableModel;
use App\Helpers\UserHelper;
use App\Services\ForumService;
use App\Utils\Value;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\App;

/**
 * @property mixed title
 * @property mixed threadId
 * @property mixed categoryId
 * @property mixed userId
 * @property mixed category
 * @property mixed firstPost
 * @property mixed templateData
 * @SuppressWarnings(PHPMD.TooManyPublicMethods)
 */
class Thread extends DeletableModel {
    /** @var ForumService */
    private $forumService;

    protected $fillable = ['categoryId', 'title', 'userId', 'firstPostId', 'lastPostId', 'isApproved', 'prefixId', 'isOpen', 'posts'];
    protected $primaryKey = 'threadId';
    protected $appends = ['parents', 'categoryIsOpen', 'user'];
    protected $hidden = ['firstPost', 'templateData', 'category'];

    public function __construct (array $attributes = []) {
        parent::__construct($attributes);
        $this->forumService = App::make('App\Services\ForumService');
    }

    public function firstPost () {
        return $this->hasOne('App\EloquentModels\Forum\Post', 'postId', 'firstPostId');
    }

    public function lastPost () {
        return $this->hasOne('App\EloquentModels\Forum\Post', 'postId', 'lastPostId');
    }

    public function poll () {
        return $this->hasOne('App\EloquentModels\Forum\ThreadPoll', 'threadId');
    }

    public function threadPosts () {
        return $this->hasMany('App\EloquentModels\Forum\Post', 'threadId');
    }

    public function prefix () {
        return $this->hasOne('App\EloquentModels\Forum\Prefix', 'prefixId', 'prefixId');
    }

    public function user () {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId');
    }

    public function templateData () {
        return $this->hasOne('App\EloquentModels\Forum\TemplateData', 'threadId');
    }

    public function category () {
        return $this->belongsTo('App\EloquentModels\Forum\Category', 'categoryId');
    }

    public function getPrefixAttribute() {
        return $this->prefix()->first();
    }

    public function getUserAttribute () {
        return UserHelper::getUser($this->userId);
    }

    public function getParentsAttribute () {
        return $this->forumService->getCategoryParents($this);
    }

    public function getCategoryIsOpenAttribute () {
        return $this->category->isOpen;
    }

    public function getTemplateAttribute () {
        return $this->category->template;
    }

    public function getContentAttribute () {
        return $this->firstPost->content;
    }

    public function getLastPostAttribute () {
        return $this->lastPost()->first();
    }

    public function getTagsAttribute () {
        if (isset($this->templateData->tags)) {
            return explode(',', $this->templateData->tags);
        }
        return [];
    }

    public function getBadgeAttribute () {
        return Value::objectProperty($this->templateData, 'badge', '');
    }

    public function scopeBelongsToUser(Builder $query, $userId) {
        return $query->where('userId', $userId);
    }

    public function scopeIsApproved (Builder $query, $canApprove = false) {
        return $query->where('isApproved', ($canApprove ? '<=' : '='), true);
    }

    public function scopeCreatedAfter(Builder $query, $createdAfter) {
        return $query->where('createdAt', '>', $createdAfter);
    }

    public function scopeUnapproved (Builder $query) {
        return $query->where('isApproved', false);
    }

    public function scopeOpen (Builder $query) {
        return $query->where('isOpen', true);
    }

    public function scopeClosed (Builder $query) {
        return $query->where('isOpen', false);
    }

    public function scopeIsSticky (Builder $query) {
        return $query->where('isSticky', true);
    }

    public function scopeNonStickied (Builder $query) {
        return $query->where('isSticky', false);
    }
}
