<?php

namespace App\Http\Controllers\Forum\Category;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\CategorySubscription;
use App\EloquentModels\Forum\IgnoredCategory;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Services\QueryParamService;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CategoryActionController extends Controller {
    private $categoryTemplates = null;

    private $queryParamService;
    private $forumService;

    /**
     * CategoryController constructor.
     * Fetch the available category templates and store them in an instance variable
     *
     * @param QueryParamService $queryParamService
     * @param ForumService $forumService
     */
    public function __construct(QueryParamService $queryParamService, ForumService $forumService) {
        parent::__construct();
        $this->categoryTemplates = ConfigHelper::getCategoryTemplatesConfig();
        $this->queryParamService = $queryParamService;
        $this->forumService = $forumService;
    }

    /**
     * @param Request $request
     * @param         $categoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createIgnore(Request $request, $categoryId) {
        $user = Cache::get('auth');
        $isAlreadyIgnoring = IgnoredCategory::where('userId', $user->userId)->where('categoryId', $categoryId)->count('threadId') > 0;
        Condition::precondition($isAlreadyIgnoring, 400, 'You are already ignoring this category');

        $categoryIds = $this->forumService->getCategoryIdsDownStream($categoryId);

        foreach ($categoryIds as $categoryId) {
            $ignore = new IgnoredCategory([
                'userId' => $user->userId,
                'categoryId' => $categoryId
            ]);
            $ignore->save();
        }

        Logger::user($user->userId, $request->ip(), Action::IGNORED_CATEGORY, ['categoryId' => $categoryId]);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param         $categoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteIgnore(Request $request, $categoryId) {
        $user = Cache::get('auth');
        $item = IgnoredCategory::where('userId', $user->userId)->where('categoryId', $categoryId);
        Condition::precondition($item->count('threadId') == 0, 404, 'You are not currently ignoring this category');

        $item->delete();

        Logger::user($user->userId, $request->ip(), Action::UNIGNORED_CATEGORY, ['categoryId' => $categoryId]);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param         $categoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createSubscription(Request $request, $categoryId) {
        $user = Cache::get('auth');
        $category = Category::find($categoryId);

        Condition::precondition(!$category, 404, 'There is not category with that ID');
        Condition::precondition(!PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumConfig()->canRead, $category->categoryId),
            400, 'You do not have access to this category');
        Condition::precondition(CategorySubscription::where('userId', $user->userId)->where('categoryId', $category->categoryId)->count('categoryId') > 0,
            400, 'You are already subscribed to this category');

        $subscription = new CategorySubscription([
            'userId' => $user->userId,
            'categoryId' => $category->categoryId
        ]);
        $subscription->save();

        Logger::user($user->userId, $request->ip(), Action::SUBSCRIBE_CATEGORY, ['categoryId' => $category->categoryId]);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param         $categoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteSubscription(Request $request, $categoryId) {
        $user = Cache::get('auth');
        $category = Category::find($categoryId);

        Condition::precondition(!$category, 404, 'There is not category with that ID');
        Condition::precondition(CategorySubscription::where('userId', $user->userId)->where('categoryId', $category->categoryId)->count('categoryId') == 0,
            400, 'You are not subscribed to this category');

        CategorySubscription::where('userId', $user->userId)->where('categoryId', $category->categoryId)->delete();

        Logger::user($user->userId, $request->ip(), Action::UNSUBSCRIBE_CATEGORY, ['categoryId' => $category->categoryId]);
        return response()->json();
    }
}
