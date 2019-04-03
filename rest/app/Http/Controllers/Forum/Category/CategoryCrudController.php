<?php

namespace App\Http\Controllers\Forum\Category;

use App\EloquentModels\CategorySubscription;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\IgnoredCategory;
use App\EloquentModels\Forum\IgnoredThread;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Services\ForumService;
use App\Services\QueryParamService;
use App\Utils\Iterables;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CategoryCrudController extends Controller {
    private $categoryTemplates = null;

    private $queryParamService;
    private $forumService;

    /**
     * CategoryController constructor.
     * Fetch the available category templates and store them in an instance variable
     *
     * @param QueryParamService $queryParamService
     * @param ForumService      $forumService
     */
    public function __construct (QueryParamService $queryParamService, ForumService $forumService) {
        parent::__construct();
        $this->categoryTemplates = ConfigHelper::getCategoryTemplatesConfig();
        $this->queryParamService = $queryParamService;
        $this->forumService = $forumService;
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategoryList() {
        $user = Cache::get('auth');
        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);

        return response()->json($this->getCategoryChildren(-1, $categoryIds));
    }

    /**
     * Get request to get the forum home resource page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getForumCategories () {
        $user = Cache::get('auth');
        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);

        return response()->json($this->getCategoriesAndFirstLevel($user->userId, $categoryIds));
    }

    /**
     *
     * @param         $clientTodayMidnight
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getForumStats ($clientTodayMidnight) {
        $user = Cache::get('auth');
        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);

        return response()->json([
            'latestPosts' => $this->getLatestPosts($user, $categoryIds),
            'topPosters' => $this->getTopPosters(),
            'topPostersToday' => $this->getTopPostersToday($clientTodayMidnight)
        ]);
    }

    /**
     * Get request to get given category resource page
     *
     * @param Request $request
     * @param         $categoryId
     * @param int     $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategoryPage (Request $request, $categoryId, $page = 1) {
        $user = Cache::get('auth');
        $sortedByQuery = $request->input('sortedBy');
        $sortOrderQuery = $request->input('sortOrder');
        $fromTheQuery = $request->input('fromThe');

        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumConfig()->canRead, $categoryId,
            'No permissions to access this category');

        $category = Category::where('categoryId', $categoryId)->first();
        $category->append('parents');
        $forumPermissions = $this->getCategoryPermissions($categoryId, $user->userId);

        $sortedBy = $this->queryParamService->getSortedBy($sortedByQuery);
        $fromThe = $this->queryParamService->getFromThe($fromTheQuery);
        $sortOrder = isset($sortOrderQuery) && !empty($sortOrderQuery) ? $sortOrderQuery : 'desc';
        $threadSql = Thread::nonStickied()
            ->where('categoryId', $categoryId)
            ->createdAfter($fromThe)
            ->isApproved($forumPermissions->canApproveThreads)
            ->orderBy($sortedBy, $sortOrder);

        if (!$forumPermissions->canViewOthersThreads) {
            $threadSql->belongsToUser($user->userId);
        }

        $total = ceil($threadSql->count() / $this->perPage);
        $threads = $threadSql->skip($this->getOffset($page))
            ->take($this->perPage)
            ->get();

        return response()->json([
            'categoryId' => $categoryId,
            'title' => $category->title,
            'isOpen' => $category->isOpen,
            'parents' => $this->forumService->getCategoryParents($category),
            'categories' => $this->getSlimChildCategories($categoryId, $user->userId),
            'stickyThreads' => $page <= 1 ? $this->getStickyThreadsForCategory($categoryId, $forumPermissions, $user->userId) : [],
            'threads' => $this->buildThreadsForCategory($threads, $user->userId),
            'total' => $total,
            'forumPermissions' => $forumPermissions,
            'page' => $page,
            'displayOptions' => [
                'sortedBy' => $sortedByQuery,
                'sortOrder' => $sortOrderQuery,
                'fromThe' => $fromTheQuery
            ],
            'isSubscribed' => CategorySubscription::where('userId', $user->userId)->where('categoryId', $categoryId)->count() > 0,
            'isIgnored' => IgnoredCategory::where('userId', $user->userId)->where('categoryId', $categoryId)->count() > 0
        ]);
    }

    /**
     * Get an object with all the available forum permissions for given user
     *
     * @param $categoryId
     * @param $userId
     *
     * @return object
     */
    private function getCategoryPermissions ($categoryId, $userId) {
        $permissions = [];

        foreach (ConfigHelper::getForumConfig() as $key => $value) {
            $permissions[$key] = PermissionHelper::haveForumPermission($userId, $value, $categoryId);
        }

        return (object)$permissions;
    }

    /**
     * Mapper method to build slim versions of threads to be displayed
     * in category page.
     *
     * @param $threads
     * @param $userId
     *
     * @return mixed
     */
    private function buildThreadsForCategory ($threads, $userId) {
        foreach ($threads as $thread) {
            $thread->append('prefix');
            $user = UserHelper::getUserFromId($thread->userId);
            $thread->lastPost = $this->forumService->getSlimPost($thread->lastPostId);
            $thread->nickname = $user ? $user->nickname : 'no-one';
            $thread->haveRead = $this->forumService->haveReadThread($thread, $userId);
        }

        return $threads;
    }

    /**
     * Get method for fetching all sticky threads for given category
     *
     * @param $categoryId
     * @param $categoryPermissions
     * @param $userId
     *
     * @return \Illuminate\Support\Collection
     */
    private function getStickyThreadsForCategory ($categoryId, $categoryPermissions, $userId) {
        $threadSql = Thread::isApproved($categoryPermissions->canApproveThreads)
            ->isSticky()
            ->where('categoryId', $categoryId);

        if (!$categoryPermissions->canViewOthersThreads) {
            $threadSql->belongsToUser($userId);
        }
        $threads = $threadSql->get();

        foreach ($threads as $thread) {
            $thread->append('prefix');
            $user = UserHelper::getUserFromId($thread->userId);
            $thread->lastPost = $this->forumService->getSlimPost($thread->lastPostId);
            $thread->nickname = $user ? $user->nickname : 'no-one';
        }

        return $threads;
    }

    /**
     * Get method to fetch all top level categories
     * to be displayed on forum home page
     *
     * @param $userId
     * @param $categoryIds
     *
     * @return array
     */
    private function getCategoriesAndFirstLevel ($userId, $categoryIds) {
        $categorySql = Category::nonHidden()
            ->withParent('-1')
            ->whereIn('categoryId', $categoryIds)
            ->select('categoryId', 'link', 'displayOrder', 'title');
        $categories = [];

        foreach ($categorySql->get() as $mainCategory) {
            $mainCategory->childs = $this->getSlimChildCategories($mainCategory->categoryId, $userId);
            $categories[] = $mainCategory;
        }

        return $categories;
    }

    /**
     * Get method to get an array and map the the category and its children for
     * a three perspective.
     *
     * @param $categoryId
     * @param $userId
     *
     * @return array
     */
    private function getSlimChildCategories ($categoryId, $userId) {
        $categoryIds = $this->forumService->getAccessibleCategories($userId);
        $children = Category::nonHidden()
            ->withParent($categoryId)
            ->whereIn('categoryId', $categoryIds)
            ->select('categoryId', 'description', 'displayOrder', 'link', 'title', 'lastPostId')
            ->get();
        $childs = [];

        foreach ($children as $child) {
            if (PermissionHelper::haveForumPermission($userId, ConfigHelper::getForumConfig()->canViewOthersThreads, $child->categoryId)) {
                $child->lastPost = $this->forumService->getSlimPost($child->lastPostId);
            } else {
                $canApproveThreads = PermissionHelper::haveForumPermission($userId, ConfigHelper::getForumConfig()->canApproveThreads, $child->categoryId);
                $categoryIdsChain = $this->getCategoryIdsChain($child->categoryId, $categoryIds);
                $last = Thread::belongsToUser($userId)
                    ->isApproved($canApproveThreads)
                    ->whereIn('categoryId', $categoryIdsChain)
                    ->orderBy('lastPostId', 'DESC')
                    ->select('lastPostId')
                    ->getQuery()
                    ->first();
                $child->lastPost = $last ? $this->forumService->getSlimPost($last->lastPostId) : null;
            }
            $child->childs = Category::whereIn('categoryId', $categoryIds)
                ->where('parentId', $child->categoryId)
                ->select('categoryId', 'title', 'displayOrder')
                ->orderBy('displayOrder', 'ASC')
                ->getQuery()
                ->get();
            $childs[] = $child;
        }

        return $childs;
    }

    /**
     * @param $categoryId
     * @param $accessibleIds
     *
     * @return array
     */
    private function getCategoryIdsChain($categoryId, $accessibleIds) {
        $categoryIds = [$categoryId];

        $ids = Category::where('parentId', $categoryId)->whereIn('categoryId', $accessibleIds)->pluck('categoryId');
        foreach ($ids as $id) {
            $result = $this->getCategoryIdsChain($id, $accessibleIds);
            $categoryIds = array_merge($categoryIds, $result);
        }

        return $categoryIds;
    }

    /**
     * Get method to fetch the latest posts made
     *
     * @param $user
     * @param $categoryIds
     *
     * @return \Illuminate\Support\Collection
     */
    private function getLatestPosts ($user, $categoryIds) {
        $ignoredCategoryIds = array_merge(IgnoredCategory::where('userId', $user->userId)->pluck('categoryId')->toArray(),
            $this->forumService->getCategoriesUserCantSeeOthersThreadsIn($user->userId));
        $ignoredThreadIds = IgnoredThread::where('userId', $user->userId)->pluck('threadId');

        return $this->forumService
            ->getLatestPosts($categoryIds, $ignoredThreadIds, $ignoredCategoryIds, 10)
            ->data;
    }

    /**
     * Get method to get an array of all the top poster over all time
     */
    private function getTopPosters () {
        return User::select('userId', 'posts')
            ->orderBy('posts', 'DESC')
            ->take(15)
            ->getQuery()
            ->get()
            ->map(function($user) {
                return [
                    'posts' => $user->posts,
                    'user' => UserHelper::getSlimUser($user->userId)
                ];
            });
    }

    /**
     * Get method to get an array of top poster for the current day.
     *
     * @param $clientTodayMidnight
     *
     * @return array
     */
    private function getTopPostersToday ($clientTodayMidnight) {
        return Post::where('createdAt', '>=', $clientTodayMidnight)
            ->select('userId', DB::raw('count(postId) AS number'))
            ->groupBy('userId')
            ->orderBy('number', 'DESC')
            ->take(15)
            ->getQuery()
            ->get()
            ->map(function($post) {
                return [
                    'posts' => $post->number,
                    'user' => UserHelper::getSlimUser($post->userId)
                ];
            });
    }

    private function getCategoryChildren($categoryId, $categoryIds) {
        $categories = [];

        foreach (Category::whereIn('categoryId', $categoryIds)->where('parentId', $categoryId)->orderBy('displayOrder', 'ASC')->get() as $category) {
            $categories[] = [
                'categoryId' => $category->categoryId,
                'title' => $category->title,
                'children' => $this->getCategoryChildren($category->categoryId, $categoryIds)
            ];
        }

        return $categories;
    }
}
