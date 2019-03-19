<?php

namespace App\Http\Controllers\Auth;

use App\EloquentModels\User\ForgotPassword;
use App\EloquentModels\User\User;
use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\Services\HabboService;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ForgotPasswordController extends Controller {
    private $codeLifeTime = 3600;
    private $authService;
    private $habboService;

    /**
     * AuthController constructor.
     *
     * @param AuthService $authService
     * @param HabboService $habboService
     */
    public function __construct (AuthService $authService, HabboService $habboService) {
        parent::__construct();
        $this->authService = $authService;
        $this->habboService = $habboService;
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request) {
        $userId = $request->input('userId');
        $password = $request->input('password');
        $repassword = $request->input('repassword');
        $user = User::find($userId);

        Condition::precondition(!$this->authService->isPasswordValid($password), 400,
            'Password is not valid, it needs to be at least 8 characters long');
        Condition::precondition(!$this->authService->isRePasswordValid($password, $repassword),
            400, 'The re-password is not valid. Double check it.');
        Condition::precondition(!$user, 404, 'User was not found');

        $forgotPassword = ForgotPassword::where('userId', $user->userId)->orderBy('createdAt', 'DESC')->first();
        Condition::precondition($forgotPassword->createdAt->timestamp < (time() - $this->codeLifeTime), 400,
            'The code was only valid one hour, start over.');

        $habbo = $this->habboService->getHabboByName($user->habbo);
        Condition::precondition(!$habbo, 404, 'Habbo was not found');
        Condition::precondition($habbo->motto != 'thishabbo-' . $forgotPassword->code, 400,
            'Your habbo motto is incorrect, if you have changed give it a minute and click again');

        $user->password = Hash::make($password);
        $user->save();

        return response()->json();
    }

    /**
     * @param $habbo
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCodeForHabbo($habbo) {
        ForgotPassword::where('createdAt', '<', time() - $this->codeLifeTime)->delete();
        $code = $this->generateCode();

        $user = User::withHabbo($habbo)->first();
        Condition::precondition(!$user, 404, 'There is no user with this habbo');

        $forgotPassword = new ForgotPassword([
            'userId' => $user->userId,
            'code' => $code
        ]);
        $forgotPassword->save();

        return response()->json([
            'userId' => $user->userId,
            'code' => $code
        ]);
    }

    /**
     * Generate code
     *
     * @return string
     */
    private function generateCode () {
        $code = openssl_random_pseudo_bytes(4);
        $code = bin2hex($code);
        return implode('', str_split($code, 4));
    }
}
