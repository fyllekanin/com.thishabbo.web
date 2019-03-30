<?php

namespace App\Http\Controllers\Admin\Moderation;

use App\EloquentModels\Infraction\AutoBan;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Services\ForumService;
use Illuminate\Http\Request;

class ForumController extends Controller {
    private $forumService;

    /**
     * ForumController constructor.
     *
     * @param ForumService $forumService
     */
    public function __construct (ForumService $forumService) {
        parent::__construct();
        $this->forumService = $forumService;
    }

    /**
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAutoBans (Request $request, $page) {
        $filter = $request->input('filter');
        $autoBansSql = AutoBan::where('title', 'LIKE', '%' . $filter . '%')
            ->orderBy('title', 'ASC')
            ->skip($this->getOffset($page))
            ->take($this->perPage);

        $total = ceil($autoBansSql->count() / $this->perPage);
        $items = $autoBansSql->map(function($item) {
            return [
                'autoBanId' => $item->autoBanId,
                'title' => $item->title,
                'amount' => $item->amount,
                'banLength' => $item->banLength,
                'updatedAt' => $item->updatedAt->timestamp
            ];
        });

        return response()->json([
            'items' => $items,
            'page' => $page,
            'total' => $total
        ]);
    }

    /**
     * Get request to fetch all posts awaiting moderation
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getModeratePosts (Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);

        $posts = Post::withoutGlobalScope('nonHardDeleted')
            ->join('threads', 'threads.threadId', '=', 'posts.threadId')
            ->whereIn('threads.categoryId', $categoryIds)
            ->where('posts.isApproved', 0)
            ->select('posts.*', 'threads.title as threadTitle', 'threads.categoryId')
            ->get();

        foreach ($posts as $key => $post) {
            $isFirstPost = Thread::where('firstPostId', $post->postId)->count() > 0;
            if ($isFirstPost) {
                unset($posts[$key]);
                continue;
            }
            $post->user = UserHelper::getUser($post->userId);
            $post->canApprove = PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumConfig()->canApproveThreads, $post->categoryId);
            $post->canDelete = PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumConfig()->canDeletePosts, $post->categoryId);
        }

        return response()->json($posts);
    }

    /**
     * Get request to fetch all threads awaiting moderation
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getModerateThreads (Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);

        foreach ($categoryIds as $key => $value) {
            if (!PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumConfig()->canApproveThreads, $value)) {
                unset($categoryIds[$key]);
            }
        }

        $threads = Thread::withoutGlobalScope('nonHardDeleted')
            ->join('categories', 'categories.categoryId', '=', 'threads.categoryId')
            ->select('threads.*', 'categories.title as categoryTitle', 'categories.categoryId')
            ->whereIn('threads.categoryId', $categoryIds)
            ->where('threads.isApproved', 0)
            ->get();

        foreach ($threads as $thread) {
            $thread->user = UserHelper::getUser($thread->userId);
            $thread->canApprove = PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumConfig()->canApproveThreads, $thread->categoryId);
            $thread->canDelete = PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumConfig()->canDeletePosts, $thread->categoryId);
        }

        return response()->json($threads);
    }
}
