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
use App\Services\HabboService;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\PostLike;

class UserController extends Controller {
    private $authService;
    private $habboService;

    /**
     * UserController constructor.
     *
     * @param AuthService  $authService
     * @param HabboService $habboService
     */
    public function __construct (AuthService $authService, HabboService $habboService) {
        parent::__construct();
        $this->authService = $authService;
        $this->habboService = $habboService;
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
        $user = UserHelper::getUserFromRequest($request);

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
        $user = UserHelper::getUserFromRequest($request);

        $getUserSql = User::select('users.nickname', 'users.userId', 'users.updatedAt', 'userdata.habbo')
            ->leftJoin('userdata', 'userdata.userId', '=', 'users.userId')
            ->orderBy('nickname', 'ASC');

        if ($habbo) {
            $getUserSql->where('userdata.habbo', 'LIKE', '%' . $habbo . '%');
        }

        if ($nickname) {
            $getUserSql->where('users.nickname', 'LIKE', '%' . $nickname . '%');
        }

        $users = array_map(function ($user) {
            $user['credits'] = UserHelper::getUserDataOrCreate($user['userId'])->credits;
            return $user;
        }, Iterables::filter($getUserSql->take($this->perPage)->skip($this->getOffset($page))->get()->toArray(), function ($item) use ($user) {
            return UserHelper::canManageUser($user, $item['userId']);
        }));

        return response()->json([
            'users' => $users,
            'page' => $page,
            'total' => ceil($getUserSql->count() / $this->perPage)
        ]);
    }

    /**
     * Get request to fetch the given user
     *
     * @param Request $request
     * @param         $userId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserBasic (Request $request, $userId) {
        $user = UserHelper::getUserFromRequest($request);
        $current = UserHelper::getUserFromId($userId);

        Condition::precondition(!UserHelper::canManageUser($user, $userId),
            400, 'You can not edit this user');

        $userData = UserHelper::getUserDataOrCreate($current->userId);
        $current->habbo = $userData->habbo;

        return response()->json([
            'user' => [
                'userId' => $current->userId,
                'nickname' => $current->nickname,
                'habbo' => $current->habbo,
                'email' => $current->email
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
        $user = UserHelper::getUserFromRequest($request);
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

        if ($shouldCheckPassword) {
            $current->password = Hash::make($newUser->password);
        }

        if (PermissionHelper::haveAdminPermission($user->userId, ConfigHelper::getAdminConfig()->canEditUserBasic)) {
            $current->nickname = $newUser->nickname;
            $current->email = $newUser->email;
            $userData = UserHelper::getUserDataOrCreate($current->userId);
            $userData->habbo = $newUser->habbo;
            $userData->habboCheckedAt = time();
            $userData->save();
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

        Condition::precondition(!$this->authService->isEmailValid($newUser->email), 400, 'Email is not valid or taken');
        Condition::precondition(!isset($newUser->nickname) || ($user->nickname != $newUser->nickname && !$this->authService->isNicknameValid($newUser->nickname)),
            400, 'nickname is not valid');

        Condition::precondition(!isset($newUser->habbo) || empty($newUser->habbo), 400, 'Habbo name can not be empty');
    }
}
