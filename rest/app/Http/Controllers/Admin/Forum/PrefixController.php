<?php

namespace App\Http\Controllers\Admin\Forum;

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
     * @param Request $request
     * @param ForumService $forumService
     */
    public function __construct(Request $request, ForumService $forumService) {
        parent::__construct($request);
        $this->forumService = $forumService;
    }

    /**
     * Get request to get all the available prefixes
     *
     * @param         $prefixId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPrefix($prefixId) {
        $categoryIds = $this->forumService->getAccessibleCategories($this->user->userId);
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
            $category->children = $this->forumService->getChildren($category, $categoryIds);
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
        $prefix = (object)$request->input('prefix');
        $categoryIds = isset($prefix->categoryIds) ? $prefix->categoryIds : [];

        foreach ($categoryIds as $categoryId) {
            PermissionHelper::haveForumPermissionWithException($this->user->userId, ConfigHelper::getForumPermissions()->canRead, $categoryId,
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

        Logger::admin($this->user->userId, $request->ip(), Action::CREATED_PREFIX, ['prefix' => $prefix->text]);
        return $this->getPrefix($prefix->prefixId);
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
        $prefix = (object)$request->input('prefix');
        $categoryIds = isset($prefix->categoryIds) ? $prefix->categoryIds : [];
        $existing = Prefix::find($prefixId);

        Condition::precondition(!$existing, 404, 'Prefix do not exist');

        foreach ($categoryIds as $categoryId) {
            PermissionHelper::haveForumPermissionWithException($this->user->userId, ConfigHelper::getForumPermissions()->canRead, $categoryId,
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

        Logger::admin($this->user->userId, $request->ip(), Action::UPDATED_PREFIX, ['prefix' => $prefix->text]);
        return $this->getPrefix($prefixId);
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
        $prefix = Prefix::find($prefixId);
        Condition::precondition(!$prefix, 404, 'The prefix do not exist');

        $prefix->isDeleted = true;
        $prefix->save();

        Logger::admin($this->user->userId, $request->ip(), Action::DELETED_PREFIX, ['prefix' => $prefix->text]);
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
