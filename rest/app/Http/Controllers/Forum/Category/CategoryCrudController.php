<?php

namespace App\Http\Controllers\Forum\Category;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\CategorySubscription;
use App\EloquentModels\Forum\IgnoredCategory;
use App\EloquentModels\Forum\IgnoredThread;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Services\ForumService;
use App\Services\QueryParamService;
use App\Utils\Condition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
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
     * @param ForumService $forumService
     */
    public function __construct(QueryParamService $queryParamService, ForumService $forumService) {
        parent::__construct();
        $this->categoryTemplates = ConfigHelper::getCategoryTemplatesConfig();
        $this->queryParamService = $queryParamService;
        $this->forumService = $forumService;
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getCategoryList(Request $request) {
        $user = $request->get('auth');
        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);

        return response()->json($this->getCategoryChildren(-1, $categoryIds));
    }

    /**
     * Get request to get the forum home resource page
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getForumCategories(Request $request) {
        $user = $request->get('auth');
        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);

        return response()->json($this->getCategoriesAndFirstLevel($user->userId, $categoryIds));
    }

    /**
     *
     * @param Request $request
     * @param         $clientTodayMidnight
     *
     * @return JsonResponse
     */
    public function getForumStats(Request $request, $clientTodayMidnight) {
        $user = $request->get('auth');
        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);

        return response()->json([
            'latestPosts' => $this->getLatestPosts($user, $categoryIds),
            'topPosters' => $this->getTopPosters(),
            'topPostersToday' => $this->getTopPostersToday($clientTodayMidnight),
            'currentlyActive' => $this->getOnline(1),
            'activeToday' => $this->getOnline(24)
        ]);
    }

    /**
     * Get request to get given category resource page
     *
     * @param Request $request
     * @param         $categoryId
     * @param int $page
     *
     * @return JsonResponse
     */
    public function getCategoryPage(Request $request, $categoryId, $page = 1) {
        $user = $request->get('auth');
        $sortedByQuery = $request->input('sortedBy');
        $sortOrderQuery = $request->input('sortOrder');
        $fromTheQuery = $request->input('fromThe');

        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumPermissions()->canRead, $categoryId,
            'No permissions to access this category');

        $category = Category::where('categoryId', $categoryId)->first();
        Condition::precondition(!$category, 404, 'No category with that ID');
        $this->forumService->updateReadCategory($category->categoryId, $user->userId);
        $forumPermissions = $this->getCategoryPermissions($categoryId, $user->userId);

        $sortedBy = $this->queryParamService->getSortedBy($sortedByQuery);
        $fromThe = $this->queryParamService->getFromThe($fromTheQuery);
        $sortOrder = isset($sortOrderQuery) && !empty($sortOrderQuery) ? $sortOrderQuery : 'desc';
        $threadSql = Thread::where('categoryId', $categoryId)
            ->nonStickied()
            ->where(function ($query) use ($user, $forumPermissions) {
                if ($forumPermissions->canApproveThreads) {
                    $query->where('isApproved', '>=', 0);
                } else {
                    $query->where('userId', $user->userId)->orWhere('isApproved', 1);
                }
            })
            ->orderBy($sortedBy, $sortOrder);

        if ($fromThe > -1) {
            $threadSql->createdAfter($fromThe);
        }

        if (!$forumPermissions->canViewOthersThreads) {
            $threadSql->belongsToUser($user->userId);
        }

        $total = DataHelper::getPage($threadSql->count('threadId'));
        $threads = $threadSql->skip(DataHelper::getOffset($page))
            ->take($this->perPage)
            ->with(['prefix', 'latestPost'])
            ->get();

        return response()->json([
            'categoryId' => $categoryId,
            'title' => $category->title,
            'isOpen' => $category->isOpen,
            'icon' => $category->icon,
            'parents' => $this->forumService->getCategoryParents($category),
            'categories' => $this->getSlimChildCategories($categoryId, $user->userId),
            'stickyThreads' => $page <= 1 ? $this->getStickyThreadsForCategory($categoryId, $forumPermissions, $user->userId, $category) : [],
            'threads' => $this->buildThreadsForCategory($threads, $user->userId, $category, $forumPermissions->canApprovePosts),
            'total' => $total,
            'forumPermissions' => $forumPermissions,
            'page' => $page,
            'displayOptions' => [
                'sortedBy' => $sortedByQuery,
                'sortOrder' => $sortOrderQuery,
                'fromThe' => $fromTheQuery
            ],
            'isSubscribed' => CategorySubscription::where('userId', $user->userId)->where('categoryId', $categoryId)->count('categoryId') > 0,
            'isIgnored' => IgnoredCategory::where('userId', $user->userId)->where('categoryId', $categoryId)->count('categoryId') > 0
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
    private function getCategoryPermissions($categoryId, $userId) {
        $permissions = [];

        foreach (ConfigHelper::getForumPermissions() as $key => $value) {
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
     * @param $category
     *
     * @return mixed
     */
    private function buildThreadsForCategory($threads, $userId, $category, $canApprovePosts) {
        foreach ($threads as $thread) {
            $thread->lastPost = $this->mapLastPost($thread, $thread->latestPost);
            $thread->haveRead = $this->forumService->haveReadThread($thread, $userId);
            $thread->icon = $category->icon;

            $lastViewed = $this->forumService->getLastViewed($userId, $thread->threadId, $canApprovePosts);
            $thread->lastPageViewed = $lastViewed->page;
            $thread->lastPostViewed = $lastViewed->post;
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
     * @param $category
     *
     * @return Collection
     */
    private function getStickyThreadsForCategory($categoryId, $categoryPermissions, $userId, $category) {
        $threadSql = Thread::isApproved($categoryPermissions->canApproveThreads)
            ->isSticky()
            ->where('categoryId', $categoryId);

        if (!$categoryPermissions->canViewOthersThreads) {
            $threadSql->belongsToUser($userId);
        }
        $threads = $threadSql->with(['prefix', 'latestPost'])->withNickname()->get();

        return $this->buildThreadsForCategory($threads, $userId, $category, $categoryPermissions->canApprovePosts);
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
    private function getCategoriesAndFirstLevel($userId, $categoryIds) {
        $categorySql = Category::nonHidden()
            ->withParent('-1')
            ->whereIn('categoryId', $categoryIds)
            ->select('categoryId', 'link', 'displayOrder', 'title');
        $categories = [];

        foreach ($categorySql->get() as $mainCategory) {
            $mainCategory->children = $this->getSlimChildCategories($mainCategory->categoryId, $userId);
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
    private function getSlimChildCategories($categoryId, $userId) {
        $permissions = ConfigHelper::getForumPermissions();
        $categoryIds = $this->forumService->getAccessibleCategories($userId);
        $childCategories = Category::nonHidden()
            ->withParent($categoryId)
            ->whereIn('categoryId', $categoryIds)
            ->orderBy('displayOrder', 'ASC')
            ->select('categoryId', 'description', 'displayOrder', 'link', 'title', 'lastPostId', 'icon', 'updatedAt')
            ->get();
        $children = [];

        foreach ($childCategories as $child) {
            if (PermissionHelper::haveForumPermission($userId, $permissions->canViewOthersThreads, $child->categoryId)) {
                $child->lastPost = $this->forumService->getSlimPost($child->lastPostId);
                $child->haveRead = $this->forumService->haveReadCategory($child, $userId);
            } else {
                $canApproveThreads = PermissionHelper::haveForumPermission($userId, $permissions->canApproveThreads, $child->categoryId);
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

            $canApprovePosts = PermissionHelper::haveForumPermission($userId, $permissions->canApprovePosts, $child->categoryId);

            $child->lastPostViewed = $child->lastPost ?
                $this->forumService->getLastViewed($userId, $child->lastPost['threadId'], $canApprovePosts) : null;

            $child->children = Category::whereIn('categoryId', $categoryIds)
                ->where('parentId', $child->categoryId)
                ->select('categoryId', 'title', 'displayOrder')
                ->orderBy('displayOrder', 'ASC')
                ->getQuery()
                ->get();
            $children[] = $child;
        }

        return $children;
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
     * @return Collection
     */
    private function getLatestPosts($user, $categoryIds) {
        $ignoredCategoryIds = array_merge(IgnoredCategory::where('userId', $user->userId)->pluck('categoryId')->toArray(),
            $this->forumService->getCategoriesUserCantSeeOthersThreadsIn($user->userId));
        $ignoredThreadIds = IgnoredThread::where('userId', $user->userId)->pluck('threadId');

        return $this->forumService
            ->getLatestPosts($categoryIds, $ignoredThreadIds, $ignoredCategoryIds, 15)
            ->data;
    }

    /**
     * Get method to get an array of all the top poster over all time
     */
    private function getTopPosters() {
        return User::select('userId', 'posts')
            ->orderBy('posts', 'DESC')
            ->take(15)
            ->getQuery()
            ->get()
            ->map(function ($user) {
                return [
                    'posts' => $user->posts,
                    'user' => UserHelper::getSlimUser($user->userId)
                ];
            });
    }

    /**
     * Get method to get an array of all the users currently active
     *
     * @param $hours
     *
     * @return array
     */
    private function getOnline($hours) {
        $userIds = User::where('lastActivity', '>=', time() - ($hours * 3600))->orderBy('nickname', 'ASC')->pluck('userId');
        return $userIds->map(function ($id) {
            return UserHelper::getSlimUser($id);
        });
    }

    /**
     * Get method to get an array of top poster for the current day.
     *
     * @param $clientTodayMidnight
     *
     * @return array
     */
    private function getTopPostersToday($clientTodayMidnight) {
        return Post::where('createdAt', '>=', $clientTodayMidnight)
            ->select('userId', DB::raw('count(postId) AS number'))
            ->groupBy('userId')
            ->orderBy('number', 'DESC')
            ->take(15)
            ->getQuery()
            ->get()
            ->map(function ($post) {
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

    private function mapLastPost($thread, $post) {
        if (!$post) {
            return null;
        }
        return (object)[
            'postId' => $post->postId,
            'threadId' => $post->threadId,
            'threadTitle' => $thread->title,
            'prefix' => $thread->prefix,
            'user' => UserHelper::getSlimUser($post->userId),
            'createdAt' => $post->createdAt->timestamp,
            'page' => DataHelper::getPage($thread->posts)
        ];
    }
}
