<?php

namespace App\Http\Controllers\Sitecp\User;

use App\Constants\LogType;
use App\EloquentModels\Log\LogUser;
use App\EloquentModels\RequestThc;
use App\EloquentModels\User\User;
use App\EloquentModels\User\VoucherCode;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Providers\Service\CreditsService;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserThcController extends Controller {
    private $myCreditsService;

    public function __construct(CreditsService $creditsService) {
        parent::__construct();
        $this->myCreditsService = $creditsService;
    }

    /**
     * Get all the existing requests
     *
     * @return JsonResponse
     */
    public function getThcRequests() {
        return response()->json(
            RequestThc::all()->map(
                function ($request) {
                    return [
                        'requestThcId' => $request->requestThcId,
                        'amount' => $request->amount,
                        'reason' => $request->reason,
                        'receiver' => UserHelper::getUser($request->receiverId),
                        'requester' => UserHelper::getUser($request->requesterId)
                    ];
                }
            )
        );
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function updateUserCredits(Request $request) {
        $user = $request->get('auth');
        $data = (object) $request->input('data');
        $target = User::find($data->userId);
        Condition::precondition(!$target, 404, 'No user with that ID');
        Condition::precondition(!UserHelper::canManageUser($user, $target->userId), 400, 'You can not manage this user');

        $oldAmount = $this->myCreditsService->getUserCredits($target->userId);
        $this->myCreditsService->setCredits($target->userId, $data->credits);

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_USERS_THC,
            [
                'before' => $oldAmount,
                'after' => $data->credits
            ],
            $target->userId
        );

        return response()->json();
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function updateThcRequests(Request $request) {
        $user = $request->get('auth');
        $requests = $request->input('requests');

        foreach ($requests as $thcRequest) {
            $requestThc = RequestThc::find($thcRequest['requestThcId']);
            if (!$requestThc) {
                continue;
            }

            if ($thcRequest['isApproved']) {
                $this->myCreditsService->giveCredits($requestThc->receiverId, $requestThc->amount);
            }
            $requestThc->isDeleted = true;
            $requestThc->save();

            Logger::sitecp(
                $user->userId,
                $request->ip(),
                LogType::MANAGED_THC_REQUESTS,
                [
                    'forUser' => User::where('userId', $requestThc->receiverId)->value('nickname'),
                    'forUserId' => $requestThc->receiverId,
                    'amount' => $requestThc->amount,
                    'wasApproved' => $thcRequest['isApproved']
                ],
                $requestThc->requestThcId
            );
        }
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $page
     *
     * @return JsonResponse
     */
    public function getVoucherCodes(Request $request, $page) {
        $filter = $request->input('filter');
        $voucherCodeSql = VoucherCode::orderBy('createdAt', 'ASC');

        if ($filter) {
            $voucherCodeSql->where('note', 'LIKE', Value::getFilterValue($request, $filter));
        }

        $total = $voucherCodeSql->count('voucherCodeId');

        return response()->json(
            [
                'total' => PaginationUtil::getTotalPages($total),
                'page' => $page,
                'items' => $voucherCodeSql->orderBy('createdAt', 'ASC')->take($this->perPage)->skip(PaginationUtil::getOffset($page))
                    ->get()->map(
                        function ($item) {
                            $claimLog = $item->isActive ? null : LogUser::where('action', LogType::CLAIMED_VOUCHER_CODE['id'])
                                ->where('contentId', $item->voucherCodeId)
                                ->first();
                            return [
                                'voucherCodeId' => $item->voucherCodeId,
                                'code' => $item->code,
                                'note' => $item->note,
                                'claimer' => !$item->isActive && $claimLog ? UserHelper::getSlimUser($claimLog->userId) : null,
                                'value' => $item->value
                            ];
                        }
                    )->values()
            ]
        );
    }

    /**
     * @param  Request  $request
     * @param $voucherCodeId
     *
     * @return JsonResponse
     */
    public function deleteVoucherCode(Request $request, $voucherCodeId) {
        $user = $request->get('auth');
        $voucherCode = VoucherCode::find($voucherCodeId);

        Condition::precondition(!$voucherCodeId, 404, 'No voucher code with that ID');

        $voucherCode->isDeleted = true;
        $voucherCode->save();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::DELETED_VOUCHER_CODE,
            [],
            $voucherCode->voucherCodeId
        );
        return response()->json();
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createVoucherCode(Request $request) {
        $user = $request->get('auth');

        $note = $request->input('note');
        $value = $request->input('value');
        Condition::precondition(!isset($note) || empty($note), 400, 'Note can not be empty!');
        Condition::precondition(!isset($note) || empty($note), 400, 'Value can not be empty!');
        Condition::precondition(!is_numeric($value), 400, 'Value needs to be numeric');
        Condition::precondition($value < 0, 400, 'Value needs to be a positive number');

        $voucherCode = new VoucherCode(
            [
                'note' => $note,
                'code' => $this->generateCode(),
                'value' => $value
            ]
        );
        $voucherCode->save();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::CREATED_VOUCHER_CODE,
            [],
            $voucherCode->voucherCodeId
        );
        return response()->json(
            [
                'voucherCodeId' => $voucherCode->voucherCodeId,
                'code' => $voucherCode->code,
                'note' => $voucherCode->note,
                'claimer' => null,
                'value' => $voucherCode->value
            ]
        );
    }

    /**
     * Generate code
     *
     * @return string
     */
    private function generateCode() {
        $token = openssl_random_pseudo_bytes(8);
        $token = bin2hex($token);
        return implode('', str_split($token, 4));
    }
}
