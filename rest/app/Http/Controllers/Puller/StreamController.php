<?php

namespace App\Http\Controllers\Puller;

use App\EloquentModels\Log\LogUser;
use App\EloquentModels\SiteMessage;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\SettingsHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Models\Logger\Action;
use App\Models\Radio\RadioSettings;
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

    /**
     * RadioController constructor.
     * Set the needed settings keys in instance variable for easier access
     *
     * @param NotificationService $notificationService
     * @param ForumService $forumService
     */
    public function __construct (NotificationService $notificationService, ForumService $forumService) {
        parent::__construct();
        $this->settingKeys = ConfigHelper::getKeyConfig();
        $this->notificationService = $notificationService;
        $this->forumService = $forumService;
    }

    /**
     * Radio stats response stream, stream the radio stats every 5sec from the database.
     * The stats are updated every 5sec in a cron job.
     *
     * @param Request $request
     *
     * @return StreamedResponse
     */
    public function getStream (Request $request) {
        $response = new StreamedResponse();
        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $userId = $request->input('userId');

        $response->setCallback(function () use ($userId) {
            $activeUsers = $this->getActiveUsers();
            $siteMessages = $this->getSiteMessages();
            $activities = $this->getLatestActivities($userId);

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
    private function getRadioStats () {
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
            ->where('readAt', 0)
            ->where('userId', $userId)
            ->get(['contentId', 'type'])
            ->filter(function($notification) use ($userId) {
                return $this->notificationService
                    ->isNotificationValid($notification->contentId, $notification->type);
            })->count();
    }

    /**
     * @return mixed
     */
    private function getSiteMessages() {
        return SiteMessage::isActive()->orderBy('createdAt', 'DESC')->get(['title', 'content', 'type', 'siteMessageId'])
            ->map(function($siteMessage) {
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

    /**
     * @param $userId
     *
     * @return array
     */
    private function getLatestActivities($userId) {
        $supportedTypes = $this->getSupportedLogIds();
        $categoryIds = $this->forumService->getAccessibleCategories($userId);

        $activities = [];
        $limit = 5;

        while(count($activities) < $limit) {
            $lastItem = end($activities);
            $item = null;
            if ($lastItem) {
                $item = LogUser::whereIn('action', $supportedTypes)->orderBy('createdAt', 'DESC')->where('logId', '<', $lastItem->logId)->first();
            } else {
                $item = LogUser::whereIn('action', $supportedTypes)->orderBy('createdAt', 'DESC')->first();
            }

            if (!$item) {
                break;
            }

            $item->data = isset($item->data) && !empty($item->data) ? (object) json_decode($item->data) : new \stdClass();
            if ($this->isItemValid($item, $categoryIds)) {
                $activities[] = $this->convertItem($item);
            }
        }

        return $activities;
    }

    /**
     * @param $item
     * @param $categoryIds
     *
     * @return bool
     */
    private function isItemValid($item, $categoryIds) {
        if (!$this->isThreadRelatedAction($item)) {
            return true;
        }
        return in_array($item->data->categoryId, $categoryIds);
    }

    /**
     * @return array
     */
    private function getSupportedLogIds() {
        return array_map(function($action) {
            return $action['id'];
        }, [
            Action::CREATED_POST,
            Action::CREATED_THREAD,
            Action::LIKED_POST,
            Action::LIKED_DJ,
            Action::STARTED_FASTEST_TYPE_GAME,
            Action::STARTED_SNAKE_GAME,
            Action::WON_ROULETTE,
            Action::LOST_ROULETTE
        ]);
    }

    /**
     * @param $item
     *
     * @return object
     */
    private function convertItem($item) {
        return (object) [
            'logId' => $item->logId,
            'user' => UserHelper::getSlimUser($item->userId),
            'type' => $item->action,
            'thread' => $this->isThreadRelatedAction($item) ? $item->data->thread : null
        ];
    }

    /**
     * @param $item
     *
     * @return bool
     */
    private function isThreadRelatedAction($item) {
        return in_array($item->action, [Action::CREATED_POST['id'], Action::CREATED_THREAD['id'], Action::LIKED_POST['id']]);
    }
}
