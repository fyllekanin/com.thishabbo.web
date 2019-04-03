<?php

namespace App\Http\Controllers\Admin\User;

use App\EloquentModels\RequestThc;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\CreditsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

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
        $user = Cache::get('auth');
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
