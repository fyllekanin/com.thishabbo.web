<?php

namespace App\EloquentModels\Forum;

use App\Constants\CategoryTemplates;
use App\EloquentModels\Models\DeletableModel;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserBadgeCompleted;
use App\Helpers\UserHelper;
use App\Providers\Service\ForumService;
use App\Utils\PaginationUtil;
use App\Utils\Value;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\App;

/**
 * @property                                     mixed title
 * @property                                     mixed threadId
 * @property                                     mixed categoryId
 * @property                                     mixed userId
 * @property                                     mixed category
 * @property                                     mixed firstPost
 * @property                                     mixed templateData
 * @property                                     mixed isApproved
 * @property                                     bool isBadgesCompleted
 * @property                                     mixed template
 * @property                                     mixed badges
 * @property                                     mixed forumPermissions
 * @property                                     ThreadPoll poll
 * @SuppressWarnings(PHPMD.TooManyPublicMethods)
 * @method                                       static isApproved($canApprove = false)
 */
class Thread extends DeletableModel {

    /**
     *
     *
     * @var ForumService
     */
    private $myForumService;

    protected $fillable = [
        'categoryId', 'title', 'userId', 'firstPostId', 'lastPostId', 'isApproved',
        'prefixId', 'isOpen', 'posts', 'isSticky'
    ];
    protected $primaryKey = 'threadId';
    protected $appends = ['parents', 'categoryIsOpen', 'user'];
    protected $hidden = ['firstPost', 'templateData', 'category'];

    public function __construct(array $attributes = []) {
        parent::__construct($attributes);
        $this->myForumService = App::make(ForumService::class);
    }

    /**
     * Append the related data needed when reading a thread for the template it has
     * It will also set the template property to itself
     *
     * @param  User  $user
     */
    public function appendTemplateRelatedData($user) {
        $this->template = $this->category->template;
        switch ($this->template) {
            case CategoryTemplates::QUEST:
                $this->append('tags')
                    ->append('badges')
                    ->append('roomLink');
                $this->isBadgesCompleted = count($this->badges) == UserBadgeCompleted::where('userId', $user->userId)
                        ->whereIn('habboBadgeId', $this->badges)
                        ->count();
                break;
            default:
                break;
        }
    }

    /**
     * Load thread posts and append them to itself
     *
     * @param $user
     * @param $page
     * @param $postedBy
     * @param $perPage
     * @param $forumPermissions
     */
    public function loadThreadPosts($user, $page, $postedBy, $perPage, $forumPermissions) {
        if (ThreadBan::where('threadId', $this->threadId)->where('userId', $user->userId)->count() > 0) {
            return;
        }

        $this->load(
            [
                'threadPosts' => function ($query) use ($page, $postedBy, $perPage, $forumPermissions) {
                    if ($postedBy) {
                        $query->where('userId', $postedBy->userId);
                    }
                    $query->isApproved($forumPermissions->canApprovePosts)
                        ->skip(PaginationUtil::getOffset($page))
                        ->take($perPage);
                }
            ]
        );
    }

    public function firstPost() {
        return $this->hasOne('App\EloquentModels\Forum\Post', 'postId', 'firstPostId');
    }

    public function latestPost() {
        return $this->hasOne('App\EloquentModels\Forum\Post', 'postId', 'lastPostId');
    }

    public function poll() {
        return $this->hasOne('App\EloquentModels\Forum\ThreadPoll', 'threadId');
    }

    public function threadPosts() {
        return $this->hasMany('App\EloquentModels\Forum\Post', 'threadId');
    }

    public function prefix() {
        return $this->hasOne('App\EloquentModels\Forum\Prefix', 'prefixId', 'prefixId');
    }

    public function user() {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId');
    }

    public function templateData() {
        return $this->hasOne('App\EloquentModels\Forum\TemplateData', 'threadId');
    }

    public function category() {
        return $this->belongsTo('App\EloquentModels\Forum\Category', 'categoryId');
    }

    public function getPrefixAttribute() {
        return $this->prefix()->first();
    }

    public function getUserAttribute() {
        return UserHelper::getSlimUser($this->userId);
    }

    public function getParentsAttribute() {
        return $this->myForumService->getCategoryParents($this);
    }

    public function getCategoryIsOpenAttribute() {
        return $this->category ? $this->category->isOpen : false;
    }

    public function getTemplateAttribute() {
        return $this->category->template;
    }

    public function getContentAttribute() {
        return $this->firstPost ? $this->firstPost->content : '';
    }

    public function getLatestPostAttribute() {
        return $this->latestPost()->first();
    }

    public function getTagsAttribute() {
        if (isset($this->templateData->tags)) {
            return explode(',', $this->templateData->tags);
        }
        return [];
    }

    public function getBadgesAttribute() {
        if (isset($this->templateData->badges)) {
            return json_decode($this->templateData->badges);
        }
        return [];
    }

    public function getRoomLinkAttribute() {
        return Value::objectProperty($this->templateData, 'roomLink', '');
    }

    public function scopeWithNickname(Builder $query) {
        return $query->leftJoin('users', 'users.userId', '=', 'threads.userId')
            ->select('threads.*', 'users.nickname');
    }

    public function scopeBelongsToUser(Builder $query, $userId) {
        return $query->where('threads.userId', $userId);
    }

    public function scopeIsApproved(Builder $query, $canApprove = 0) {
        return $query->where('threads.isApproved', ($canApprove ? '>=' : '>'), 0);
    }

    public function scopeCreatedAfter(Builder $query, $createdAfter) {
        return $query->where('threads.createdAt', '>', $createdAfter);
    }

    public function scopeUnapproved(Builder $query) {
        return $query->where('threads.isApproved', '<', 1);
    }

    public function scopeOpen(Builder $query) {
        return $query->where('threads.isOpen', '>', 0);
    }

    public function scopeClosed(Builder $query) {
        return $query->where('threads.isOpen', '<', 1);
    }

    public function scopeIsSticky(Builder $query) {
        return $query->where('threads.isSticky', '>', 0);
    }

    public function scopeNonStickied(Builder $query) {
        return $query->where('threads.isSticky', '<', 1);
    }
}
