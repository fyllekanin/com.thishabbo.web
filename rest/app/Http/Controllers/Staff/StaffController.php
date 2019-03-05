<?php

namespace App\Http\Controllers\Staff;

use App\EloquentModels\RequestThc;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserData;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;

class StaffController extends Controller {

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createRequestThc (Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $requests = $request->input('requests');
        $this->validateRequests($requests);

        foreach ($requests as $thcRequest) {
            $nickname = Value::arrayProperty($thcRequest, 'nickname', '');
            $account = User::withNickname($nickname)->first();
            if ($account->lastActivity < strtotime('-1 month')) {
                continue;
            }

            $newRequest = new RequestThc([
                'requesterId' => $user->userId,
                'receiverId' => $account->userId,
                'amount' => ceil($thcRequest['amount']),
                'reason' => $thcRequest['reason']
            ]);
            $newRequest->save();
        }

        Logger::staff($user->userId, $request->ip(), Action::REQUESTED_THC_FOR_USER, ['name' => $account->nickname]);
        return response()->json();
    }

    /**
     * Validates all the requests so they can be processed
     *
     * @param $requests
     */
    private function validateRequests ($requests) {
        foreach ($requests as $request) {
            Condition::precondition(!isset($request['nickname']) || empty($request['nickname']),
                400, 'nickname needs to be set');
            Condition::precondition(!is_numeric($request['amount']) || $request['amount'] < 1, 400,
                'The amount is not valid, 1 or more number is mandatory');
            Condition::precondition(!isset($request['reason']) || empty($request['reason']),
                400, 'Each row needs a reason');

            $nickname = Value::arrayProperty($request, 'nickname', '');
            $account = User::withNickname($nickname)->first();
            Condition::precondition(!$account, 404, sprintf('There is no account related with %s',
                $nickname));
        }
    }
}
