<?php

namespace App\Http\Controllers\Sitecp\Moderation;

use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Infraction\AutoBan;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Providers\Service\ForumService;
use App\Repositories\Repository\CategoryRepository;
use App\Utils\PaginationUtil;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ForumController extends Controller {
    private $myForumService;
    private $myCategoryRepository;

    public function __construct(ForumService $forumService, CategoryRepository $categoryRepository) {
        parent::__construct();
        $this->myForumService = $forumService;
        $this->myCategoryRepository = $categoryRepository;
    }

    /**
     * @param  Request  $request
     * @param $page
     *
     * @return JsonResponse
     */
    public function getAutoBans(Request $request, $page) {
        $filter = $request->input('filter');
        $autoBansSql = AutoBan::where('title', 'LIKE', Value::getFilterValue($request, $filter))
            ->orderBy('title', 'ASC')
            ->skip(PaginationUtil::getOffset($page))
            ->take($this->perPage);

        $total = PaginationUtil::getTotalPages($autoBansSql->count('autoBanId'));
        $items = $autoBansSql->map(
            function ($item) {
                return [
                    'autoBanId' => $item->autoBanId,
                    'title' => $item->title,
                    'amount' => $item->amount,
                    'banLength' => $item->banLength,
                    'updatedAt' => $item->updatedAt->timestamp
                ];
            }
        );

        return response()->json(
            [
                'items' => $items,
                'page' => $page,
                'total' => $total
            ]
        );
    }

    /**
     * Get request to fetch all posts awaiting moderation
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getModeratePosts(Request $request) {
        $user = $request->get('auth');
        $categoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ);

        $posts = Post::withoutGlobalScope('nonHardDeleted')
            ->join('threads', 'threads.threadId', '=', 'posts.threadId')
            ->whereIn('threads.categoryId', $categoryIds)
            ->where('threads.firstPostId', '!=', 'posts.postId')
            ->where('threads.isApproved', 1)
            ->where('posts.isApproved', 0)
            ->where('posts.createdAt', '>', strtotime('-1 week'))
            ->select('posts.*', 'threads.title as threadTitle', 'threads.categoryId')
            ->orderBy('posts.updatedAt', 'DESC')
            ->get();

        foreach ($posts as $post) {
            $post->user = UserHelper::getUser($post->userId);
            $post->canApprove = PermissionHelper::haveForumPermission(
                $user->userId,
                CategoryPermissions::CAN_APPROVE_THREADS,
                $post->categoryId
            );
            $post->canDelete = PermissionHelper::haveForumPermission(
                $user->userId,
                CategoryPermissions::CAN_DELETE_POSTS,
                $post->categoryId
            );
        }

        return response()->json($posts);
    }

    /**
     * Get request to fetch all threads awaiting moderation
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getModerateThreads(Request $request) {
        $user = $request->get('auth');
        $categoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ)
            ->filter(function ($categoryId) use ($user) {
                return PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_APPROVE_THREADS, $categoryId);
            });

        $threads = Thread::join('categories', 'categories.categoryId', '=', 'threads.categoryId')
            ->select('threads.*', 'categories.title as categoryTitle', 'categories.categoryId')
            ->whereIn('threads.categoryId', $categoryIds)
            ->where('threads.isApproved', 0)
            ->get();

        foreach ($threads as $thread) {
            $thread->user = UserHelper::getUser($thread->userId);
            $thread->canApprove = PermissionHelper::haveForumPermission(
                $user->userId,
                CategoryPermissions::CAN_APPROVE_THREADS,
                $thread->categoryId
            );
            $thread->canDelete = PermissionHelper::haveForumPermission(
                $user->userId,
                CategoryPermissions::CAN_DELETE_POSTS,
                $thread->categoryId
            );
        }

        return response()->json($threads);
    }
}
