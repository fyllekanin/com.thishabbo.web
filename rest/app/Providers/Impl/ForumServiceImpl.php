<?php

namespace App\Providers\Impl;

use App\Constants\CategoryTemplates;
use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\CategoryRead;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Prefix;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\ThreadPollAnswer;
use App\EloquentModels\Forum\ThreadRead;
use App\EloquentModels\Log\LogSitecp;
use App\EloquentModels\SiteMessage;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Logger;
use App\Providers\Service\ForumService;
use App\Repositories\Repository\CategoryRepository;
use App\Utils\Iterables;
use App\Utils\PaginationUtil;
use App\Utils\Value;

class ForumServiceImpl implements ForumService {

    private $myCategoryRepository;

    public function __construct(CategoryRepository $categoryRepository) {
        $this->myCategoryRepository = $categoryRepository;
    }

    public function postSiteMessageIfApplicable(Thread $thread) {
        if ($thread->category->template !== CategoryTemplates::QUEST
            || !$thread->isApproved
            || LogSitecp::where('action', LogType::getAction(LogType::CREATED_SITE_MESSAGE))->where('contentId',
                $thread->threadId)->count() > 0
        ) {
            return;
        }

        Logger::sitecp(0, 0, LogType::CREATED_SITE_MESSAGE, [], $thread->threadId);
        $siteMessage = new SiteMessage(
            [
                'title' => $thread->title,
                'type' => 2,
                'content' => "New quest article available, click below to read it!
            [url]".CONST_APP_URL."/forum/thread/".$thread->threadId."/page/1[/url]",
                'expiresAt' => time() + 1800
            ]
        );
        $siteMessage->save();
    }

    public function doCategoryHaveOption(int $categoryId, int $option) {
        $category = Category::find($categoryId);
        return $category && $category->options & $option;
    }

    public function getThreadPoll(Thread $thread, $userId) {
        $poll = $thread->poll ? $thread->poll : null;
        if (!$poll) {
            return null;
        }

        $canViewPoll = $thread->userId == $userId ||
            PermissionHelper::haveForumPermission($userId, CategoryPermissions::CAN_SEE_NON_PUBLIC_POLL_RESULTS, $thread->categoryId);
        if (!$poll->isResultPublic && !$canViewPoll) {
            return [
                'question' => $poll->question,
                'isPublic' => false,
                'haveVoted' => ThreadPollAnswer::where('threadPollId', $poll->threadPollId)->whereUserId($userId)->countPrimary() > 0
            ];
        }

        $answers = json_decode($poll->options);
        foreach ($answers as $answer) {
            $answer->answers = ThreadPollAnswer::where('threadPollId', $poll->threadPollId)
                ->where('answer', $answer->id)->countPrimary();
        }
        return [
            'isPublic' => $thread->poll->isResultPublic || $canViewPoll,
            'question' => $thread->poll->question,
            'answers' => $answers,
            'haveVoted' => ThreadPollAnswer::where('threadPollId', $poll->threadPollId)->whereUserId($userId)->countPrimary() > 0
        ];
    }

    public function updateLastPostIdOnCategory($categoryId) {
        $category = Category::find($categoryId);
        if (!$category) {
            return;
        }

        $downStreamIds = $this->getCategoryIdsDownStream($categoryId)->filter(function ($id) use ($categoryId) {
            return $id != $categoryId;
        });
        $lastThreadPostId = Value::objectProperty(
            Thread::isApproved()->where('categoryId', $categoryId)->select('lastPostId')->orderBy('lastPostId', 'DESC')->first(),
            'lastPostId',
            -1
        );
        $lastChildPostId = Value::objectProperty(
            Category::whereIn('categoryId', $downStreamIds)->select('lastPostId')->orderBy('lastPostId', 'DESC')->first(),
            'lastPostId',
            -1
        );
        $category->lastPostId = $lastThreadPostId > $lastChildPostId ? $lastThreadPostId : $lastChildPostId;
        $category->save();

        $this->updateLastPostIdOnCategory($category->parentId);
    }

    public function haveReadThread($thread, $userId) {
        $threadRead = ThreadRead::where('threadId', $thread->threadId)
            ->where('userId', $userId)->first();
        $threadUpdatedAt = is_numeric($thread->updatedAt) ? $thread->updatedAt : $thread->updatedAt->timestamp;

        return $threadRead && $threadRead->updatedAt->timestamp >= $threadUpdatedAt;
    }

    public function updateReadThread($threadId, $userId) {
        if (!$userId) {
            return;
        }
        $threadRead = ThreadRead::where('threadId', $threadId)
            ->where('userId', $userId)
            ->first();
        if (!$threadRead) {
            $threadRead = new ThreadRead();
        }
        $threadRead->threadId = $threadId;
        $threadRead->userId = $userId;
        $threadRead->updatedAt = time();
        $threadRead->save();
    }

    public function haveReadCategory($category, $userId) {
        $categoryRead = CategoryRead::where('categoryId', $category->categoryId)
            ->where('userId', $userId)->first();
        $categoryUpdatedAt = is_numeric($category->updatedAt) ? $category->updatedAt : $category->updatedAt->timestamp;

        return $categoryRead && $categoryRead->updatedAt->timestamp >= $categoryUpdatedAt;
    }

    public function updateReadCategory($categoryId, $userId) {
        $category = $categoryId > 0 ? Category::find($categoryId) : null;
        if (!$userId || !$category) {
            return;
        }
        $categoryRead = CategoryRead::where('categoryId', $category->categoryId)
            ->where('userId', $userId)
            ->first();
        if (!$categoryRead) {
            $categoryRead = new CategoryRead();
        }
        $categoryRead->categoryId = $category->categoryId;
        $categoryRead->userId = $userId;
        $categoryRead->updatedAt = time();
        $categoryRead->save();

        $this->updateReadCategory($category->parentId, $userId);
    }

    public function getCategoriesUserCantSeeOthersThreadsIn($userId) {
        if (PermissionHelper::isSuperSitecp($userId)) {
            return [];
        }
        $categoryIdsWhereCanSeeOtherThreads
            = $this->myCategoryRepository->getCategoryIdsWherePermission($userId, CategoryPermissions::CAN_VIEW_OTHERS_THREADS);
        return $this->myCategoryRepository->getCategoryIdsWherePermission($userId, CategoryPermissions::CAN_READ)->filter(
            function ($categoryId) use ($categoryIdsWhereCanSeeOtherThreads) {
                return !$categoryIdsWhereCanSeeOtherThreads->contains($categoryId);
            }
        )->toArray();
    }

    public function getLatestPosts($categoryIds, $ignoredThreadIds, $ignoredCategoryIds, $amount, $skip = 0) {
        $threadsSql = Thread::select('title', 'categoryId', 'threadId', 'lastPostId', 'posts')
            ->with(['prefix', 'latestPost'])
            ->isApproved()
            ->whereIn('categoryId', $categoryIds)
            ->where('isApproved', true)
            ->whereNotIn('threadId', $ignoredThreadIds)
            ->whereNotIn('categoryId', $ignoredCategoryIds);

        return (object) [
            'total' => $threadsSql->count('threadId'),
            'data' => $threadsSql->take($amount)->skip($skip)->orderBy('lastPostId', 'DESC')->get()->map(
                function ($thread) {
                    $page = PaginationUtil::getTotalPages($thread->posts);

                    return (object) [
                        'title' => $thread->title,
                        'category' => $thread->category->title,
                        'threadId' => $thread->threadId,
                        'text' => $thread->prefix ? $thread->prefix->text : null,
                        'style' => $thread->prefix ? $thread->prefix->style : null,
                        'postId' => $thread->lastPostId,
                        'createdAt' => $thread->latestPost ? $thread->latestPost->createdAt->timestamp : 0,
                        'user' => Userhelper::getSlimUser($thread->latestPost ? $thread->latestPost->userId : 0),
                        'page' => $page < 1 ? 1 : $page
                    ];
                }
            )
        ];
    }

    public function getCategoryIdsDownStream($categoryId) {
        return $this->myCategoryRepository->getCategoryIdsDownstream($categoryId);
    }

    public function getForumPermissionsForUserInCategory($userId, $categoryId) {
        $permissions = [];
        foreach (CategoryPermissions::getAsOptions() as $key => $value) {
            $permissions[$key] = PermissionHelper::haveForumPermission($userId, $value, $categoryId);
        }
        return (object) $permissions;
    }

    public function getSlimPost($postId) {
        $post = Post::find($postId);
        $threadData = $post ? Thread::where('threadId', $post->threadId)->select('posts', 'prefixId')->first() : null;
        $prefix = $threadData && $threadData->prefixId ? Prefix::where('prefixId', $threadData->prefixId)->first() : null;
        return $post ? [
            'postId' => $post->postId,
            'threadId' => $post->threadId,
            'threadTitle' => $post->thread->title,
            'prefix' => $prefix,
            'user' => UserHelper::getSlimUser($post->userId),
            'createdAt' => $post->createdAt->timestamp,
            'page' => $threadData ? PaginationUtil::getTotalPages($threadData->posts) : 1
        ] : null;
    }

    public function getCategoryParents($category) {
        $parents = [];
        $parentId = Value::objectProperty($category, 'parentId', $category->categoryId);
        $index = 0;

        while ($parentId > 0) {
            $parent = Category::where('categoryId', $parentId)->first(['categoryId', 'title', 'parentId']);
            if ($parent) {
                $parent->displayOrder = $index;
                $parents[] = $parent;
                $parentId = $parent->parentId;
                $index++;
            } else {
                break;
            }
        }

        return $parents;
    }

    public function getChildren($parent, $categoryIds, $isFirstChild) {
        return $this->myCategoryRepository->getCategoriesWithParentIdFromPossibleIds($parent->categoryId, $categoryIds)->map(
            function ($category) use ($categoryIds, $isFirstChild) {
                return [
                    'categoryId' => $category->categoryId,
                    'title' => $category->title,
                    'displayOrder' => $category->displayOrder,
                    'isHidden' => $category->isHidden,
                    'parentId' => $category->parentId,
                    'isFirstChild' => $isFirstChild,
                    'children' => $this->getChildren($category, $categoryIds, false)
                ];
            }
        )->values();
    }

    public function getCategoryTree($user, $ignoreIds = [], $parentId = -1) {
        $categories = Category::where('parentId', $parentId)->select('categoryId', 'title', 'displayOrder')->get();
        Iterables::filter(
            Category::where('parentId', $parentId)
                ->select('categoryId', 'title', 'displayOrder')
                ->where('isDeleted', '<', 1)
                ->getQuery()
                ->get()
                ->toArray(),
            function ($category) use ($ignoreIds, $user) {
                return in_array($category->categoryId, $ignoreIds) ||
                    !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_READ, $category->categoryId);
            }
        );
        foreach ($categories as $category) {
            $category->children = $this->getCategoryTree($user, $ignoreIds, $category->categoryId);
        }

        return $categories;
    }
}
