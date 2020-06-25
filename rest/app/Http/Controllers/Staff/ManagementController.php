<?php

namespace App\Http\Controllers\Staff;

use App\Constants\CommonRegex;
use App\Constants\LogType;
use App\Constants\SettingsKeys;
use App\EloquentModels\Log\RadioStatsLog;
use App\EloquentModels\Staff\Event;
use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\Staff\TimetableData;
use App\EloquentModels\User\Login;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Providers\Service\RadioService;
use App\Repositories\Repository\SettingRepository;
use App\Utils\Condition;
use App\Utils\Iterables;
use App\Utils\PaginationUtil;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use stdClass;

class ManagementController extends Controller {
    private $myRadioService;
    private $mySettingRepository;

    public function __construct(RadioService $radioService, SettingRepository $settingRepository) {
        parent::__construct();
        $this->myRadioService = $radioService;
        $this->mySettingRepository = $settingRepository;
    }

    public function getEventStats(Request $request) {
        $region = $request->input('region');
        $hours = [];

        if ($region) {
            foreach (ConfigHelper::getTimetable() as $key => $value) {
                if ($value == $region) {
                    $hours[] = $key;
                }
            }
        }

        $statsSql = Event::select('events.name', 'events.eventId', DB::raw('COUNT(timetable.timetableId) as amount'))
            ->leftJoin('timetable', 'timetable.eventId', '=', 'events.eventId')
            ->groupBy('events.name', 'events.eventId')
            ->orderBy('amount', 'DESC');

        if (count($hours) > 0) {
            $statsSql->whereIn('timetable.hour', $hours);
        }

        return response()->json($statsSql->get());
    }

    /**
     * @return JsonResponse
     */
    public function getCurrentListeners() {
        $listeners = Iterables::unique($this->myRadioService->getCurrentListeners(), 'hostname');
        return response()->json(
            array_map(
                function ($listener) {
                    $userId = Login::where('ip', $listener->hostname)->value('userId');
                    return [
                        'user' => UserHelper::getSlimUser($userId),
                        'time' => $listener->connecttime
                    ];
                },
                $listeners
            )
        );
    }

    public function getListenersForWeek($year, $week) {
        $start = strtotime($year.'W'.($week < 10 ? '0'.$week : $week));
        $end = strtotime('+1 week', $start);
        $timetable = ConfigHelper::getTimetable();
        $statistics = (object) [
            'EU' => [0, 0, 0, 0, 0, 0, 0],
            'OC' => [0, 0, 0, 0, 0, 0, 0],
            'NA' => [0, 0, 0, 0, 0, 0, 0]
        ];
        RadioStatsLog::where('createdAt', '>=', $start)->where('createdAt', '<', $end)->get()->each(
            function ($item) use ($statistics, $timetable) {
                $day = date('N', $item->createdAt->timestamp);
                $hour = date('G', $item->createdAt->timestamp);
                $region = $timetable[$hour];

                if ($region == 'NONE') {
                    return;
                }
                $statistics->$region[$day - 1] += ceil($item->listeners / 12);
            }
        );

        $firstLog = RadioStatsLog::orderBy('createdAt', 'ASC')->first();
        $startDate = $firstLog ? $firstLog->createdAt->timestamp : strtotime('now');
        return response()->json(
            [
                'earliestYear' => date('Y', $startDate),
                'statistics' => $statistics
            ]
        );
    }

    /**
     * Get request for do not hire list
     *
     * @return JsonResponse
     */
    public function getDoNotHireList() {
        $items = $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::DO_NOT_HIRE);

        if (!$items) {
            $items = [];
        }

        foreach ($items as $item) {
            $item->addedBy = User::where('userId', $item->addedBy)->value('nickname');
        }

        return response()->json(
            [
                'items' => $items
            ]
        );
    }

    /**
     * Get request for do not hire entry
     *
     * @param $nickname
     *
     * @return JsonResponse
     */
    public function getDoNotHire($nickname) {
        $entries = $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::DO_NOT_HIRE);
        $entryInfo = new stdClass();

        if (!$entries) {
            $entries = [];
        }

        foreach ($entries as $entry) {
            if ($entry->nickname == $nickname) {
                $entryInfo = $entry;
            }
        }

        return response()->json($entryInfo);
    }

    /**
     * Put request for do not hire entry
     *
     * @param  Request  $request
     * @param $nickname
     *
     * @return JsonResponse
     */
    public function updateDoNotHire(Request $request, $nickname) {
        $user = $request->get('auth');

        $information = (object) $request->input('information');
        $oldEntries = $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::DO_NOT_HIRE);
        $newEntries = [];

        if (!$oldEntries) {
            $oldEntries = [];
        }

        Condition::precondition(!isset($information->nickname), 400, 'Nickname missing');
        Condition::precondition(strpos($information->nickname, ' ') !== false, 400, 'Name can not contain spaces');
        Condition::precondition(strpos($information->nickname, '/'), 400, 'Name can not contain slashes');
        Condition::precondition(!isset($information->reason), 400, 'Reason missing');

        foreach ($oldEntries as $entry) {
            if ($entry->nickname == $nickname) {
                $entry = [
                    'nickname' => $information->nickname,
                    'reason' => $information->reason,
                    'addedBy' => $user->userId,
                    'createdAt' => time()
                ];
            }

            $newEntries[] = $entry;
        }

        $this->mySettingRepository->createOrUpdate(SettingsKeys::DO_NOT_HIRE, json_encode($newEntries));
        Logger::staff($user->userId, $request->ip(), LogType::UPDATED_DO_NOT_HIRE, ['nickname' => $information->nickname]);
        return response()->json();
    }

    /**
     * Post request for do not hire entry
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createDoNotHire(Request $request) {
        $user = $request->get('auth');

        $information = (object) $request->input('information');
        $entries = $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::DO_NOT_HIRE);

        Condition::precondition(!isset($information->nickname), 400, 'Nickname missing');
        Condition::precondition(strpos($information->nickname, ' ') !== false, 400, 'Name can not contain spaces');
        Condition::precondition(strpos($information->nickname, '/'), 400, 'Name can not contain slashes');
        Condition::precondition(!isset($information->reason), 400, 'Reason missing');

        $entries[] = [
            'nickname' => $information->nickname,
            'reason' => $information->reason,
            'addedBy' => $user->userId,
            'createdAt' => time()
        ];

        $this->mySettingRepository->createOrUpdate(SettingsKeys::DO_NOT_HIRE, json_encode($entries));
        Logger::staff($user->userId, $request->ip(), LogType::CREATED_DO_NOT_HIRE, ['nickname' => $information->nickname]);
        return response()->json();
    }

    /**
     * Delete request for do not hire entry
     *
     * @param  Request  $request
     * @param $nickname
     *
     * @return JsonResponse
     */
    public function deleteDoNotHire(Request $request, $nickname) {
        $user = $request->get('auth');
        $oldEntries = $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::DO_NOT_HIRE);

        $entries = Iterables::filter(
            $oldEntries,
            function ($entry) use ($nickname) {
                return $entry->nickname != $nickname;
            }
        );

        $this->mySettingRepository->createOrUpdate(SettingsKeys::DO_NOT_HIRE, json_encode($entries));
        Logger::staff($user->userId, $request->ip(), LogType::DELETED_DO_NOT_HIRE, ['nickname' => $nickname]);
        return response()->json();
    }

    /**
     * Post request for creating a perm show
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createPermShow(Request $request) {
        $user = $request->get('auth');
        $booking = (object) $request->input('booking');

        Condition::precondition(!isset($booking), 400, 'Stupid developer');
        Condition::precondition(!isset($booking->hour), 400, 'Hour missing');
        Condition::precondition(!isset($booking->day), 400, 'Day missing');
        Condition::precondition($booking->type < 0 || $booking->type > 1, 400, 'Invalid type');

        $bookingForUser = User::withNickname(Value::objectProperty($booking, 'nickname', ''))->first();
        Condition::precondition(!$bookingForUser, 404, 'There is no user with that nickname');

        $isPermExisting = Timetable::where('day', $booking->day)
                ->where('hour', $booking->hour)
                ->where('type', $booking->type)
                ->isPerm()
                ->count('timetableId') > 0;
        Condition::precondition($isPermExisting, 400, 'Perm show already exists on this slot');

        $existing = Timetable::where('day', $booking->day)
            ->where('hour', $booking->hour)
            ->where('type', $booking->type)
            ->isActive()
            ->first();
        if ($existing) {
            $existing->isDeleted = true;
            $existing->save();
        }

        $link = '';
        if (isset($booking->link) && !empty($booking->link)) {
            $link = $booking->link;
            Condition::precondition(!preg_match(CommonRegex::HABBO_ROOM_LINK, $link), 400, 'The room link is not valid');
        }

        $timetable = new Timetable(
            [
                'userId' => $bookingForUser->userId,
                'day' => $booking->day,
                'hour' => $booking->hour,
                'link' => $link,
                'isPerm' => 1,
                'type' => $booking->type,
                'isActive' => 1
            ]
        );
        $timetable->save();

        $timetableData = new TimetableData(
            [
                'timetableId' => $timetable->timetableId,
                'name' => $booking->name,
                'description' => $booking->description
            ]
        );
        $timetableData->save();

        Logger::staff(
            $user->userId,
            $request->ip(),
            LogType::BOOKED_PERM_SLOT,
            [
                'timetableId' => $timetable->timetableId
            ]
        );
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $timetableId
     *
     * @return JsonResponse
     */
    public function updatePermShow(Request $request, $timetableId) {
        $user = $request->get('auth');
        $booking = (object) $request->input('booking');

        Condition::precondition(!isset($booking), 400, 'Stupid developer');
        Condition::precondition(!isset($booking->hour), 400, 'Hour missing');
        Condition::precondition(!isset($booking->day), 400, 'Day missing');
        Condition::precondition($booking->type < 0 || $booking->type > 1, 400, 'Invalid type');

        $existingPerm = Timetable::where('day', $booking->day)
            ->where('hour', $booking->hour)
            ->where('type', $booking->type)
            ->isPerm()
            ->first();
        $existingCheck = isset($existingPerm) && $existingPerm->timetableId != $booking->timetableId;

        Condition::precondition($existingCheck, 400, 'Perm show already exists on this slot');

        $slot = Timetable::find($timetableId);
        Condition::precondition(!$slot, 404, 'No slot with that ID');
        $bookingForUser = User::withNickname(Value::objectProperty($booking, 'nickname', ''))->value('userId');

        Condition::precondition(!isset($bookingForUser), 400, $bookingForUser);

        $existing = Timetable::where('day', $booking->day)
            ->where('hour', $booking->hour)
            ->where('type', $booking->type)
            ->isActive()->first();
        if ($existing && $existing->timetableId != $slot->timetableId) {
            $existing->isDeleted = true;
            $existing->save();
        }

        $link = '';
        if (isset($booking->link) && !empty($booking->link)) {
            $link = $booking->link;
            Condition::precondition(!preg_match(CommonRegex::HABBO_ROOM_LINK, $link), 400, 'The room link is not valid');
        }

        $slot->day = $booking->day;
        $slot->hour = $booking->hour;
        $slot->type = $booking->type;
        $slot->link = $link;
        $slot->userId = $bookingForUser;
        $slot->save();

        $slot->timetableData->name = $booking->name;
        $slot->timetableData->description = $booking->description;
        $slot->timetableData->save();

        Logger::staff(
            $user->userId,
            $request->ip(),
            LogType::EDITED_PERM_SLOT,
            [
                'show' => $booking->name
            ]
        );

        return response()->json();
    }

    /**
     * Delete request for removing a perm show
     *
     * @param  Request  $request
     * @param $timetableId
     *
     * @return JsonResponse
     */
    public function deletePermShow(Request $request, $timetableId) {
        $user = $request->get('auth');
        $booking = Timetable::find($timetableId);
        Condition::precondition(!$booking, 404, 'Booking does not exist');

        $booking->isDeleted = true;
        $booking->save();

        Logger::staff(
            $user->userId,
            $request->ip(),
            LogType::DELETED_PERM_SLOT,
            [
                'timetableId' => $booking->timetableId
            ]
        );
        return response()->json();
    }

    /**
     * Get request for perm shows
     *
     * @param $page
     *
     * @return JsonResponse
     */
    public function getPermShows($page) {
        $permShows = Timetable::isPerm()->take($this->perPage)->skip(PaginationUtil::getOffset($page))->get();
        $total = PaginationUtil::getTotalPages(Timetable::isPerm()->count('timetableId'));

        return response()->json(
            [
                'permShows' => $permShows->map(
                    function ($show) {
                        return $show->permShow;
                    }
                ),
                'total' => $total,
                'page' => $page
            ]
        );
    }

    /**
     * Get request for perm show
     *
     * @param $timetableId
     *
     * @return JsonResponse
     */
    public function getPermShow($timetableId) {
        $permShow = $timetableId == 'new' ? new stdClass() : Timetable::find($timetableId)->permShow;
        return response()->json($permShow);
    }
}
