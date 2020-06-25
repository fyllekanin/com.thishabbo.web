<?php

namespace App\Http\Controllers\Puller;

use App\Constants\NotificationTypes;
use App\Factories\Notification\NotificationView;
use App\Http\Controllers\Controller;
use App\Providers\Service\NotificationService;
use App\Utils\Iterables;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller {
    private $myNotificationService;

    public function __construct(NotificationService $notificationService) {
        parent::__construct();
        $this->myNotificationService = $notificationService;
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function readAllNotifications(Request $request) {
        $user = $request->get('auth');
        $types = [
            NotificationTypes::FOLLOWED,
            NotificationTypes::BADGE,
            NotificationTypes::CATEGORY_SUBSCRIPTION,
            NotificationTypes::INFRACTION_DELETED,
            NotificationTypes::INFRACTION_GIVEN,
            NotificationTypes::MENTION,
            NotificationTypes::QUOTE,
            NotificationTypes::THREAD_SUBSCRIPTION,
            NotificationTypes::LIKE_POST,
            NotificationTypes::LIKE_DJ,
            NotificationTypes::RADIO_REQUEST,
            NotificationTypes::LIKE_HOST,
            NotificationTypes::REFERRAL,
            NotificationTypes::SENT_CREDITS
        ];

        DB::table('notifications')
            ->where('readAt', '<', 1)
            ->where('userId', $user->userId)
            ->whereIN('type', $types)
            ->update(['readAt' => time()]);
        return response()->json();
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function readAllMessages(Request $request) {
        $user = $request->get('auth');
        $types = [
            NotificationTypes::VISITOR_MESSAGE
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
     * @param  Request  $request
     * @param $notificationId
     *
     * @return JsonResponse
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
     * @param  Request  $request
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

        return array_map(
            function ($notification) use ($user) {
                return new NotificationView($notification, $user);
            },
            Iterables::filter(
                $notifications,
                function ($notification) use ($user) {
                    return $this->myNotificationService->isNotificationValid($notification->contentId, $notification->type, $user);
                }
            )
        );
    }
}
