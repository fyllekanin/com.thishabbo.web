<?php

namespace App\Http\Controllers\Admin\Settings;

use App\EloquentModels\Page;
use App\Helpers\ConfigHelper;
use App\Helpers\SettingsHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PageSettingsController extends Controller {
    private $settingKeys;

    /**
     * GeneralSettingsController constructor.
     * Fetch the setting keys and store them in an instance variable
     */
    public function __construct() {
        parent::__construct();
        $this->settingKeys = ConfigHelper::getKeyConfig();
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
        $user = Cache::get('auth');
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

        Logger::admin($user->userId, $request->ip(), Action::CREATED_PAGE, [
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
    public function updatePage(Request $request, $pageId) {
        $user = Cache::get('auth');
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

        Logger::admin($user->userId, $request->ip(), Action::UPDATED_PAGE, [
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
        $user = Cache::get('auth');
        $page = Page::find($pageId);

        Condition::precondition(!$page, 404, 'No page with that ID exists');
        Condition::precondition($page->isSystem, 400, 'Can not delete a system page');

        $page->isDeleted = true;
        $page->save();

        Logger::admin($user->userId, $request->ip(), Action::DELETED_PAGE, [
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
        $user = Cache::get('auth');

        $navigation = json_encode($request->input('navigation'));
        $oldNavigation = json_decode(SettingsHelper::getSettingValue($this->settingKeys->navigation));

        SettingsHelper::createOrUpdateSetting($this->settingKeys->navigation, $navigation);
        Logger::admin($user->userId, $request->ip(), Action::UPDATED_NAVIGATION, [
            'oldNavigation' => $oldNavigation,
            'newNavigation' => $navigation
        ]);
        return response()->json();
    }
}
