<?php

namespace App\Http\Controllers\Forum\Category;

use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\CategorySubscription;
use App\EloquentModels\Forum\IgnoredCategory;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Providers\Service\ForumService;
use App\Providers\Service\QueryParamService;
use App\Repositories\Repository\CategoryRepository;
use App\Utils\Condition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryActionController extends Controller {
    private $myQueryParamService;
    private $myForumService;
    private $myCategoryRepository;

    public function __construct(QueryParamService $queryParamService, ForumService $forumService, CategoryRepository $categoryRepository) {
        parent::__construct();
        $this->myQueryParamService = $queryParamService;
        $this->myForumService = $forumService;
        $this->myCategoryRepository = $categoryRepository;
    }

    public function readAll(Request $request) {
        $user = $request->get('auth');

        if ($user->userId < 1) {
            return response()->json();
        }

        $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ)->each(
            function ($categoryId) use ($user) {
                $this->myForumService->updateReadCategory($categoryId, $user->userId);
            }
        );

        Logger::user($user->userId, $request->ip(), LogType::READ_ALL_CATEGORIES);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $categoryId
     *
     * @return JsonResponse
     */
    public function createIgnore(Request $request, $categoryId) {
        $user = $request->get('auth');
        $isCascade = $request->input('isCascade');
        $isAlreadyIgnoring = IgnoredCategory::where('userId', $user->userId)->where('categoryId', $categoryId)->count('categoryId') > 0;
        Condition::precondition($isAlreadyIgnoring, 400, 'You are already ignoring this category');

        $categoryIds = $isCascade ? $this->myForumService->getCategoryIdsDownStream($categoryId) : [$categoryId];

        foreach ($categoryIds as $categoryId) {
            $ignore = new IgnoredCategory(
                [
                    'userId' => $user->userId,
                    'categoryId' => $categoryId
                ]
            );
            $ignore->save();
        }

        Logger::user($user->userId, $request->ip(), LogType::IGNORED_CATEGORY, ['categoryIds' => json_encode($categoryIds)], $categoryId);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $categoryId
     *
     * @return JsonResponse
     */
    public function deleteIgnore(Request $request, $categoryId) {
        $user = $request->get('auth');
        $item = IgnoredCategory::where('userId', $user->userId)->where('categoryId', $categoryId);
        Condition::precondition($item->count('categoryId') == 0, 404, 'You are not currently ignoring this category');

        $item->delete();

        Logger::user($user->userId, $request->ip(), LogType::UNIGNORED_CATEGORY, ['categoryId' => $categoryId], $categoryId);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $categoryId
     *
     * @return JsonResponse
     */
    public function createSubscription(Request $request, $categoryId) {
        $user = $request->get('auth');
        $category = Category::find($categoryId);

        Condition::precondition(!$category, 404, 'There is not category with that ID');
        Condition::precondition(
            !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_READ, $category->categoryId),
            400,
            'You do not have access to this category'
        );
        Condition::precondition(
            CategorySubscription::where('userId', $user->userId)->where('categoryId', $category->categoryId)->count('categoryId') > 0,
            400,
            'You are already subscribed to this category'
        );

        $subscription = new CategorySubscription(
            [
                'userId' => $user->userId,
                'categoryId' => $category->categoryId
            ]
        );
        $subscription->save();

        Logger::user(
            $user->userId,
            $request->ip(),
            LogType::SUBSCRIBE_CATEGORY,
            ['categoryId' => $category->categoryId],
            $category->categoryId
        );
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $categoryId
     *
     * @return JsonResponse
     */
    public function deleteSubscription(Request $request, $categoryId) {
        $user = $request->get('auth');
        $category = Category::find($categoryId);

        Condition::precondition(!$category, 404, 'There is not category with that ID');
        Condition::precondition(
            CategorySubscription::where('userId', $user->userId)->where('categoryId', $category->categoryId)->count('categoryId') == 0,
            400,
            'You are not subscribed to this category'
        );

        CategorySubscription::where('userId', $user->userId)->where('categoryId', $category->categoryId)->delete();

        Logger::user(
            $user->userId,
            $request->ip(),
            LogType::UNSUBSCRIBE_CATEGORY,
            ['categoryId' => $category->categoryId],
            $category->categoryId
        );
        return response()->json();
    }
}
