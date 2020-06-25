<?php

namespace App\Http\Controllers\Sitecp\Forum;

use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\Prefix;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Providers\Service\ForumService;
use App\Repositories\Repository\CategoryRepository;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use stdClass;

class PrefixController extends Controller {
    private $myForumService;
    private $myCateogyRepository;

    public function __construct(ForumService $forumService, CategoryRepository $categoryRepository) {
        parent::__construct();
        $this->myForumService = $forumService;
        $this->myCateogyRepository = $categoryRepository;
    }

    /**
     * Get request to get all the available prefixes
     *
     * @param  Request  $request
     * @param $prefixId
     *
     * @return JsonResponse
     */
    public function getPrefix(Request $request, $prefixId) {
        $user = $request->get('auth');
        $categoryIds = $this->myCateogyRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ);
        $prefix = null;

        if ($prefixId == 'new') {
            $prefix = new stdClass();
            $prefix->categoryIds = '';
        } else {
            $prefix = Prefix::find($prefixId);
        }
        $prefix->categoryIds = isset($prefix->categoryIds) && strlen($prefix->categoryIds) > 0 ? explode(',', $prefix->categoryIds) : [-1];

        Condition::precondition(!$prefix, 404, 'Prefix do not exist');
        $prefix->categories = $this->myForumService->getChildren((object) ['categoryId' => '-1'], $categoryIds, true);
        return response()->json($prefix);
    }

    /**
     * Post request to create a new prefix
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createPrefix(Request $request) {
        $user = $request->get('auth');
        $prefix = (object) $request->input('prefix');
        $categoryIds = isset($prefix->categoryIds) ? $prefix->categoryIds : [];

        $categoryIds = Category::whereIn('categoryId', $categoryIds)->pluck('categoryId')->toArray();
        foreach ($categoryIds as $categoryId) {
            PermissionHelper::haveForumPermissionWithException(
                $user->userId,
                CategoryPermissions::CAN_READ,
                $categoryId,
                'You do not have access to one of the forum'
            );
        }

        Condition::precondition(!isset($prefix->text), 400, 'Text needs to be present');
        Condition::precondition(!isset($prefix->style), 400, 'Style needs to be present');
        Condition::precondition(strlen($prefix->text) < 1, 400, 'Text can not be empty');
        Condition::precondition(strlen($prefix->style) < 1, 400, 'Style can not be empty');

        $prefix = new Prefix(
            [
                'text' => $prefix->text,
                'style' => $prefix->style,
                'categoryIds' => implode(',', $categoryIds)
            ]
        );
        $prefix->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::CREATED_PREFIX, ['prefix' => $prefix->text], $prefix->prefixId);
        return $this->getPrefix($request, $prefix->prefixId);
    }

    /**
     * Put request to update the given prefix
     *
     * @param  Request  $request
     * @param $prefixId
     *
     * @return JsonResponse
     */
    public function updatePrefix(Request $request, $prefixId) {
        $user = $request->get('auth');
        $prefix = (object) $request->input('prefix');
        $categoryIds = isset($prefix->categoryIds) ? $prefix->categoryIds : [];
        $existing = Prefix::find($prefixId);

        Condition::precondition(!$existing, 404, 'Prefix do not exist');

        $categoryIds = Category::whereIn('categoryId', $categoryIds)->pluck('categoryId')->toArray();
        foreach ($categoryIds as $categoryId) {
            PermissionHelper::haveForumPermissionWithException(
                $user->userId,
                CategoryPermissions::CAN_READ,
                $categoryId,
                'You do not have access to one of the forum'
            );
        }

        Condition::precondition(!isset($prefix->text), 400, 'Text needs to be present');
        Condition::precondition(!isset($prefix->style), 400, 'Style needs to be present');
        Condition::precondition(strlen($prefix->text) < 1, 400, 'Text can not be empty');
        Condition::precondition(strlen($prefix->style) < 1, 400, 'Style can not be empty');

        $existing->text = $prefix->text;
        $existing->style = $prefix->style;
        $existing->categoryIds = implode(',', $categoryIds);
        $existing->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::UPDATED_PREFIX, ['prefix' => $prefix->text], $prefix->prefixId);
        return $this->getPrefix($request, $prefixId);
    }

    /**
     * Delete request to delete the given prefix
     *
     * @param  Request  $request
     * @param $prefixId
     *
     * @return JsonResponse
     */
    public function deletePrefix(Request $request, $prefixId) {
        $user = $request->get('auth');

        $prefix = Prefix::find($prefixId);
        Condition::precondition(!$prefix, 404, 'The prefix do not exist');

        $prefix->isDeleted = true;
        $prefix->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::DELETED_PREFIX, ['prefix' => $prefix->text], $prefix->prefixId);
        return response()->json();
    }

    /**
     * Get request to fetch all available prefixes
     *
     * @param $page
     *
     * @return JsonResponse
     */
    public function getPrefixes($page) {

        return response()->json(
            [
                'page' => $page,
                'total' => PaginationUtil::getTotalPages(Prefix::count()),
                'items' => Prefix::take($this->perPage)->skip(PaginationUtil::getOffset($page))->get()
            ]
        );
    }
}
