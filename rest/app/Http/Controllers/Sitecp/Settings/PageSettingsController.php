<?php

namespace App\Http\Controllers\Sitecp\Settings;

use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\Constants\SettingsKeys;
use App\EloquentModels\Page;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Providers\Service\ForumService;
use App\Repositories\Repository\SettingRepository;
use App\Utils\Condition;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageSettingsController extends Controller {
    private $myForumService;
    private $mySettingRepository;

    public function __construct(ForumService $forumService, SettingRepository $settingRepository) {
        parent::__construct();
        $this->myForumService = $forumService;

        $this->mySettingRepository = $settingRepository;
    }

    public function getHomePageThreads(Request $request) {
        $user = $request->get('auth');

        $categoryIds = $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::HOME_PAGE_THREADS);
        return response()->json(
            [
                'categoryIds' => is_array($categoryIds) ? $categoryIds : [],
                'categories' => $this->myForumService->getCategoryTree($user, [], -1)
            ]
        );
    }

    public function updateHomePageThreads(Request $request) {
        $user = $request->get('auth');
        $data = $request->input('data');
        if (!is_array($data)) {
            $data = [];
        }

        foreach ($data as $item) {
            Condition::precondition(
                !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_READ, $item),
                400,
                'You do not have access to one or more of the categories'
            );
        }

        $this->mySettingRepository->createOrUpdate(SettingsKeys::HOME_PAGE_THREADS, json_encode($data));
        Logger::sitecp($user->userId, $request->ip(), LogType::UPDATED_HOME_PAGE_THREADS);
        return response()->json();
    }

    /**
     * @return JsonResponse
     */
    public function getPages() {
        return response()->json(
            Page::all()->map(
                function ($page) {
                    return [
                        'pageId' => $page->pageId,
                        'path' => $page->path,
                        'title' => $page->title,
                        'isSystem' => $page->isSystem,
                        'canEdit' => $page->canEdit
                    ];
                }
            )
        );
    }

    /**
     * @param $pageId
     *
     * @return JsonResponse
     */
    public function getPage($pageId) {
        $page = Page::find($pageId);
        Condition::precondition(!$page, 404, 'No page with that ID exists');

        return response()->json($page);
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createPage(Request $request) {
        $user = $request->get('auth');
        $data = (object) $request->input('data');

        Condition::precondition(!isset($data->path) || empty($data->path), 400, 'Path can not be empty');
        Condition::precondition(!isset($data->title) || empty($data->title), 400, 'Title can not be empty');
        Condition::precondition(!isset($data->content) || empty($data->content), 400, 'Content can not be empty');
        Condition::precondition(
            !preg_match('/[a-zA-Z]+/', $data->path),
            400,
            'Path is not valid, it can only be text'
        );

        $page = new Page(
            [
                'path' => $data->path,
                'title' => $data->title,
                'content' => $data->content
            ]
        );
        $page->save();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::CREATED_PAGE,
            [
                'title' => $data->title
            ]
        );
        return $this->getPage($page->pageId);
    }

    /**
     * @param  Request  $request
     *
     * @param $pageId
     *
     * @return JsonResponse
     */
    public function updatePage(Request $request, $pageId) {
        $user = $request->get('auth');
        $page = Page::find($pageId);
        $data = (object) $request->input('data');

        Condition::precondition(!$page, 404, 'No page with that ID exists');
        Condition::precondition(!$page->canEdit, 400, 'You can not edit this page');
        Condition::precondition(!isset($data->path) || empty($data->path), 400, 'Path can not be empty');
        Condition::precondition(!isset($data->title) || empty($data->title), 400, 'Title can not be empty');
        Condition::precondition(!isset($data->content) || empty($data->content), 400, 'Content can not be empty');
        Condition::precondition(
            !preg_match('/[a-zA-Z]+/', $data->path),
            400,
            'Path is not valid, it can only be text'
        );

        if (!$page->isSystem) {
            $page->path = $data->path;
        }
        $page->title = $data->title;
        $page->content = $data->content;
        $page->save();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_PAGE,
            [
                'title' => $data->title
            ]
        );
        return response()->json();
    }

    /**
     * @param  Request  $request
     *
     * @param $pageId
     *
     * @return JsonResponse
     */
    public function deletePage(Request $request, $pageId) {
        $user = $request->get('auth');
        $page = Page::find($pageId);

        Condition::precondition(!$page, 404, 'No page with that ID exists');
        Condition::precondition($page->isSystem, 400, 'Can not delete a system page');

        $page->isDeleted = true;
        $page->save();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::DELETED_PAGE,
            [
                'title' => $page->title
            ]
        );
        return response()->json();
    }

    /**
     * @return JsonResponse
     */
    public function getNavigation() {
        $navigation = null;
        try {
            $navigation = $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::NAVIGATION);
        } catch (Exception $e) {
            $navigation = [];
        }
        return response()->json(is_array($navigation) ? $navigation : []);
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function updateNavigation(Request $request) {
        $user = $request->get('auth');

        $navigation = json_encode($request->input('navigation'));
        $oldNavigation = $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::NAVIGATION);
        $this->mySettingRepository->createOrUpdate(SettingsKeys::NAVIGATION, $navigation);

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_NAVIGATION,
            [
                'oldNavigation' => $oldNavigation,
                'newNavigation' => $navigation
            ]
        );
        return response()->json();
    }
}
