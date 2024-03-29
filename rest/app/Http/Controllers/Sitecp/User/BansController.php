<?php

namespace App\Http\Controllers\Sitecp\User;

use App\Constants\LogType;
use App\EloquentModels\User\Ban;
use App\EloquentModels\User\Token;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BansController extends Controller {

    /**
     * @param  Request  $request
     * @param $userId
     *
     * @return JsonResponse
     */
    public function getUserBans(Request $request, $userId) {
        $user = $request->get('auth');
        $current = UserHelper::getSlimUser($userId);

        Condition::precondition(!$current, 404, 'User do not exist');
        Condition::precondition(
            !UserHelper::canManageUser($user, $userId),
            400,
            'You can not see this user'
        );

        return response()->json(
            [
                'user' => $current,
                'bans' => Ban::where('bannedId', $userId)->get()->map(
                    function ($ban) {
                        return $this->mapBan($ban);
                    }
                )
            ]
        );
    }

    /**
     * @param  Request  $request
     * @param $userId
     *
     * @return array
     */
    public function createUserBan(Request $request, $userId) {
        $user = $request->get('auth');
        $current = UserHelper::getUser($userId);
        $banData = (object) $request->input('reason');

        Condition::precondition(!$current, 404, 'User do not exist');
        Condition::precondition(
            !UserHelper::canManageUser($user, $userId),
            400,
            'You can not see this user'
        );
        Condition::precondition(!is_numeric($banData->length) || $banData->length < 0, 400, 'Invalid length');
        Condition::precondition(!isset($banData->reason) || empty($banData->reason), 400, 'Invalid reason');

        $ban = new Ban(
            [
                'bannedId' => $userId,
                'userId' => $user->userId,
                'reason' => $banData->reason,
                'expiresAt' => $banData->length == 0 ? 0 : time() + $banData->length
            ]
        );
        $ban->save();

        Token::where('userId', $userId)->delete();

        Logger::sitecp($user->userId, $request->ip(), LogType::BANNED_USER, [], $userId);
        return response()->json($this->mapBan($ban));
    }

    /**
     * @param  Request  $request
     * @param $userId
     * @param $banId
     *
     * @return JsonResponse
     */
    public function liftUserBan(Request $request, $userId, $banId) {
        $user = $request->get('auth');
        $current = UserHelper::getUser($userId);
        $ban = Ban::find($banId);
        $liftData = (object) $request->input('reason');

        Condition::precondition(!$ban, 404, 'The ban do not exist');
        Condition::precondition(!$current, 404, 'User do not exist');
        Condition::precondition(
            !UserHelper::canManageUser($user, $userId),
            400,
            'You can not see this user'
        );
        Condition::precondition(!isset($liftData->reason) || empty($liftData->reason), 400, 'Invalid reason');

        $ban->lifterId = $user->userId;
        $ban->isLifted = true;
        $ban->liftReason = $liftData->reason;
        $ban->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::UNBANNED_USER, ['name' => $current->nickname], $current->userId);
        return response()->json($this->mapBan($ban));
    }

    /**
     * @param  Request  $request
     * @param $page
     *
     * @return JsonResponse
     */
    public function getBannedUsers(Request $request, $page) {
        $filter = $request->input('nickname');
        $bansSql = Ban::active()->withNicknameLike($filter);
        $total = PaginationUtil::getTotalPages($bansSql->count('banId'));
        $bans = $bansSql->take($this->perPage)->skip(PaginationUtil::getOffset($page))->get()->map(
            function ($ban) {
                return $this->mapBan($ban);
            }
        );

        return response()->json(
            [
                'page' => $page,
                'total' => $total,
                'bans' => $bans
            ]
        );
    }

    private function mapBan($ban) {
        return [
            'banId' => $ban->banId,
            'banner' => UserHelper::getSlimUser($ban->userId),
            'banned' => UserHelper::getSlimUser($ban->bannedId),
            'reason' => $ban->reason,
            'expiresAt' => $ban->expiresAt,
            'isLifted' => $ban->isLifted,
            'lifter' => $ban->lifterId ? UserHelper::getSlimUser($ban->lifterId) : null,
            'liftReason' => $ban->liftReason,
            'updatedAt' => $ban->updatedAt->timestamp
        ];
    }
}
