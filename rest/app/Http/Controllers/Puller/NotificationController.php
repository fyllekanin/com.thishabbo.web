<?php

namespace App\Http\Controllers\Puller;

use App\EloquentModels\Forum\Post;
use App\Factories\Notification\NotificationView;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use App\Utils\Iterables;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller {
    private $notificationService;

    public function __construct (NotificationService $notificationService) {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function readAllNotifications(Request $request) {
        $user = UserHelper::getUserFromRequest($request);
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
     * @param Request $request
     * @param         $notificationId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function readNotification (Request $request, $notificationId) {
        $user = UserHelper::getUserFromRequest($request);

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
     * @param         $createdAfter
     *
     * @return array NotificationView
     */
    public function getUnreadNotifications (Request $request, $createdAfter) {
        $user = UserHelper::getUserFromRequest($request);

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
