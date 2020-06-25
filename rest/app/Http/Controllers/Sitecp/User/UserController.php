<?php

namespace App\Http\Controllers\Sitecp\User;

use App\Constants\LogType;
use App\Constants\Permission\SiteCpPermissions;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\PostLike;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\User\Token;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserGroup;
use App\EloquentModels\User\UserItem;
use App\EloquentModels\User\VisitorMessage;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\User\CustomUserFields;
use App\Providers\Service\AuthService;
use App\Utils\Condition;
use App\Utils\Iterables;
use App\Utils\PaginationUtil;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller {
    private $myAuthService;

    public function __construct(AuthService $authService) {
        parent::__construct();
        $this->myAuthService = $authService;
    }

    /**
     * Method for merging users
     *
     * @param  Request  $request
     * @param $sourceNickname
     * @param $targetNickname
     *
     * @return JsonResponse
     */
    public function mergeUsers(Request $request, $sourceNickname, $targetNickname) {
        $user = $request->get('auth');

        Condition::precondition(
            !PermissionHelper::haveSitecpPermission($user->userId, SiteCpPermissions::CAN_MERGE_USERS),
            400,
            'You do not have permission!'
        );

        $sourceUser = User::withNickname($sourceNickname)->first();
        $targetUser = User::withNickname($targetNickname)->first();

        Condition::precondition(!$sourceUser, 404, 'Source user does not exist!');
        Condition::precondition(!$targetUser, 404, 'Target user does not exist!');

        Thread::where('userId', $sourceUser->userId)->update(
            [
                'userId' => $targetUser->userId
            ]
        );

        Post::where('userId', $sourceUser->userId)->update(
            [
                'userId' => $targetUser->userId
            ]
        );

        PostLike::where('userId', $sourceUser->userId)->update(
            [
                'userId' => $targetUser->userId
            ]
        );
        Timetable::where('userId', $sourceUser->userId)->update(['userId' => $targetUser->userId]);
        UserItem::where('userId', $sourceUser->userId)->update(['userId' => $targetUser->userId]);
        User::where('referralId', $sourceUser->userId)->update(['referralId' => $targetUser->userId]);
        VisitorMessage::where('userId', $sourceUser->userId)->orWhere('hostId', $sourceUser->userId)->update([
            'userId' => $targetUser->userId,
            'hostId' => $targetUser->userId
        ]);
        UserGroup::where('userId', $sourceUser->userId)->delete();

        $targetUser->posts += $sourceUser->posts;
        $targetUser->threads += $sourceUser->threads;
        $targetUser->likes += $sourceUser->likes;
        $targetUser->userdata->credits += $sourceUser->userdata->credits;
        $targetUser->userdata->xp += $sourceUser->userdata->xp;
        $targetUser->userdata->save();
        $sourceUser->userdata->delete();

        $targetUser->lastActivity = max($sourceUser->lastActivity, $targetUser->lastActivity);
        $targetUser->save();
        $sourceUser->delete();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::MERGED_USERS,
            [
                'sourceUser' => $sourceUser->toJson(),
                'targetUser' => $targetUser->toJson()
            ]
        );

        return response()->json();
    }

    /**
     * Get request to get all available users
     *
     * @param  Request  $request
     * @param $page
     *
     * @return JsonResponse
     */
    public function getUsers(Request $request, $page) {
        $nickname = $request->input('nickname');
        $habbo = $request->input('habbo');
        $user = $request->get('auth');
        $sortBy = $request->has('sortBy') ? $request->input('sortBy') : 'nickname';
        $sortOrder = $request->has('sortOrder') ? $request->input('sortOrder') : 'ASC';

        $getUserSql = User::select('users.nickname', 'users.userId', 'users.updatedAt', 'users.habbo', 'userdata.credits as credits')
            ->leftJoin('userdata', 'userdata.userId', '=', 'users.userId')
            ->orderBy($sortBy, $sortOrder);

        if ($nickname) {
            $getUserSql->where('users.nickname', 'LIKE', Value::getFilterValue($request, $nickname));
        }

        if ($habbo) {
            $getUserSql->where('users.habbo', 'LIKE', Value::getFilterValue($request, $habbo));
        }

        $total = PaginationUtil::getTotalPages($getUserSql->count('users.userId'), $this->bigPerPage);
        $canManageCredits = PermissionHelper::haveSitecpPermission($user->userId, SiteCpPermissions::CAN_MANAGE_CREDITS);
        $users = array_map(
            function ($user) use ($canManageCredits) {
                $user['credits'] = $canManageCredits && $user['credits'] ? $user['credits'] : 0;
                return $user;
            },
            Iterables::filter(
                $getUserSql->take($this->bigPerPage)->skip(PaginationUtil::getOffset($page, $this->bigPerPage))->get()->toArray(),
                function ($item) use ($user) {
                    return UserHelper::canManageUser($user, $item['userId']);
                }
            )
        );

        return response()->json(
            [
                'users' => $users,
                'page' => $page,
                'total' => $total
            ]
        );
    }

    /**
     * Get request to fetch the given user
     *
     * @param  Request  $request
     * @param $userId
     *
     * @return JsonResponse
     */
    public function getUserBasic(Request $request, $userId) {
        $user = $request->get('auth');
        $current = User::find($userId);

        Condition::precondition(
            !UserHelper::canManageUser($user, $userId),
            400,
            'You can not edit this user'
        );

        $customFields = new CustomUserFields(UserHelper::getUserDataOrCreate($userId)->customFields);
        return response()->json(
            [
                'user' => [
                    'userId' => $current->userId,
                    'nickname' => $current->nickname,
                    'habbo' => $current->habbo
                ],
                'customFields' => [
                    'role' => $customFields->role
                ]
            ]
        );
    }

    /**
     * Update request to update basic user
     *
     * @param  Request  $request
     * @param $userId
     *
     * @return JsonResponse
     */
    public function updateUserBasic(Request $request, $userId) {
        $user = $request->get('auth');
        $current = User::find($userId);
        $userData = UserHelper::getUserDataOrCreate($userId);
        $newUser = (object) $request->input('user');
        $role = $request->input('role');

        Condition::precondition(
            !UserHelper::canManageUser($user, $userId),
            400,
            'You do not have high enough immunity!'
        );

        $shouldCheckPassword = isset($newUser->password) && strlen($newUser->password) > 0 && isset($newUser->repassword) &&
            PermissionHelper::haveSitecpPermission($user->userId, SiteCpPermissions::CAN_EDIT_USER_ADVANCED);
        $this->basicUserConditionCollection($current, $newUser, $shouldCheckPassword);

        $beforeHabbo = $current->habbo;
        $beforeNickname = $current->nickname;
        if ($shouldCheckPassword) {
            $current->password = Hash::make($newUser->password);
        }

        if (PermissionHelper::haveSitecpPermission($user->userId, SiteCpPermissions::CAN_EDIT_USER_BASICS)) {
            $current->nickname = $newUser->nickname;
            $current->habbo = $newUser->habbo;

            $customFields = new CustomUserFields($userData->customFields);
            $customFields->role = isset($role) && !empty($role) ? $role : null;
            $userData->customFields = json_encode($customFields);
            $userData->save();
        }
        $current->save();

        if ($shouldCheckPassword) {
            Token::where('userId', $current->userId)->delete();
        }

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_USERS_BASIC_SETTINGS,
            [
                'beforeNickname' => $beforeNickname,
                'afterNickname' => $current->nickname,
                'beforeHabbo' => $beforeHabbo,
                'afterHabbo' => $current->habbo
            ],
            $current->userId
        );
        return response()->json();
    }

    /**
     * Collection of conditions for updating a basic user
     *
     * @param $user
     * @param $newUser
     * @param $shouldCheckPassword
     */
    private function basicUserConditionCollection($user, $newUser, $shouldCheckPassword) {
        if (!PermissionHelper::haveSitecpPermission($user->userId, SiteCpPermissions::CAN_EDIT_USER_BASICS)) {
            return;
        }

        Condition::precondition(!$user, 404, 'Given user do not exist!');
        Condition::precondition(!$newUser, 404, 'No data supplied!');

        $isNickNameSame = isset($newUser->nickname) && $user->nickname == $newUser->nickname;
        Condition::precondition(
            !$isNickNameSame && !$this->myAuthService->isNicknameValid($newUser->nickname, $user),
            400,
            'Nickname is not valid or i!'
        );

        Condition::precondition(
            $shouldCheckPassword && !$this->myAuthService->isPasswordValid($newUser->password),
            400,
            'Password not valid'
        );
        Condition::precondition(
            $shouldCheckPassword && !$this->myAuthService->isRePasswordValid($newUser->repassword, $newUser->password),
            400,
            'Re-password not valid'
        );
        Condition::precondition(!isset($newUser->habbo) || empty($newUser->habbo), 400, 'A Habbo needs to be set!');
        Condition::precondition(
            User::withHabbo($newUser->habbo)->where('userId', '!=', $user->userId)->count() > 0,
            400,
            'Habbo is already taken'
        );
    }
}
