<?php

namespace App\Http\Controllers\Auth;

use App\EloquentModels\User\ForgotPassword;
use App\EloquentModels\User\User;
use App\Http\Controllers\Controller;
use App\Providers\Service\AuthService;
use App\Providers\Service\HabboService;
use App\Utils\Condition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ForgotPasswordController extends Controller {
    private $codeLifeTime = 3600;
    private $myAuthService;
    private $myHabboService;

    public function __construct(AuthService $authService, HabboService $habboService) {
        parent::__construct();
        $this->myAuthService = $authService;
        $this->myHabboService = $habboService;
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function changePassword(Request $request) {
        $userId = $request->input('userId');
        $password = $request->input('password');
        $repassword = $request->input('repassword');
        $user = User::find($userId);

        Condition::precondition(
            !$this->myAuthService->isPasswordValid($password),
            400,
            'Password is not valid, it needs to be at least 8 characters long'
        );
        Condition::precondition(
            !$this->myAuthService->isRePasswordValid($password, $repassword),
            400,
            'The re-password is not valid. Double check it.'
        );
        Condition::precondition(!$user, 404, 'User was not found');

        $forgotPassword = ForgotPassword::where('userId', $user->userId)->orderBy('createdAt', 'DESC')->first();
        Condition::precondition(
            $forgotPassword->createdAt->timestamp < (time() - $this->codeLifeTime),
            400,
            'The code was only valid one hour, start over.'
        );

        $habbo = $this->myHabboService->getHabboByName($user->habbo);
        Condition::precondition(!$habbo, 404, 'Habbo was not found');
        Condition::precondition(
            $habbo->motto != 'thishabbo-'.$forgotPassword->code,
            400,
            'Your habbo motto is incorrect, if you have changed give it a minute and click again'
        );

        $user->password = Hash::make($password);
        $user->save();

        return response()->json();
    }

    /**
     * @param $habbo
     *
     * @return JsonResponse
     */
    public function getCodeForHabbo($habbo) {
        ForgotPassword::where('createdAt', '<', time() - $this->codeLifeTime)->delete();
        $code = $this->generateCode();

        $user = User::withHabbo($habbo)->first();
        Condition::precondition(!$user, 404, 'There is no user with this habbo');

        $forgotPassword = new ForgotPassword(
            [
                'userId' => $user->userId,
                'code' => $code
            ]
        );
        $forgotPassword->save();

        return response()->json(
            [
                'userId' => $user->userId,
                'code' => $code
            ]
        );
    }

    /**
     * Generate code
     *
     * @return string
     */
    private function generateCode() {
        $code = openssl_random_pseudo_bytes(4);
        $code = bin2hex($code);
        return implode('', str_split($code, 4));
    }
}
