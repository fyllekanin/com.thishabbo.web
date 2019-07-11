<?php

namespace App\Http\Controllers\Staff;

use App\EloquentModels\Log\LogStaff;
use App\EloquentModels\Log\LogUser;
use App\EloquentModels\Staff\Event;
use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\User\User;
use App\Factories\Notification\NotificationFactory;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\SettingsHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use App\Utils\Iterables;
use App\Utils\Value;
use Illuminate\Http\Request;

class EventsController extends Controller {

    /**
     * Get Ban on Sight List
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBanOnSightList() {
        $settingKeys = ConfigHelper::getKeyConfig();
        $items = json_decode(SettingsHelper::getSettingValue($settingKeys->banOnSight));

        return response()->json(array_map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'reason' => $item->reason,
                'addedBy' => User::where('userId', $item->addedBy)->value('nickname'),
                'createdAt' => $item->createdAt
            ];
        }, $items));
    }

    /**
     * Post request for liking Host, validation for Current Host and last time since like
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createHostLike(Request $request) {
        $user = $request->get('auth');
        $nowMinus30Min = time() - 1800;

        $hour = date('G');
        $day = date('N');
        $current = Timetable::events()->with(['user'])->where('day', $day)->where('hour', $hour)->first();

        Condition::precondition(!$current, 404, 'No current event!');
        $eventUser = User::find($current->userId);

        Condition::precondition(!$current->user, 404, 'Cannot find host!');
        Condition::precondition($user->userId == 0, 400, 'You need to be logged in to like a host!');
        Condition::precondition($user->userId == $current->user->userId, 400, 'You can not like yourself');

        $haveLikedWithInLimit = LogUser::where('userId', $user->userId)
                ->where('action', Action::getAction(Action::LIKED_HOST))
                ->where('createdAt', '>', $nowMinus30Min)
                ->count('logId') > 0;
        Condition::precondition($haveLikedWithInLimit, 400, 'You are trying to like the Event Host too fast!');

        $eventUser->likes++;
        $eventUser->save();

        NotificationFactory::newLikeHost($eventUser->userId, $user->userId);
        Logger::user($user->userId, $request->ip(), Action::LIKED_HOST, [], $current->user->userId);
        return response()->json();
    }

    /**
     * Get Ban on Sight Entry
     *
     * @param $entryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBanOnSight($entryId) {
        $settingKeys = ConfigHelper::getKeyConfig();
        $entries = json_decode(SettingsHelper::getSettingValue($settingKeys->banOnSight));

        $entry = Iterables::find($entries, function ($entry) use ($entryId) {
            return $entry->id == $entryId;
        });

        return response()->json($entry);
    }

    /**
     * Put request for Ban on Sight Entry
     *
     * @param Request $request
     * @param $entryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateBanOnSight(Request $request, $entryId) {
        $settingKeys = ConfigHelper::getKeyConfig();
        $user = $request->get('auth');
        $information = (object)$request->input('information');
        $oldEntries = json_decode(SettingsHelper::getSettingValue($settingKeys->banOnSight));

        Condition::precondition(!isset($information->name), 400, 'Name missing');
        Condition::precondition(!isset($information->reason), 400, 'Reason missing');

        $newEntry = (object)[
            'id' => $entryId,
            'name' => $information->name,
            'reason' => $information->reason,
            'addedBy' => $user->userId,
            'createdAt' => time()
        ];
        $entries = Iterables::filter($oldEntries, function ($oldEntry) use ($entryId) {
            return $oldEntry->id != $entryId;
        });
        $entries[] = $newEntry;

        SettingsHelper::createOrUpdateSetting($settingKeys->banOnSight, json_encode($entries));
        Logger::staff($user->userId, $request->ip(), Action::UPDATED_BAN_ON_SIGHT, ['name' => $information->name]);

        return response()->json();
    }

    /**
     * Post request for Ban on Sight Entry
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createBanOnSight(Request $request) {
        $settingKeys = ConfigHelper::getKeyConfig();
        $user = $request->get('auth');
        $information = (object)$request->input('information');
        $entries = json_decode(SettingsHelper::getSettingValue($settingKeys->banOnSight));

        Condition::precondition(!isset($information->name), 400, 'Name missing');
        Condition::precondition(!isset($information->reason), 400, 'Reason missing');

        $entry = [
            'id' => count($entries) + 1,
            'name' => $information->name,
            'reason' => $information->reason,
            'addedBy' => $user->userId,
            'createdAt' => time()
        ];
        $entries[] = $entry;

        SettingsHelper::createOrUpdateSetting($settingKeys->banOnSight, json_encode($entries));
        Logger::staff($user->userId, $request->ip(), Action::CREATED_BAN_ON_SIGHT, ['name' => $information->name]);

        return response()->json($entry);
    }

    /**
     * Deleter Ban on Sight List Item
     *
     * @param Request $request
     * @param $entryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteBanOnSight(Request $request, $entryId) {
        $settingKeys = ConfigHelper::getKeyConfig();
        $user = $request->get('auth');
        $oldEntries = json_decode(SettingsHelper::getSettingValue($settingKeys->banOnSight));
        $oldEntry = Iterables::find($oldEntries, function ($entry) use ($entryId) {
            return $entry->id == $entryId;
        });
        $entry = Iterables::filter($oldEntries, function ($entry) use ($entryId) {
            return $entry->id != $entryId;
        });

        SettingsHelper::createOrUpdateSetting($settingKeys->banOnSight, json_encode($entry));
        Logger::staff($user->userId, $request->ip(), Action::DELETED_BAN_ON_SIGHT, ['name' => $oldEntry->name]);

        return response()->json();
    }

    /**
     * @param $page
     *
     * @return mixed
     */
    public function getBookingLog($page) {
        $bookAction = Action::getAction(Action::BOOKED_EVENT_SLOT);
        $unbookAction = Action::getAction(Action::UNBOOKED_EVENT_SLOT);

        $logSql = LogStaff::whereIn('action', [$bookAction, $unbookAction]);

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
     * Get request to fetch all available event types, resource used for
     * editing event types and not when booking a slot.
     *
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEventTypes(Request $request, $page) {
        $filter = $request->input('filter');

        $eventsSql = Event::where('name', 'LIKE', Value::getFilterValue($request, $filter))
            ->orderBy('name', 'ASC');

        $total = DataHelper::getPage($eventsSql->count('eventId'));
        $events = $eventsSql->take($this->perPage)->skip(DataHelper::getOffset($page))->get();

        return response()->json([
            'events' => $events,
            'page' => $page,
            'total' => $total
        ]);
    }

    /**
     * Post request for creating a new event type
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createEventType(Request $request) {
        $user = $request->get('auth');
        $newEvent = (object)$request->input('event');

        Condition::precondition(!$newEvent, 400, 'Empty body!');
        Condition::precondition(!isset($newEvent->name), 400, 'Missing name!');

        $existingEvent = Event::withName($newEvent->name)->count('eventId') > 0;
        Condition::precondition($existingEvent, 400, 'Name already exists');

        $event = new Event([
            'name' => $newEvent->name
        ]);
        $event->save();

        Logger::staff($user->userId, $request->ip(), Action::CREATED_EVENT_TYPE, [
            'event' => $event->name
        ]);
        return response()->json($event);
    }

    /**
     * Put request to update an existing event type
     *
     * @param Request $request
     * @param         $eventId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateEventType(Request $request, $eventId) {
        $user = $request->get('auth');
        $newEvent = (object)$request->input('event');
        $event = Event::find($eventId);

        Condition::precondition(!$event, 404, 'Event type do not exist');
        Condition::precondition(!$newEvent, 400, 'Empty body!');
        Condition::precondition(!$newEvent->name, 400, 'Missing name!');

        $event->name = $newEvent->name;
        $event->save();

        Logger::staff($user->userId, $request->ip(), Action::UPDATED_EVENT_TYPE, [
            'event' => $event->name
        ]);
        return response()->json();
    }

    /**
     * Delete request to remove an existing event type.
     *
     * @param Request $request
     * @param         $eventId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteEventType(Request $request, $eventId) {
        $user = $request->get('auth');
        $event = Event::find($eventId);

        Condition::precondition(!$event, 404, 'Event type do not exist');

        $event->isDeleted = true;
        $event->save();

        Logger::staff($user->userId, $request->ip(), Action::DELETED_EVENT_TYPE, [
            'event' => $event->name
        ]);
        return response()->json();
    }

    /**
     * Get request for all booked slots that are active
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTimetable() {
        return response()->json([
            'timetable' => Timetable::events()->isActive()->get(),
            'events' => Event::orderBy('name', 'ASC')->get(),
            'timezones' => ConfigHelper::getTimetable()
        ]);
    }

    /**
     * Delete request to delete existing booking.
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

        Logger::staff($user->userId, $request->ip(), Action::UNBOOKED_EVENT_SLOT, ['timetableId' => $booking->timetableId]);
        return response()->json();
    }

    public function updateBooking(Request $request, $timetableId) {
        $user = $request->get('auth');
        $data = (object)$request->input('data');

        $slot = Timetable::find($timetableId);
        Condition::precondition(!$slot, 404, 'No slot with that ID');
        $event = Event::find($data->eventId);
        Condition::precondition(!$event, 404, 'Selected event do not exist');

        $bookingForUser = User::withNickname(Value::objectProperty($data, 'nickname', ''))->first();
        Condition::precondition(isset($data->nickname) && !empty($data->nickname) && !$bookingForUser,
            404, 'No user with that nickname');

        $link = '';
        if (isset($data->link) && !empty($data->link)) {
            $link = $data->link;
            Condition::precondition(!preg_match(ConfigHelper::getRegex()->HABBO_ROOM, $link), 400, 'The room link is not valid');
        }

        $userIdBefore = $slot->userId;
        $eventIdBefore = $slot->eventId;

        $slot->userId = $bookingForUser ? $bookingForUser->userId : $user->userId;
        $slot->eventId = $event->eventId;
        $slot->link = $link;
        $slot->save();

        Logger::staff($user->userId, $request->ip(), Action::EDITED_TIMETABLE_SLOT, [
            'userIdBefore' => $userIdBefore,
            'userIdAfter' => $slot->userId,
            'eventIdBefore' => $eventIdBefore,
            'eventIdAfter' => $slot->eventId
        ], $slot->timetableId);;
        return response()->json([
            'timetableId' => $slot->timetableId,
            'createdAt' => time(),
            'user' => UserHelper::getUser($slot->userId),
            'event' => $event,
            'link' => $slot->link
        ]);
    }

    /**
     * Post request to create a booking.
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
        Condition::precondition(!isset($booking->eventId), 400, 'You need to select an event to host');

        $event = Event::find($booking->eventId);
        Condition::precondition(!$event, 404, 'Selected event do not exist');

        $canBookForOthers = PermissionHelper::haveStaffPermission($user->userId, ConfigHelper::getStaffConfig()->canBookEventForOthers);
        $bookingForUser = User::withNickname(Value::objectProperty($booking, 'nickname', ''))->first();
        Condition::precondition(isset($booking->nickname) && !$bookingForUser, 404, 'No user by the name ' . Value::objectProperty($booking, 'nickname', ''));
        Condition::precondition($bookingForUser && $bookingForUser->userId != $user->userId && !$canBookForOthers, 400, 'You can not book for someone else');

        $existing = Timetable::events()->where('day', $booking->day)->where('hour', $booking->hour)->isActive()->count('timetableId') > 0;
        Condition::precondition($existing, 400, 'Booking already exists on this slot');
        $userId = $bookingForUser ? $bookingForUser->userId : $user->userId;

        $link = '';
        if (isset($booking->link) && !empty($booking->link)) {
            $link = $booking->link;
            Condition::precondition(!preg_match(ConfigHelper::getRegex()->HABBO_ROOM, $link), 400, 'The room link is not valid');
        }

        $timetable = new Timetable([
            'userId' => $userId,
            'day' => $booking->day,
            'hour' => $booking->hour,
            'isPerm' => 0,
            'type' => 1,
            'eventId' => $event->eventId,
            'link' => $link
        ]);
        $timetable->save();

        Logger::staff($user->userId, $request->ip(), Action::BOOKED_EVENT_SLOT, [], $timetable->timetableId);;
        return response()->json([
            'timetableId' => $timetable->timetableId,
            'createdAt' => time(),
            'user' => UserHelper::getUser($userId),
            'event' => $event,
            'link' => $timetable->link
        ]);
    }
}
