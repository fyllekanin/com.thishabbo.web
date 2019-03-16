<?php

namespace App\Http\Controllers\Admin;

use App\EloquentModels\Log\LogAdmin;
use App\EloquentModels\Log\LogMod;
use App\EloquentModels\Log\LogStaff;
use App\EloquentModels\Log\LogUser;
use App\EloquentModels\User\User;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Models\Logger\Action;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Mockery\Exception;

class LogsController extends Controller {

    /**
     * @param Request $request
     * @param $type
     * @param $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLogs(Request $request, $type, $page) {
        $nickname = $request->input('filter');
        $log = null;
        switch ($type) {
            case 'user':
                $log = LogUser::orderBy('createdAt', 'desc');
                break;
            case 'mod':
                $log = LogMod::orderBy('createdAt', 'desc');
                break;
            case 'admin':
                $log = LogAdmin::orderBy('createdAt', 'desc');
                break;
            case 'staff':
                $log = LogStaff::orderBy('createdAt', 'desc');
                break;
            default:
                Condition::precondition(true, 404,
                    $type . ' is not a supported mod type');
                break;
        }

        if ($nickname) {
            $userIds = User::withNicknameLike($nickname)->pluck('userId');
            $log->whereIn('userId', $userIds);
        }

        $total = $log->count();
        $items = $log->take($this->perPage)->skip($this->getOffset($page))->get()->map(function($item) {
            $data = null;
            try {
                $data = json_decode($item->data);
            } catch (Exception $e) {
                // Left empty intentionally
            }

            return (object) [
                'user' => UserHelper::getSlimUser($item->userId),
                'action' => Action::getActionFromId($item->action)['description'],
                'data' => $data,
                'createdAt' => $item->createdAt->timestamp
            ];
        });

        return response()->json([
            'total' => ceil($total / $this->perPage),
            'page' => $page,
            'items' => $items
        ]);
    }
}