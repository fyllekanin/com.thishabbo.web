<?php

namespace App\Repositories\Repository;

use App\Repositories\Impl\CategoryRepository\CategoryDBO;
use Illuminate\Support\Collection;

interface CategoryRepository {

    /**
     * Get all categories with given option
     *
     * @param  int  $option
     *
     * @return Collection
     */
    public function getCategoriesWithOption(int $option);

    /**
     * Get all categories with given template
     *
     * @param  string  $template
     *
     * @return Collection
     */
    public function getCategoriesWithTemplate(string $template);

    /**
     * Get a collection of all category ids downstream
     * including given starting category id based on possible ids
     *
     * @param  int  $categoryId
     * @param  Collection  $categoryIds
     *
     * @return Collection
     */
    public function getCategoryIdsDownstreamFromPossibleIds(int $categoryId, Collection $categoryIds);

    /**
     * Get a collection of all category ids downstream
     * including given starting category id
     *
     * @param  int  $categoryId
     *
     * @return Collection
     */
    public function getCategoryIdsDownstream(int $categoryId);

    /**
     * Change parent id on
     *
     * @param  int  $currentId
     * @param  int  $newId
     *
     * @return mixed
     */
    public function changeParentId(int $currentId, int $newId);

    /**
     * Delete provided category
     *
     * @param  int  $categoryId
     */
    public function deleteCategory(int $categoryId);

    /**
     * Get category by provided ID
     *
     * @param  int  $categoryId
     *
     * @return CategoryDBO
     */
    public function getCategoryById(int $categoryId);

    /**
     * Get a collection of category ids that the user
     * can access by READ permission.
     *
     * @param  int  $userId
     * @param  int  $permission
     *
     * @return Collection of category ids
     */
    public function getCategoryIdsWherePermission(int $userId, int $permission);

    /**
     * Get a collection of categories that is a child to
     * given parent id
     *
     * @param  int  $parentId
     * @param  Collection  $possibleIds
     *
     * @return Collection
     */
    public function getCategoriesWithParentIdFromPossibleIds(int $parentId, Collection $possibleIds);

    /**
     * Check if given user have given permission in given category
     *
     * @param  int  $userId
     * @param  int  $categoryId
     * @param  int  $permission
     *
     * @return bool
     */
    public function doUserIdHaveForumPermissionForCategoryId(int $userId, int $categoryId, int $permission);
}
