<?php

namespace App\Http\Controllers\Admin\User;

use App\EloquentModels\RequestThc;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\CreditsService;
use App\Utils\Condition;
use Illuminate\Http\Request;

class UserThcController extends Controller {
    private $creditsService;

    /**
     * UserThcController constructor.
     *
     * @param CreditsService $creditsService
     */
    public function __construct(CreditsService $creditsService) {
        parent::__construct();
        $this->creditsService = $creditsService;
    }

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
        Condition::precondition(!UserHelper::canManageUser($user, $userId),
            400, 'Can not edit a user with same or higher immunity');

        $this->creditsService->setUserCredits($current->userId, $credits);
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
                $this->creditsService->giveCredits($requestThc->receiverId, $requestThc->amount);
            }
            $requestThc->isDeleted = true;
            $requestThc->save();
        }

        Logger::admin($user->userId, $request->ip(), Action::MANAGED_THC_REQUESTS);
        return response()->json();
    }
}
