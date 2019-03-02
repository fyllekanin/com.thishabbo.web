<?php

namespace App\Http\Controllers\Puller;

use App\EloquentModels\SiteMessage;
use App\Helpers\ConfigHelper;
use App\Helpers\SettingsHelper;
use App\Http\Controllers\Controller;
use App\Models\Radio\RadioSettings;
use App\Services\ForumService;
use App\Services\NotificationService;
use App\Utils\BBcodeUtil;
use App\Utils\Iterables;
use App\Utils\Value;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StreamController extends Controller {
    private $settingKeys;
    private $notificationService;

    /**
     * RadioController constructor.
     * Set the needed settings keys in instance variable for easier access
     *
     * @param NotificationService $notificationService
     */
    public function __construct (NotificationService $notificationService) {
        parent::__construct();
        $this->settingKeys = ConfigHelper::getKeyConfig();
        $this->notificationService = $notificationService;
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

        $response->setCallback(function () use ($request) {
            $finish = time() + 30;
            $siteMessages = SiteMessage::isActive()->orderBy('createdAt', 'DESC')->get(['title', 'content', 'type', 'siteMessageId'])
                ->map(function($siteMessage) {
                    return [
                        'siteMessageId' => $siteMessage->siteMessageId,
                        'title' => $siteMessage->title,
                        'type' => $siteMessage->type,
                        'content' => BBcodeUtil::bbcodeParser($siteMessage->content)
                    ];
                });
            while (true) {
                $stats = [
                    'radio' => $this->getRadioStats(),
                    'unreadNotifications' => $this->getAmountOfUnreadNotifications($request->input('userId')),
                    'siteMessages' => $siteMessages
                ];
                echo 'data: ' . json_encode($stats) . "\n\n";
                ob_flush();
                flush();

                if (time() > $finish) {
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
        return new RadioSettings(SettingsHelper::getSettingValue($this->settingKeys->radio));
    }

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
}
