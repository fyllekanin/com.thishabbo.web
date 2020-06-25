<?php

namespace App\Repositories\Impl\CategoryRepository;

use App\Helpers\PermissionHelper;
use App\Repositories\Repository\CategoryRepository;
use App\Repositories\Repository\GroupRepository;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class CategoryRepositoryImpl implements CategoryRepository {
    private $myIsCategoriesCached = false;
    private $myCategoryDBO;
    private $myForumPermissionDBO;
    public $myCategories;

    private $myGroupRepository;

    public function __construct(GroupRepository $groupRepository) {
        $this->myCategories = collect();
        $this->myCategoryDBO = new CategoryDBO();
        $this->myForumPermissionDBO = new ForumPermissionDBO();

        $this->myGroupRepository = $groupRepository;
    }

    public function getCategoriesWithOption(int $option) {
        return $this->getCategories()->filter(function ($category) use ($option) {
            return $category->options & $option;
        });
    }

    public function getCategoriesWithTemplate(string $template) {
        return $this->getCategories()->filter(function ($category) use ($template) {
            return $category->template == $template;
        });
    }

    public function changeParentId(int $currentId, int $newId) {
        $this->myCategoryDBO->query()
            ->whereParentId($currentId)
            ->setParentId($newId);

        $this->getCategories()->each(function ($category) use ($currentId, $newId) {
            $category->parentId = $category->parentId == $currentId ? $newId : $category->parentId;
        });
    }

    public function getCategoryIdsDownstreamFromPossibleIds(int $categoryId, Collection $categoryIds) {
        $collection = collect($categoryId);
        $this->getCategoriesWithParentIdFromPossibleIds($categoryId, $categoryIds)
            ->each(function ($category) use ($collection, $categoryIds) {
                $this->getCategoryIdsDownstreamFromPossibleIds($category->categoryId, $categoryIds)->each(function ($id) use ($collection) {
                    $collection->push($id);
                });
            });
        return $collection;
    }

    public function deleteCategory(int $categoryId) {
        $item = $this->getCategoryById($categoryId);
        if (!$item) {
            return;
        }
        $item->isDeleted = true;
        $item->save();
        $this->myCategoryDBO->query()
            ->whereParentId($categoryId)
            ->makeTopParent();

        $this->myCategories = $this->myCategories->filter(function ($category) use ($categoryId) {
            return $category->categoryId != $categoryId;
        });
        $this->getCategories()->each(function ($category) use ($categoryId) {
            $category->parentId = $category->parentId == $categoryId ? -1 : $category->parentId;
        });
    }

    public function getCategoryIdsDownstream(int $categoryId) {
        $collection = collect($categoryId);
        $this->getCategoriesWithParentId($categoryId)
            ->each(function ($category) use ($collection) {
                $this->getCategoryIdsDownstream($category->categoryId)->each(function ($id) use ($collection) {
                    $collection->push($id);
                });
            });
        return $collection;
    }

    public function getCategoryById(int $categoryId) {
        return $this->getCategories()->first(function ($category) use ($categoryId) {
            return $category->categoryId == $categoryId;
        });
    }

    public function getCategoriesWithParentIdFromPossibleIds(int $parentId, Collection $possibleIds) {
        $categories = $this->getCategories();
        return $categories->filter(function ($category) use ($parentId, $possibleIds) {
            return $category->parentId == $parentId && $possibleIds->contains($category->categoryId);
        });
    }

    public function getCategoryIdsWherePermission(int $userId, int $permission) {
        if (Cache::has("accessible-categories-{$userId}-permission{$permission}")) {
            return Cache::get("accessible-categories-{$userId}-permission{$permission}");
        }
        if (PermissionHelper::isSuperSitecp($userId)) {
            return $this->getCategories()->pluck('categoryId');
        }
        $groupIds = $this->myGroupRepository->getGroupIdsForUserId($userId);
        $categoryIds = $this->myForumPermissionDBO->query()
            ->whereInGroupIds($groupIds)
            ->isLoggedIn($userId > 0)
            ->wherePermission($permission)
            ->pluck('categoryId');

        Cache::put("accessible-categories-{$userId}-permission{$permission}", $categoryIds, 30);
        return $categoryIds;
    }

    public function doUserIdHaveForumPermissionForCategoryId(int $userId, int $categoryId, int $permission) {
        if (PermissionHelper::isSuperSitecp($userId)) {
            return true;
        }
        $groupIds = $this->myGroupRepository->getGroupIdsForUserId($userId);
        return $this->myForumPermissionDBO->query()
                ->whereCategoryId($categoryId)
                ->wherePermission($permission)
                ->whereInGroupIds($groupIds)
                ->countPrimary() > 0;
    }

    public function getCategoriesWithParentId(int $parentId) {
        return $this->getCategories()->filter(function ($category) use ($parentId) {
            return $category->parentId == $parentId;
        });
    }

    private function getCategories() {
        if ($this->myIsCategoriesCached) {
            return $this->myCategories;
        }
        $this->myCategories = $this->myCategoryDBO->query()->orderBy('displayOrder', 'ASC')->get();
        $this->myIsCategoriesCached = true;
        return $this->myCategories;
    }
}
