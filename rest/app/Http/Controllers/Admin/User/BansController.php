<?php

namespace App\Http\Controllers\Admin\User;

use App\EloquentModels\User\Ban;
use App\EloquentModels\User\Token;
use App\EloquentModels\User\User;
use App\Helpers\DataHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class BansController extends Controller {

    /**
     * @param         $userId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserBans ($userId) {
        $user = Cache::get('auth');
        $current = UserHelper::getSlimUser($userId);

        Condition::precondition(!$current, 404, 'User do not exist');
        Condition::precondition(!UserHelper::canManageUser($user, $userId),
            400, 'You can not see this user');

        return response()->json([
            'user' => $current,
            'bans' => Ban::where('bannedId', $userId)->get()->map(function ($ban) {
                return $this->mapBan($ban);
            })
        ]);
    }

    /**
     * @param Request $request
     * @param         $userId
     *
     * @return array
     */
    public function createUserBan (Request $request, $userId) {
        $user = Cache::get('auth');
        $current = UserHelper::getUser($userId);
        $banData = (object)$request->input('reason');

        Condition::precondition(!$current, 404, 'User do not exist');
        Condition::precondition(!UserHelper::canManageUser($user, $userId),
            400, 'You can not see this user');
        Condition::precondition(!is_numeric($banData->length) || $banData->length < 0, 400, 'Invalid length');
        Condition::precondition(!isset($banData->reason) || empty($banData->reason), 400, 'Invalid reason');

        $ban = new Ban([
            'bannedId' => $userId,
            'userId' => $user->userId,
            'reason' => $banData->reason,
            'expiresAt' => $banData->length == 0 ? 0 : time() + $banData->length
        ]);
        $ban->save();

        Token::where('userId', $userId)->delete();

        Logger::admin($user->userId, $request->ip(), Action::BANNED_USER, ['name' => $current->nickname]);
        return response()->json($this->mapBan($ban));
    }

    /**
     * @param Request $request
     * @param         $userId
     * @param         $banId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function liftUserBan (Request $request, $userId, $banId) {
        $user = Cache::get('auth');
        $current = UserHelper::getUser($userId);
        $ban = Ban::find($banId);
        $liftData = (object)$request->input('reason');

        Condition::precondition(!$ban, 404, 'The ban do not exist');
        Condition::precondition(!$current, 404, 'User do not exist');
        Condition::precondition(!UserHelper::canManageUser($user, $userId),
            400, 'You can not see this user');
        Condition::precondition(!isset($liftData->reason) || empty($liftData->reason), 400, 'Invalid reason');

        $ban->lifterId = $user->userId;
        $ban->isLifted = true;
        $ban->liftReason = $liftData->reason;
        $ban->save();

        Logger::admin($user->userId, $request->ip(), Action::UNBANNED_USER, ['name' => $current->nickname]);
        return response()->json($this->mapBan($ban));
    }

    /**
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBannedUsers (Request $request, $page) {
        $user = Cache::get('auth');
        $filter = $request->input('nickname');
        $bansSql = Ban::active()->withImmunityLessThan(User::getImmunity($user->userId))->withNicknameLike($filter);
        $total = DataHelper::getPage($bansSql->count());
        $bans = $bansSql->take($this->perPage)->skip($this->getOffset($page))->get()->map(function ($ban) {
            return $this->mapBan($ban);
        });

        return response()->json([
            'page' => $page,
            'total' => $total,
            'bans' => $bans
        ]);
    }

    private function mapBan ($ban) {
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
