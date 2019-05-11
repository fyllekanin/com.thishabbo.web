<?php

namespace App\Http\Controllers\Staff;

use App\EloquentModels\RequestThc;
use App\EloquentModels\Staff\RadioRequest;
use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\User\User;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;

class StaffController extends Controller {

    /**
     * @param Request $request
     * @param $startOfWeek
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDashboardStats(Request $request, $startOfWeek) {
        $user = $request->get('auth');

        return response()->json([
            'general' => [
                'events' => Timetable::isActive()->events()->count('timetableId'),
                'radio' => Timetable::isActive()->radio()->count('timetableId'),
                'requests' => RadioRequest::where('createdAt', '>', $startOfWeek)->count('requestId'),
                'thc' => RequestThc::where('createdAt', '>', $startOfWeek)->count('requestThcId')
            ],
            'personal' => [
                'events' => $this->getNextEventsSlot($user),
                'radio' => $this->getNextRadioSlot($user)
            ]
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createRequestThc(Request $request) {
        $user = $request->get('auth');
        $requests = $request->input('requests');
        $this->validateRequests($requests);

        foreach ($requests as $thcRequest) {
            $nickname = Value::arrayProperty($thcRequest, 'nickname', '');
            $habbo = Value::arrayProperty($thcRequest, 'habbo', '');
            $account = $this->findAccount($nickname, $habbo);
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
            Logger::staff($user->userId, $request->ip(), Action::REQUESTED_THC_FOR_USER, ['name' => $account->nickname]);
        }

        return response()->json();
    }

    /**
     * Find an account based on nickname if not try habbo name
     *
     * @param $nickname
     * @param $habbo
     *
     * @return null|object
     */
    private function findAccount($nickname, $habbo) {
        $account = User::withNickname($nickname)->first();
        if ($account) {
            return $account;
        }
        return User::withHabbo($habbo)->first();
    }

    /**
     * Validates all the requests so they can be processed
     *
     * @param $requests
     */
    private function validateRequests($requests) {
        foreach ($requests as $request) {
            Condition::precondition(!isset($request['nickname']) && !isset($request['habbo']),
                400, 'nickname or habbo needs to be set');
            Condition::precondition(empty($request['nickname']) && empty($request['habbo']),
                400, 'nickname or habbo needs to be set');
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

    private function getNextEventsSlot($user) {
        $slot = Timetable::isActive()
            ->where('day', '>=', date('N'))
            ->where('hour', '>', date('G'))
            ->orderBy('day', 'ASC')
            ->orderBy('hour', 'ASC')
            ->where('userId', $user->userId)
            ->events()
            ->first();

        if (!$slot) {
            return null;
        }

        return [
            'day' => $slot->day,
            'hour' => $slot->hour
        ];
    }

    private function getNextRadioSlot($user) {
        $slot = Timetable::isActive()
            ->where('day', '>=', date('N'))
            ->where('hour', '>', date('G'))
            ->orderBy('day', 'ASC')
            ->orderBy('hour', 'ASC')
            ->where('userId', $user->userId)
            ->radio()
            ->first();

        if (!$slot) {
            return null;
        }

        return [
            'day' => $slot->day,
            'hour' => $slot->hour
        ];
    }
}
