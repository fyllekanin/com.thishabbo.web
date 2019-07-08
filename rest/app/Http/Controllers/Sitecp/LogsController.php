<?php

namespace App\Http\Controllers\Sitecp;

use App\EloquentModels\Log\LogMod;
use App\EloquentModels\Log\LogSitecp;
use App\EloquentModels\Log\LogStaff;
use App\EloquentModels\Log\LogUser;
use App\EloquentModels\User\User;
use App\Helpers\DataHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Models\Logger\Action;
use App\Utils\BBcodeUtil;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Mockery\Exception;

class LogsController extends Controller {

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getServerLogs() {
        $files = array_map(function ($file) {
            return $file->getFilename();
        }, File::files(storage_path('logs')));
        asort($files);
        return response()->json($files);
    }

    /**
     * @param $fileName
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getServerLog($fileName) {
        Condition::precondition(!File::exists(storage_path('logs/' . $fileName)), 404, 'Log do not exist');

        $content = BBcodeUtil::arrowsToEntry(File::get(storage_path('logs/' . $fileName)));
        return response()->json(nl2br($content));
    }

    /**
     * @param Request $request
     * @param $type
     * @param $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLogs(Request $request, $type, $page) {
        $nickname = $request->input('user');
        $action = $request->input('action');

        $log = null;
        $actions = [];
        switch ($type) {
            case 'user':
                $log = LogUser::orderBy('createdAt', 'desc');
                $actions = Action::getActionsByLog('log_user');
                break;
            case 'mod':
                $log = LogMod::orderBy('createdAt', 'desc');
                $actions = Action::getActionsByLog('log_mod');
                break;
            case 'sitecp':
                $log = LogSitecp::orderBy('createdAt', 'desc');
                $actions = Action::getActionsByLog('log_sitecp');
                break;
            case 'staff':
                $log = LogStaff::orderBy('createdAt', 'desc');
                $actions = Action::getActionsByLog('log_staff');
                break;
            default:
                Condition::precondition(true, 404,
                    $type . ' is not a supported mod type');
                break;
        }

        if ($action) {
            $log->where('action', $action);
        }

        if ($nickname) {
            $userIds = User::withNicknameLike($nickname)->pluck('userId');
            $log->whereIn('userId', $userIds);
        }

        $total = DataHelper::getPage($log->count('logId'));
        $items = $log->take($this->perPage)->skip(DataHelper::getOffset($page))->get()->map(function ($item) {
            $data = null;
            try {
                $data = json_decode($item->data);
            } catch (Exception $e) {
                // Left empty intentionally
            }

            return (object)[
                'logId' => $item->logId,
                'user' => UserHelper::getSlimUser($item->userId),
                'action' => Action::getActionFromId($item->action)['description'],
                'data' => $data,
                'createdAt' => $item->createdAt->timestamp
            ];
        });

        return response()->json([
            'total' => $total,
            'actions' => array_map(function ($action) {
                return ['id' => $action['id'], 'description' => $action['description']];
            }, $actions),
            'page' => $page,
            'items' => $items
        ]);
    }
}
