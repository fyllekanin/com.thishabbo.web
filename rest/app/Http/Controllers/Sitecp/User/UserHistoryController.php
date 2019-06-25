<?php

namespace App\Http\Controllers\Sitecp\User;

use App\EloquentModels\Log\LogSitecp;
use App\Helpers\DataHelper;
use App\Http\Controllers\Controller;
use App\Http\Impl\Sitecp\Shop\UserHistoryControllerImpl;

/**
 * Handles all of the history reading of a user, when stuff changed on them etc
 *
 * Supported cases:
 * - Groups update (When user groups updated)
 * - Basic update (When nickname & habbo updated)
 * - Subscription update (When subscription created/deleted)
 * - Accolade update (When accolade created/updated/deleted)
 * - Ban update (When ban created/updated/deleted)
 * - Avatar deleted (When avatar deleted)
 * - Cover photo deleted (When cover photo deleted)
 */
class UserHistoryController extends Controller {
    private $myImpl;

    public function __construct(UserHistoryControllerImpl $impl) {
        parent::__construct();
        $this->myImpl = $impl;
    }

    /**
     * Get the change history of a user
     *
     * @param $userId
     * @param $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHistory($userId, $page) {
        $logsSql = LogSitecp::where('contentId', $userId)->whereIn('action', $this->myImpl->getSupportedActionIds());
        $total = DataHelper::getPage($logsSql->count());
        $items = $logsSql->orderBy('createdAt', 'DESC')->take($this->perPage)->skip(DataHelper::getOffset($page))->get();

        return response()->json([
            'total' => $total,
            'page' => $page,
            'userId' => $userId,
            'items' => $items->map(function ($item) {
                return $this->myImpl->mapItem($item);
            })
        ]);
    }
}