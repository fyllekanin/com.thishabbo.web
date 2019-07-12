<?php

namespace App\Http\Controllers\Puller;

use App\EloquentModels\Forum\IgnoredCategory;
use App\EloquentModels\Forum\IgnoredThread;
use App\EloquentModels\SiteMessage;
use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\SettingsHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Models\Radio\RadioSettings;
use App\Services\ActivityService;
use App\Services\ForumService;
use App\Services\NotificationService;
use App\Utils\BBcodeUtil;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
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
     * @return JsonResponse
     */
    public function getPull(Request $request) {
        $user = $request->get('auth');
        $activeUsers = $this->getActiveUsers();
        $siteMessages = $this->getSiteMessages();

        $ignoredCategoryIds = array_merge(IgnoredCategory::where('userId', $user->userId)->pluck('categoryId')->toArray(),
            $this->forumService->getCategoriesUserCantSeeOthersThreadsIn($user->userId));
        $categoryIds = [];
        $ignoredThreadIds = IgnoredThread::where('userId', $user->userId)->pluck('threadId');
        foreach ($this->forumService->getAccessibleCategories($user->userId) as $categoryId) {
            if (!in_array($categoryId, $ignoredCategoryIds)) {
                $categoryIds[] = $categoryId;
            }
        }
        $activities = $this->activityService->getLatestActivities($categoryIds, $ignoredThreadIds);

        return response()->json([
            'radio' => $this->getRadioStats(),
            'events' => $this->getEventsStats(),
            'unreadNotifications' => $this->getAmountOfUnreadNotifications($user),
            'siteMessages' => $siteMessages,
            'activities' => $activities,
            'footer' => [
                'month' => $this->getStaffMemberOfTheMonth(),
                'activeUsers' => $activeUsers
            ],
            'user' => $user->userId > 0 ? [
                'credits' => UserHelper::getUserDataOrCreate($user->userId)->credits,
                'xp' => UserHelper::getUserDataOrCreate($user->userId)->xp
            ] : null
        ]);
    }

    private function getStaffMemberOfTheMonth() {
        $motm = json_decode(SettingsHelper::getSettingValue($this->settingKeys->memberOfTheMonth));

        $member = User::withNickname(Value::objectProperty($motm, 'member', ''))->first();
        $staff = User::withNickname(Value::objectProperty($motm, 'staff', ''))->first();

        return [
            'member' => $member ? UserHelper::getSlimUser($member->userId) : null,
            'staff' => $staff ? UserHelper::getSlimUser($staff->userId) : null,
            'month' => Value::objectProperty($motm, 'month', null),
            'year' => Value::objectProperty($motm, 'year', date('Y')),
        ];
    }

    private function getEventsStats() {
        $hour = date('G');
        $day = date('N');
        $current = Timetable::events()->with(['user', 'event'])->where('day', $day)->where('hour', $hour)->first();
        $next = Timetable::events()->with(['user', 'event'])->where('day', $this->getNextDay($day, $hour))->where('hour', $this->getNextHour($hour))->first();

        return [
            'currentHost' => $current ? UserHelper::getSlimUser($current->user->userId) : null,
            'event' => $current ? $current->event->name : null,
            'nextHost' => $next ? UserHelper::getSlimUser($next->user->userId) : null,
            'nextEvent' => $next ? $next->event->name : null,
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

        $stats->currentDj = UserHelper::getSlimUser($stats->userId);
        $stats->nextDj = UserHelper::getSlimUser($stats->nextDjId);
        return $stats;
    }

    /**
     * @param $user
     *
     * @return int
     */
    private function getAmountOfUnreadNotifications($user) {
        return DB::table('notifications')
            ->where('readAt', '<', 1)
            ->where('userId', $user->userId)
            ->get(['contentId', 'type'])
            ->filter(function ($notification) use ($user) {
                return $this->notificationService
                    ->isNotificationValid($notification->contentId, $notification->type, $user);
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
        return User::orderBy('lastActivity', 'DESC')
            ->leftJoin('userdata', 'userdata.userId', '=', 'users.userId')
            ->take(28)
            ->get(['users.nickname', 'users.userId', 'userdata.avatarUpdatedAt']);
    }
}
