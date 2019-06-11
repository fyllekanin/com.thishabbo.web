<?php

namespace App\Http\Controllers\Sitecp\Settings;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Page;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\SettingsHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Utils\Condition;
use Illuminate\Http\Request;

class PageSettingsController extends Controller {
    private $settingKeys;
    private $forumService;

    /**
     * GeneralSettingsController constructor.
     * Fetch the setting keys and store them in an instance variable
     *
     * @param ForumService $forumService
     */
    public function __construct(ForumService $forumService) {
        parent::__construct();
        $this->forumService = $forumService;
        $this->settingKeys = ConfigHelper::getKeyConfig();
    }

    public function getHomePageThreads(Request $request) {
        $user = $request->get('auth');

        $categoryIds = json_decode(SettingsHelper::getSettingValue($this->settingKeys->homePageThreads));
        return response()->json([
            'categoryIds' => is_array($categoryIds) ? $categoryIds : [],
            'categories' => Category::whereIn('categoryId', $this->forumService->getAccessibleCategories($user->userId))
                ->orderBy('title', 'ASC')
                ->get(['categoryId', 'title'])
        ]);
    }

    public function updateHomePageThreads(Request $request) {
        $user = $request->get('auth');
        $data = $request->input('data');
        $permissions = ConfigHelper::getForumPermissions();

        if (!is_array($data)) {
            $data = [];
        }

        foreach ($data as $item) {
            Condition::precondition(!PermissionHelper::haveForumPermission($user->userId, $permissions->canRead, $item), 400,
                'You do not have access to one or more of the categories');
        }

        SettingsHelper::createOrUpdateSetting($this->settingKeys->homePageThreads, json_encode($data));
        Logger::sitecp($user->userId, $request->ip(), Action::UPDATED_HOME_PAGE_THREADS);
        return response()->json();
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPages() {
        return response()->json(Page::all()->map(function ($page) {
            return [
                'pageId' => $page->pageId,
                'path' => $page->path,
                'title' => $page->title,
                'isSystem' => $page->isSystem,
                'canEdit' => $page->canEdit
            ];
        }));
    }

    /**
     * @param $pageId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPage($pageId) {
        $page = Page::find($pageId);
        Condition::precondition(!$page, 404, 'No page with that ID exists');

        return response()->json($page);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createPage(Request $request) {
        $user = $request->get('auth');
        $data = (object)$request->input('data');

        Condition::precondition(!isset($data->path) || empty($data->path), 400, 'Path can not be empty');
        Condition::precondition(!isset($data->title) || empty($data->title), 400, 'Title can not be empty');
        Condition::precondition(!isset($data->content) || empty($data->content), 400, 'Content can not be empty');
        Condition::precondition(!preg_match('/[a-zA-Z]+/', $data->path), 400,
            'Path is not valid, it can only be text');

        $page = new Page([
            'path' => $data->path,
            'title' => $data->title,
            'content' => $data->content
        ]);
        $page->save();

        Logger::sitecp($user->userId, $request->ip(), Action::CREATED_PAGE, [
            'title' => $data->title
        ]);
        return $this->getPage($page->pageId);
    }

    /**
     * @param Request $request
     *
     * @param         $pageId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePage(Request $request, $pageId) {
        $user = $request->get('auth');
        $page = Page::find($pageId);
        $data = (object)$request->input('data');

        Condition::precondition(!$page, 404, 'No page with that ID exists');
        Condition::precondition(!$page->canEdit, 400, 'You can not edit this page');
        Condition::precondition(!isset($data->path) || empty($data->path), 400, 'Path can not be empty');
        Condition::precondition(!isset($data->title) || empty($data->title), 400, 'Title can not be empty');
        Condition::precondition(!isset($data->content) || empty($data->content), 400, 'Content can not be empty');
        Condition::precondition(!preg_match('/[a-zA-Z]+/', $data->path), 400,
            'Path is not valid, it can only be text');

        if (!$page->isSystem) {
            $page->path = $data->path;
        }
        $page->title = $data->title;
        $page->content = $data->content;
        $page->save();

        Logger::sitecp($user->userId, $request->ip(), Action::UPDATED_PAGE, [
            'title' => $data->title
        ]);
        return response()->json();
    }

    /**
     * @param Request $request
     *
     * @param         $pageId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deletePage(Request $request, $pageId) {
        $user = $request->get('auth');
        $page = Page::find($pageId);

        Condition::precondition(!$page, 404, 'No page with that ID exists');
        Condition::precondition($page->isSystem, 400, 'Can not delete a system page');

        $page->isDeleted = true;
        $page->save();

        Logger::sitecp($user->userId, $request->ip(), Action::DELETED_PAGE, [
            'title' => $page->title
        ]);
        return response()->json();
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNavigation() {
        $navigation = null;
        try {
            $navigation = json_decode(SettingsHelper::getSettingValue($this->settingKeys->navigation));
        } catch (\Exception $e) {
            $navigation = [];
        }
        return response()->json(is_array($navigation) ? $navigation : []);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateNavigation(Request $request) {
        $user = $request->get('auth');

        $navigation = json_encode($request->input('navigation'));
        $oldNavigation = json_decode(SettingsHelper::getSettingValue($this->settingKeys->navigation));

        SettingsHelper::createOrUpdateSetting($this->settingKeys->navigation, $navigation);
        Logger::sitecp($user->userId, $request->ip(), Action::UPDATED_NAVIGATION, [
            'oldNavigation' => $oldNavigation,
            'newNavigation' => $navigation
        ]);
        return response()->json();
    }
}
