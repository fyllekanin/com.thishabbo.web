<?php

namespace App\Http\Controllers\Puller;

use App\Factories\Notification\NotificationView;
use App\Http\Controllers\Controller;
use App\Models\Notification\Type;
use App\Services\NotificationService;
use App\Utils\Iterables;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller {
    private $notificationService;

    public function __construct(NotificationService $notificationService) {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function readAllNotifications() {
        $user = Cache::get('auth');
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
            ->where('readAt', 0)
            ->where('userId', $user->userId)
            ->whereIN('type', $types)
            ->update(['readAt' => time()]);
        return response()->json();
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function readAllMessages() {
        $user = Cache::get('auth');
        $types = [
            Type::getType(Type::VISITOR_MESSAGE)
        ];

        DB::table('notifications')
            ->where('readAt', 0)
            ->where('userId', $user->userId)
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
        $user = Cache::get('auth');

        DB::table('notifications')
            ->where('notificationId', $notificationId)
            ->where('userId', $user->userId)
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
        $user = Cache::get('auth');

        $notifications = DB::table('notifications')
            ->where('createdAt', '>=', $createdAfter)
            ->where('readAt', 0)
            ->where('userId', $user->userId)
            ->get()->toArray();

        return array_map(function ($notification) use ($user) {
            return new NotificationView($notification, $user);
        }, Iterables::filter($notifications, function ($notification) use ($user) {
            return $this->notificationService->isNotificationValid($notification->contentId, $notification->type);
        }));
    }
}
