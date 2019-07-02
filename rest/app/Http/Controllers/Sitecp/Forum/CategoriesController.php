<?php

namespace App\Http\Controllers\Sitecp\Forum;

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
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoriesController extends Controller {
    private $forumService;

    public function __construct(ForumService $forumService) {
        parent::__construct();
        $this->forumService = $forumService;
    }

    /**
     * Put request to update the display order of categories
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function updateCategoryOrders(Request $request) {
        $user = $request->get('auth');
        $orders = $request->input('updates');

        foreach ($orders as $order) {
            if (PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canRead, $order['categoryId'])) {
                Category::where('categoryId', $order['categoryId'])->update(['displayOrder' => $order['order']]);
            }
        }

        Logger::sitecp($user->userId, $request->ip(), Action::UPDATED_CATEGORIES_ORDER);
        return $this->getCategories($request);
    }

    /**
     * Post request to create a new category
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function createCategory(Request $request) {
        $newCategory = (object)$request->input('category');
        $newCategory->parentId = Value::objectProperty($newCategory, 'parentId', -1);
        $newCategory->template = Value::objectProperty($newCategory, 'template', ConfigHelper::getCategoryTemplatesConfig()->DEFAULT);

        $parent = Category::find($newCategory->parentId);
        $user = $request->get('auth');

        $cantAddChildren = $newCategory->parentId > 0 && !PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canRead, $parent->categoryId);
        Condition::precondition($newCategory->parentId > 0 && !$parent, 400, 'Invalid parent');
        Condition::precondition($cantAddChildren, 400, 'You dont have permission to add children to this parent');
        Condition::precondition(empty($newCategory->title), 400, 'Title cant be empty');
        Condition::precondition(!$this->forumService->isValidTemplate($newCategory->template), 400, 'Invalid template');
        Condition::precondition(isset($newCategory->icon) && !preg_match('/^[a-zA-Z\- ]+$/', $newCategory->icon), 400, 'Icon string is invalid');
        Condition::precondition(!isset($newCategory->credits) || !is_numeric($newCategory->credits), 400, 'Credits need to set');
        Condition::precondition(!isset($newCategory->xp) || !is_numeric($newCategory->xp), 400, 'XP need to set');

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
            'link' => Value::objectProperty($newCategory, 'link', ''),
            'icon' => Value::objectProperty($newCategory, 'icon', null),
            'credits' => $newCategory->credits,
            'xp' => $newCategory->xp
        ]);
        $category->save();

        $this->createForumPermissions($category);
        Logger::sitecp($user->userId, $request->ip(), Action::CREATED_CATEGORY, ['category' => $category->title]);

        return $this->getCategory($request, $category->categoryId);
    }

    /**
     * Delete request to delete given category
     *
     * @param Request $request
     * @param         $categoryId
     *
     * @return JsonResponse
     */
    public function deleteCategory(Request $request, $categoryId) {
        $user = $request->get('auth');
        $category = Category::find($categoryId);

        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumPermissions()->canRead, $categoryId,
            'You do not have access to this category');
        Condition::precondition(!$category, 404, 'The category do not exist');

        Category::where('categoryId', $categoryId)->update(['isDeleted' => 1]);
        Category::where('parentId', $categoryId)->update(['parentId' => -1]);

        $this->forumService->updateLastPostIdOnCategory($category->parentId);
        Logger::sitecp($user->userId, $request->ip(), Action::DELETED_CATEGORY, ['category' => $category->title]);
        return response()->json();
    }

    /**
     * Put request to update given category
     *
     * @param Request $request
     * @param         $categoryId
     *
     * @return JsonResponse
     */
    public function updateCategory(Request $request, $categoryId) {
        $newCategory = (object)$request->category;
        $category = Category::find($categoryId);
        $parent = Category::find($newCategory->parentId);
        $user = $request->get('auth');

        Condition::precondition(!PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canRead, $categoryId), 400, 'You do not have access to this category');
        Condition::precondition($newCategory->parentId > 0 && !$parent, 400, 'Invalid parent');

        $cantAddChildren = $newCategory->parentId > 0 && !PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canRead, $parent->categoryId);
        Condition::precondition($cantAddChildren, 400, 'You dont have permission to add children to this parent');
        Condition::precondition(!$category, 404, 'Category do not exist');
        Condition::precondition(empty($newCategory->title), 400, 'Title cant be empty');
        Condition::precondition(!$this->forumService->isValidTemplate($newCategory->template), 400, 'Invalid template');
        Condition::precondition(isset($newCategory->icon) && !preg_match('/^[a-zA-Z\- ]+$/', $newCategory->icon), 400, 'Icon string is invalid');
        Condition::precondition(!isset($newCategory->credits) || !is_numeric($newCategory->credits), 400, 'Credits need to set');
        Condition::precondition(!isset($newCategory->xp) || !is_numeric($newCategory->xp), 400, 'XP need to set');

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
                'link' => Value::objectProperty($newCategory, 'link', ''),
                'icon' => Value::objectProperty($newCategory, 'icon', null),
                'credits' => $newCategory->credits,
                'xp' => $newCategory->xp
            ]);

        if ($newCategoryId != $oldCategoryId) {
            $this->forumService->updateLastPostIdOnCategory($newCategoryId);
            $this->forumService->updateLastPostIdOnCategory($oldCategoryId);
        }

        Logger::sitecp($user->userId, $request->ip(), Action::UPDATED_CATEGORY, ['category' => $newCategory->title]);
        return $this->getCategory($request, $categoryId);
    }

    /**
     * Get request to get given category
     *
     * @param Request $request
     * @param         $categoryId
     *
     * @return JsonResponse
     */
    public function getCategory(Request $request, $categoryId) {
        $category = Category::find($categoryId);
        $user = $request->get('auth');
        $category = $categoryId == 'new' ? new \stdClass() : $category;

        Condition::precondition(!$category, 404, 'Category does not exist');
        $category->options = $this->getCategoryOptions($category);

        return response()->json([
            'category' => $category,
            'forumTree' => $this->forumService->getCategoryTree($user, [$categoryId], -1)
        ]);
    }

    /**
     * Get request to get all available categories
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getCategories(Request $request) {
        $user = $request->get('auth');

        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);

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
