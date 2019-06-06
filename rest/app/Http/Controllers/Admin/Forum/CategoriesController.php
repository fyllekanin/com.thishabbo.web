<?php

namespace App\Http\Controllers\Admin\Forum;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\ForumPermission;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;

class CategoriesController extends Controller {
    private $forumService;

    public function __construct(Request $request, ForumService $forumService) {
        parent::__construct($request);
        $this->forumService = $forumService;
    }

    /**
     * Put request to update the display order of categories
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateCategoryOrders(Request $request) {
        $orders = $request->input('updates');

        foreach ($orders as $order) {
            if (PermissionHelper::haveForumPermission($this->user->userId, ConfigHelper::getForumPermissions()->canRead, $order['categoryId'])) {
                Category::where('categoryId', $order['categoryId'])->update(['displayOrder' => $order['order']]);
            }
        }

        Logger::admin($this->user->userId, $request->ip(), Action::UPDATED_CATEGORIES_ORDER);
        return $this->getCategories();
    }

    /**
     * Post request to create a new category
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createCategory(Request $request) {
        $newCategory = (object)$request->input('category');
        $newCategory->parentId = Value::objectProperty($newCategory, 'parentId', -1);
        $newCategory->template = Value::objectProperty($newCategory, 'template', ConfigHelper::getCategoryTemplatesConfig()->DEFAULT);

        $parent = Category::find($newCategory->parentId);
        $cantAddChildren = $newCategory->parentId > 0 && !PermissionHelper::haveForumPermission($this->user->userId, ConfigHelper::getForumPermissions()->canRead, $parent->categoryId);
        Condition::precondition($newCategory->parentId > 0 && !$parent, 400, 'Invalid parent');
        Condition::precondition($cantAddChildren, 400, 'You dont have permission to add children to this parent');
        Condition::precondition(empty($newCategory->title), 400, 'Title cant be empty');
        Condition::precondition(!$this->forumService->isValidTemplate($newCategory->template), 400, 'Invalid template');

        $newCategory->options = PermissionHelper::nameToNumberOptions($newCategory);

        $category = new Category([
            'parentId' => $newCategory->parentId,
            'title' => $newCategory->title,
            'description' => Value::objectProperty($newCategory, 'description', ''),
            'options' => $newCategory->options,
            'displayOrder' => Value::objectProperty($newCategory, 'displayOrder', 0),
            'lastPostId' => 0,
            'template' => $newCategory->template,
            'isHidden' => $newCategory->isHidden,
            'isOpen' => $newCategory->isOpen,
            'link' => Value::objectProperty($newCategory, 'link', '')
        ]);
        $category->save();

        $this->createForumPermissions($category);
        Logger::admin($this->user->userId, $request->ip(), Action::CREATED_CATEGORY, ['category' => $category->title]);

        return $this->getCategory($category->categoryId);
    }

    /**
     * Delete request to delete given category
     *
     * @param Request $request
     * @param         $categoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteCategory(Request $request, $categoryId) {
        $category = Category::find($categoryId);

        PermissionHelper::haveForumPermissionWithException($this->user->userId, ConfigHelper::getForumPermissions()->canRead, $categoryId,
            'You do not have access to this category');
        Condition::precondition(!$category, 404, 'The category do not exist');

        Category::where('categoryId', $categoryId)->update(['isDeleted' => 1]);
        Category::where('parentId', $categoryId)->update(['parentId' => -1]);

        $this->forumService->updateLastPostIdOnCategory($category->parentId);
        Logger::admin($this->user->userId, $request->ip(), Action::DELETED_CATEGORY, ['category' => $category->title]);
        return response()->json();
    }

    /**
     * Put request to update given category
     *
     * @param Request $request
     * @param         $categoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateCategory(Request $request, $categoryId) {
        $newCategory = (object)$request->input('category');
        $category = Category::find($categoryId);
        $parent = Category::find($newCategory->parentId);

        Condition::precondition(!PermissionHelper::haveForumPermission($this->user->userId, ConfigHelper::getForumPermissions()->canRead, $categoryId), 400, 'You do not have access to this category');
        Condition::precondition($newCategory->parentId > 0 && !$parent, 400, 'Invalid parent');

        $cantAddChildren = $newCategory->parentId > 0 && !PermissionHelper::haveForumPermission($this->user->userId, ConfigHelper::getForumPermissions()->canRead, $parent->categoryId);
        Condition::precondition($cantAddChildren, 400, 'You dont have permission to add children to this parent');
        Condition::precondition(!$category, 404, 'Category do not exist');
        Condition::precondition(empty($newCategory->title), 400, 'Title cant be empty');
        Condition::precondition(!$this->forumService->isValidTemplate($newCategory->template), 400, 'Invalid template');

        $newCategoryId = $newCategory->categoryId;
        $oldCategoryId = $category->categoryId;

        $newCategory->options = PermissionHelper::nameToNumberOptions($newCategory);
        Category::where('categoryId', $category->categoryId)
            ->update([
                'parentId' => Value::objectProperty($newCategory, 'parentId', -1),
                'title' => $newCategory->title,
                'description' => Value::objectProperty($newCategory, 'description', ''),
                'options' => $newCategory->options,
                'displayOrder' => Value::objectProperty($newCategory, 'displayOrder', 0),
                'template' => $newCategory->template,
                'isHidden' => $newCategory->isHidden,
                'isOpen' => $newCategory->isOpen,
                'link' => Value::objectProperty($newCategory, 'link', '')
            ]);

        if ($newCategoryId != $oldCategoryId) {
            $this->forumService->updateLastPostIdOnCategory($newCategoryId);
            $this->forumService->updateLastPostIdOnCategory($oldCategoryId);
        }

        Logger::admin($this->user->userId, $request->ip(), Action::UPDATED_CATEGORY, ['category' => $newCategory->title]);
        return $this->getCategory($categoryId);
    }

    /**
     * Get request to get given category
     *
     * @param         $categoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategory($categoryId) {
        $category = Category::find($categoryId);
        $category = $categoryId == 'new' ? new \stdClass() : $category;

        Condition::precondition(!$category, 404, 'Category does not exist');
        $category->options = $this->getCategoryOptions($category);

        return response()->json([
            'category' => $category,
            'forumTree' => $this->forumService->getCategoryTree($this->user, [$categoryId], -1)
        ]);
    }

    /**
     * Get request to get all available categories
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategories() {
        $categoryIds = $this->forumService->getAccessibleCategories($this->user->userId);

        $categories = Category::select('categoryId', 'title', 'displayOrder', 'isHidden')
            ->where('parentId', '<', 0)
            ->whereIn('categoryId', $categoryIds)
            ->get();

        foreach ($categories as $category) {
            $category->children = $this->forumService->getChildren($category, $categoryIds);
        }

        return response()->json($categories);
    }

    /**
     * Get method to convert forum options to names for front-end
     *
     * @param $category
     *
     * @return array
     */
    private function getCategoryOptions($category) {
        $options = [];

        if (!isset($category->options)) {
            return $options;
        }

        foreach (ConfigHelper::getForumOptionsConfig() as $key => $value) {
            $options[$key] = $category->options & $value;
        }

        return $options;
    }

    /**
     * Method to create forum permissions
     *
     * @param $category
     */
    private function createForumPermissions($category) {
        $parentPermissions = ForumPermission::where('categoryId', $category->parentId)->get();
        if ($parentPermissions) {
            foreach ($parentPermissions as $parentPermission) {
                $permission = new ForumPermission([
                    'categoryId' => $category->categoryId,
                    'groupId' => $parentPermission->groupId,
                    'permissions' => $parentPermission->permissions
                ]);
                $permission->save();
            }
        } else {
            $permission = new ForumPermission([
                'categoryId' => $category->categoryId,
                'groupId' => 0,
                'permissions' => 1
            ]);
            $permission->save();
        }
    }
}
