<?php

namespace App\Http\Controllers\Staff;

use App\Constants\LogType;
use App\Constants\Permission\StaffPermissions;
use App\Constants\RadioServerTypes;
use App\EloquentModels\Log\LogStaff;
use App\EloquentModels\Log\LogUser;
use App\EloquentModels\Staff\RadioRequest;
use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\User\User;
use App\Factories\Notification\NotificationFactory;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Providers\Service\ContentService;
use App\Providers\Service\RadioService;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RadioController extends Controller {
    private $myContentService;
    private $myRadioService;

    public function __construct(ContentService $contentService, RadioService $radioService) {
        parent::__construct();
        $this->myContentService = $contentService;
        $this->myRadioService = $radioService;
    }

    /**
     * @param $page
     *
     * @return mixed
     */
    public function getBookingLog($page) {
        $bookAction = LogType::getAction(LogType::BOOKED_RADIO_SLOT);
        $unbookAction = LogType::getAction(LogType::UNBOOKED_RADIO_SLOT);
        $editedAction = LogType::getAction(LogType::EDITED_RADIO_TIMETABLE_SLOT);
        $bookedPermAction = LogType::getAction(LogType::BOOKED_PERM_SLOT);
        $deletedPermAction = LogType::getAction(LogType::DELETED_PERM_SLOT);

        $logSql = LogStaff::whereIn('action', [$bookAction, $unbookAction, $bookedPermAction, $deletedPermAction, $editedAction]);

        $total = PaginationUtil::getTotalPages($logSql->count('logId'));
        $items = $logSql->orderBy('logId', 'DESC')
            ->take($this->perPage)
            ->skip(PaginationUtil::getOffset($page))
            ->get()->map(
                function ($log) use ($editedAction) {

                    $booking = Timetable::where('timetableId', $log->getData()->timetableId)
                        ->withoutGlobalScope('nonHardDeleted')->first();
                    $isEditAction = $log->action == $editedAction;
                    $userId = $isEditAction ? $log->getData()->userIdBefore : $booking->userId;
                    return [
                        'user' => UserHelper::getSlimUser($log->userId),
                        'affected' => UserHelper::getSlimUser($userId),
                        'day' => $booking->day,
                        'hour' => $booking->hour,
                        'action' => $log->action,
                        'updatedAt' => $log->updatedAt->timestamp
                    ];
                }
            );

        return response()->json(
            [
                'items' => $items,
                'page' => $page,
                'total' => $total
            ]
        );
    }

    /**
     * Get request for radio connection information resource
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getConnectionInformation(Request $request) {
        $user = $request->get('auth');
        $radio = $this->myRadioService->getRadioSettings();
        $info = $this->myRadioService->getRadioConnection(false);

        $isDj = $user->userId == $radio->nextDjId || $user->userId == $radio->userId || $user->userId == $this->getCurrentDjId();
        $response = PermissionHelper::haveStaffPermission(
            $user->userId,
            StaffPermissions::CAN_ALWAYS_SEE_CONNECTION_INFORMATION
        ) || $isDj ? $info : null;
        return response()->json($response);
    }

    /**
     * Get request for radio connection information resource for Manage Connection
     *
     * @return JsonResponse
     */
    public function getSitecpConnectionInformation() {
        return response()->json($this->myRadioService->getRadioConnection(true));
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getDjSays(Request $request) {
        $user = $request->get('auth');
        $radio = $this->myRadioService->getRadioSettings();

        return response()->json(
            [
                'says' => $radio->djSays,
                'canUpdate' => $user->userId == $radio->userId ||
                    PermissionHelper::haveStaffPermission($user->userId, StaffPermissions::CAN_OVERRIDE_DJ_SAYS)
            ]
        );
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function updateDjSays(Request $request) {
        $user = $request->get('auth');
        $says = $request->input('says');
        $radio = $this->myRadioService->getRadioSettings();

        $canUpdate = $user->userId == $radio->userId ||
            PermissionHelper::haveStaffPermission($user->userId, StaffPermissions::CAN_OVERRIDE_DJ_SAYS);
        Condition::precondition(!$canUpdate, 400, 'You are not able to update the DJ says');

        $radio->djSays = $says;
        $this->myRadioService->updateRadioSettings($radio);
        Logger::staff($user->userId, $request->ip(), LogType::UPDATED_DJ_SAYS, ['says' => $says]);
        return response()->json();
    }

    /**
     * Kick the current DJ on air off the air
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function kickOffDj(Request $request) {
        $user = $request->get('auth');
        $currentDjId = $this->myRadioService->kickCurrentDj();

        Logger::staff($user->userId, $request->ip(), LogType::KICKED_DJ_OFF, [], $currentDjId);
        return response()->json();
    }

    /**
     * Start the auto dj
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function startAutoDj(Request $request) {
        $user = $request->get('auth');
        $this->myRadioService->startAzuracastAutoDj();

        Logger::staff($user->userId, $request->ip(), LogType::STARTED_AUTO_DJ, []);
        return response()->json();
    }

    /**
     * Stop the auto dj
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function stopAutoDj(Request $request) {
        $user = $request->get('auth');
        $this->myRadioService->stopAzuracastAutoDj();

        Logger::staff($user->userId, $request->ip(), LogType::STOPPED_AUTO_DJ, []);
        return response()->json();
    }

    /**
     * Post request for liking DJ, validation for DJ on air and last time since like
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createDjLike(Request $request) {
        $user = $request->get('auth');
        $nowMinus30Min = time() - 1800;
        $radio = $this->myRadioService->getRadioSettings();
        $djUser = User::find($radio->userId);

        Condition::precondition(!$djUser, 404, 'The current DJ could not be found');
        Condition::precondition($user->userId == 0, 400, 'You need to be logged in to like a DJ');
        Condition::precondition($user->userId == $djUser->userId, 400, 'You can not like yourself');
        $lastLike = LogUser::where('userId', $user->userId)
            ->where('action', LogType::getAction(LogType::LIKED_DJ))
            ->orderBy('createdAt', 'DESC')
            ->first();
        if ($lastLike && $lastLike->createdAt->timestamp > $nowMinus30Min) {
            return response()->json(
                [
                    'isTimeout' => true,
                    'timeLeft' => $lastLike->createdAt->timestamp - $nowMinus30Min
                ]
            );
        }

        $djUser->likes++;
        $djUser->save();


        NotificationFactory::newLikeDj($djUser->userId, $user->userId);
        Logger::user($user->userId, $request->ip(), LogType::LIKED_DJ, [], $djUser->userId);
        return response()->json(
            [
                'isTimeout' => false
            ]
        );
    }

    /**
     * Post request for creating a request, validation for message, nickname and
     * time since last request. Logged in users can not fake their nickname.
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createRequest(Request $request) {
        $user = $request->get('auth');
        $content = $request->input('content');

        Condition::precondition(!$content, 400, 'Request message can not be empty');
        Condition::precondition(strlen($content) == 0, 400, 'Request message can not be empty');

        $isRequestingToQuick = RadioRequest::where('ip', $request->ip())
                ->where('createdAt', '>', $this->nowMinus15)
                ->count('requestId') > 0;
        Condition::precondition($isRequestingToQuick, 400, 'You are requesting to quick!');

        $radioRequest = new RadioRequest(
            [
                'userId' => $user->userId,
                'nickname' => $user->nickname,
                'content' => $content,
                'ip' => $request->ip()
            ]
        );
        $radioRequest->save();

        $radio = $this->myRadioService->getRadioSettings();
        NotificationFactory::newRadioRequest($radio->userId, $user->userId, $radioRequest->requestId);
        Logger::user($user->userId, $request->ip(), LogType::DID_RADIO_REQUEST);
        return response()->json();
    }

    public function deleteRequest(Request $request, $requestId) {
        $user = $request->get('auth');
        $radioRequest = RadioRequest::find($requestId);
        Condition::precondition(!$radioRequest, 404, 'No request with that ID');

        Condition::precondition(!$this->canUserDeleteRequests($user), 400, 'You are not able to delete the request');

        $radioRequest->isDeleted = true;
        $radioRequest->save();

        Logger::staff(
            $user->userId,
            $request->ip(),
            LogType::DELETED_RADIO_REQUEST,
            [
                'content' => $radioRequest->content
            ]
        );
        return response()->json();
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function deleteAllRequests(Request $request) {
        $user = $request->get('auth');
        RadioRequest::twoHours()->update(['isDeleted' => true]);
        Logger::staff($user->userId, $request->ip(), LogType::DELETED_ALL_RADIO_REQUEST, []);
        return response()->json();
    }

    /**
     * Get an array of all requests which are made less then two hours ago.
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getRequests(Request $request) {
        $user = $request->get('auth');
        $canSeeRequestIp = PermissionHelper::haveStaffPermission($user->userId, StaffPermissions::CAN_SEE_IPS_AND_DELETE_REQUESTS);

        $radioRequests = RadioRequest::twoHours()->orderBy('requestId', 'DESC')->where('isDeleted', '<', 1)->getQuery()->get();
        foreach ($radioRequests as $radioRequest) {
            if (!$canSeeRequestIp) {
                unset($radioRequest->ip);
            }
            $radioRequest->nickname = $this->myContentService->getContentEscapedArrows($radioRequest->nickname);
            $radioRequest->content = $this->myContentService->getContentEscapedArrows($radioRequest->content);
        }

        return response()->json(
            [
                'canDeleteRequests' => $this->canUserDeleteRequests($user),
                'items' => $radioRequests
            ]
        );
    }

    /**
     * Get all the booked slots that are active
     *
     * @return JsonResponse
     */
    public function getTimetable() {
        return response()->json(
            [
                'timetable' => Timetable::radio()->isActive()->get(),
                'events' => [],
                'timezones' => ConfigHelper::getTimetable()
            ]
        );
    }

    /**
     * Delete request to remove booked slot.
     *
     * @param  Request  $request
     * @param         $timetableId
     *
     * @return JsonResponse
     */
    public function deleteBooking(Request $request, $timetableId) {
        $user = $request->get('auth');

        $booking = Timetable::find($timetableId);
        Condition::precondition(!$booking, 404, 'Booking does not exist');
        $canBookForOthers = PermissionHelper::haveStaffPermission($user->userId, StaffPermissions::CAN_BOOK_RADIO_FOR_OTHERS);
        Condition::precondition($booking->userId != $user->userId && !$canBookForOthers, 400, 'You can not unbook others slots');

        if ($booking->isPerm) {
            $booking->isActive = false;
        } else {
            $booking->isDeleted = true;
        }
        $booking->save();

        Logger::staff($user->userId, $request->ip(), LogType::UNBOOKED_RADIO_SLOT, ['timetableId' => $booking->timetableId]);
        return response()->json();
    }

    public function updateBooking(Request $request, $timetableId) {
        $user = $request->get('auth');
        $data = (object) $request->input('data');

        $slot = Timetable::find($timetableId);
        Condition::precondition(!$slot, 404, 'No slot with that ID');

        $bookingForUser = User::withNickname(Value::objectProperty($data, 'nickname', ''))->first();
        Condition::precondition(
            isset($data->nickname) && !empty($data->nickname) && !$bookingForUser,
            404,
            'No user with that nickname'
        );

        $userIdBefore = $slot->userId;

        $slot->userId = $bookingForUser ? $bookingForUser->userId : $user->userId;
        $slot->save();

        Logger::staff(
            $user->userId,
            $request->ip(),
            LogType::EDITED_RADIO_TIMETABLE_SLOT,
            [
                'userIdBefore' => $userIdBefore,
                'userIdAfter' => $slot->userId,
                'eventIdBefore' => null,
                'eventIdAfter' => null,
                'timetableId' => $slot->timetableId
            ],
            $slot->timetableId
        );
        return response()->json(
            [
                'timetableId' => $slot->timetableId,
                'createdAt' => time(),
                'user' => UserHelper::getUser($slot->userId)
            ]
        );
    }

    /**
     * Post request for creating a booking
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createBooking(Request $request) {
        $user = $request->get('auth');
        $booking = (object) $request->input('booking');

        Condition::precondition(!isset($booking), 400, 'Stupid developer');
        Condition::precondition(!isset($booking->hour), 400, 'Hour missing');
        Condition::precondition(!isset($booking->day), 400, 'Day missing');

        $canBookForOthers = PermissionHelper::haveStaffPermission($user->userId, StaffPermissions::CAN_BOOK_RADIO_FOR_OTHERS);
        $bookingForUser = User::withNickname(Value::objectProperty($booking, 'nickname', ''))->first();
        Condition::precondition(
            isset($booking->nickname) && !$bookingForUser,
            404,
            'No user by the name '.Value::objectProperty($booking, 'nickname', '')
        );
        Condition::precondition(
            $bookingForUser && $bookingForUser->userId != $user->userId && !$canBookForOthers,
            400,
            'You can not book for someone else'
        );

        $existing = Timetable::radio()->where('day', $booking->day)->where('hour', $booking->hour)->isActive()->count('timetableId') > 0;
        Condition::precondition($existing, 400, 'Booking already exists on this slot');
        $userId = $bookingForUser ? $bookingForUser->userId : $user->userId;

        $timetable = new Timetable(
            [
                'userId' => $userId,
                'day' => $booking->day,
                'hour' => $booking->hour,
                'isPerm' => 0,
                'type' => 0
            ]
        );
        $timetable->save();

        Logger::staff($user->userId, $request->ip(), LogType::BOOKED_RADIO_SLOT, ['timetableId' => $timetable->timetableId]);
        return response()->json(
            [
                'timetableId' => $timetable->timetableId,
                'createdAt' => time(),
                'user' => UserHelper::getUser($userId)
            ]
        );
    }

    /**
     * Post request for updating the connection information
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */

    public function updateConnectionInfo(Request $request) {
        $user = $request->get('auth');
        $information = (object) $request->input('information');
        $oldInformation = $this->myRadioService->getRadioSettings();

        Condition::precondition(
            !RadioServerTypes::isValidType($information->serverType),
            400,
            'Server type is not valid'
        );

        $newInformation = clone $oldInformation;
        $newInformation->ip = $information->ip;
        $newInformation->port = $information->port;
        $newInformation->connectionPort = $information->connectionPort;
        $newInformation->mountPoint = $information->mountPoint;
        $newInformation->password = $information->password;
        $newInformation->adminPassword = $information->adminPassword;
        $newInformation->serverType = $information->serverType;
        $newInformation->azuracastApiKey = $information->azuracastApiKey;
        $newInformation->azuracastStationId = $information->azuracastStationId;
        $newInformation->isAzuracast = (boolean) $information->isAzuracast;

        $this->myRadioService->updateRadioSettings($newInformation);
        Logger::staff(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_CONNECTION_INFORMATION,
            [
                'oldInformation' => $oldInformation,
                'newInformation' => $newInformation
            ]
        );

        return response()->json();
    }

    private function canUserDeleteRequests($user) {
        $radio = $this->myRadioService->getRadioSettings();
        $isCurrentDj = $user->userId == $radio->userId;
        $canDelete = PermissionHelper::haveStaffPermission($user->userId, StaffPermissions::CAN_ALWAYS_SEE_CONNECTION_INFORMATION);

        return $isCurrentDj || $canDelete;
    }

    private function getCurrentDjId() {
        $day = date('N');
        $hour = date('G');

        $currentSlot = Timetable::radio()->isActive()->where('day', $day)->where('hour', $hour)->first();
        return $currentSlot ? $currentSlot->user->userId : null;
    }
}
