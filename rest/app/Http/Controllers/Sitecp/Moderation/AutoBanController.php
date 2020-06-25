<?php

namespace App\Http\Controllers\Sitecp\Moderation;

use App\Constants\LogType;
use App\EloquentModels\Infraction\AutoBan;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AutoBanController extends Controller {

    /**
     * @param  Request  $request
     * @param $page
     *
     * @return JsonResponse
     */
    public function getAutoBans(Request $request, $page) {
        $filter = $request->input('filter');
        $autoBansSql = AutoBan::where('title', 'LIKE', Value::getFilterValue($request, $filter))
            ->orderBy('title', 'ASC')
            ->skip(PaginationUtil::getOffset($page))
            ->take($this->perPage);

        $total = PaginationUtil::getTotalPages($autoBansSql->count('autoBanId'));
        $items = $autoBansSql->get()->map(
            function ($item) {
                return [
                    'autoBanId' => $item->autoBanId,
                    'title' => $item->title,
                    'amount' => $item->amount,
                    'banLength' => $item->banLength,
                    'updatedAt' => $item->updatedAt->timestamp
                ];
            }
        );

        return response()->json(
            [
                'items' => $items,
                'page' => $page,
                'total' => $total
            ]
        );
    }

    /**
     * @param $autoBanId
     *
     * @return JsonResponse
     */
    public function getAutoBan($autoBanId) {
        $autoBan = AutoBan::find($autoBanId);
        Condition::precondition(!$autoBan, 404, 'No autoban with this ID exist');

        return response()->json(
            [
                'autoBanId' => $autoBan->autoBanId,
                'title' => $autoBan->title,
                'amount' => $autoBan->amount,
                'banLength' => ($autoBan->banLength / 3600),
                'reason' => $autoBan->reason,
                'updatedAt' => $autoBan->updatedAt->timestamp
            ]
        );
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createAutoBan(Request $request) {
        $user = $request->get('auth');
        $autoBan = (object) $request->input('autoBan');
        $this->validateAutoBanInput($autoBan);

        $newAutoBan = new AutoBan(
            [
                'title' => $autoBan->title,
                'amount' => $autoBan->amount,
                'banLength' => $autoBan->banLength * 3600,
                'reason' => $autoBan->reason
            ]
        );
        $newAutoBan->save();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::CREATED_AUTO_BAN,
            [
                'title' => $autoBan->title
            ],
            $autoBan->autoBanId
        );
        return $this->getAutoBan($newAutoBan->autoBanId);
    }

    /**
     * @param  Request  $request
     * @param $autoBanId
     *
     * @return JsonResponse
     */
    public function updateAutoBan(Request $request, $autoBanId) {
        $user = $request->get('auth');
        $newAutoBan = (object) $request->input('autoBan');
        $autoBan = AutoBan::find($autoBanId);
        Condition::precondition(!$autoBan, 404, 'No autoban with this ID exist');
        $this->validateAutoBanInput($newAutoBan);

        $autoBan->title = $newAutoBan->title;
        $autoBan->amount = $newAutoBan->amount;
        $autoBan->banLength = $newAutoBan->banLength * 3600;
        $autoBan->reason = $newAutoBan->reason;
        $autoBan->save();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_AUTO_BAN,
            [
                'title' => $autoBan->title
            ],
            $autoBan->autoBanId
        );
        return $this->getAutoBan($autoBan->autoBanId);
    }

    /**
     * @param  Request  $request
     * @param $autoBanId
     *
     * @return JsonResponse
     */
    public function deleteAutoBan(Request $request, $autoBanId) {
        $user = $request->get('auth');
        $autoBan = AutoBan::find($autoBanId);

        Condition::precondition(!$autoBan, 404, 'No autoban with this ID exist');
        $autoBan->isDeleted = true;
        $autoBan->save();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::DELETED_AUTO_BAN,
            [
                'title' => $autoBan->title
            ],
            $autoBan->autoBanId
        );
        return response()->json();
    }

    private function validateAutoBanInput($autoBan) {
        Condition::precondition(!isset($autoBan->title) || empty($autoBan->title), 400, 'Title needs to be set');
        Condition::precondition(
            !isset($autoBan->amount) || empty($autoBan->amount) || !is_numeric($autoBan->amount),
            400,
            'Amount needs to be set'
        );
        Condition::precondition(
            !isset($autoBan->banLength) || empty($autoBan->banLength || !is_numeric($autoBan->banLength)),
            400,
            'Ban length needs to be set'
        );
        Condition::precondition(!isset($autoBan->reason) || empty($autoBan->reason), 400, 'Reason needs to be set');
        Condition::precondition(
            AutoBan::where('amount', $autoBan->amount)->count('autoBanId') > 0,
            400,
            'There is already an automatic ban for this amount of points'
        );
    }
}
