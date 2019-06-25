<?php

namespace App\Http\Controllers\Staff;

use App\EloquentModels\Log\LogStaff;
use App\EloquentModels\Log\LogUser;
use App\EloquentModels\Staff\RadioRequest;
use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\SettingsHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Models\Radio\RadioServerTypes;
use App\Models\Radio\RadioSettings;
use App\Utils\BBcodeUtil;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;

class RadioController extends Controller {

    /**
     * @param $page
     *
     * @return mixed
     */
    public function getBookingLog($page) {
        $bookAction = Action::getAction(Action::BOOKED_RADIO_SLOT);
        $unbookAction = Action::getAction(Action::UNBOOKED_RADIO_SLOT);
        $bookedPermAction = Action::getAction(Action::BOOKED_PERM_SLOT);
        $deletedPermAction = Action::getAction(Action::DELETED_PERM_SLOT);

        $logSql = LogStaff::whereIn('action', [$bookAction, $unbookAction, $bookedPermAction, $deletedPermAction]);

        $total = DataHelper::getPage($logSql->count('logId'));
        $items = $logSql->orderBy('logId', 'DESC')
            ->take($this->perPage)
            ->skip(DataHelper::getOffset($page))
            ->get()->map(function ($log) {

                $booking = Timetable::where('timetableId', json_decode($log->data)->timetableId)
                    ->withoutGlobalScope('nonHardDeleted')->first();
                return [
                    'user' => UserHelper::getUser($log->userId),
                    'affected' => UserHelper::getUser($booking->userId),
                    'day' => $booking->day,
                    'hour' => $booking->hour,
                    'action' => $log->action,
                    'updatedAt' => $log->updatedAt->timestamp
                ];
            });

        return response()->json([
            'items' => $items,
            'page' => $page,
            'total' => $total
        ]);
    }

    /**
     * Get request for radio connection information resource
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getConnectionInformation() {
        return response()->json(SettingsHelper::getRadioConnectionInformation());
    }

    /**
     * Get request for radio connection information resource for Manage Connection
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSitecpConnectionInformation() {
        return response()->json(SettingsHelper::getRadioConnectionInformation(true));
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDjSays(Request $request) {
        $user = $request->get('auth');
        $settingKeys = ConfigHelper::getKeyConfig();

        $radio = new RadioSettings(SettingsHelper::getSettingValue($settingKeys->radio));

        return response()->json([
            'says' => $radio->djSays,
            'canUpdate' => $user->userId == $radio->userId ||
                PermissionHelper::haveStaffPermission($user->userId, ConfigHelper::getStaffConfig()->canOverrideDjSays)
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateDjSays(Request $request) {
        $user = $request->get('auth');
        $says = $request->input('says');
        $settingKeys = ConfigHelper::getKeyConfig();
        $radio = new RadioSettings(SettingsHelper::getSettingValue($settingKeys->radio));

        $canUpdate = $user->userId == $radio->userId ||
            PermissionHelper::haveStaffPermission($user->userId, ConfigHelper::getStaffConfig()->canOverrideDjSays);
        Condition::precondition(!$canUpdate, 400, 'You are not able to update the DJ says');

        $radio->djSays = $says;
        SettingsHelper::createOrUpdateSetting($settingKeys->radio, json_encode($radio));
        Logger::staff($user->userId, $request->ip(), Action::UPDATED_DJ_SAYS, ['says' => $says]);
        return response()->json();
    }

    /**
     * Kick the current DJ on air off the air
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function kickOffDj(Request $request) {
        $user = $request->get('auth');

        $settingKeys = ConfigHelper::getKeyConfig();
        $radio = new RadioSettings(SettingsHelper::getSettingValue($settingKeys->radio));
        $userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36';

        $url = 'http://' . $radio->ip . ':' . $radio->port . '/sitecp.cgi?mode=kicksrc';
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_POST, false);
        curl_setopt($curl, CURLOPT_USERPWD, 'sitecp:' . $radio->sitecpPassword);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_USERAGENT, $userAgent);
        curl_exec($curl);

        Condition::precondition(curl_getinfo($curl, CURLINFO_HTTP_CODE) != 200, 400,
            'Something went wrong');
        curl_close($curl);

        Logger::staff($user->userId, $request->ip(), Action::KICKED_DJ_OFF, ['dj' => $radio->nickname]);
        return response()->json();
    }

    /**
     * Post request for liking DJ, validation for DJ on air and last time since like
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createDjLike(Request $request) {
        $user = $request->get('auth');
        $nowMinus30Min = time() - 1800;
        $settings = ConfigHelper::getKeyConfig();
        $radio = new RadioSettings(SettingsHelper::getSettingValue($settings->radio));
        $djUser = User::find(SettingsHelper::getSettingValue($radio->userId));

        Condition::precondition(!$djUser, 404, 'The current DJ could not be found');
        Condition::precondition($user->userId == 0, 400, 'You need to be logged in to like a DJ');
        Condition::precondition($user->userId == $djUser->userId, 400, 'You can not like yourself');
        $haveLikedWithInLimit = LogUser::where('userId', $user->userId)
                ->where('action', Action::getAction(Action::LIKED_DJ))
                ->where('createdAt', '>', $nowMinus30Min)
                ->count('logId') > 0;
        Condition::precondition($haveLikedWithInLimit, 400, 'You are trying to like to fast!');

        $djUser->likes++;
        $djUser->save();

        Logger::user($user->userId, $request->ip(), Action::LIKED_DJ, [], $djUser->userId);
        return response()->json();
    }

    /**
     * Post request for creating a request, validation for message, nickname and
     * time since last request. Logged in users can not fake their nickname.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createRequest(Request $request) {
        $user = $request->get('auth');
        $nickname = $user ? $user->nickname : $request->input('nickname');
        $content = $request->input('content');
        $ipAddress = request()->ip();

        Condition::precondition(!$content, 400, 'Request message can not be empty');
        Condition::precondition(strlen($content) == 0, 400, 'Request message can not be empty');
        Condition::precondition(!$nickname, 400, 'nickname can not be empty');
        Condition::precondition(strlen($nickname) == 0, 400, 'nickname can not be empty');

        $isRequestingToQuick = RadioRequest::where('ip', $ipAddress)->where('createdAt', '>', $this->nowMinus15)->count('requestId') > 0;
        Condition::precondition($isRequestingToQuick, 400, 'You are requesting to quick!');

        $radioRequest = new RadioRequest([
            'userId' => $user->userId,
            'nickname' => $user->userId != 0 ? $user->nickname : $nickname,
            'content' => $content,
            'ip' => $ipAddress
        ]);
        $radioRequest->save();

        Logger::user($user->userId, $request->ip(), Action::DID_RADIO_REQUEST);
        return response()->json();
    }

    /**
     * Get an array of all requests which are made less then two hours ago.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRequests(Request $request) {
        $user = $request->get('auth');
        $canSeeRequestIp = PermissionHelper::haveStaffPermission($user->userId, ConfigHelper::getStaffConfig()->canSeeIpOnRequests);

        $radioRequests = RadioRequest::twoHours()->orderBy('requestId', 'DESC')->getQuery()->get();
        foreach ($radioRequests as $radioRequest) {
            if (!$canSeeRequestIp) {
                unset($radioRequest['ip']);
            }
            $radioRequest->nickname = BBcodeUtil::arrowsToEntry($radioRequest->nickname);
            $radioRequest->content = BBcodeUtil::arrowsToEntry($radioRequest->content);
        }

        return response()->json($radioRequests);
    }

    /**
     * Get all the booked slots that are active
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTimetable() {
        return response()->json([
            'timetable' => Timetable::radio()->isActive()->get(),
            'events' => [],
            'timezones' => ConfigHelper::getTimetable()
        ]);
    }

    /**
     * Delete request to remove booked slot.
     *
     * @param Request $request
     * @param         $timetableId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteBooking(Request $request, $timetableId) {
        $user = $request->get('auth');

        $booking = Timetable::find($timetableId);
        Condition::precondition(!$booking, 404, 'Booking does not exist');
        $canBookForOthers = PermissionHelper::haveStaffPermission($user->userId, ConfigHelper::getStaffConfig()->canBookRadioForOthers);
        Condition::precondition($booking->userId != $user->userId && !$canBookForOthers, 400, 'You can not unbook others slots');

        if ($booking->isPerm) {
            $booking->isActive = false;
        } else {
            $booking->isDeleted = true;
        }
        $booking->save();

        Logger::staff($user->userId, $request->ip(), Action::UNBOOKED_RADIO_SLOT, ['timetableId' => $booking->timetableId]);
        return response()->json();
    }

    /**
     * Post request for creating a booking
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createBooking(Request $request) {
        $user = $request->get('auth');
        $booking = (object)$request->input('booking');

        Condition::precondition(!isset($booking), 400, 'Stupid developer');
        Condition::precondition(!isset($booking->hour), 400, 'Hour missing');
        Condition::precondition(!isset($booking->day), 400, 'Day missing');

        $canBookForOthers = PermissionHelper::haveStaffPermission($user->userId, ConfigHelper::getStaffConfig()->canBookRadioForOthers);
        $bookingForUser = User::withNickname(Value::objectProperty($booking, 'nickname', ''))->first();
        Condition::precondition(isset($booking->nickname) && !$bookingForUser, 404, 'No user by the name ' . Value::objectProperty($booking, 'nickname', ''));
        Condition::precondition($bookingForUser && $bookingForUser->userId != $user->userId && !$canBookForOthers, 400, 'You can not book for someone else');

        $existing = Timetable::radio()->where('day', $booking->day)->where('hour', $booking->hour)->isActive()->count('timetableId') > 0;
        Condition::precondition($existing, 400, 'Booking already exists on this slot');
        $userId = $bookingForUser ? $bookingForUser->userId : $user->userId;

        $timetable = new Timetable([
            'userId' => $userId,
            'day' => $booking->day,
            'hour' => $booking->hour,
            'isPerm' => 0,
            'type' => 0
        ]);
        $timetable->save();

        Logger::staff($user->userId, $request->ip(), Action::BOOKED_RADIO_SLOT, ['timetableId' => $timetable->timetableId]);
        return response()->json([
            'timetableId' => $timetable->timetableId,
            'createdAt' => time(),
            'user' => UserHelper::getUser($userId)
        ]);
    }

    /**
     * Post request for updating the connection information
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */

    public function updateConnectionInfo(Request $request) {
        $user = $request->get('auth');
        $information = (object)$request->input('information');
        $settingKeys = ConfigHelper::getKeyConfig();
        $oldInformation = new RadioSettings(SettingsHelper::getSettingValue($settingKeys->radio));

        foreach ($information as $key => $value) {
            Condition::precondition(!isset($value) || empty($value), 400, $key . ' is missing');
        }
        Condition::precondition(!RadioServerTypes::isValidType($information->serverType), 400,
            'Server type is not valid');

        $newInformation = new RadioSettings(SettingsHelper::getSettingValue($settingKeys->radio));
        $newInformation->ip = $information->ip;
        $newInformation->port = $information->port;
        $newInformation->password = $information->password;
        $newInformation->sitecpPassword = $information->sitecpPassword;
        $newInformation->serverType = $information->serverType;

        SettingsHelper::createOrUpdateSetting($settingKeys->radio, json_encode($newInformation));

        Logger::staff($user->userId, $request->ip(), Action::UPDATED_CONNECTION_INFORMATION, [
            'oldInformation' => $oldInformation,
            'newInformation' => $newInformation
        ]);

        return response()->json();
    }
}
