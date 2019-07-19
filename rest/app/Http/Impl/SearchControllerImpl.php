<?php

namespace App\Http\Impl;

use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Services\ForumService;
use App\Utils\Condition;
use App\Utils\Iterables;
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
        $usersSql = $this->applyFilters($request, $usersSql, 'users');

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
        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);
        $postsSql = Post::where('content', 'LIKE', Value::getFilterValue($request, $request->input('text')))
            ->leftJoin('threads', 'threads.threadId', '=', 'posts.threadId')
            ->whereIn('threads.categoryId', $categoryIds)
            ->select([
                'posts.postId',
                'posts.threadId',
                'posts.userId',
                'posts.createdAt',
                'threads.categoryId',
                'threads.title'
            ]);
        $postsSql = $this->applyFilters($request, $postsSql, 'posts');

        $total = DataHelper::getPage($postsSql->count('postId'));
        $items = $postsSql->take(Controller::$perPageStatic)->offset(DataHelper::getOffset($page))->get()->map(function ($item) {
            return (object)[
                'id' => $item->postId,
                'parentId' => $item->threadId,
                'categoryId' => $item->thread->categoryId,
                'page' => DataHelper::getPage(Post::where('postId', '<', $item->postId)->where('threadId', $item->threadId)
                    ->isApproved()->count('postId')),
                'user' => UserHelper::getSlimUser($item->userId),
                'title' => $item->title,
                'createdAt' => $item->createdAt->timestamp
            ];
        })->toArray();

        return (object)[
            'total' => $total,
            'items' => Iterables::filter($items, function ($item) use ($user) {
                return $item->user->userId == $user->userId ||
                    PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canViewOthersThreads, $item->categoryId);
            })
        ];
    }

    private function getThreadsResult($request, $page, $user) {
        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);
        $threadsSql = Thread::where('title', 'LIKE', Value::getFilterValue($request, $request->input('text')))->whereIn('categoryId', $categoryIds);
        $threadsSql = $this->applyFilters($request, $threadsSql, 'threads');

        $total = DataHelper::getPage($threadsSql->count('threadId'));
        $items = $threadsSql->take(Controller::$perPageStatic)->offset(DataHelper::getOffset($page))->get()->map(function ($item) {
            return (object)[
                'id' => $item->threadId,
                'categoryId' => $item->categoryId,
                'page' => 1,
                'user' => UserHelper::getSlimUser($item->userId),
                'title' => $item->title,
                'createdAt' => $item->createdAt->timestamp
            ];
        })->toArray();

        return (object)[
            'total' => $total,
            'items' => Iterables::filter($items, function ($item) use ($user) {
                return $item->user->userId == $user->userId ||
                    PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canViewOthersThreads, $item->categoryId);
            })
        ];
    }

    private function applyFilters($request, $sqlObj, $table) {
        if ($request->input('byUser')) {
            $userIds = User::withNicknameLike($request->input('byUser'))->pluck('userId');
            if ($userIds) {
                $sqlObj->whereIn($table . '.userId', $userIds);
            }
        }

        if ($request->input('from')) {
            $sqlObj->where($table . '.createdAt', '>', strtotime($request->input('from')));
        }

        if ($request->input('to')) {
            $sqlObj->where($table . '.createdAt', '<', strtotime($request->input('to')));
        }

        $sqlObj->orderBy($table . '.createdAt', $request->input('order') ? $request->input('order') : 'DESC');
        return $sqlObj;
    }
}
