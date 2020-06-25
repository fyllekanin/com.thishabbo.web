<?php

namespace App\Http\Controllers\Sitecp\Forum;

use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\ThreadTemplate;
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

class ThreadTemplateController extends Controller {
    private $myForumService;
    private $myCategoryRepository;

    public function __construct(ForumService $forumService, CategoryRepository $categoryRepository) {
        parent::__construct();
        $this->myForumService = $forumService;
        $this->myCategoryRepository = $categoryRepository;
    }

    /**
     * Get request to get all the available thread templates
     *
     * @param  Request  $request
     * @param $threadTemplateId
     *
     * @return JsonResponse
     */
    public function getThreadTemplate(Request $request, $threadTemplateId) {
        $user = $request->get('auth');
        $categoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ);
        $threadTemplate = null;

        if ($threadTemplateId == 'new') {
            $threadTemplate = new stdClass();
            $threadTemplate->categoryIds = '';
        } else {
            $threadTemplate = ThreadTemplate::find($threadTemplateId);
        }

        $threadTemplate->categoryIds = isset($threadTemplate->categoryIds) ? explode(',', $threadTemplate->categoryIds) : [-1];

        Condition::precondition(!$threadTemplate, 404, 'Thread template do not exist');

        $threadTemplate->categories = $this->myForumService->getChildren((object) ['categoryId' => '-1'], $categoryIds, true);
        return response()->json($threadTemplate);
    }

    /**
     * Post request to create a new thread template
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createThreadTemplate(Request $request) {
        $user = $request->get('auth');
        $data = (object) $request->input('threadTemplate');
        $categoryIds = isset($data->categoryIds) ? $data->categoryIds : [];

        $categoryIds = Category::whereIn('categoryId', $categoryIds)->pluck('categoryId')->toArray();
        foreach ($categoryIds as $categoryId) {
            PermissionHelper::haveForumPermissionWithException(
                $user->userId,
                CategoryPermissions::CAN_READ,
                $categoryId,
                'You do not have access to one of the forum'
            );
        }

        Condition::precondition(!isset($data->name), 400, 'Name needs to be present');
        Condition::precondition(!isset($data->content), 400, 'Content needs to be present');
        Condition::precondition(strlen($data->name) < 1, 400, 'Name can not be empty');
        Condition::precondition(strlen($data->content) < 1, 400, 'Content can not be empty');

        $threadTemplate = new ThreadTemplate();
        $threadTemplate->name = $data->name;
        $threadTemplate->content = $data->content;
        $threadTemplate->categoryIds = implode(',', $categoryIds);

        $threadTemplate->save();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::CREATED_THREAD_TEMPLATE,
            ['threadTemplate' => $threadTemplate],
            $threadTemplate->threadTemplateId
        );
        return $this->getThreadTemplate($request, $threadTemplate->threadTemplateId);
    }

    /**
     * Put request to update the given thread template
     *
     * @param  Request  $request
     * @param $threadTemplateId
     *
     * @return JsonResponse
     */
    public function updateThreadTemplate(Request $request, $threadTemplateId) {
        $user = $request->get('auth');
        $data = (object) $request->input('threadTemplate');
        $categoryIds = isset($data->categoryIds) ? $data->categoryIds : [];
        $existing = ThreadTemplate::find($threadTemplateId);

        Condition::precondition(!$existing, 404, 'Thread template do not exist');

        $categoryIds = Category::whereIn('categoryId', $categoryIds)->pluck('categoryId')->toArray();
        foreach ($categoryIds as $categoryId) {
            PermissionHelper::haveForumPermissionWithException(
                $user->userId,
                CategoryPermissions::CAN_READ,
                $categoryId,
                'You do not have access to one of the forum'
            );
        }

        Condition::precondition(!isset($data->name), 400, 'Name needs to be present');
        Condition::precondition(!isset($data->content), 400, 'Content needs to be present');
        Condition::precondition(strlen($data->name) < 1, 400, 'Name can not be empty');
        Condition::precondition(strlen($data->content) < 1, 400, 'Content can not be empty');

        $existing->name = $data->name;
        $existing->content = $data->content;
        $existing->categoryIds = implode(',', $categoryIds);
        $existing->save();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_THREAD_TEMPLATE,
            ['threadTemplate' => $existing],
            $existing->threadTemplateId
        );
        return $this->getThreadTemplate($request, $threadTemplateId);
    }

    /**
     * Delete request to delete the given thread template
     *
     * @param  Request  $request
     * @param $threadTemplateId
     *
     * @return JsonResponse
     */
    public function deleteThreadTemplate(Request $request, $threadTemplateId) {
        $user = $request->get('auth');

        $threadTemplate = ThreadTemplate::find($threadTemplateId);
        Condition::precondition(!$threadTemplate, 404, 'The thread template do not exist');

        $threadTemplate->isDeleted = true;
        $threadTemplate->save();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::DELETED_THREAD_TEMPLATE,
            ['threadTemplate' => $threadTemplate],
            $threadTemplate->threadTemplateId
        );
        return response()->json();
    }

    /**
     * Get request to fetch all available thread templates
     *
     * @param $page
     *
     * @return JsonResponse
     */
    public function getThreadTemplates($page) {

        return response()->json(
            [
                'page' => $page,
                'total' => PaginationUtil::getTotalPages(ThreadTemplate::count()),
                'items' => ThreadTemplate::take($this->perPage)->skip(PaginationUtil::getOffset($page))->get()
            ]
        );
    }
}
