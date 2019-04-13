<?php

namespace App\Http\Controllers\Puller;

use App\Factories\Notification\NotificationView;
use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use App\Utils\Iterables;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller {
    private $notificationService;

    public function __construct (NotificationService $notificationService) {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function readAllNotifications() {
        $user = Cache::get('auth');
        DB::table('notifications')
            ->where('readAt', 0)
            ->where('userId', $user->userId)
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
    public function readNotification ($notificationId) {
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
    public function getUnreadNotifications ($createdAfter) {
        $user = Cache::get('auth');

        $notifications = DB::table('notifications')
            ->where('createdAt', '>=', $createdAfter)
            ->where('readAt', 0)
            ->where('userId', $user->userId)
            ->get()->toArray();

        return array_map(function($notification) use ($user) {
            return new NotificationView($notification, $user);
        }, Iterables::filter($notifications, function($notification) use ($user) {
            return $this->notificationService->isNotificationValid($notification->contentId, $notification->type);
        }));
    }
}
