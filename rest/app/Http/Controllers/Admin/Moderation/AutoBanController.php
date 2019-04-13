<?php

namespace App\Http\Controllers\Admin\Moderation;

use App\EloquentModels\Infraction\AutoBan;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AutoBanController extends Controller {

    /**
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAutoBans (Request $request, $page) {
        $filter = $request->input('filter');
        $autoBansSql = AutoBan::where('title', 'LIKE', '%' . $filter . '%')
            ->orderBy('title', 'ASC')
            ->skip($this->getOffset($page))
            ->take($this->perPage);

        $total = ceil($autoBansSql->count() / $this->perPage);
        $items = $autoBansSql->get()->map(function($item) {
            return [
                'autoBanId' => $item->autoBanId,
                'title' => $item->title,
                'amount' => $item->amount,
                'banLength' => $item->banLength,
                'updatedAt' => $item->updatedAt->timestamp
            ];
        });

        return response()->json([
            'items' => $items,
            'page' => $page,
            'total' => $total
        ]);
    }

    /**
     * @param         $autoBanId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAutoBan($autoBanId) {
        $autoBan = AutoBan::find($autoBanId);
        Condition::precondition(!$autoBan, 404, 'No autoban with this ID exist');

        return response()->json([
            'autoBanId' => $autoBan->autoBanId,
            'title' => $autoBan->title,
            'amount' => $autoBan->amount,
            'banLength' => ($autoBan->banLength / 3600),
            'reason' => $autoBan->reason,
            'updatedAt' => $autoBan->updatedAt->timestamp
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createAutoBan(Request $request) {
        $user = Cache::get('auth');
        $autoBan = (object) $request->input('autoBan');
        $this->validateAutoBanInput($autoBan);

        $newAutoBan = new AutoBan([
            'title' => $autoBan->title,
            'amount' => $autoBan->amount,
            'banLength' => $autoBan->banLength * 3600,
            'reason' => $autoBan->reason
        ]);
        $newAutoBan->save();

        Logger::admin($user->userId, $request->ip(), Action::CREATED_AUTO_BAN, [
            'title' => $autoBan->title
        ]);
        return $this->getAutoBan($newAutoBan->autoBanId);
    }

    /**
     * @param Request $request
     * @param         $autoBanId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateAutoBan(Request $request, $autoBanId) {
        $user = Cache::get('auth');
        $newAutoBan = (object) $request->input('autoBan');
        $autoBan = AutoBan::find($autoBanId);
        Condition::precondition(!$autoBan, 404, 'No autoban with this ID exist');
        $this->validateAutoBanInput($newAutoBan);

        $autoBan->title = $newAutoBan->title;
        $autoBan->amount = $newAutoBan->amount;
        $autoBan->banLength = $newAutoBan->banLength * 3600;
        $autoBan->reason = $newAutoBan->reason;
        $autoBan->save();

        Logger::admin($user->userId, $request->ip(), Action::UPDATED_AUTO_BAN, [
            'title' => $autoBan->title
        ]);
        return $this->getAutoBan($autoBan->autoBanId);
    }

    /**
     * @param Request $request
     * @param         $autoBanId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteAutoBan(Request $request, $autoBanId) {
        $user = Cache::get('auth');
        $autoBan = AutoBan::find($autoBanId);

        Condition::precondition(!$autoBan, 404, 'No autoban with this ID exist');
        $autoBan->isDeleted = true;
        $autoBan->save();

        Logger::admin($user->userId, $request->ip(), Action::DELETED_AUTO_BAN, [
            'title' => $autoBan->title
        ]);
        return response()->json();
    }

    private function validateAutoBanInput($autoBan) {
        Condition::precondition(!isset($autoBan->title) || empty($autoBan->title), 400, 'Title needs to be set');
        Condition::precondition(!isset($autoBan->amount) || empty($autoBan->amount) || !is_numeric($autoBan->amount),
            400, 'Amount needs to be set');
        Condition::precondition(!isset($autoBan->banLength) || empty($autoBan->banLength || !is_numeric($autoBan->banLength)),
            400, 'Ban length needs to be set');
        Condition::precondition(!isset($autoBan->reason) || empty($autoBan->reason), 400, 'Reason needs to be set');
        Condition::precondition(AutoBan::where('amount', $autoBan->amount)->count() > 0,
            400, 'There is already an automatic ban for this amount of points');
    }
}
