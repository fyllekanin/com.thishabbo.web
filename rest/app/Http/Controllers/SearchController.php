<?php

namespace App\Http\Controllers;

use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\User\User;
use App\Helpers\DataHelper;
use App\Helpers\UserHelper;
use App\Services\ForumService;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SearchController extends Controller {
    private $TYPES = ['threads', 'posts', 'users'];
    private $forumService;

    /**
     * SearchController constructor.
     *
     * @param ForumService $forumService
     */
    public function __construct(ForumService $forumService) {
        parent::__construct();
        $this->forumService = $forumService;
    }

    /**
     * @param Request $request
     * @param $type
     * @param $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSearch(Request $request, $type, $page) {
        $user = Cache::get('auth');
        $result = null;
        switch ($type) {
            case $this->TYPES[0]:
                $result = $this->getThreadsResult($request, $page, $user);
                break;
            case $this->TYPES[1]:
                $result = $this->getPostsResult($request, $page, $user);
                break;
            case $this->TYPES[2]:
                $result = $this->getUsersResult($request, $page);
                break;
            default:
                Condition::precondition(true, 404, $type . ' is not a supported type!');
                break;
        }

        return response()->json([
            'total' => $result->total,
            'page' => $page,
            'items' => $result->items,
            'parameters' => [
                'type' => $type,
                'text' => $request->input('text'),
                'byUser' => $request->input('byUser'),
                'from' => $request->input('from'),
                'to' => $request->input('to'),
                'order' => $request->input('order') ? $request->input('order') : 'desc'
            ]
        ]);
    }

    private function getUsersResult($request, $page) {
        $usersSql = User::where('nickname', 'LIKE', '%' . $request->input('text') . '%');
        $this->applyFilters($request, $usersSql);

        return (object)[
            'total' => DataHelper::getPage($usersSql->count('userId')),
            'items' => $usersSql->take($this->perPage)->offset($this->getOffset($page))->get()->map(function ($item) {
                return [
                    'id' => $item->userId,
                    'page' => 1,
                    'user' => UserHelper::getSlimUser($item->userId),
                    'title' => $item->nickname,
                    'createdAt' => $item->createdAt->timestamp
                ];
            })
        ];
    }

    private function getPostsResult($request, $page, $user) {
        $threadIds = $this->forumService->getAccessibleThreads($user->userId);
        $postsSql = Post::where('content', 'LIKE', '%' . $request->input('text') . '%')->whereIn('threadId', $threadIds);
        $this->applyFilters($request, $postsSql);

        return (object)[
            'total' => DataHelper::getPage($postsSql->count('postId')),
            'items' => $postsSql->take($this->perPage)->offset($this->getOffset($page))->get()->map(function ($item) {
                return [
                    'id' => $item->postId,
                    'parentId' => $item->threadId,
                    'page' => DataHelper::getPage(Post::where('postId', '<', $item->postId)->where('threadId', $item->threadId)
                        ->isApproved()->count('postId')),
                    'user' => UserHelper::getSlimUser($item->userId),
                    'title' => $item->thread->title,
                    'createdAt' => $item->createdAt->timestamp
                ];
            })
        ];
    }

    private function getThreadsResult($request, $page, $user) {
        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);
        $threadsSql = Thread::where('title', 'LIKE', '%' . $request->input('text') . '%')->whereIn('categoryId', $categoryIds);
        $this->applyFilters($request, $threadsSql);

        return (object)[
            'total' => DataHelper::getPage($threadsSql->count('threadId')),
            'items' => $threadsSql->take($this->perPage)->offset($this->getOffset($page))->get()->map(function ($item) {
                return [
                    'id' => $item->threadId,
                    'page' => 1,
                    'user' => UserHelper::getSlimUser($item->userId),
                    'title' => $item->title,
                    'createdAt' => $item->createdAt->timestamp
                ];
            })
        ];
    }

    private function applyFilters($request, $sqlObj) {
        if ($request->input('byUser')) {
            $userIds = User::withNicknameLike($request->input('byUser'))->pluck('userId');
            if ($userIds) {
                $sqlObj->whereIn('userId', $userIds);
            }
        }

        if ($request->input('from')) {
            $sqlObj->where('createdAt', '>', strtotime($request->input('from')));
        }

        if ($request->input('to')) {
            $sqlObj->where('createdAt', '<', strtotime($request->input('to')));
        }

        $sqlObj->orderBy('createdAt', $request->input('order') ? $request->input('order') : 'DESC');
        return $sqlObj;
    }
}
