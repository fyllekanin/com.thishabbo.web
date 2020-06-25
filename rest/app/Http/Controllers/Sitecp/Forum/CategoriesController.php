<?php

namespace App\Http\Controllers\Sitecp\Forum;

use App\Constants\CategoryOptions;
use App\Constants\CategoryTemplates;
use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\ForumPermission;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Group\Group;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Providers\Service\ForumService;
use App\Repositories\Repository\CategoryRepository;
use App\Utils\Condition;
use App\Utils\Iterables;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use stdClass;

class CategoriesController extends Controller {
    private $myForumService;
    private $myCategoryRepository;

    public function __construct(ForumService $forumService, CategoryRepository $categoryRepository) {
        parent::__construct();
        $this->myForumService = $forumService;
        $this->myCategoryRepository = $categoryRepository;
    }

    public function mergeCategories(Request $request, $sourceCategoryId, $targetCategoryId) {
        $user = $request->get('auth');

        $sourceCategory = $this->myCategoryRepository->getCategoryById($sourceCategoryId);
        $targetCategory = $this->myCategoryRepository->getCategoryById($targetCategoryId);
        Condition::precondition(!$sourceCategory || !$targetCategory, 404, 'Either source or target category do not exist');
        Condition::precondition($sourceCategoryId == $targetCategoryId, 400, 'You can not merge a category with itself');
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_READ,
            $sourceCategory->categoryId,
            'You do not have access to the source category'
        );
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_READ,
            $targetCategory->categoryId,
            'You do not have access to the target category'
        );

        Thread::where('categoryId', $sourceCategory->categoryId)->update(['categoryId' => $targetCategory->categoryId]);

        $this->myCategoryRepository->changeParentId($sourceCategory->categoryId, $targetCategory->categoryId);
        $this->myCategoryRepository->deleteCategory($sourceCategory->categoryId);
        $this->myForumService->updateLastPostIdOnCategory($sourceCategory->parentId);
        $this->myForumService->updateLastPostIdOnCategory($targetCategory->categoryId);

        Logger::sitecp($user->userId, $request->ip(), LogType::MERGED_CATEGORIES, [
            'sourceCategoryId' => $sourceCategory->categoryId,
            'targetCategoryId' => $targetCategory->categoryId
        ], $sourceCategory->categoryId);
        return $this->getCategories($request);
    }

    public function getGroupTree($categoryId) {
        $category = $this->myCategoryRepository->getCategoryById($categoryId);
        Condition::precondition(!$category, 404, 'No category with that ID');
        $groups = Group::orderBy('name', 'ASC')->get(['name', 'groupId']);

        return response()->json(
            [
                'name' => $category->title,
                'children' => [
                    [
                        'name' => 'Can access',
                        'children' => $this->getGroupsWithPermission($groups, CategoryPermissions::CAN_READ, $category->categoryId)
                    ],
                    [
                        'name' => 'Can post',
                        'children' => $this->getGroupsWithPermission($groups, CategoryPermissions::CAN_POST, $category->categoryId)
                    ],
                    [
                        'name' => 'Can post in others threads',
                        'children' => $this->getGroupsWithPermission(
                            $groups,
                            CategoryPermissions::CAN_POST_IN_OTHERS_THREADS,
                            $category->categoryId
                        )
                    ],
                    [
                        'name' => 'Can create threads',
                        'children' => $this->getGroupsWithPermission(
                            $groups,
                            CategoryPermissions::CAN_CREATE_THREADS,
                            $category->categoryId
                        )
                    ],
                    [
                        'name' => 'Can view threads',
                        'children' => $this->getGroupsWithPermission(
                            $groups,
                            CategoryPermissions::CAN_VIEW_THREAD_CONTENT,
                            $category->categoryId
                        )
                    ],
                    [
                        'name' => 'Can view others threads',
                        'children' => $this->getGroupsWithPermission(
                            $groups,
                            CategoryPermissions::CAN_VIEW_OTHERS_THREADS,
                            $category->categoryId
                        )
                    ],
                    [
                        'name' => 'Can open/close own thread',
                        'children' => $this->getGroupsWithPermission(
                            $groups,
                            CategoryPermissions::CAN_OPEN_CLOSE_OWN_THREAD,
                            $category->categoryId
                        )
                    ],

                    [
                        'name' => 'Can edit others threads/posts',
                        'children' => $this->getGroupsWithPermission(
                            $groups,
                            CategoryPermissions::CAN_EDIT_OTHERS_POSTS,
                            $category->categoryId
                        )
                    ],
                    [
                        'name' => 'Can move threads',
                        'children' => $this->getGroupsWithPermission($groups, CategoryPermissions::CAN_MOVE_THREADS, $category->categoryId)
                    ],
                    [
                        'name' => 'Can open/close threads',
                        'children' => $this->getGroupsWithPermission(
                            $groups,
                            CategoryPermissions::CAN_CLOSE_OPEN_THREAD,
                            $category->categoryId
                        )
                    ],
                    [
                        'name' => 'Can approve/unapprove threads',
                        'children' => $this->getGroupsWithPermission(
                            $groups,
                            CategoryPermissions::CAN_APPROVE_THREADS,
                            $category->categoryId
                        )
                    ],
                    [
                        'name' => 'Can approve/unapprove posts',
                        'children' => $this->getGroupsWithPermission($groups, CategoryPermissions::CAN_APPROVE_POSTS, $category->categoryId)
                    ],
                    [
                        'name' => 'Can merge threads and posts',
                        'children' => $this->getGroupsWithPermission(
                            $groups,
                            CategoryPermissions::CAN_MERGE_THREADS_AND_POSTS,
                            $category->categoryId
                        )
                    ],
                    [
                        'name' => 'Can change owner',
                        'children' => $this->getGroupsWithPermission($groups, CategoryPermissions::CAN_CHANGE_OWNER, $category->categoryId)
                    ],
                    [
                        'name' => 'Can sticky threads',
                        'children' => $this->getGroupsWithPermission($groups, CategoryPermissions::CAN_STICKY_THREAD, $category->categoryId)
                    ],
                    [
                        'name' => 'Can delete threads/posts',
                        'children' => $this->getGroupsWithPermission($groups, CategoryPermissions::CAN_DELETE_POSTS, $category->categoryId)
                    ],
                    [
                        'name' => 'Can manage polls',
                        'children' => $this->getGroupsWithPermission($groups, CategoryPermissions::CAN_MANAGE_POLLS, $category->categoryId)
                    ],
                ]
            ]
        );
    }

    /**
     * Put request to update the display order of categories
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function updateCategoryOrders(Request $request) {
        $user = $request->get('auth');
        $orders = $request->input('updates');

        foreach ($orders as $order) {
            if (PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_READ, $order['categoryId'])) {
                Category::where('categoryId', $order['categoryId'])->update(['displayOrder' => $order['order']]);
            }
        }

        Logger::sitecp($user->userId, $request->ip(), LogType::UPDATED_CATEGORIES_ORDER);
        return $this->getCategories($request);
    }

    /**
     * Post request to create a new category
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createCategory(Request $request) {
        $newCategory = (object) $request->input('category');
        $newCategory->parentId = Value::objectProperty($newCategory, 'parentId', -1);
        $newCategory->template = Value::objectProperty($newCategory, 'template', CategoryTemplates::DEFAULT);

        $parent = Category::find($newCategory->parentId);
        $user = $request->get('auth');

        $cantAddChildren = $newCategory->parentId > 0 &&
            !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_READ, $parent->categoryId);
        Condition::precondition($newCategory->parentId > 0 && !$parent, 400, 'Invalid parent');
        Condition::precondition($cantAddChildren, 400, 'You dont have permission to add children to this parent');
        Condition::precondition(empty($newCategory->title), 400, 'Title cant be empty');
        Condition::precondition(!CategoryTemplates::isValid($newCategory->template), 400, 'Invalid template');
        Condition::precondition(
            isset($newCategory->icon) && !preg_match('/^[a-zA-Z\- ]+$/', $newCategory->icon),
            400,
            'Icon string is invalid'
        );
        Condition::precondition(!isset($newCategory->credits) || !is_numeric($newCategory->credits), 400, 'Credits need to set');
        Condition::precondition(!isset($newCategory->xp) || !is_numeric($newCategory->xp), 400, 'XP need to set');

        $newCategory->options = PermissionHelper::nameToNumberOptions($newCategory);

        $category = new Category(
            [
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
            ]
        );
        $category->save();

        $this->createForumPermissions($category);
        Logger::sitecp($user->userId, $request->ip(), LogType::CREATED_CATEGORY, ['category' => $category->title], $category->categoryId);

        return $this->getCategory($request, $category->categoryId);
    }

    /**
     * Delete request to delete given category
     *
     * @param  Request  $request
     * @param $categoryId
     *
     * @return JsonResponse
     */
    public function deleteCategory(Request $request, $categoryId) {
        $user = $request->get('auth');
        $category = $this->myCategoryRepository->getCategoryById($categoryId);

        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_READ,
            $categoryId,
            'You do not have access to this category'
        );
        Condition::precondition(!$category, 404, 'The category do not exist');

        $this->myCategoryRepository->deleteCategory($categoryId);
        $this->myForumService->updateLastPostIdOnCategory($category->parentId);

        Logger::sitecp($user->userId, $request->ip(), LogType::DELETED_CATEGORY, ['category' => $category], $category->categoryId);
        return $this->getCategories($request);
    }

    /**
     * Put request to update given category
     *
     * @param  Request  $request
     * @param $categoryId
     *
     * @return JsonResponse
     */
    public function updateCategory(Request $request, $categoryId) {
        $newCategory = (object) $request->input('category');
        $isCascade = (boolean) $request->input('isCascade');
        $category = Category::find($categoryId);
        $parent = Category::find($newCategory->parentId);
        $user = $request->get('auth');

        Condition::precondition(
            !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_READ, $categoryId),
            400,
            'You do not have access to this category'
        );
        Condition::precondition($newCategory->parentId > 0 && !$parent, 400, 'Invalid parent');

        $cantAddChildren = $newCategory->parentId > 0 &&
            !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_READ, $parent->categoryId);
        Condition::precondition($cantAddChildren, 400, 'You dont have permission to add children to this parent');
        Condition::precondition(!$category, 404, 'Category do not exist');
        Condition::precondition(empty($newCategory->title), 400, 'Title cant be empty');
        Condition::precondition(!CategoryTemplates::isValid($newCategory->template), 400, 'Invalid template');
        Condition::precondition(
            isset($newCategory->icon) && !preg_match('/^[a-zA-Z\- ]+$/', $newCategory->icon),
            400,
            'Icon string is invalid'
        );
        Condition::precondition(!isset($newCategory->credits) || !is_numeric($newCategory->credits), 400, 'Credits need to set');
        Condition::precondition(!isset($newCategory->xp) || !is_numeric($newCategory->xp), 400, 'XP need to set');

        $newCategoryId = $newCategory->categoryId;
        $oldCategoryId = $category->categoryId;
        $oldCategory = $category;

        $newCategory->options = PermissionHelper::nameToNumberOptions($newCategory);
        $category->parentId = Value::objectProperty($newCategory, 'parentId', -1);
        $category->title = $newCategory->title;
        $category->description = Value::objectProperty($newCategory, 'description', '');
        $category->options = $newCategory->options;
        $category->displayOrder = Value::objectProperty($newCategory, 'displayOrder', 0);
        $category->template = $newCategory->template;
        $category->isHidden = $newCategory->isHidden;
        $category->isOpen = $newCategory->isOpen;
        $category->link = Value::objectProperty($newCategory, 'link', '');
        $category->icon = Value::objectProperty($newCategory, 'icon', null);
        $category->credits = $newCategory->credits;
        $category->xp = $newCategory->xp;
        $category->save();

        if ($newCategoryId != $oldCategoryId) {
            $this->myForumService->updateLastPostIdOnCategory($newCategoryId);
            $this->myForumService->updateLastPostIdOnCategory($oldCategoryId);
        }

        if ($isCascade) {
            $this->cascadeCategoryOptions($category);
        }

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_CATEGORY,
            [
                'before' => $oldCategory,
                'after' => $category,
                'isCascade' => $isCascade
            ],
            $newCategory->categoryId
        );
        return $this->getCategory($request, $categoryId);
    }

    /**
     * Get request to get given category
     *
     * @param  Request  $request
     * @param $categoryId
     *
     * @return JsonResponse
     */
    public function getCategory(Request $request, $categoryId) {
        $category = Category::find($categoryId);
        $user = $request->get('auth');
        $category = $categoryId == 'new' ? new stdClass() : $category;

        Condition::precondition(!$category, 404, 'Category does not exist');
        $category->options = $this->getCategoryOptions($category);

        return response()->json(
            [
                'category' => $category,
                'categories' => $this->myForumService->getCategoryTree($user, [$categoryId], -1)
            ]
        );
    }

    /**
     * Get request to get all available categories
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getCategories(Request $request) {
        $user = $request->get('auth');

        $categoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ);

        $categories = Category::select('categoryId', 'title', 'displayOrder', 'isHidden', 'parentId')
            ->where('parentId', '<', 0)
            ->whereIn('categoryId', $categoryIds)
            ->get();

        foreach ($categories as $category) {
            $category->children = $this->myForumService->getChildren($category, $categoryIds, true);
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

        foreach (CategoryOptions::getAsOptions() as $key => $value) {
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
        if ($category->parentId > 0) {
            ForumPermission::where('categoryId', $category->parentId)->get()
                ->each(
                    function ($parentPermission) use ($category) {
                        $permission = new ForumPermission();
                        $permission->categoryId = $category->categoryId;
                        $permission->groupId = $parentPermission->groupId;
                        $permission->permissions = $parentPermission->permissions;
                        $permission->save();
                    }
                );
        } else {
            $permission = new ForumPermission();
            $permission->categoryId = $category->categoryId;
            $permission->groupId = 0;
            $permission->permissions = CategoryPermissions::CAN_READ;
            $permission->save();
        }
    }

    private function cascadeCategoryOptions($category) {
        $categoryIds = $this->myForumService->getCategoryIdsDownStream($category->categoryId);

        Category::whereIn('categoryId', $categoryIds)->update(
            [
                'credits' => $category->credits,
                'xp' => $category->xp,
                'template' => $category->template,
                'options' => $category->options
            ]
        );
    }

    private function getGroupsWithPermission($groups, $permission, $categoryId) {
        return array_map(
            function ($group) {
                return ['name' => $group['name'], 'children' => []];
            },
            Iterables::filter(
                $groups->toArray(),
                function ($group) use ($categoryId, $permission) {
                    return ForumPermission::where('categoryId', $categoryId)
                            ->where('groupId', $group['groupId'])
                            ->whereRaw('(permissions & '.$permission.')')
                            ->count('categoryId') > 0;
                }
            )
        );
    }
}
