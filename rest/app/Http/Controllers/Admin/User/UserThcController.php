<?php

namespace App\Http\Controllers\Admin\User;

use App\EloquentModels\RequestThc;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use Illuminate\Http\Request;

class UserThcController extends Controller {

    /**
     * @param Request $request
     * @param         $userId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateThc (Request $request, $userId) {
        $user = UserHelper::getUserFromRequest($request);
        $current = UserHelper::getUserFromId($userId);
        $credits = $request->input('credits');

        Condition::precondition($current->userId == 0, 404, 'User do not exist');
        Condition::precondition(!is_numeric($credits), 400, 'credits need to be a number');
        Condition::precondition($credits < 0, 'You can not have negative amount in credits');
        Condition::precondition(!UserHelper::canManageUser($user, $userId),
            400, 'Can not edit a user with same or higher immunity');

        $userData = UserHelper::getUserDataOrCreate($current->userId);
        $userData->credits = $credits;
        $userData->save();

        Logger::admin($user->userId, $request->ip(), Action::UPDATED_USERS_CREDITS, [
            'name' => $current->nickname,
            'amount' => $credits
        ]);
        return response()->json();
    }

    /**
     * Get all the existing requests
     * @return \Illuminate\Http\JsonResponse
     */
    public function getThcRequests () {
        return response()->json(RequestThc::all()->map(function ($request) {
            return [
                'requestThcId' => $request->requestThcId,
                'amount' => $request->amount,
                'reason' => $request->reason,
                'receiver' => UserHelper::getUser($request->receiverId),
                'requester' => UserHelper::getUser($request->requesterId)
            ];
        }));
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateThcRequests (Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $requests = $request->input('requests');

        foreach ($requests as $thcRequest) {
            $requestThc = RequestThc::find($thcRequest['requestThcId']);
            if (!$requestThc) {
                continue;
            }

            if ($thcRequest['isApproved']) {
                $receiverUserData = UserHelper::getUserDataOrCreate($requestThc->receiverId);
                $receiverUserData->credits += $requestThc->amount;
                $receiverUserData->save();
            }
            $requestThc->isDeleted = true;
            $requestThc->save();
        }

        Logger::admin($user->userId, $request->ip(), Action::MANAGED_THC_REQUESTS);
        return response()->json();
    }
}
