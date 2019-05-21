<?php

namespace App\Http\Controllers\Puller;

use App\EloquentModels\SiteMessage;
use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\SettingsHelper;
use App\Http\Controllers\Controller;
use App\Models\Radio\RadioSettings;
use App\Services\ActivityService;
use App\Services\ForumService;
use App\Services\NotificationService;
use App\Utils\BBcodeUtil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StreamController extends Controller {
    private $settingKeys;
    private $notificationService;
    private $forumService;
    private $activityService;

    /**
     * RadioController constructor.
     * Set the needed settings keys in instance variable for easier access
     *
     * @param NotificationService $notificationService
     * @param ForumService $forumService
     * @param ActivityService $activityService
     */
    public function __construct(NotificationService $notificationService, ForumService $forumService, ActivityService $activityService) {
        parent::__construct();
        $this->settingKeys = ConfigHelper::getKeyConfig();
        $this->notificationService = $notificationService;
        $this->forumService = $forumService;
        $this->activityService = $activityService;
    }

    /**
     * Radio stats response stream, stream the radio stats every 5sec from the database.
     * The stats are updated every 5sec in a cron job.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPull(Request $request) {
        $user = $request->get('auth');
        $activeUsers = $this->getActiveUsers();
        $siteMessages = $this->getSiteMessages();
        $activities = $this->activityService->getLatestActivities($this->forumService->getAccessibleCategories($user->userId));

        return response()->json([
            'radio' => $this->getRadioStats(),
            'events' => $this->getEventsStats(),
            'unreadNotifications' => $this->getAmountOfUnreadNotifications($user->userId),
            'siteMessages' => $siteMessages,
            'activeUsers' => $activeUsers,
            'activities' => $activities
        ]);
    }

    private function getEventsStats() {
        $hour = date('G');
        $day = date('N');
        $current = Timetable::events()->with(['user', 'event'])->where('day', $day)->where('hour', $hour)->first();
        $next = Timetable::events()->with(['user', 'event'])->where('day', $this->getNextDay($day, $hour))->where('hour', $this->getNextHour($hour))->first();

        $settingKeys = ConfigHelper::getKeyConfig();
        return [
            'nickname' => $current ? $current->user->nickname : null,
            'event' => $current ? $current->event->name : null,
            'nextHost' => $next ? $next->user->nickname : null,
            'nextEvent' => $next ? $next->event->name : null,
            'says' => SettingsHelper::getSettingValue($settingKeys->eventsSay),
            'link' => $current ? $current->link : null
        ];
    }

    private function getNextDay($day, $hour) {
        if (($hour + 1) > 23) {
            return ($day + 1) > 7 ? 1 : $day + 1;
        }
        return $day;
    }

    private function getNextHour($hour) {
        if (($hour + 1) > 23) {
            return ($hour + 1) - 24;
        }
        return $hour + 1;
    }

    /**
     * Return the structured object with radio stats
     *
     * @return object
     */
    private function getRadioStats() {
        $stats = new RadioSettings(SettingsHelper::getSettingValue($this->settingKeys->radio));
        $stats->adminPassword = null;
        $stats->password = null;
        return $stats;
    }

    /**
     * @param $userId
     *
     * @return int
     */
    private function getAmountOfUnreadNotifications($userId) {
        return DB::table('notifications')
            ->where('readAt', '<', 1)
            ->where('userId', $userId)
            ->get(['contentId', 'type'])
            ->filter(function ($notification) use ($userId) {
                return $this->notificationService
                    ->isNotificationValid($notification->contentId, $notification->type);
            })->count('notificationId');
    }

    /**
     * @return mixed
     */
    private function getSiteMessages() {
        return SiteMessage::isActive()->orderBy('createdAt', 'DESC')->get(['title', 'content', 'type', 'siteMessageId'])
            ->map(function ($siteMessage) {
                return [
                    'siteMessageId' => $siteMessage->siteMessageId,
                    'title' => $siteMessage->title,
                    'type' => $siteMessage->type,
                    'content' => BBcodeUtil::bbcodeParser($siteMessage->content)
                ];
            });
    }

    /**
     * @return mixed
     */
    private function getActiveUsers() {
        return User::orderBy('lastActivity', 'DESC')->take(28)->get(['nickname', 'userId']);
    }
}
