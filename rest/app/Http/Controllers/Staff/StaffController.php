<?php

namespace App\Http\Controllers\Staff;

use App\Constants\LogType;
use App\EloquentModels\Log\LogSitecp;
use App\EloquentModels\Log\RadioStatsLog;
use App\EloquentModels\RequestThc;
use App\EloquentModels\Staff\RadioRequest;
use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\User\User;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use stdClass;

class StaffController extends Controller {

    /**
     * @param  Request  $request
     * @param $startOfWeek
     *
     * @param $year
     * @param $month
     *
     * @return JsonResponse
     */
    public function getDashboardStats(Request $request, $startOfWeek, $year, $month) {
        $user = $request->get('auth');

        return response()->json(
            [
                'general' => [
                    'events' => Timetable::isActive()->events()->count('timetableId'),
                    'radio' => Timetable::isActive()->radio()->count('timetableId'),
                    'requests' => RadioRequest::where('createdAt', '>', $startOfWeek)->count('requestId'),
                    'thc' => RequestThc::where('createdAt', '>', $startOfWeek)->count('requestThcId')
                ],
                'personal' => [
                    'events' => $this->getNextEventsSlot($user),
                    'radio' => $this->getNextRadioSlot($user)
                ],
                'radioPoints' => $this->getRadioPoints($year, $month)
            ]
        );
    }

    private function getRadioPoints($year, $month) {
        $result = (object) [
            'EU' => 0,
            'OC' => 0,
            'NA' => 0
        ];

        function getKey($hour) {
            $isEu = $hour > 17 && $hour < 22;
            $isNa = ($hour > 21 && $hour < 24) || ($hour > -1 && $hour < 2);
            $isOc = $hour > 6 && $hour < 11;
            switch (true) {
                case $isEu:
                    return 'EU';
                case $isNa:
                    return 'NA';
                case $isOc:
                    return 'OC';
            }
        }

        $dayOne = strtotime($year.'-'.$month.'-01');
        $lastDay = strtotime('+1 month', $dayOne);
        $logs = RadioStatsLog::where('createdAt', '>=', $dayOne)->where('createdAt', '<=', $lastDay)->get();
        $firstLog = RadioStatsLog::orderBy('createdAt', 'ASC')->first();

        foreach ($logs as $log) {
            $hour = date('G', $log->createdAt->timestamp);
            $key = getKey($hour);
            if ($key) {
                $result->$key += $log->listeners / 12;
            }
        }

        $result->EU = ceil($result->EU);
        $result->NA = ceil($result->NA);
        $result->OC = ceil($result->OC);

        $startDate = $firstLog ? $firstLog->createdAt->timestamp : strtotime('now');
        return [
            'start' => [
                'year' => date('Y', $startDate),
                'month' => date('n', $startDate)
            ],
            'current' => [
                'year' => $year,
                'month' => $month
            ],
            'result' => $result
        ];
    }

    /**
     * @param  Request  $request
     * @param  Number  $page
     *
     * @return JsonResponse
     */
    public function getThcRequestsLog(Request $request, $page) {
        $user = $request->get('auth');

        $logSql = RequestThc::where('requesterId', $user->userId)
            ->withoutGlobalScope('nonHardDeleted');
        $total = $logSql->count();
        $items = $logSql->orderBy('createdAt', 'DESC')
            ->skip(PaginationUtil::getOffset($page))
            ->take($this->perPage)
            ->get()
            ->map(
                function ($item) {
                    $log = LogSitecp::where('action', LogType::getAction(LogType::MANAGED_THC_REQUESTS))
                        ->where('contentId', $item->requestThcId)->first();
                    $data = $log ? json_decode($log->data) : new stdClass();
                    return [
                        'nickname' => $item->receiver->nickname,
                        'habbo' => $item->receiver->habbo,
                        'amount' => $item->amount,
                        'isPending' => !$item->isDeleted,
                        'isApproved' => Value::objectJsonProperty($data, 'wasApproved', false),
                        'updatedAt' => $item->updatedAt->timestamp
                    ];
                }
            );

        return response()->json(
            [
                'total' => $total,
                'page' => $page,
                'items' => $items
            ]
        );
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createRequestThc(Request $request) {
        $user = $request->get('auth');
        $requests = $request->input('requests');
        $this->validateRequests($requests);

        foreach ($requests as $thcRequest) {
            $nickname = Value::arrayProperty($thcRequest, 'nickname', '');
            $habbo = Value::arrayProperty($thcRequest, 'habbo', '');
            $account = $this->findAccount($nickname, $habbo);

            $newRequest = new RequestThc(
                [
                    'requesterId' => $user->userId,
                    'receiverId' => $account->userId,
                    'amount' => ceil($thcRequest['amount']),
                    'reason' => $thcRequest['reason']
                ]
            );
            $newRequest->save();
            Logger::staff(
                $user->userId, $request->ip(), LogType::REQUESTED_THC_FOR_USER, [
                    'name' => $account->nickname,
                    'amount' => $newRequest->amount
                ]
            );
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
            Condition::precondition(
                !isset($request['nickname']) && !isset($request['habbo']),
                400, 'A nickname or habbo needs to be set!'
            );
            Condition::precondition(
                empty($request['nickname']) && empty($request['habbo']),
                400, 'A nickname or habbo needs to be set!'
            );
            Condition::precondition(
                !is_numeric($request['amount']) || $request['amount'] < 1, 400,
                'The amount is not valid, 1 or more number is mandatory!'
            );
            Condition::precondition(
                !isset($request['reason']) || empty($request['reason']),
                400, 'Each row needs a reason!'
            );

            $nickname = Value::arrayProperty($request, 'nickname', '');
            $account = User::withNickname($nickname)->first();
            Condition::precondition(
                !$account, 404, sprintf(
                    'There is no account related with %s',
                    $nickname
                )
            );
        }
    }

    private function getNextEventsSlot($user) {
        $slots = Timetable::isActive()
            ->where('day', '>=', date('N'))
            ->where('userId', $user->userId)
            ->orderBy('day', 'ASC')
            ->orderBy('hour', 'ASC')
            ->events()
            ->get();

        $slot = null;
        foreach ($slots as $upcomingSlot) {
            if ($upcomingSlot->day == date('N') && $upcomingSlot->hour > date('G')) {
                $slot = $upcomingSlot;
                break;
            }
            if ($upcomingSlot->day > date('N')) {
                $slot = $upcomingSlot;
                break;
            }
        }

        if (!$slot) {
            return null;
        }

        return [
            'day' => $slot->day,
            'hour' => $slot->hour
        ];
    }

    private function getNextRadioSlot($user) {
        $slots = Timetable::isActive()
            ->where('day', '>=', date('N'))
            ->where('userId', $user->userId)
            ->orderBy('day', 'ASC')
            ->orderBy('hour', 'ASC')
            ->radio()
            ->get();

        $slot = null;
        foreach ($slots as $upcomingSlot) {
            if ($upcomingSlot->day == date('N') && $upcomingSlot->hour > date('G')) {
                $slot = $upcomingSlot;
                break;
            }
            if ($upcomingSlot->day > date('N')) {
                $slot = $upcomingSlot;
                break;
            }
        }

        if (!$slot) {
            return null;
        }

        return [
            'day' => $slot->day,
            'hour' => $slot->hour
        ];
    }
}
