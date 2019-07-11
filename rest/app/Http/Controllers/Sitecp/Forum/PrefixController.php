<?php

namespace App\Http\Controllers\Sitecp\Forum;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\Prefix;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Utils\Condition;
use Illuminate\Http\Request;

class PrefixController extends Controller {
    private $forumService;

    /**
     * PrefixController constructor.
     *
     * @param ForumService $forumService
     */
    public function __construct(ForumService $forumService) {
        parent::__construct();
        $this->forumService = $forumService;
    }

    /**
     * Get request to get all the available prefixes
     *
     * @param Request $request
     * @param         $prefixId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPrefix(Request $request, $prefixId) {
        $user = $request->get('auth');
        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);
        $prefix = null;

        if ($prefixId == 'new') {
            $prefix = new \stdClass();
            $prefix->categoryIds = '';
        } else {
            $prefix = Prefix::find($prefixId);
        }
        $prefix->categoryIds = isset($prefix->categoryIds) && strlen($prefix->categoryIds) > 0 ? explode(',', $prefix->categoryIds) : [-1];

        Condition::precondition(!$prefix, 404, 'Prefix do not exist');
        $categories = Category::select('categoryId', 'title')
            ->whereIn('categoryId', $categoryIds)
            ->where('parentId', '-1')
            ->get();

        foreach ($categories as $category) {
            $category->children = $this->forumService->getChildren($category, $categoryIds, true);
        }
        $prefix->categories = $categories;
        return response()->json($prefix);
    }

    /**
     * Post request to create a new prefix
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createPrefix(Request $request) {
        $user = $request->get('auth');
        $prefix = (object)$request->input('prefix');
        $categoryIds = isset($prefix->categoryIds) ? $prefix->categoryIds : [];

        foreach ($categoryIds as $categoryId) {
            PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumPermissions()->canRead, $categoryId,
                'You do not have access to one of the forum');
        }

        Condition::precondition(!isset($prefix->text), 400, 'Text needs to be present');
        Condition::precondition(!isset($prefix->style), 400, 'Style needs to be present');
        Condition::precondition(strlen($prefix->text) < 1, 400, 'Text can not be empty');
        Condition::precondition(strlen($prefix->style) < 1, 400, 'Style can not be empty');

        $prefix = new Prefix([
            'text' => $prefix->text,
            'style' => $prefix->style,
            'categoryIds' => implode(',', $categoryIds)
        ]);
        $prefix->save();

        Logger::sitecp($user->userId, $request->ip(), Action::CREATED_PREFIX, ['prefix' => $prefix->text], $prefix->prefixId);
        return $this->getPrefix($request, $prefix->prefixId);
    }

    /**
     * Put request to update the given prefix
     *
     * @param Request $request
     * @param         $prefixId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePrefix(Request $request, $prefixId) {
        $user = $request->get('auth');
        $prefix = (object)$request->input('prefix');
        $categoryIds = isset($prefix->categoryIds) ? $prefix->categoryIds : [];
        $existing = Prefix::find($prefixId);

        Condition::precondition(!$existing, 404, 'Prefix do not exist');

        foreach ($categoryIds as $categoryId) {
            PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumPermissions()->canRead, $categoryId,
                'You do not have access to one of the forum');
        }

        Condition::precondition(!isset($prefix->text), 400, 'Text needs to be present');
        Condition::precondition(!isset($prefix->style), 400, 'Style needs to be present');
        Condition::precondition(strlen($prefix->text) < 1, 400, 'Text can not be empty');
        Condition::precondition(strlen($prefix->style) < 1, 400, 'Style can not be empty');

        $existing->text = $prefix->text;
        $existing->style = $prefix->style;
        $existing->categoryIds = implode(',', $categoryIds);
        $existing->save();

        Logger::sitecp($user->userId, $request->ip(), Action::UPDATED_PREFIX, ['prefix' => $prefix->text], $prefix->prefixId);
        return $this->getPrefix($request, $prefixId);
    }

    /**
     * Delete request to delete the given prefix
     *
     * @param Request $request
     * @param         $prefixId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deletePrefix(Request $request, $prefixId) {
        $user = $request->get('auth');

        $prefix = Prefix::find($prefixId);
        Condition::precondition(!$prefix, 404, 'The prefix do not exist');

        $prefix->isDeleted = true;
        $prefix->save();

        Logger::sitecp($user->userId, $request->ip(), Action::DELETED_PREFIX, ['prefix' => $prefix->text], $prefix->prefixId);
        return response()->json();
    }

    /**
     * Get request to fetch all available prefixes
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPrefixes() {
        return response()->json(Prefix::all());
    }
}
