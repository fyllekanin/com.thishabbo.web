<?php

namespace App\Http\Controllers\Staff;

use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\Staff\TimetableData;
use App\EloquentModels\User\Login;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\SettingsHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Models\Radio\RadioSettings;
use App\Utils\Condition;
use App\Utils\Iterables;
use App\Utils\Value;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ManagementController extends Controller {
    private $settingKeys;

    public function __construct () {
        parent::__construct();
        $this->settingKeys = ConfigHelper::getKeyConfig();
    }

    /**
     * @return array
     */
    public function getCurrentListeners() {
        $listeners = Iterables::unique($this->getListenersFromServer(), 'hostname');
        return array_map(function($listener) {
            $userId = Login::where('ip', $listener->hostname)->value('userId');
            return [
                'user' => UserHelper::getSlimUser($userId),
                'time' => $listener->connecttime
            ];
        }, $listeners);
    }

    /**
     * Get request for do not hire list
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDoNotHireList () {
        $items = json_decode(SettingsHelper::getSettingValue($this->settingKeys->doNotHire));

        foreach ($items as $item) {
            $item->addedBy = User::where('userId', $item->addedBy)->value('nickname');
        }

        return response()->json([
            'items' => $items
        ]);
    }

    /**
     * Get request for do not hire entry
     *
     * @param $nickname
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDoNotHire ($nickname) {
        $entries = json_decode(SettingsHelper::getSettingValue($this->settingKeys->doNotHire));
        $entryInfo = new \stdClass();

        foreach($entries as $entry){
            if($entry->nickname == $nickname){
                $entryInfo = $entry;
            }
        }

        return response()->json($entryInfo);
    }

    /**
     * Put request for do not hire entry
     *
     * @param Request $request
     * @param         $nickname
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateDoNotHire (Request $request, $nickname) {
        $user = Cache::get('auth');

        $information = (object)$request->input('information');
        $oldEntries = json_decode(SettingsHelper::getSettingValue($this->settingKeys->doNotHire));
        $newEntries = [];

        Condition::precondition(!isset($information->nickname), 400, 'Nickname missing');
        Condition::precondition(!isset($information->reason), 400, 'Reason missing');

        foreach ($oldEntries as $entry) {
            if($entry->nickname == $nickname){
                $entry = [
                    'nickname' => $information->nickname,
                    'reason' => $information->reason,
                    'addedBy' => $user->userId,
                    'createdAt' => time()
                ];
            }

            $newEntries[] = $entry;
        }

        SettingsHelper::createOrUpdateSetting($this->settingKeys->doNotHire, json_encode($newEntries));

        Logger::staff($user->userId, $request->ip(), Action::UPDATED_DO_NOT_HIRE, ['nickname' => $information->nickname]);

        return response()->json();
    }

    /**
     * Post request for do not hire entry
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createDoNotHire (Request $request) {
        $user = Cache::get('auth');

        $information = (object)$request->input('information');
        $entries = json_decode(SettingsHelper::getSettingValue($this->settingKeys->doNotHire));

        Condition::precondition(!isset($information->nickname), 400, 'Nickname missing');
        Condition::precondition(!isset($information->reason), 400, 'Reason missing');

        $entries[] = [
            'nickname' => $information->nickname,
            'reason' => $information->reason,
            'addedBy' => $user->userId,
            'createdAt' => time()
        ];

        SettingsHelper::createOrUpdateSetting($this->settingKeys->doNotHire, json_encode($entries));

        Logger::staff($user->userId, $request->ip(), Action::CREATED_DO_NOT_HIRE, ['nickname' => $information->nickname]);

        return response()->json();
    }

    /**
     * Delete request for do not hire entry
     *
     * @param Request $request
     * @param $nickname
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteDoNotHire (Request $request, $nickname) {
        $user = Cache::get('auth');
        $oldEntries = json_decode(SettingsHelper::getSettingValue($this->settingKeys->doNotHire));

        $entries = Iterables::filter($oldEntries, function($entry) use ($nickname) {
            return $entry->nickname != $nickname;
        });

        SettingsHelper::createOrUpdateSetting($this->settingKeys->doNotHire, json_encode($entries));

        Logger::staff($user->userId, $request->ip(), Action::DELETED_DO_NOT_HIRE, ['nickname' => $nickname]);

        return response()->json();
    }

    private function getListenersFromServer() {
        $radio = new RadioSettings(SettingsHelper::getSettingValue($this->settingKeys->radio));
        $userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36';
        $url = $radio->ip . ':' . $radio->port . '/admin.cgi?sid=1&mode=viewjson&page=3';

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_USERAGENT, $userAgent);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_USERPWD, 'admin:' . $radio->adminPassword);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($curl, CURLOPT_TIMEOUT, 45);

        $data = curl_exec($curl);
        curl_close($curl);
        return json_decode($data);
    }

    /**
     * Post request for creating a perm show
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createPermShow (Request $request) {
        $user = Cache::get('auth');
        $booking = (object)$request->input('booking');

        Condition::precondition(!isset($booking), 400, 'Stupid developer');
        Condition::precondition(!isset($booking->hour), 400, 'Hour missing');
        Condition::precondition(!isset($booking->day), 400, 'Day missing');
        Condition::precondition($booking->type < 0 || $booking->type > 1, 400, 'Invalid type');

        $bookingForUser = User::withNickname(Value::objectProperty($booking, 'nickname', ''))->first();
        Condition::precondition(!$bookingForUser, 404, 'There is no user with that nickname');

        $isPermExisting = Timetable::where('day', $booking->day)->where('hour', $booking->hour)->where('type', $booking->type)->isPerm()->count() > 0;
        Condition::precondition($isPermExisting, 400, 'Perm show already exists on this slot');

        $existing = Timetable::where('day', $booking->day)->where('hour', $booking->hour)->where('type', $booking->type)->isActive()->first();
        if ($existing) {
            $existing->delete();
        }

        $timetable = new Timetable([
            'userId' => $bookingForUser->userId,
            'day' => $booking->day,
            'hour' => $booking->hour,
            'isPerm' => 1,
            'type' => $booking->type
        ]);
        $timetable->save();

        $timetableData = new TimetableData([
            'timetableId' => $timetable->timetableId,
            'name' => $booking->name,
            'description' => $booking->description
        ]);
        $timetableData->save();

        Logger::staff($user->userId, $request->ip(), Action::BOOKED_PERM_SLOT, [
            'timetableId' => $timetable->timetableId
        ]);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param         $timetableId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePermShow (Request $request, $timetableId) {
        $user = Cache::get('auth');

        $booking = (object)$request->input('booking');

        Condition::precondition(!isset($booking), 400, 'Stupid developer');
        Condition::precondition(!isset($booking->hour), 400, 'Hour missing');
        Condition::precondition(!isset($booking->day), 400, 'Day missing');
        Condition::precondition($booking->type < 0 || $booking->type > 1, 400, 'Invalid type');

        $existingPerm = Timetable::where('day', $booking->day)->where('hour', $booking->hour)->where('type', $booking->type)->isPerm()->first();
        $existingCheck = isset($existingPerm) && $existingPerm->timetableId != $booking->timetableId;

        Condition::precondition($existingCheck, 400, 'Perm show already exists on this slot');

        $slot = Timetable::find($timetableId);
        $bookingForUser = User::withNickname(Value::objectProperty($booking, 'nickname', ''))->value('userId');

        Condition::precondition(!isset($bookingForUser), 400, $bookingForUser);

        $existing = Timetable::where('day', $booking->day)->where('hour', $booking->hour)->where('type', $booking->type)->isActive()->first();
        if ($existing) {
            $existing->delete();
        }

        $slot->update([
            'day' => $booking->day,
            'hour' => $booking->hour,
            'userId' => $bookingForUser
        ]);

        $slot->timetableData->update([
            'name' => $booking->name,
            'description' => $booking->description
        ]);

        Logger::staff($user->userId, $request->ip(), Action::EDITED_PERM_SLOT, [
            'show' => $booking->name
        ]);

        return response()->json();
    }

    /**
     * Delete request for removing a perm show
     *
     * @param Request $request
     * @param $timetableId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deletePermShow (Request $request, $timetableId) {
        $user = Cache::get('auth');
        $booking = Timetable::find($timetableId);
        Condition::precondition(!$booking, 404, 'Booking does not exist');

        $booking->isDeleted = true;
        $booking->save();

        Logger::staff($user->userId, $request->ip(), Action::DELETED_PERM_SLOT, [
            'timetableId' => $booking->timetableId
        ]);
        return response()->json();
    }

    /**
     * Get request for perm shows
     *
     * @param $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPermShows ($page) {
        $permShows = Timetable::isPerm()->take($this->perPage)->skip($this->getOffset($page))->get();
        $total = ceil(Timetable::isPerm()->count() / $this->perPage);

        return response()->json([
            'permShows' => $permShows->map(function ($item) {
                return $item->permShow;
            }),
            'total' => $total,
            'page' => $page
        ]);
    }

    /**
     * Get request for perm show
     *
     * @param $timetableId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPermShow ($timetableId) {
        $permShow = $timetableId == 'new' ? new \stdClass() : Timetable::find($timetableId)->permShow;
        return response()->json($permShow);
    }
}
