<?php

namespace App\Http\Controllers\Puller;

use App\Constants\Permission\CategoryPermissions;
use App\Constants\SettingsKeys;
use App\EloquentModels\Forum\IgnoredCategory;
use App\EloquentModels\Forum\IgnoredThread;
use App\EloquentModels\SiteMessage;
use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\User\User;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Providers\Service\ActivityService;
use App\Providers\Service\ContentService;
use App\Providers\Service\ForumService;
use App\Providers\Service\NotificationService;
use App\Providers\Service\RadioService;
use App\Repositories\Repository\CategoryRepository;
use App\Repositories\Repository\SettingRepository;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StreamController extends Controller {
    private $myNotificationService;
    private $myForumService;
    private $myActivityService;
    private $myContentService;
    private $myRadioService;
    private $mySettingRepository;
    private $myCategoryRepository;

    public function __construct(
        NotificationService $notificationService,
        ForumService $forumService,
        ActivityService $activityService,
        ContentService $contentService,
        RadioService $radioService,
        SettingRepository $settingRepository,
        CategoryRepository $categoryRepository
    ) {
        parent::__construct();
        $this->myNotificationService = $notificationService;
        $this->myForumService = $forumService;
        $this->myActivityService = $activityService;
        $this->myContentService = $contentService;
        $this->myRadioService = $radioService;
        $this->mySettingRepository = $settingRepository;
        $this->myCategoryRepository = $categoryRepository;
    }

    /**
     * Radio stats response stream, stream the radio stats every 5sec from the database.
     * The stats are updated every 5sec in a cron job.
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getPull(Request $request) {
        $user = $request->get('auth');
        $activeUsers = $this->getActiveUsers();
        $siteMessages = $this->getSiteMessages();

        $ignoredCategoryIds = array_merge(
            IgnoredCategory::where('userId', $user->userId)->pluck('categoryId')->toArray(),
            $this->myForumService->getCategoriesUserCantSeeOthersThreadsIn($user->userId)
        );
        $ignoredThreadIds = IgnoredThread::where('userId', $user->userId)->pluck('threadId')->toArray();
        $categoryIds = $this->myCategoryRepository
            ->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ)
            ->filter(function ($categoryId) use ($ignoredCategoryIds) {
                return !in_array($categoryId, $ignoredCategoryIds);
            })
            ->values();
        $activities = $this->myActivityService->getLatestActivities($user, $categoryIds, $ignoredThreadIds);

        return response()->json(
            [
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
            ]
        );
    }

    private function getStaffMemberOfTheMonth() {
        $motm = $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::MEMBER_OF_THE_MONTH);

        $member = User::withNickname(Value::objectProperty($motm, 'member', ''))->first();
        $photo = User::withNickname(Value::objectProperty($motm, 'photo', ''))->first();

        return [
            'member' => $member ? UserHelper::getSlimUser($member->userId) : null,
            'photo' => $photo ? UserHelper::getSlimUser($photo->userId) : null,
            'month' => Value::objectProperty($motm, 'month', null),
            'year' => Value::objectProperty($motm, 'year', date('Y')),
        ];
    }

    private function getEventsStats() {
        $hour = date('G');
        $day = date('N');
        $current = Timetable::events()->with(['user', 'event'])->isActive()->where('day', $day)->where('hour', $hour)->first();
        $next = Timetable::events()
            ->with(['user', 'event'])
            ->isActive()
            ->where('day', $this->getNextDay($day, $hour))
            ->where('hour', $this->getNextHour($hour))
            ->first();

        $currentEvent = $this->getEventName($current);
        $nextEvent = $this->getEventName($next);
        return [
            'currentHost' => $current ? UserHelper::getSlimUser($current->user->userId) : null,
            'event' => $currentEvent,
            'nextHost' => $next ? UserHelper::getSlimUser($next->user->userId) : null,
            'nextEvent' => $nextEvent,
            'link' => $current ? $current->link : null
        ];
    }

    private function getEventName($slot) {
        if (!$slot) {
            return null;
        }

        if ($slot->isPerm) {
            return $slot->timetableData->name;
        }
        return $slot->event->name;
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
        $stats = $this->myRadioService->getRadioConnection(false);
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
            ->filter(
                function ($notification) use ($user) {
                    return $this->myNotificationService
                        ->isNotificationValid($notification->contentId, $notification->type, $user);
                }
            )->count('notificationId');
    }

    /**
     * @return mixed
     */
    private function getSiteMessages() {
        return SiteMessage::query()->isActive()->orderBy('createdAt', 'DESC')->get(['title', 'content', 'type', 'siteMessageId'])
            ->map(
                function ($siteMessage) {
                    return [
                        'siteMessageId' => $siteMessage->siteMessageId,
                        'title' => $siteMessage->title,
                        'type' => $siteMessage->type,
                        'content' => $this->myContentService->getParsedContent($siteMessage->content)
                    ];
                }
            );
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
