<?php

namespace App\Http\Controllers\Sitecp\User;

use App\EloquentModels\Log\LogUser;
use App\EloquentModels\RequestThc;
use App\EloquentModels\User\VoucherCode;
use App\Helpers\DataHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\CreditsService;
use App\Utils\Condition;
use App\Utils\Value;
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
     * Get all the existing requests
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getThcRequests() {
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
    public function updateThcRequests(Request $request) {
        $user = $request->get('auth');
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

        Logger::sitecp($user->userId, $request->ip(), Action::MANAGED_THC_REQUESTS);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getVoucherCodes(Request $request, $page) {
        $filter = $request->input('filter');
        $voucherCodeSql = VoucherCode::orderBy('createdAt', 'ASC');

        if ($filter) {
            $voucherCodeSql->where('note', 'LIKE', Value::getFilterValue($request, $filter));
        }

        $total = $voucherCodeSql->count('voucherCodeId');

        return response()->json([
            'total' => DataHelper::getPage($total),
            'page' => $page,
            'items' => $voucherCodeSql->orderBy('createdAt', 'ASC')->take($this->perPage)->skip(DataHelper::getOffset($page))
                ->get()->map(function ($item) {
                    $claimLog = LogUser::where('action', Action::CLAIMED_VOUCHER_CODE['id'])
                        ->where('contentId', $item->voucherCodeId)
                        ->first();
                    return [
                        'voucherCodeId' => $item->voucherCodeId,
                        'code' => $item->code,
                        'note' => $item->note,
                        'claimer' => !$item->isActive && $claimLog ? UserHelper::getSlimUser($claimLog->userId) : null,
                        'value' => $item->value
                    ];
                })
        ]);
    }

    /**
     * @param Request $request
     * @param $voucherCodeId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteVoucherCode(Request $request, $voucherCodeId) {
        $user = $request->get('auth');
        $voucherCode = VoucherCode::find($voucherCodeId);

        Condition::precondition(!$voucherCodeId, 404, 'No voucher code with that ID');

        $voucherCode->isDeleted = true;
        $voucherCode->save();

        Logger::sitecp($user->userId, $request->ip(), Action::DELETED_VOUCHER_CODE,
            [], $voucherCode->voucherCodeId);
        return response()->json();
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createVoucherCode(Request $request) {
        $user = $request->get('auth');

        $note = $request->input('note');
        $value = $request->input('value');
        Condition::precondition(!isset($note) || empty($note), 400, 'Note can not be empty!');
        Condition::precondition(!isset($note) || empty($note), 400, 'Value can not be empty!');
        Condition::precondition(!is_numeric($value), 400, 'Value needs to be numeric');
        Condition::precondition($value < 0, 400, 'Value needs to be a positive number');

        $voucherCode = new VoucherCode([
            'note' => $note,
            'code' => $this->generateCode(),
            'value' => $value
        ]);
        $voucherCode->save();

        Logger::sitecp($user->userId, $request->ip(), Action::CREATED_VOUCHER_CODE,
            [], $voucherCode->voucherCodeId);
        return response()->json([
            'voucherCodeId' => $voucherCode->voucherCodeId,
            'code' => $voucherCode->code,
            'note' => $voucherCode->note,
            'claimer' => null,
            'value' => $voucherCode->value
        ]);
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
