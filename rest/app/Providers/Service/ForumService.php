<?php

namespace App\Providers\Service;

use App\EloquentModels\Forum\Thread;

/**
 * Class ForumService
 *
 * @package App\Providers\Services
 */
interface ForumService {


    /**
     * Post a site message if the thread is in a category of template type QUEST
     *
     * @param  Thread  $thread
     */
    public function postSiteMessageIfApplicable(Thread $thread);

    /**
     * Check if given category have given option set
     *
     * @param  int  $categoryId
     * @param  int  $option
     *
     * @return boolean
     */
    public function doCategoryHaveOption(int $categoryId, int $option);

    /**
     * Get the thread poll from thread
     *
     * @param $thread
     * @param $userId
     *
     * @return array|null
     */
    public function getThreadPoll(Thread $thread, $userId);

    /**
     * Update the last postId on given category
     *
     * @param  integer  $categoryId
     *
     * @return mixed
     */
    public function updateLastPostIdOnCategory($categoryId);

    /**
     * Check if user have read given thread since the last post
     *
     * @param $thread
     * @param $userId
     *
     * @return mixed
     */
    public function haveReadThread($thread, $userId);

    /**
     * Update the thread read time for user for given thread ID
     *
     * @param $threadId
     * @param $userId
     *
     * @return mixed
     */
    public function updateReadThread($threadId, $userId);

    /**
     * Check if user have read given category since the last thread or post
     *
     * @param $category
     * @param $userId
     *
     * @return mixed
     */
    public function haveReadCategory($category, $userId);

    /**
     * Update the category read time for user for given thread ID
     *
     * @param $categoryId
     * @param $userId
     *
     * @return mixed
     */
    public function updateReadCategory($categoryId, $userId);

    /**
     * Get list of category ids were the given user do not have access to
     * read other users threads
     *
     * @param $userId
     *
     * @return array
     */
    public function getCategoriesUserCantSeeOthersThreadsIn($userId);

    /**
     * Get latest posts in the system based on categories the given user can access
     *
     * @param $categoryIds
     * @param $ignoredThreadIds
     * @param $ignoredCategoryIds
     * @param $amount
     * @param  int  $skip
     *
     * @return object with data and total
     */
    public function getLatestPosts($categoryIds, $ignoredThreadIds, $ignoredCategoryIds, $amount, $skip = 0);

    /**
     * Get list of category ids that are downstream from given category ID
     *
     * @param $categoryId
     *
     * @return array
     */
    public function getCategoryIdsDownStream($categoryId);

    /**
     * Get forum permissions given user have in given category
     *
     * @param $userId
     * @param $categoryId
     *
     * @return object
     */
    public function getForumPermissionsForUserInCategory($userId, $categoryId);

    /**
     * Get slim post model of given post ID
     *
     * @param $postId
     *
     * @return array|null
     */
    public function getSlimPost($postId);

    /**
     * Get category tree of parents to given category
     *
     * @param $category
     *
     * @return array
     */
    public function getCategoryParents($category);

    /**
     * Get category tree of children based on given category
     *
     * @param $category
     * @param $categoryIds
     *
     * @param  bool  $isFirstChild
     *
     * @return mixed
     */
    public function getChildren($category, $categoryIds, $isFirstChild);

    /**
     * Get full category tree based on parent ID to start on
     *
     * @param $user
     * @param  array  $ignoreIds
     * @param  int  $parentId
     *
     * @return mixed
     */
    public function getCategoryTree($user, $ignoreIds = [], $parentId = -1);
}
