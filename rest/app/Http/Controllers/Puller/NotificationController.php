<?php

namespace App\Http\Controllers\Puller;

use App\Factories\Notification\NotificationView;
use App\Http\Controllers\Controller;
use App\Models\Notification\Type;
use App\Services\NotificationService;
use App\Utils\Iterables;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller {
    private $notificationService;

    public function __construct(NotificationService $notificationService) {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function readAllNotifications(Request $request) {
        $user = $request->get('auth');
        $types = [
            Type::getType(Type::FOLLOWED),
            Type::getType(Type::BADGE),
            Type::getType(Type::CATEGORY_SUBSCRIPTION),
            Type::getType(Type::INFRACTION_DELETED),
            Type::getType(Type::INFRACTION_GIVEN),
            Type::getType(Type::MENTION),
            Type::getType(Type::QUOTE),
            Type::getType(Type::THREAD_SUBSCRIPTION),
            Type::getType(Type::LIKE_POST),
            Type::getType(Type::LIKE_DJ),
            Type::getType(Type::RADIO_REQUEST),
            Type::getType(Type::LIKE_HOST),
            Type::getType(Type::REFERRAL)
        ];

        DB::table('notifications')
            ->where('readAt', '<', 1)
            ->where('userId', $user->userId)
            ->whereIN('type', $types)
            ->update(['readAt' => time()]);
        return response()->json();
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function readAllMessages(Request $request) {
        $user = $request->get('auth');
        $types = [
            Type::getType(Type::VISITOR_MESSAGE)
        ];

        DB::table('notifications')
            ->where('readAt', '<', 1)
            ->where('userId', $user->userId)
            ->whereIN('type', $types)
            ->update(['readAt' => time()]);
        return response()->json();
    }

    /**
     * Performs a read action on the specific notification
     * and mark it as read.
     *
     * @param Request $request
     * @param         $notificationId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function readNotification(Request $request, $notificationId) {
        $user = $request->get('auth');

        DB::table('notifications')
            ->where('notificationId', $notificationId)
            ->where('userId', $user->userId)
            ->update(['readAt' => time()]);

        return response()->json();
    }

    /**
     * Get request for fetching unread notification
     *
     * @param Request $request
     *
     * @return array NotificationView
     */
    public function getUnreadNotifications(Request $request) {
        $user = $request->get('auth');

        $notifications = DB::table('notifications')
            ->where('readAt', '<', 1)
            ->where('userId', $user->userId)
            ->get()
            ->toArray();

        return array_map(function ($notification) {
            return new NotificationView($notification);
        }, Iterables::filter($notifications, function ($notification) use ($user) {
            return $this->notificationService->isNotificationValid($notification->contentId, $notification->type, $user);
        }));
    }
}
