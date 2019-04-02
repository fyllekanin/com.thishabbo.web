<?php

namespace App\Http\Controllers\Auth;

use App\EloquentModels\Ban;
use App\EloquentModels\Forum\ForumPermission;
use App\EloquentModels\User\Token;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\AuthService;
use App\Services\HabboService;
use App\Services\BotService;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AuthController extends Controller {
    private $accessTokenLifetime = 5400;
    private $refreshTokenLifetime = 86400;

    private $botService;
    private $authService;
    private $habboService;

    /**
     * AuthController constructor.
     *
     * @param BotService $botService
     * @param AuthService $authService
     * @param HabboService $habboService
     */
    public function __construct (BotService $botService, AuthService $authService, HabboService $habboService) {
        parent::__construct();
        $this->botService = $botService;
        $this->authService = $authService;
        $this->habboService = $habboService;
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRegisterPage () {
        return response()->json([
            'nicknames' => User::pluck('nickname'),
            'usernames' => User::pluck('username')
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function acceptGdpr(Request $request) {
        $user = UserHelper::getUserFromRequest($request);

        $user->gdpr = 1;
        $user->save();

        return response()->json();
    }

    /**
     * Register POST method
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function register (Request $request) {
        $data = (object)$request->input('data');
        $data->username = trim($data->username);
        $data->nickname = trim($data->nickname);

        $this->registerValidation($data);

        $referralId = 0;
        if (isset($data->referredBy) && !empty($data->referredBy)) {
            $user = User::withNickname($data->referredBy)->first();
            if ($user) {
                $referralId = $user->userId;
            }
        }

        $password = Hash::make($data->password);
        $user = new User([
            'username' => $data->username,
            'nickname' => $data->nickname,
            'habbo' => $data->habbo,
            'gdpr' => true,
            'password' => $password,
            'referralId' => $referralId,
            'createdAt' => time(),
            'updatedAt' => time()
        ]);
        $user->save();

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $userData->save();

        $this->botService->triggerWelcomeBot($user);
        Logger::user($user->userId, $request->ip(), Action::REGISTERED, ['name' => $user->nickname]);
        return response()->json();
    }

    /**
     * Get request for refreshing the access and refresh token and
     * getting the updated one back with user information.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh (Request $request) {
        $refreshToken = $request->header('RefreshAuthorization');
        $authorization = $request->header('Authorization');
        $parts = explode(' ', $authorization);
        Condition::precondition(count($parts) < 2, 400);
        $accessToken = $parts[1];

        $token = Token::where('accessToken', $accessToken)
            ->where('ip', $request->ip())
            ->where('refreshToken', $refreshToken)
            ->first();

        if (!$token || ($token->expiresAt + $this->refreshTokenLifetime) < time()) {
            throw new HttpException(401);
        }

        $user = User::find($token->userId);
        $expiresAt = time() + $this->accessTokenLifetime;
        $accessToken = $this->generateToken();
        $refreshToken = $this->generateToken();
        $this->updateOrSetUserToken($user->userId, $accessToken, $refreshToken, $expiresAt, $request);

        return response()->json([
            'adminPermissions' => self::buildAdminPermissions($user),
            'staffPermissions' => self::buildStaffPermissions($user),
            'oauth' => [
                'accessToken' => $accessToken,
                'expiresIn' => $this->accessTokenLifetime,
                'refreshToken' => $refreshToken
            ],
            'userId' => $user->userId,
            'nickname' => $user->nickname,
            'gdpr' => $user->gdpr,
            'homePage' => UserHelper::getUserDataOrCreate($user->userId)->homePage
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUser(Request $request) {
        $authorization = $request->header('Authorization');
        $parts = explode(' ', $authorization);
        $accessToken = isset($parts) && count($parts) > 1 ? $parts[1] : '';
        $token = Token::where('accessToken', $accessToken)->where('ip', $request->ip())->first();
        if (!$token) {
            return response()->json();
        }

        $expiresAt = time() + $this->accessTokenLifetime;
        $token = $this->updateOrSetUserToken($token->userId, $this->generateToken(), $this->generateToken(), $expiresAt, $request);

        $user = User::find($token->userId);
        return response()->json([
            'adminPermissions' => self::buildAdminPermissions($user),
            'staffPermissions' => self::buildStaffPermissions($user),
            'oauth' => [
                'accessToken' => $token->accessToken,
                'expiresIn' => $this->accessTokenLifetime,
                'refreshToken' => $token->refreshToken
            ],
            'userId' => $user->userId,
            'nickname' => $user->nickname,
            'gdpr' => $user->gdpr,
            'homePage' => UserHelper::getUserDataOrCreate($user->userId)->homePage
        ]);
    }

    /**
     * Performs a logout operation
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout (Request $request) {
        $authorization = $request->header('Authorization');
        $parts = explode(' ', $authorization);
        if (count($parts) < 2) {
            return response()->json(['status' => 'success']);
        }
        $accessToken = $parts[1];
        $token = Token::where('accessToken', $accessToken)->where('ip', $request->ip())->first();

        if (!$token) {
            return response()->json(['status' => 'success']);
        }

        Token::where('accessToken', $accessToken)->where('ip', $request->ip())->delete();
        return response()->json(['status' => 'success']);
    }

    /**
     * Perform login operation
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login (Request $request) {
        $loginName = $request->input('loginName');
        $password = $request->input('password');

        Condition::precondition(!isset($loginName) || empty($loginName), 400, 'Please input your Username or Habbo Name!');
        Condition::precondition(!isset($password) || empty($password), 400, 'Please input your Password!');

        $userId = $this->findUser($loginName, $password);
        Condition::precondition(!$userId, 404, 'Invalid username or Password');

        $user = User::where('users.userId', $userId)
            ->leftJoin('userdata', 'userdata.userId', '=', 'users.userId')
            ->select('users.*', 'userdata.avatarUpdatedAt')
            ->first();

        if (!$user || !Hash::check($password, $user->password)) {
            Logger::login($user ? $user->userId : null, $request->ip(), false);
            Condition::precondition(true, 400, 'nickname or Password are incorrect');
        }

        $ban = Ban::isBanned($user->userId)->first();
        if ($ban) {
            Logger::login($user->userId, $request->ip(), false);
            $message = $ban->expiresAt == 0 ? 'This account is permanent banned' : sprintf('This account is banned until % s UTC',
                date('l jS \of F Y h:i:s A', $ban->expiresAt));

            Condition::precondition(true, 400, $message);
        }

        // User exist & credentials are correct
        $expiresAt = time() + $this->accessTokenLifetime;
        $accessToken = $this->generateToken();
        $refreshToken = $this->generateToken();
        $this->updateOrSetUserToken($user->userId, $accessToken, $refreshToken, $expiresAt, $request);

        Logger::login($user->userId, $request->ip(), true);
        return response()->json([
            'adminPermissions' => self::buildAdminPermissions($user),
            'staffPermissions' => self::buildStaffPermissions($user),
            'oauth' => [
                'accessToken' => $accessToken,
                'expiresIn' => $this->accessTokenLifetime,
                'refreshToken' => $refreshToken
            ],
            'userId' => $user->userId,
            'nickname' => $user->nickname,
            'gdpr' => $user->gdpr,
            'homePage' => UserHelper::getUserDataOrCreate($user->userId)->homePage
        ]);
    }

    /**
     * @param $loginName
     * @param $password
     *
     * @return null
     */
    private function findUser ($loginName, $password) {
        $userWithUsername = User::withUsername($loginName)->first();
        $userWithHabbo = User::withHabbo($loginName)->first();

        if ($userWithUsername && Hash::check($password, $userWithUsername->password)) {
            return $userWithUsername->userId;
        } else if ($userWithHabbo && Hash::check($password, $userWithHabbo->password)) {
            return $userWithHabbo->userId;
        }
        return null;
    }

    /**
     * Generate token
     *
     * @return string
     */
    private function generateToken () {
        $token = openssl_random_pseudo_bytes(24);
        $token = bin2hex($token);
        return implode('', str_split($token, 4));
    }

    /**
     * Update token for user
     *
     * @param $userId
     * @param $accessToken
     * @param $refreshToken
     * @param $expiresAt
     * @param $request
     *
     * @return Token
     */
    private function updateOrSetUserToken ($userId, $accessToken, $refreshToken, $expiresAt, $request) {
        Token::where('userId', $userId)
            ->where('ip', $request->ip())
            ->delete();

        try {
            $token = new Token([
                'userId' => $userId,
                'ip' => $request->ip(),
                'accessToken' => $accessToken,
                'refreshToken' => $refreshToken,
                'expiresAt' => $expiresAt
            ]);
            $token->save();
            return $token;
        } catch (\Exception $e) {
            $this->updateOrSetUserToken($userId, $accessToken, $refreshToken, $expiresAt, $request);
        }
    }

    /**
     * @param $data
     */
    private function registerValidation ($data) {
        Condition::precondition(!isset($data->gdpr) || !$data->gdpr, 400, 'You need to accept GDPR to sign up');
        Condition::precondition(!$this->authService->isNicknameValid($data->nickname),
            400, 'Nickname is not valid');
        Condition::precondition(!$this->authService->isUsernamevalid($data->username),
            400, 'Username is not valid');
        Condition::precondition(!$this->authService->isPasswordValid($data->password),
            400, 'Password must be at least 8 characters long');
        Condition::precondition(!$this->authService->isRePasswordValid($data->repassword, $data->password),
            400, 'The passwords entered do not match');
        Condition::precondition(!isset($data->habbo) || empty($data->habbo), 400, 'Habbo needs to be set');

        $habbo = $this->habboService->getHabboByName($data->habbo);
        Condition::precondition(!$habbo, 404, 'There is no Habbo with that name!');
        Condition::precondition($habbo->motto != 'thishabbo-register', 400, 'Your motto needs to be "thishabbo-register"');
        Condition::precondition(User::withHabbo($data->habbo)->count() > 0, 400, 'The Habbo Name is already taken. Contact Support!');

        $oneMonthAgo = time() - 2419200;
        Condition::precondition(strtotime($habbo->memberSince) > $oneMonthAgo, 400, 'Your Habbo needs to be at least one month old! Contact Support!');
    }

    /**
     * @param $user
     *
     * @return array
     */
    private function buildAdminPermissions ($user) {
        $obj = ['isAdmin' => false];
        $adminPermissions = ConfigHelper::getAdminConfig();
        $forumPermissions = ConfigHelper::getForumConfig();

        // General admin permissions
        foreach ($adminPermissions as $key => $value) {
            $obj[$key] = PermissionHelper::haveAdminPermission($user->userId, $value);
        }

        // Moderation permissions
        $obj['canModerateThreads'] = PermissionHelper::isSuperAdmin($user->userId) ||
            ForumPermission::withGroups($user->groupIds)
                ->withPermission($forumPermissions->canApproveThreads)
                ->count() > 0;
        $obj['canModeratePosts'] = PermissionHelper::isSuperAdmin($user->userId) ||
            ForumPermission::withGroups($user->groupIds)
                ->withPermission($forumPermissions->canApprovePosts)
                ->count() > 0;
        $obj['canManagePolls'] = PermissionHelper::isSuperAdmin($user->userId) ||
            ForumPermission::withGroups($user->groupIds)
                ->withPermission($forumPermissions->canManagePolls)
                ->count() > 0;

        foreach ($obj as $key => $value) {
            if ($value) {
                $obj['isAdmin'] = true;
                break;
            }
        }

        return $obj;
    }

    /**
     * @param $user
     *
     * @return array
     */
    private function buildStaffPermissions ($user) {
        $obj = [];
        $staffPermissions = ConfigHelper::getStaffConfig();

        foreach ($staffPermissions as $key => $value) {
            $obj[$key] = PermissionHelper::haveStaffPermission($user->userId, $value);
        }

        foreach ($obj as $key => $value) {
            if ($value) {
                $obj['isStaff'] = true;
                break;
            }
        }

        return $obj;
    }
}