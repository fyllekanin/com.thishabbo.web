<?php

namespace App\Http\Controllers\Sitecp;

use App\Constants\LogType;
use App\EloquentModels\Log\LogMod;
use App\EloquentModels\Log\LogSitecp;
use App\EloquentModels\Log\LogStaff;
use App\EloquentModels\Log\LogUser;
use App\EloquentModels\User\User;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Http\Impl\Sitecp\LogsControllerImpl;
use App\Providers\Service\ContentService;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Mockery\Exception;

class LogsController extends Controller {
    private $myImpl;
    private $myContentService;

    public function __construct(LogsControllerImpl $impl, ContentService $contentService) {
        parent::__construct();
        $this->myImpl = $impl;
        $this->myContentService = $contentService;
    }

    /**
     * @return JsonResponse
     */
    public function getServerLogs() {
        $files = array_map(
            function ($file) {
                return $file->getFilename();
            }, File::files(storage_path('logs'))
        );
        asort($files);
        return response()->json($files);
    }

    /**
     * @param $fileName
     *
     * @return JsonResponse
     */
    public function getServerLog($fileName) {
        Condition::precondition(!File::exists(storage_path('logs/'.$fileName)), 404, 'Log do not exist');

        return response()->json($this->myContentService->getParsedContent(File::get(storage_path('logs/'.$fileName))));
    }

    /**
     * @param  Request  $request
     * @param $type
     * @param $page
     *
     * @return JsonResponse
     */
    public function getLogs(Request $request, $type, $page) {
        $perPage = 20;
        $nickname = $request->input('user');
        $targetNickname = $request->input('target');
        $action = $request->input('action');

        $log = null;
        $actions = [];
        switch ($type) {
            case 'user':
                $log = LogUser::orderByCreatedDesc();
                $actions = LogType::getActionsByLog('log_user');
                break;
            case 'mod':
                $log = LogMod::orderByCreatedDesc();
                $actions = LogType::getActionsByLog('log_mod');
                break;
            case 'sitecp':
                $log = LogSitecp::orderByCreatedDesc();
                $actions = LogType::getActionsByLog('log_sitecp');
                break;
            case 'staff':
                $log = LogStaff::orderByCreatedDesc();
                $actions = LogType::getActionsByLog('log_staff');
                break;
            default:
                Condition::precondition(
                    true, 404,
                    $type.' is not a supported mod type'
                );
                break;
        }

        if ($action) {
            $log->whereAction($action);
        }

        if ($nickname) {
            $userIds = User::withNicknameLike($nickname)->pluck('userId');
            $log->whereInUserIds($userIds);
        }

        if ($targetNickname) {
            $userId = User::withNickname($targetNickname)->value('userId');
            $log->whereContentId($userId);
        }

        $total = PaginationUtil::getTotalPages($log->count('logId'), $perPage);
        $items = $log->take($perPage)->skip(PaginationUtil::getOffset($page, $perPage))->get()->map(function ($item) {
            $data = null;
            try {
                $data = json_decode($item->data);
            } catch (Exception $e) {
                $data = null;
            }

            return (object) [
                'logId' => $item->logId,
                'user' => UserHelper::getSlimUser($item->userId),
                'action' => LogType::getActionFromId($item->action)->description,
                'data' => $data,
                'content' => $this->getContentFromLog($item, $data),
                'createdAt' => $item->createdAt->timestamp
            ];
        });

        return response()->json(
            [
                'type' => $type,
                'total' => $total,
                'actions' => array_map(
                    function ($action) {
                        return ['id' => $action['id'], 'description' => $action['description']];
                    }, $actions
                ),
                'page' => $page,
                'items' => $items
            ]
        );
    }

    private function getContentFromLog($item, $data) {
        $action = LogType::getActionFromId($item->action);
        $content = $this->myImpl->getFormattedContent($item, $data);
        if ($content) {
            return $content;
        }

        if ($action && isset($action->contentId) && $action->contentId) {
            return DB::table($action->contentTable)->where($action->contentId, $item->contentId)->value($action->contentSelect);
        }
        return '';
    }
}
