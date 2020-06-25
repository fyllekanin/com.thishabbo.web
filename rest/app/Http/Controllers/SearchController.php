<?php

namespace App\Http\Controllers;

use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\User\User;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Logger;
use App\Providers\Service\ContentService;
use App\Providers\Service\ForumService;
use App\Repositories\Repository\CategoryRepository;
use App\Utils\Condition;
use App\Utils\Iterables;
use App\Utils\PaginationUtil;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller {
    private $TYPES = ['threads', 'posts', 'users'];
    private $myForumService;
    private $myContentService;
    private $myCategoryRepository;

    public function __construct(ForumService $forumService, ContentService $contentService, CategoryRepository $categoryRepository) {
        parent::__construct();
        $this->myForumService = $forumService;
        $this->myContentService = $contentService;
        $this->myCategoryRepository = $categoryRepository;
    }

    /**
     * @param  Request  $request
     * @param $type
     * @param $page
     *
     * @return JsonResponse
     */
    public function getSearch(Request $request, $type, $page) {
        $user = $request->get('auth');
        $result = $this->getResult($request, $type, $page, $user);

        if (!$request->input('isMentionSearch')) {
            Logger::user(
                $user->userId,
                $request->ip(),
                LogType::SEARCHED,
                [
                    'text' => $request->input('text'),
                    'type' => $type
                ]
            );
        }
        return response()->json(
            [
                'total' => $result->total,
                'page' => $page,
                'items' => $result->items,
                'categories' => $this->myForumService->getCategoryTree($user, [], -1),
                'parameters' => [
                    'type' => $type,
                    'categoryId' => $request->input('categoryId'),
                    'text' => $request->input('text'),
                    'byUser' => $request->input('byUser'),
                    'from' => $request->input('from'),
                    'to' => $request->input('to'),
                    'order' => $request->input('order') ? $request->input('order') : 'desc',
                    'userSearchType' => $request->input('userSearchType')
                ]
            ]
        );
    }

    private function getResult($request, $type, $page, $user) {
        switch ($type) {
            case $this->TYPES[0]:
                return $this->getThreadsResult($request, $page, $user);
            case $this->TYPES[1]:
                return $this->getPostsResult($request, $page, $user);
            case $this->TYPES[2]:
                return $this->getUsersResult($request, $page);
            default:
                Condition::precondition(true, 404, $type.' is not a supported type!');
                break;
        }
    }

    private function getUsersResult($request, $page) {
        $usersSql = User::where('nickname', 'LIKE', Value::getFilterValue($request, $request->input('text')));
        $usersSql = $this->applyFilters($request, $usersSql, 'users');

        return (object) [
            'total' => PaginationUtil::getTotalPages($usersSql->count('userId')),
            'items' => $usersSql->take(Controller::$perPageStatic)->offset(PaginationUtil::getOffset($page))->get()->map(function ($item) {
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
        $categoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ);
        $postsSql = Post::where('content', 'LIKE', Value::getFilterValue($request, $request->input('text')))
            ->leftJoin('threads', 'threads.threadId', '=', 'posts.threadId')->whereIn('threads.categoryId', $categoryIds)->select(
                [
                    'posts.postId',
                    'posts.threadId',
                    'posts.userId',
                    'posts.createdAt',
                    'posts.content',
                    'threads.categoryId',
                    'threads.title'
                ]
            );
        $postsSql = $this->applyFilters($request, $postsSql, 'posts');

        if ($request->input('categoryId')) {
            $postsSql->where('threads.categoryId', $request->input('categoryId'));
        }

        $total = PaginationUtil::getTotalPages($postsSql->count('postId'));
        $items = $postsSql->take(Controller::$perPageStatic)->offset(PaginationUtil::getOffset($page))->get()->map(
            function ($item) {
                return (object) [
                    'id' => $item->postId,
                    'parentId' => $item->threadId,
                    'categoryId' => $item->categoryId,
                    'page' => PaginationUtil::getTotalPages(
                        Post::where('postId', '<', $item->postId)->where('threadId', $item->threadId)->isApproved()->count('postId')
                    ),
                    'user' => UserHelper::getSlimUser($item->userId),
                    'title' => $item->title,
                    'content' => $this->myContentService->getParsedContent($item->content),
                    'createdAt' => $item->createdAt->timestamp
                ];
            }
        )->toArray();

        return (object) [
            'total' => $total,
            'items' => Iterables::filter($items, function ($item) use ($user) {
                return ($item->user && $item->user->userId == $user->userId) ||
                    PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_VIEW_OTHERS_THREADS, $item->categoryId);
            })
        ];
    }

    private function getThreadsResult($request, $page, $user) {
        $categoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ);
        $threadsSql = Thread::where('title', 'LIKE', Value::getFilterValue($request, $request->input('text')))
            ->whereIn('categoryId', $categoryIds);
        $threadsSql = $this->applyFilters($request, $threadsSql, 'threads');

        if ($request->input('categoryId')) {
            $threadsSql->where('categoryId', $request->input('categoryId'));
        }

        $total = PaginationUtil::getTotalPages($threadsSql->count('threadId'));
        $items = $threadsSql->take(Controller::$perPageStatic)->offset(PaginationUtil::getOffset($page))->get()->map(
            function ($item) {
                return (object) [
                    'id' => $item->threadId,
                    'categoryId' => $item->categoryId,
                    'page' => 1,
                    'user' => UserHelper::getSlimUser($item->userId),
                    'title' => $item->title,
                    'createdAt' => $item->createdAt->timestamp
                ];
            }
        )->toArray();

        return (object) [
            'total' => $total,
            'items' => Iterables::filter($items, function ($item) use ($user) {
                return $item->user->userId == $user->userId ||
                    PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_VIEW_OTHERS_THREADS, $item->categoryId);
            })
        ];
    }

    private function getByUserSearchValue($request) {
        switch ($request->input('userSearchType')) {
            case 'fromStart':
                return $request->input('byUser').'%';
            case 'exact':
                return $request->input('byUser');
            default:
                return '%'.$request->input('byUser').'%';
        }
    }

    private function applyFilters($request, $sqlObj, $table) {
        if ($request->input('byUser')) {
            $value = $this->getByUserSearchValue($request);
            $userIds = User::where('nickname', 'LIKE', $value)->pluck('userId');
            $sqlObj->whereIn($table.'.userId', $userIds);
        }

        if ($request->input('from')) {
            $sqlObj->where($table.'.createdAt', '>', strtotime($request->input('from')));
        }

        if ($request->input('to')) {
            $sqlObj->where($table.'.createdAt', '<', strtotime($request->input('to')));
        }

        $sqlObj->orderBy($table.'.createdAt', $request->input('order') ? $request->input('order') : 'DESC');
        return $sqlObj;
    }
}
