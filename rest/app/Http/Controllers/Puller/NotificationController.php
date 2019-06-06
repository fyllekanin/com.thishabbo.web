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

    public function __construct(Request $request, NotificationService $notificationService) {
        parent::__construct($request);
        $this->notificationService = $notificationService;
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function readAllNotifications() {
        $types = [
            Type::getType(Type::FOLLOWED),
            Type::getType(Type::BADGE),
            Type::getType(Type::CATEGORY_SUBSCRIPTION),
            Type::getType(Type::INFRACTION_DELETED),
            Type::getType(Type::INFRACTION_GIVEN),
            Type::getType(Type::MENTION),
            Type::getType(Type::QUOTE),
            Type::getType(Type::THREAD_SUBSCRIPTION)
        ];

        DB::table('notifications')
            ->where('readAt', '<', 1)
            ->where('userId', $this->user->userId)
            ->whereIN('type', $types)
            ->update(['readAt' => time()]);
        return response()->json();
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function readAllMessages() {
        $types = [
            Type::getType(Type::VISITOR_MESSAGE)
        ];

        DB::table('notifications')
            ->where('readAt', '<', 1)
            ->where('userId', $this->user->userId)
            ->whereIN('type', $types)
            ->update(['readAt' => time()]);
        return response()->json();
    }

    /**
     * Performs a read action on the specific notification
     * and mark it as read.
     *
     * @param         $notificationId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function readNotification($notificationId) {
        DB::table('notifications')
            ->where('notificationId', $notificationId)
            ->where('userId', $this->user->userId)
            ->update(['readAt' => time()]);

        return response()->json();
    }

    /**
     * Get request for fetching unread notification
     *
     * @param         $createdAfter
     *
     * @return array NotificationView
     */
    public function getUnreadNotifications($createdAfter) {
        $notifications = DB::table('notifications')
            ->where('createdAt', '>=', $createdAfter)
            ->where('readAt', '<', 1)
            ->where('userId', $this->user->userId)
            ->get()->toArray();

        return array_map(function ($notification) {
            return new NotificationView($notification, $this->user);
        }, Iterables::filter($notifications, function ($notification) {
            return $this->notificationService->isNotificationValid($notification->contentId, $notification->type);
        }));
    }
}
