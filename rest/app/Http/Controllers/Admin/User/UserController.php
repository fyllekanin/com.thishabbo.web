<?php

namespace App\Http\Controllers\Admin\User;

use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\AuthService;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\PostLike;

class UserController extends Controller {
    private $authService;

    /**
     * UserController constructor.
     *
     * @param AuthService  $authService
     */
    public function __construct (AuthService $authService) {
        parent::__construct();
        $this->authService = $authService;
    }

    /**
     * Method for merging users
     *
     * @param Request $request
     * @param         $srcNickname
     * @param         $destNickname
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function mergeUsers (Request $request, $srcNickname, $destNickname) {
        $user = Cache::get('auth');

        Condition::precondition(!PermissionHelper::haveAdminPermission($user->userId, ConfigHelper::getAdminConfig()->canMergeUsers), 400, 'You do not have permission!');

        $srcUser = User::withNickname($srcNickname)->first();
        $destUser = User::withNickname($destNickname)->first();

        Condition::precondition(!$srcUser, 404, 'Source user does not exist');
        Condition::precondition(!$destUser, 404, 'Destination user does not exist');

        Thread::where('userId', $srcUser->userId)->update([
            'userId' => $destUser->userId
        ]);

        Post::where('userId', $srcUser->userId)->update([
            'userId' => $destUser->userId
        ]);

        PostLike::where('userId', $srcUser->userId)->update([
            'userId' => $destUser->userId
        ]);

        $destUser->posts += $srcUser->posts;
        $destUser->threads += $srcUser->threads;
        $destUser->likes += $srcUser->likes;
        $destUser->lastActivity = max($srcUser->lastActivity, $destUser->lastActivity);
        $destUser->save();
        $srcUser->delete();

        Logger::admin($user->userId, $request->ip(), Action::MERGED_USERS, ['srcUser' => $srcUser->userId, 'destUser' => $destUser->userId]);

        return response()->json();
    }

    /**
     * Get request to get all available users
     *
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUsers (Request $request, $page) {
        $nickname = $request->input('nickname');
        $habbo = $request->input('habbo');
        $user = Cache::get('auth');

        $getUserSql = User::select('nickname', 'userId', 'updatedAt', 'habbo')
            ->orderBy('nickname', 'ASC');

        if ($nickname) {
            $getUserSql->where('nickname', 'LIKE', '%' . $nickname . '%');
        }

        if ($habbo) {
            $getUserSql->where('habbo', 'LIKE', '%' . $habbo . '%');
        }

        $total = ceil($getUserSql->count() / $this->perPage);
        $users = array_map(function ($user) {
            $user['credits'] = UserHelper::getUserDataOrCreate($user['userId'])->credits;
            return $user;
        }, Iterables::filter($getUserSql->take($this->perPage)->skip($this->getOffset($page))->get()->toArray(), function ($item) use ($user) {
            return UserHelper::canManageUser($user, $item['userId']);
        }));

        return response()->json([
            'users' => $users,
            'page' => $page,
            'total' => $total
        ]);
    }

    /**
     * Get request to fetch the given user
     *
     * @param         $userId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserBasic ($userId) {
        $user = Cache::get('auth');
        $current = UserHelper::getUserFromId($userId);

        Condition::precondition(!UserHelper::canManageUser($user, $userId),
            400, 'You can not edit this user');

        return response()->json([
            'user' => [
                'userId' => $current->userId,
                'nickname' => $current->nickname,
                'habbo' => $current->habbo
            ]
        ]);
    }

    /**
     * Update request to update basic user
     *
     * @param Request $request
     * @param         $userId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateUserBasic (Request $request, $userId) {
        $user = Cache::get('auth');
        $current = User::find($userId);
        $newUser = (object)$request->input('user');

        Condition::precondition(!UserHelper::canManageUser($user, $userId),
            400, 'You do not have high enough immunity');

        $this->basicUserConditionCollection($current, $newUser);
        $shouldCheckPassword = isset($newUser->password) && strlen($newUser->password) > 0 &&
            PermissionHelper::haveAdminPermission($user->userId, ConfigHelper::getAdminConfig()->canEditUserAdvanced);
        Condition::precondition($shouldCheckPassword && !$this->authService->isPasswordValid($newUser->password),
            400, 'Password not valid');
        Condition::precondition($shouldCheckPassword && !$this->authService->isRePasswordValid($newUser->repassword, $newUser->password),
            400, 'Re-password not valid');
        Condition::precondition(!isset($newUser->habbo) || empty($newUser->habbo), 400, 'Habbo needs to be set');

        if ($shouldCheckPassword) {
            $current->password = Hash::make($newUser->password);
        }

        if (PermissionHelper::haveAdminPermission($user->userId, ConfigHelper::getAdminConfig()->canEditUserBasic)) {
            $current->nickname = $newUser->nickname;
            $current->habbo = $newUser->habbo;
        }
        $current->save();

        Logger::admin($user->userId, $request->ip(), Action::UPDATED_USERS_BASIC_SETTINGS,
            ['name' => $current->nickname, 'userId' => $current->userId]);
        return response()->json();
    }

    /**
     * Collection of conditions for updating a basic user
     *
     * @param $user
     * @param $newUser
     */
    private function basicUserConditionCollection ($user, $newUser) {
        if (!PermissionHelper::haveAdminPermission($user->userId, ConfigHelper::getAdminConfig()->canEditUserBasic)) {
            return;
        }

        Condition::precondition(!$user, 404, 'Given user do not exist');
        Condition::precondition(!$newUser, 404, 'No data supplied');

        Condition::precondition(!isset($newUser->nickname) || ($user->nickname != $newUser->nickname && !$this->authService->isNicknameValid($newUser->nickname)),
            400, 'nickname is not valid');
    }
}
