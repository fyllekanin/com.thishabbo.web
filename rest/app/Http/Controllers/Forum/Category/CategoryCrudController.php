<?php

namespace App\Http\Controllers\Forum\Category;

use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\IgnoredCategory;
use App\EloquentModels\Forum\IgnoredThread;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\User\User;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Providers\Service\ForumService;
use App\Providers\Service\QueryParamService;
use App\Repositories\Repository\CategoryRepository;
use App\Repositories\Repository\ForumListenerRepository;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use stdClass;

class CategoryCrudController extends Controller {
    private $myQueryParamService;
    private $myForumService;
    private $myCategoryRepository;
    private $myForumListenerRepository;

    public function __construct(
        QueryParamService $queryParamService,
        ForumService $forumService,
        CategoryRepository $categoryRepository,
        ForumListenerRepository $forumListenerRepository
    ) {
        parent::__construct();
        $this->myQueryParamService = $queryParamService;
        $this->myForumService = $forumService;
        $this->myCategoryRepository = $categoryRepository;
        $this->myForumListenerRepository = $forumListenerRepository;
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getCategoryList(Request $request) {
        $user = $request->get('auth');
        $categoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ);

        return response()->json($this->getCategoryChildren(-1, $categoryIds));
    }

    /**
     * Get request to get the forum home resource page
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getForumCategories(Request $request) {
        $user = $request->get('auth');
        $categoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ);
        return response()->json($this->getCategoriesAndFirstLevel($user->userId, $categoryIds)->values());
    }

    /**
     *
     * @param  Request  $request
     * @param $clientTodayMidnight
     *
     * @return JsonResponse
     */
    public function getForumStats(Request $request, $clientTodayMidnight) {
        $user = $request->get('auth');
        $categoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ);

        return response()->json(
            [
                'latestPosts' => $this->getLatestPosts($user, $categoryIds),
                'topPosters' => $this->getTopPosters(),
                'topPostersToday' => $this->getTopPostersToday($clientTodayMidnight),
                'currentlyActive' => $this->getOnline(1),
                'activeToday' => $this->getOnline(24)
            ]
        );
    }

    /**
     * Get request to get given category resource page
     *
     * @param  Request  $request
     * @param $categoryId
     * @param  int  $page
     *
     * @return JsonResponse
     */
    public function getCategoryPage(Request $request, $categoryId, $page = 1) {
        $user = $request->get('auth');
        $sortedByQuery = $request->input('sortedBy');
        $sortOrderQuery = $request->input('sortOrder');
        $fromTheQuery = $request->input('fromThe');

        Condition::precondition(
            !$this->myCategoryRepository
                ->doUserIdHaveForumPermissionForCategoryId($user->userId, $categoryId, CategoryPermissions::CAN_READ),
            400,
            'No permission to access this category'
        );

        $category = $this->myCategoryRepository->getCategoryById($categoryId);
        Condition::precondition(!$category, 404, 'No category with that ID');
        $this->myForumService->updateReadCategory($category->categoryId, $user->userId);
        $forumPermissions = $this->getCategoryPermissions($categoryId, $user->userId);

        $sortedBy = $this->myQueryParamService->getSortedBy($sortedByQuery);
        $fromThe = $this->myQueryParamService->getFromThe($fromTheQuery);
        $sortOrder = isset($sortOrderQuery) && !empty($sortOrderQuery) ? $sortOrderQuery : 'desc';
        $threadSql = Thread::where('categoryId', $categoryId)
            ->nonStickied()
            ->where(
                function ($query) use ($user, $forumPermissions) {
                    if ($forumPermissions->canApproveThreads) {
                        $query->where('isApproved', '>=', 0);
                    } else {
                        $query->where('userId', $user->userId)->orWhere('isApproved', 1);
                    }
                }
            )
            ->orderBy($sortedBy, $sortOrder);

        if ($fromThe > -1) {
            $threadSql->createdAfter($fromThe);
        }

        if (!$forumPermissions->canViewOthersThreads) {
            $threadSql->belongsToUser($user->userId);
        }

        $total = PaginationUtil::getTotalPages($threadSql->count('threadId'));
        $threads = $threadSql->skip(PaginationUtil::getOffset($page))
            ->take($this->perPage)
            ->with(['prefix', 'latestPost'])
            ->get();

        return response()->json(
            [
                'categoryId' => $categoryId,
                'title' => $category->title,
                'isOpen' => $category->isOpen,
                'icon' => $category->icon,
                'parents' => $this->myForumService->getCategoryParents($category),
                'categories' => $this->getSlimChildCategories($categoryId, $user->userId),
                'stickyThreads' => $page <= 1 ?
                    $this->getStickyThreadsForCategory($categoryId, $forumPermissions, $user->userId, $category) :
                    [],
                'threads' => $this->buildThreadsForCategory($threads, $user->userId, $category),
                'total' => $total,
                'forumPermissions' => $forumPermissions,
                'page' => $page,
                'displayOptions' => [
                    'sortedBy' => $sortedByQuery,
                    'sortOrder' => $sortOrderQuery,
                    'fromThe' => $fromTheQuery
                ],
                'isSubscribed' => $this->myForumListenerRepository->isUserSubscribedToCategory($user->userId, $categoryId),
                'isIgnored' => IgnoredCategory::where('userId', $user->userId)->where('categoryId', $categoryId)->count('categoryId') > 0
            ]
        );
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

        foreach (CategoryPermissions::getAsOptions() as $key => $value) {
            $permissions[$key] = PermissionHelper::haveForumPermission($userId, $value, $categoryId);
        }

        return (object) $permissions;
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
    private function buildThreadsForCategory($threads, $userId, $category) {
        foreach ($threads as $thread) {
            $thread->lastPost = $this->mapLastPost($thread, $thread->latestPost);
            $thread->haveRead = $this->myForumService->haveReadThread($thread, $userId);
            $thread->icon = $category->icon;
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

        return $this->buildThreadsForCategory($threads, $userId, $category);
    }

    /**
     * Get method to fetch all top level categories
     * to be displayed on forum home page
     *
     * @param  int  $userId
     * @param  Collection  $categoryIds
     *
     * @return Collection
     */
    private function getCategoriesAndFirstLevel(int $userId, Collection $categoryIds) {
        return $this->myCategoryRepository
            ->getCategoriesWithParentIdFromPossibleIds('-1', $categoryIds)->map(function ($category) use ($userId) {
                $item = new stdClass();
                $item->categoryId = $category->categoryId;
                $item->link = $category->link;
                $item->displayOrder = $category->displayOrder;
                $item->title = $category->title;
                $item->children = $this->getSlimChildCategories($category->categoryId, $userId);
                return $item;
            })->values();
    }

    /**
     * Get method to get an array and map the the category and its children for
     * a three perspective.
     *
     * @param $categoryId
     * @param $userId
     *
     * @return Collection
     */
    private function getSlimChildCategories($categoryId, $userId) {
        $categoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($userId, CategoryPermissions::CAN_READ);
        return $this->myCategoryRepository->getCategoriesWithParentIdFromPossibleIds($categoryId, $categoryIds)
            ->map(function ($category) use ($userId, $categoryIds) {
                $item = new stdClass();
                $item->categoryId = $category->categoryId;
                $item->description = $category->description;
                $item->displayOrder = $category->displayOrder;
                $item->link = $category->link;
                $item->title = $category->title;
                $item->lastPostId = $category->lastPostId;
                $item->icon = $category->icon;
                $item->updatedAt = $category->updatedAt;
                $item->haveRead = $this->myForumService->haveReadCategory($item, $userId);
                $item->lastPost = $this->getLastPost($userId, $category->categoryId, $category->lastPostId, $categoryIds);
                $item->children = $this->myCategoryRepository
                    ->getCategoriesWithParentIdFromPossibleIds($item->categoryId, $categoryIds)
                    ->map(function ($category) {
                        return [
                            'categoryId' => $category->categoryId,
                            'title' => $category->title,
                            'displayOrder' => $category->displayOrder
                        ];
                    })
                    ->values();

                return $item;
            })->values();
    }

    private function getLastPost(int $userId, int $categoryId, int $lastPostId, Collection $categoryIds) {
        $lastPostCategoryId = Thread::where('lastPostId', $lastPostId)->select('categoryId')->value('categoryId');
        $canReadOtherUsersThreadsCategoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission(
            $userId,
            CategoryPermissions::CAN_VIEW_OTHERS_THREADS
        );

        if (!$categoryIds->contains($lastPostCategoryId) ||
            !$canReadOtherUsersThreadsCategoryIds->contains($lastPostCategoryId)
        ) {
            $categoryIdsChain = $this->myCategoryRepository->getCategoryIdsDownstreamFromPossibleIds($categoryId, $categoryIds);
            $categoriesWithOthersThreads = $categoryIdsChain->filter(function ($id) use ($canReadOtherUsersThreadsCategoryIds) {
                return $canReadOtherUsersThreadsCategoryIds->contains($id);
            });
            $threadWithLatestPost = Thread::whereIn('categoryId', $categoriesWithOthersThreads)
                ->orWhere(function ($query) use ($userId, $categoryIdsChain) {
                    return $query->where('userId', $userId)->whereIn('categoryId', $categoryIdsChain);
                })
                ->orderBy('lastPostId', 'DESC')
                ->first();

            return $threadWithLatestPost ? $this->myForumService->getSlimPost($threadWithLatestPost->lastPostId) : null;
        }

        return $this->myForumService->getSlimPost($lastPostId);
    }

    /**
     * Get method to fetch the latest posts made
     *
     * @param $user
     * @param $categoryIds
     *
     * @return Collection
     */
    private function getLatestPosts($user, Collection $categoryIds) {
        $ignoredCategoryIds = array_merge(
            IgnoredCategory::where('userId', $user->userId)->pluck('categoryId')->toArray(),
            $this->myForumService->getCategoriesUserCantSeeOthersThreadsIn($user->userId)
        );
        $ignoredThreadIds = IgnoredThread::where('userId', $user->userId)->pluck('threadId');

        return $this->myForumService
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
            ->map(
                function ($user) {
                    return [
                        'posts' => $user->posts,
                        'user' => UserHelper::getSlimUser($user->userId)
                    ];
                }
            );
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
        return $userIds->map(
            function ($id) {
                return UserHelper::getSlimUser($id);
            }
        );
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
            ->map(
                function ($post) {
                    return [
                        'posts' => $post->number,
                        'user' => UserHelper::getSlimUser($post->userId)
                    ];
                }
            );
    }

    private function getCategoryChildren(int $categoryId, Collection $categoryIds) {
        return $this->myCategoryRepository->getCategoriesWithParentIdFromPossibleIds($categoryId, $categoryIds)->map(
            function ($category) use ($categoryIds) {
                return [
                    'categoryId' => $category->categoryId,
                    'title' => $category->title,
                    'children' => $this->getCategoryChildren($category->categoryId, $categoryIds)
                ];
            }
        )->values();
    }

    private function mapLastPost($thread, $post) {
        if (!$post) {
            return null;
        }
        return (object) [
            'postId' => $post->postId,
            'threadId' => $post->threadId,
            'threadTitle' => $thread->title,
            'prefix' => $thread->prefix,
            'user' => UserHelper::getSlimUser($post->userId),
            'createdAt' => $post->createdAt->timestamp,
            'page' => PaginationUtil::getTotalPages($thread->posts)
        ];
    }
}
