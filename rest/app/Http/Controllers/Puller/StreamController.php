<?php

namespace App\Http\Controllers\Puller;

use App\EloquentModels\SiteMessage;
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
use Symfony\Component\HttpFoundation\StreamedResponse;

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
     * @return StreamedResponse
     */
    public function getStream(Request $request) {
        $response = new StreamedResponse();
        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $userId = $request->input('userId');

        $response->setCallback(function () use ($userId) {
            $activeUsers = $this->getActiveUsers();
            $siteMessages = $this->getSiteMessages();
            $activities = $this->activityService->getLatestActivities($this->forumService->getAccessibleCategories($userId));

            for ($i = 0; $i < 6; $i++) {
                $stats = [
                    'radio' => $this->getRadioStats(),
                    'unreadNotifications' => $this->getAmountOfUnreadNotifications($userId),
                    'siteMessages' => $siteMessages,
                    'activeUsers' => $activeUsers,
                    'activities' => $activities
                ];

                echo 'data: ' . json_encode($stats) . "\n\n";
                ob_flush();
                flush();

                if ($i == 5) {
                    sleep(3);
                    break;
                }

                sleep(5);
            }
        });
        return $response;
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
