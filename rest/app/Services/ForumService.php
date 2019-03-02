<?php

namespace App\Services;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\ThreadRead;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Utils\Iterables;
use App\Utils\Value;
use Illuminate\Support\Facades\Cache;

class ForumService {

    public function updateLastPostIdOnCategory($categoryId) {
        $category = Category::find($categoryId);

        if (!$category) {
            return;
        }

        $lastPostId = $this->getLastPostIdForCategory($categoryId);
        $category->lastPostId = $lastPostId;
        $category->save();

        $this->updateLastPostIdOnCategory($category->parentId);
    }

    public function getSlimCategories($categoryIds, $fields) {
        return Category::nonHidden()
            ->whereIn('categoryId', $categoryIds)
            ->get($fields)->toArray();
    }

    public function getLastPostIdForCategory($categoryId) {
        $lastThreadPostId = Value::objectProperty(Thread::isApproved()->where('categoryId', $categoryId)->select('lastPostId')->orderBy('lastPostId', 'DESC')->first(),
            'lastPostId', -1);
        $lastChildPostId = Value::objectProperty(Category::where('parentId', $categoryId)->select('lastPostId')->orderBy('lastPostId', 'DESC')->first(),
            'lastPostId', -1);

        return $lastThreadPostId > $lastChildPostId ? $lastThreadPostId : $lastChildPostId;
    }

    public function haveReadThread ($thread, $userId) {
        $threadRead = ThreadRead::where('threadId', $thread->threadId)
            ->where('userId', $userId)->first();
        $threadUpdatedAt = is_numeric($thread->updatedAt) ? $thread->updatedAt : $thread->updatedAt->timestamp;

        return $threadRead && $threadRead->updatedAt->timestamp > $threadUpdatedAt;
    }

    public function updateReadThread ($threadId, $userId) {
        if (!$userId) {
            return;
        }
        $threadRead = ThreadRead::where('threadId', $threadId)
            ->where('userId', $userId)
            ->first();

        if (!$threadRead) {
            $threadRead = new ThreadRead([
                'threadId' => $threadId,
                'userId' => $userId
            ]);
            $threadRead->save();
        } else {
            ThreadRead::where('threadId', $threadId)->where('userId', $userId)->update(['updatedAt' => time()]);
        }
    }

    public function isValidTemplate ($template) {
        $templates = (array)ConfigHelper::getCategoryTemplatesConfig();
        return in_array($template, $templates);
    }

    public function getAccessibleCategories ($userId, $permission = null) {
        if (Cache::has('accessible-categories')) {
            return Cache::get('accessible-categories');
        }

        $forumPermission = $permission ? $permission : ConfigHelper::getForumConfig()->canRead;
        $categoryIds = Category::pluck('categoryId');
        $ids = [];

        foreach ($categoryIds as $categoryId) {
            if (PermissionHelper::haveForumPermission($userId, $forumPermission, $categoryId)) {
                $ids[] = $categoryId;
            }
        }

        Cache::add('accessible-categories', $ids, 30);
        return $ids;
    }

    public function getCategoriesUserCantSeeOthersThreadsIn ($userId) {
        $forumPermissions = ConfigHelper::getForumConfig();
        $categories = Category::select('categoryId')->where('isDeleted', 0)->get();
        $categoryIds = [];

        foreach ($categories as $category) {
            if (!PermissionHelper::haveForumPermission($userId, $forumPermissions->canViewOthersThreads, $category->categoryId)) {
                $categoryIds[] = $category->categoryId;
            }
        }
        return $categoryIds;
    }

    public function getCategoryIdsChainUpStream ($categoryId) {
        $categoryIds = [];
        $parentId = $categoryId;

        while ($parentId > 0) {
            $parent = Category::where('categoryId', $parentId)
                ->first(['categoryId', 'parentId']);
            $categoryIds[] = $parent->categoryId;
            $parentId = $parent->parentId;
        }

        return $categoryIds;
    }

    /**
     * @param     $categoryIds
     * @param     $ignoredThreadIds
     * @param     $ignoredCategoryIds
     * @param     $amount
     * @param int $skip
     *
     * @return object with data and total
     */
    public function getLatestPosts($categoryIds, $ignoredThreadIds, $ignoredCategoryIds, $amount, $skip = 0) {
        $threadsSql = Thread::select('title', 'categoryId', 'threadId', 'lastPostId')
            ->where('isApproved', true)
            ->whereIn('categoryId', $categoryIds)
            ->whereNotIn('threadId', $ignoredThreadIds)
            ->whereNotIn('categoryId', $ignoredCategoryIds);

        return (object) [
            'total' => $threadsSql->count(),
            'data' => $threadsSql->take($amount)->skip($skip)->orderBy('lastPostId', 'DESC')->get()->map(function($thread) {
                $page = ceil($thread->posts / Controller::$perPageStatic);

                return (object) [
                    'title' => $thread->title,
                    'categoryId' => $thread->categoryId,
                    'threadId' => $thread->threadId,
                    'text' => $thread->prefix ? $thread->prefix->text : null,
                    'style' => $thread->prefix ? $thread->prefix->style : null,
                    'postId' => $thread->lastPostId,
                    'createdAt' => $thread->lastPost ? $thread->lastPost->createdAt->timestamp : 0,
                    'user' => Userhelper::getSlimUser($thread->lastPost ? $thread->lastPost->userId : 0),
                    'page' => $page < 1 ? 1 : $page
                ];
            })
        ];
    }

    public function getCategoryIdsDownStream ($categoryId) {
        $categoryIds = [$categoryId];
        $childIds = Category::where('parentId', $categoryId)->pluck('categoryId');

        foreach ($childIds as $childId) {
            $ids = $this->getCategoryIdsDownStream($childId);
            $categoryIds = array_merge($categoryIds, $ids);
        }

        return $categoryIds;
    }

    public function getForumPermissionsForUserInCategory ($userId, $categoryId) {
        $forumPermissions = ConfigHelper::getForumConfig();
        $permissions = [];

        foreach ($forumPermissions as $key => $value) {
            $permissions[$key] = PermissionHelper::haveForumPermission($userId, $value, $categoryId);
        }

        return (object)$permissions;
    }

    public function getSlimPost ($postId) {
        $post = Post::with(['thread'])->where('posts.postId', $postId)
            ->first();

        if (!$post) {
            return null;
        }

        return [
            'postId' => $post->postId,
            'threadId' => $post->threadId,
            'threadTitle' => $post->thread->title,
            'prefix' => $post->thread->prefix,
            'user' => UserHelper::getSlimUser($post->userId),
            'createdAt' => $post->createdAt->timestamp,
            'page' => ceil($post->thread->posts / Controller::$perPageStatic)
        ];
    }

    public function getCategoryParents ($item) {
        $parents = [];
        $parentId = Value::objectProperty($item, 'parentId', $item->categoryId);
        $index = 0;

        while ($parentId > 0) {
            $parent = Category::where('categoryId', $parentId)->first(['categoryId', 'title', 'parentId']);
            $parent->displayOrder = $index;
            $parents[] = $parent;
            $parentId = $parent->parentId;
            $index++;
        }

        return $parents;
    }

    public function getChildren ($category, $categoryIds) {
        $children = Category::where('parentId', $category->categoryId)
            ->whereIn('categoryId', $categoryIds)
            ->get(['categoryId', 'title', 'displayOrder', 'isHidden']);

        foreach ($children as $child) {
            $child->children = $this->getChildren($child, $categoryIds);
        }

        return $children;
    }

    public function getCategoryTree ($user, $ignoreIds = [], $parentId = -1) {
        $forumPermissions = ConfigHelper::getForumConfig();
        $categories = Category::where('parentId', $parentId)->select('categoryId', 'title')->getQuery()->get();
        Iterables::filter(Category::where('parentId', $parentId)->select('categoryId', 'title')->getQuery()->get()->toArray(),
            function($category) use ($ignoreIds, $forumPermissions, $user) {
                return in_array($category->categoryId, $ignoreIds) || !PermissionHelper::haveForumPermission($user->userId, $forumPermissions->canRead, $category->categoryId);
            });
        foreach ($categories as $category) {
            $category->children = $this->getCategoryTree($user, $ignoreIds, [$category->categoryId]);
        }

        return $categories;
    }
}
