<?php

namespace App\EloquentModels\Forum;

use App\Constants\CategoryOptions;
use App\Constants\CategoryTemplates;
use App\EloquentModels\Models\DeletableModel;
use App\Providers\Service\ForumService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\App;

/**
 * @property mixed title
 * @property mixed categoryId
 *
 * @SuppressWarnings(PHPMD.TooManyPublicMethods)
 */
class Category extends DeletableModel {

    /**
     *
     *
     * @var ForumService
     */
    private $myForumService;

    protected $primaryKey = 'categoryId';
    protected $fillable = [
        'parentId', 'title', 'description', 'options', 'displayOrder', 'template', 'isOpen', 'isHidden', 'link', 'lastPostId',
        'icon', 'credits', 'xp'
    ];

    public function __construct(array $attributes = []) {
        parent::__construct($attributes);
        $this->myForumService = App::make(ForumService::class);
    }

    public function threads() {
        return $this->hasMany('App\EloquentModels\Forum\Thread', 'categoryId');
    }

    public function categories() {
        return $this->hasMany('App\EloquentModels\Forum\Category', 'categoryId');
    }

    public function posts() {
        return $this->hasManyThrough(
            'App\EloquentModels\Forum\Post',
            'App\EloquentModels\Thread',
            'categoryId',
            'threadId',
            'threadId',
            'postId'
        );
    }

    public function parent() {
        return $this->belongsTo('App\EloquentModels\Forum\Category', 'parentId');
    }

    public function getParentsAttribute() {
        return $this->myForumService->getCategoryParents($this);
    }

    public function scopeWithParent(Builder $query, $parentId) {
        return $query->where('parentId', $parentId);
    }

    public function scopeIsReportCategory(Builder $query) {
        return $query->whereRaw('(options & '.CategoryOptions::REPORT_POSTS_GO_HERE.')');
    }

    public function scopeIsJobCategory(Builder $query) {
        return $query->whereRaw('(options & '.CategoryOptions::JOB_APPLICATIONS_GO_HERE.')');
    }

    public function scopeIsContactCategory(Builder $query) {
        return $query->whereRaw('(options & '.CategoryOptions::CONTACT_POSTS_GO_HERE.')');
    }

    public function scopeNonHidden(Builder $query) {
        return $query->where('isHidden', '<', 1);
    }

    public function scopeDefault(Builder $query) {
        return $query->where('template', CategoryTemplates::DEFAULT);
    }

    public function scopeMedia(Builder $query) {
        return $query->where('template', CategoryTemplates::MEDIA);
    }

    public function scopeQuests(Builder $query) {
        return $query->where('template', CategoryTemplates::QUEST);
    }
}
