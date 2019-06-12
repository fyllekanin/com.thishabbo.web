<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\DeletableModel;
use App\Helpers\ConfigHelper;
use App\Services\ForumService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\App;

/**
 * @property mixed title
 * @property mixed categoryId
 *
 * @SuppressWarnings(PHPMD.TooManyPublicMethods)
 */
class Category extends DeletableModel {
    /** @var ForumService */
    private $forumService;

    protected $primaryKey = 'categoryId';
    protected $fillable = ['parentId', 'title', 'description', 'options', 'displayOrder', 'template', 'isOpen', 'isHidden', 'link', 'lastPostId', 'icon'];

    public function __construct(array $attributes = []) {
        parent::__construct($attributes);
        $this->forumService = App::make('App\Services\ForumService');
    }

    public function threads() {
        return $this->hasMany('App\EloquentModels\Forum\Thread', 'categoryId');
    }

    public function categories() {
        return $this->hasMany('App\EloquentModels\Forum\Category', 'categoryId');
    }

    public function parent() {
        return $this->belongsTo('App\EloquentModels\Forum\Category', 'parentId');
    }

    public function getParentsAttribute() {
        return $this->forumService->getCategoryParents($this);
    }

    public function scopeWithParent(Builder $query, $parentId) {
        return $query->where('parentId', $parentId);
    }

    public function scopeIsReportCategory(Builder $query) {
        return $query->whereRaw('(options & ' . ConfigHelper::getForumOptionsConfig()->reportPostsGoHere . ')');
    }

    public function scopeIsJobCategory(Builder $query) {
        return $query->whereRaw('(options & ' . ConfigHelper::getForumOptionsConfig()->jobApplicationsGoHere . ')');
    }

    public function scopeIsContactCategory(Builder $query) {
        return $query->whereRaw('(options & ' . ConfigHelper::getForumOptionsConfig()->contactPostsGoHere . ')');
    }

    public function scopeNonHidden(Builder $query) {
        return $query->where('isHidden', '<', 1);
    }

    public function scopeDefault(Builder $query) {
        return $query->where('template', ConfigHelper::getCategoryTemplatesConfig()->DEFAULT);
    }

    public function scopeMedia(Builder $query) {
        return $query->where('template', ConfigHelper::getCategoryTemplatesConfig()->MEDIA);
    }

    public function scopeQuests(Builder $query) {
        return $query->where('template', ConfigHelper::getCategoryTemplatesConfig()->QUEST);
    }
}
