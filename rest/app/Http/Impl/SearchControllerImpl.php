<?php

namespace App\Http\Impl;

use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\User\User;
use App\Helpers\DataHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Services\ForumService;
use App\Utils\Condition;
use App\Utils\Value;

class SearchControllerImpl {
    private $TYPES = ['threads', 'posts', 'users'];
    private $forumService;

    /**
     * SearchController constructor.
     *
     * @param ForumService $forumService
     */
    public function __construct(ForumService $forumService) {
        $this->forumService = $forumService;
    }

    /**
     * @param $request
     * @param $type - The search type
     *
     * @param $page
     * @param $user
     *
     * @return object
     */
    public function getResult($request, $type, $page, $user) {
        switch ($type) {
            case $this->TYPES[0]:
                return $this->getThreadsResult($request, $page, $user);
            case $this->TYPES[1]:
                return $this->getPostsResult($request, $page, $user);
            case $this->TYPES[2]:
                return $this->getUsersResult($request, $page);
            default:
                Condition::precondition(true, 404, $type . ' is not a supported type!');
                break;
        }
    }

    private function getUsersResult($request, $page) {
        $usersSql = User::where('nickname', 'LIKE', Value::getFilterValue($request, $request->input('text')));
        $usersSql = $this->applyFilters($request, $usersSql);

        return (object)[
            'total' => DataHelper::getPage($usersSql->count('userId')),
            'items' => $usersSql->take(Controller::$perPageStatic)->offset(DataHelper::getOffset($page))->get()->map(function ($item) {
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
        $postsSql = Post::where('content', 'LIKE', Value::getFilterValue($request, $request->input('text')))->whereIn('threadId', $threadIds);
        $postsSql = $this->applyFilters($request, $postsSql);

        return (object)[
            'total' => DataHelper::getPage($postsSql->count('postId')),
            'items' => $postsSql->take(Controller::$perPageStatic)->offset(DataHelper::getOffset($page))->get()->map(function ($item) {
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
        $threadsSql = Thread::where('title', 'LIKE', Value::getFilterValue($request, $request->input('text')))->whereIn('categoryId', $categoryIds);
        $threadsSql = $this->applyFilters($request, $threadsSql);

        return (object)[
            'total' => DataHelper::getPage($threadsSql->count('threadId')),
            'items' => $threadsSql->take(Controller::$perPageStatic)->offset(DataHelper::getOffset($page))->get()->map(function ($item) {
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