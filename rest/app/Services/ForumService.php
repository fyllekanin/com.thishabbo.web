<?php

namespace App\Services;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\CategoryRead;
use App\EloquentModels\Forum\ForumPermission;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\ThreadRead;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
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

    public function getLastPostIdForCategory($categoryId) {
        $lastThreadPostId = Value::objectProperty(Thread::isApproved()->where('categoryId', $categoryId)->select('lastPostId')->orderBy('lastPostId', 'DESC')->first(),
            'lastPostId', -1);
        $lastChildPostId = Value::objectProperty(Category::where('parentId', $categoryId)->select('lastPostId')->orderBy('lastPostId', 'DESC')->first(),
            'lastPostId', -1);

        return $lastThreadPostId > $lastChildPostId ? $lastThreadPostId : $lastChildPostId;
    }

    public function haveReadThread($thread, $userId) {
        $threadRead = ThreadRead::where('threadId', $thread->threadId)
            ->where('userId', $userId)->first();
        $threadUpdatedAt = is_numeric($thread->updatedAt) ? $thread->updatedAt : $thread->updatedAt->timestamp;

        return $threadRead && $threadRead->updatedAt->timestamp > $threadUpdatedAt;
    }

    /**
     * @param $threadId
     * @param $userId
     */
    public function updateReadThread($threadId, $userId) {
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

    public function haveReadCategory($category, $userId) {
        $categoryRead = CategoryRead::where('categoryId', $category->categoryId)
            ->where('userId', $userId)->first();
        $categoryUpdatedAt = is_numeric($category->updatedAt) ? $category->updatedAt : $category->updatedAt->timestamp;

        return $categoryRead && $categoryRead->updatedAt->timestamp > $categoryUpdatedAt;
    }

    /**
     * @param $categoryId
     * @param $userId
     */
    public function updateReadCategory($categoryId, $userId) {
        if (!$userId) {
            return;
        }
        $categoryRead = CategoryRead::where('categoryId', $categoryId)
            ->where('userId', $userId)
            ->first();

        if (!$categoryRead) {
            $categoryRead = new CategoryRead([
                'categoryId' => $categoryId,
                'userId' => $userId
            ]);
            $categoryRead->save();
        } else {
            CategoryRead::where('categoryId', $categoryId)->where('userId', $userId)->update(['updatedAt' => time()]);
        }
    }

    /**
     * @param $template
     *
     * @return bool
     */
    public function isValidTemplate($template) {
        $templates = (array)ConfigHelper::getCategoryTemplatesConfig();
        return in_array($template, $templates);
    }

    /**
     * @param $userId
     * @param null $permission
     *
     * @return array|mixed
     */
    public function getAccessibleCategories($userId, $permission = null) {
        if (Cache::has('accessible-categories-' . $userId)) {
            return Cache::get('accessible-categories-' . $userId);
        }

        $forumPermission = $permission ? $permission : ConfigHelper::getForumPermissions()->canRead;
        $categoryIds = Category::pluck('categoryId');
        $ids = [];

        foreach ($categoryIds as $categoryId) {
            if ($userId == 0 && $forumPermission == ConfigHelper::getForumPermissions()->canRead && self::isCategoryAuthOnly($categoryId)) {
                continue;
            }

            if (PermissionHelper::haveForumPermission($userId, $forumPermission, $categoryId)) {
                $ids[] = $categoryId;
            }
        }

        Cache::add('accessible-categories-' . $userId, $ids, 30);
        return $ids;
    }

    /**
     * @param $userId
     *
     * @return mixed
     */
    public function getAccessibleThreads($userId) {
        $categoryIds = $this->getAccessibleCategories($userId);

        return Thread::whereIn('categoryId', $categoryIds)->pluck('threadId');
    }

    /**
     * @param $userId
     *
     * @return array
     */
    public function getCategoriesUserCantSeeOthersThreadsIn($userId) {
        $forumPermissions = ConfigHelper::getForumPermissions();
        $categories = Category::select('categoryId')->get();
        $categoryIds = [];

        foreach ($categories as $category) {
            if (!PermissionHelper::haveForumPermission($userId, $forumPermissions->canViewOthersThreads, $category->categoryId)) {
                $categoryIds[] = $category->categoryId;
            }
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
            ->with(['prefix', 'latestPost'])
            ->isApproved()
            ->whereIn('categoryId', $categoryIds)
            ->whereNotIn('threadId', $ignoredThreadIds)
            ->whereNotIn('categoryId', $ignoredCategoryIds);

        return (object)[
            'total' => $threadsSql->count('threadId'),
            'data' => $threadsSql->take($amount)->skip($skip)->orderBy('lastPostId', 'DESC')->get()->map(function ($thread) {
                $page = DataHelper::getPage($thread->posts);

                return (object)[
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
            })
        ];
    }

    /**
     * @param $categoryId
     *
     * @return array
     */
    public function getCategoryIdsDownStream($categoryId) {
        $categoryIds = [$categoryId];
        $childIds = Category::where('parentId', $categoryId)->pluck('categoryId');

        foreach ($childIds as $childId) {
            $ids = $this->getCategoryIdsDownStream($childId);
            $categoryIds = array_merge($categoryIds, $ids);
        }

        return $categoryIds;
    }

    /**
     * @param $userId
     * @param $categoryId
     *
     * @return object
     */
    public function getForumPermissionsForUserInCategory($userId, $categoryId) {
        $forumPermissions = ConfigHelper::getForumPermissions();
        $permissions = [];

        foreach ($forumPermissions as $key => $value) {
            $permissions[$key] = PermissionHelper::haveForumPermission($userId, $value, $categoryId);
        }

        return (object)$permissions;
    }

    /**
     * @param $postId
     *
     * @return array|null
     */
    public function getSlimPost($postId) {
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
            'page' => DataHelper::getPage($post->thread->posts)
        ];
    }

    /**
     * @param $item
     *
     * @return array
     */
    public function getCategoryParents($item) {
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

    /**
     * @param $category
     * @param $categoryIds
     *
     * @return mixed
     */
    public function getChildren($category, $categoryIds) {
        $children = Category::where('parentId', $category->categoryId)
            ->whereIn('categoryId', $categoryIds)
            ->get(['categoryId', 'title', 'displayOrder', 'isHidden']);

        foreach ($children as $child) {
            $child->children = $this->getChildren($child, $categoryIds);
        }

        return $children;
    }

    /**
     * @param $user
     * @param array $ignoreIds
     * @param int $parentId
     *
     * @return mixed
     */
    public function getCategoryTree($user, $ignoreIds = [], $parentId = -1) {
        $forumPermissions = ConfigHelper::getForumPermissions();
        $categories = Category::where('parentId', $parentId)->select('categoryId', 'title')->getQuery()->get();
        Iterables::filter(Category::where('parentId', $parentId)->select('categoryId', 'title')->getQuery()->get()->toArray(),
            function ($category) use ($ignoreIds, $forumPermissions, $user) {
                return in_array($category->categoryId, $ignoreIds) || !PermissionHelper::haveForumPermission($user->userId, $forumPermissions->canRead, $category->categoryId);
            });
        foreach ($categories as $category) {
            $category->children = $this->getCategoryTree($user, $ignoreIds, [$category->categoryId]);
        }

        return $categories;
    }

    private function isCategoryAuthOnly($categoryId) {
        return ForumPermission::where('categoryId', $categoryId)->where('isAuthOnly', true)->count() > 0;
    }
}
