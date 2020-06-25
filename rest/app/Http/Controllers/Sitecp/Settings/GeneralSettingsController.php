<?php

namespace App\Http\Controllers\Sitecp\Settings;

use App\Constants\LogType;
use App\Constants\SettingsKeys;
use App\EloquentModels\SiteMessage;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Providers\Service\ForumService;
use App\Repositories\Repository\SettingRepository;
use App\Utils\Condition;
use App\Utils\Value;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GeneralSettingsController extends Controller {
    private $myWelcomeBotKeys = [];
    private $myForumService;
    private $mySettingRepository;

    public function __construct(ForumService $forumService, SettingRepository $settingRepository) {
        parent::__construct();
        $this->myForumService = $forumService;
        $this->mySettingRepository = $settingRepository;
        $this->myWelcomeBotKeys = [
            SettingsKeys::BOT_USER_ID,
            SettingsKeys::WELCOME_BOT_MESSAGE,
            SettingsKeys::WELCOME_BOT_CATEGORY_ID
        ];
    }

    /**
     * @return JsonResponse
     */
    public function getSiteMessages() {
        return response()->json(SiteMessage::query()->isActive()->orderBy('siteMessageId', 'DESC')->get());
    }

    /**
     * @param $siteMessageId
     *
     * @return JsonResponse
     */
    public function getSiteMessage($siteMessageId) {
        $siteMessage = SiteMessage::find($siteMessageId);
        Condition::precondition(!$siteMessage, 404, 'Site message with that ID do not exist');

        return response()->json($siteMessage);
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createSiteMessage(Request $request) {
        $user = $request->get('auth');
        $data = (object) $request->input('data');

        Condition::precondition(
            !isset($data->title) || empty($data->title),
            400,
            'Title can not be empty!'
        );
        Condition::precondition(
            !is_numeric($data->type) || $data->type > 3 || $data->type < 1,
            400,
            'Type is not valid'
        );
        Condition::precondition(
            !isset($data->content) || empty($data->content),
            400,
            'Content can not be empty!'
        );
        Condition::precondition(
            !isset($data->expiresAt) || empty($data->expiresAt),
            400,
            'Expires at need to be set'
        );
        Condition::precondition(
            strtotime($data->expiresAt) > time(),
            400,
            'Expires at need to be in the future (at least one day ahead)'
        );

        $siteMessage = new SiteMessage(
            [
                'title' => $data->title,
                'expiresAt' => $data->expiresAt,
                'content' => $data->content,
                'type' => $data->type
            ]
        );
        $siteMessage->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::CREATED_SITE_MESSAGE, [], $siteMessage->siteMessageId);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $siteMessageId
     *
     * @return JsonResponse
     */
    public function updateSiteMessage(Request $request, $siteMessageId) {
        $user = $request->get('auth');
        $siteMessage = SiteMessage::find($siteMessageId);
        $data = (object) $request->input('data');

        Condition::precondition(!$siteMessage, 404, 'Site message with that ID do not exist');
        Condition::precondition(
            !is_numeric($data->type) || $data->type > 3 || $data->type < 1,
            400,
            'Type is not valid'
        );
        Condition::precondition(
            !isset($data->title) || empty($data->title),
            400,
            'Title can not be empty!'
        );
        Condition::precondition(
            !isset($data->content) || empty($data->content),
            400,
            'Content can not be empty!'
        );
        Condition::precondition(
            !isset($data->expiresAt) || empty($data->expiresAt),
            400,
            'Expires at need to be set'
        );

        $siteMessage->title = $data->title;
        $siteMessage->expiresAt = $data->expiresAt;
        $siteMessage->content = $data->content;
        $siteMessage->type = $data->type;
        $siteMessage->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::UPDATED_SITE_MESSAGE, [], $siteMessage->siteMessageId);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $siteMessageId
     *
     * @return JsonResponse
     */
    public function deleteSiteMessage(Request $request, $siteMessageId) {
        $user = $request->get('auth');
        $siteMessage = SiteMessage::find($siteMessageId);

        $siteMessage->isDeleted = true;
        $siteMessage->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::DELETED_SITE_MESSAGE, [], $siteMessage->siteMessageId);
        return response()->json();
    }

    /**
     * @return JsonResponse
     */
    public function getNavigation() {
        $navigation = null;
        try {
            $navigation = $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::NAVIGATION);
        } catch (Exception $e) {
            $navigation = [];
        }
        return response()->json(is_array($navigation) ? $navigation : []);
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function updateNavigation(Request $request) {
        $user = $request->get('auth');
        $navigation = json_encode($request->input('navigation'));
        $oldNavigation = $this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::NAVIGATION);

        $this->mySettingRepository->createOrUpdate(SettingsKeys::NAVIGATION, $navigation);
        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_NAVIGATION,
            [
                'oldNavigation' => $oldNavigation,
                'newNavigation' => $navigation
            ]
        );
        return response()->json();
    }

    /**
     * Get the current maintenance mode message
     *
     * @return JsonResponse
     */
    public function getMaintenance() {
        return response()->json(
            [
                'content' => $this->mySettingRepository->getValueOfSetting(SettingsKeys::MAINTENANCE_CONTENT)
            ]
        );
    }

    /**
     * Put request to update the maintenance mode message, if not empty maintenance mode turns on.
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function updateMaintenance(Request $request) {
        $user = $request->get('auth');
        $maintenance = (object) $request->input('maintenance');

        $isMaintenanceOn = strlen(Value::objectProperty($maintenance, 'content', '')) > 0;
        $this->mySettingRepository->createOrUpdate(SettingsKeys::MAINTENANCE_CONTENT, $maintenance->content);
        $this->mySettingRepository->createOrUpdate(SettingsKeys::IS_MAINTENANCE, $isMaintenanceOn);

        Logger::sitecp($user->userId, $request->ip(), $isMaintenanceOn ? LogType::TURNED_ON_MAINTENANCE : LogType::TURNED_OFF_MAINTENANCE);
        return response()->json();
    }
}
