<?php

namespace App\Http\Controllers\Admin\Settings;

use App\EloquentModels\SiteMessage;
use App\Helpers\ConfigHelper;
use App\Helpers\SettingsHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class GeneralSettingsController extends Controller {
    private $welcomeBotKeys = [];
    private $settingKeys;

    private $forumService;

    /**
     * GeneralSettingsController constructor.
     * Fetch the setting keys and store them in an instance variable
     *
     * @param ForumService $forumService
     */
    public function __construct (ForumService $forumService) {
        parent::__construct();
        $this->forumService = $forumService;
        $this->settingKeys = ConfigHelper::getKeyConfig();
        $this->welcomeBotKeys = [
            $this->settingKeys->botUserId,
            $this->settingKeys->welcomeBotMessage,
            $this->settingKeys->welcomeBotCategoryId
        ];
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSiteMessages() {
        return response()->json(SiteMessage::all());
    }

    /**
     * @param $siteMessageId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSiteMessage($siteMessageId) {
        $siteMessage = SiteMessage::find($siteMessageId);
        Condition::precondition(!$siteMessage, 404, 'Site message with that ID do not exist');

        return response()->json($siteMessage);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createSiteMessage(Request $request) {
        $user = Cache::get('auth');
        $data = (object) $request->input('data');

        Condition::precondition(!isset($data->title) || empty($data->title), 400,
            'Title can not be empty!');
        Condition::precondition(!is_numeric($data->type) || $data->type > 3 || $data->type < 1, 400,
            'Type is not valid');
        Condition::precondition(!isset($data->content) || empty($data->content), 400,
            'Content can not be empty!');

        $siteMessage = new SiteMessage([
            'title' => $data->title,
            'isActive' => $data->isActive,
            'content' => $data->content,
            'type' => $data->type
        ]);
        $siteMessage->save();

        Logger::admin($user->userId, $request->ip(), Action::CREATED_SITE_MESSAGE, [
            'siteMessageId' => []
        ]);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param         $siteMessageId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateSiteMessage(Request $request, $siteMessageId) {
        $user = Cache::get('auth');
        $siteMessage = SiteMessage::find($siteMessageId);
        $data = (object) $request->input('data');

        Condition::precondition(!$siteMessage, 404, 'Site message with that ID do not exist');
        Condition::precondition(!is_numeric($data->type) || $data->type > 3 || $data->type < 1, 400,
            'Type is not valid');
        Condition::precondition(!isset($data->title) || empty($data->title), 400,
            'Title can not be empty!');
        Condition::precondition(!isset($data->content) || empty($data->content), 400,
            'Content can not be empty!');

        $siteMessage->title = $data->title;
        $siteMessage->isActive = $data->isActive;
        $siteMessage->content = $data->content;
        $siteMessage->type = $data->type;
        $siteMessage->save();

        Logger::admin($user->userId, $request->ip(), Action::UPDATED_SITE_MESSAGE, [
            'siteMessageId' => []
        ]);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param         $siteMessageId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteSiteMessage(Request $request, $siteMessageId) {
        $user = Cache::get('auth');
        $siteMessage = SiteMessage::find($siteMessageId);

        $siteMessage->isDeleted = true;
        $siteMessage->save();

        Logger::admin($user->userId, $request->ip(), Action::DELETED_SITE_MESSAGE, [
            'siteMessageId' => []
        ]);
        return response()->json();
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNavigation () {
        $navigation = null;
        try {
            $navigation = json_decode(SettingsHelper::getSettingValue($this->settingKeys->navigation));
        } catch (\Exception $e) {
            $navigation = [];
        }
        return response()->json(is_array($navigation) ? $navigation :  []);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateNavigation (Request $request) {
        $user = Cache::get('auth');
        $navigation = json_encode($request->input('navigation'));
        $oldNavigation = json_decode(SettingsHelper::getSettingValue($this->settingKeys->navigation));

        SettingsHelper::createOrUpdateSetting($this->settingKeys->navigation, $navigation);
        Logger::admin($user->userId, $request->ip(), Action::UPDATED_NAVIGATION, [
            'oldNavigation' => $oldNavigation,
            'newNavigation' => $navigation
        ]);
        return response()->json();
    }

    /**
     * Get the current maintenance mode message
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMaintenance () {
        return response()->json([
            'content' => SettingsHelper::getSettingValue($this->settingKeys->maintenanceContent)
        ]);
    }

    /**
     * Put request to update the maintenance mode message, if not empty maintenance mode turns on.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateMaintenance (Request $request) {
        $user = Cache::get('auth');
        $maintenance = (object)$request->input('maintenance');

        SettingsHelper::createOrUpdateSetting($this->settingKeys->maintenanceContent, $maintenance->content);
        $isMaintenanceOn = strlen(Value::objectProperty($maintenance, 'content', '')) > 0;
        SettingsHelper::createOrUpdateSetting($this->settingKeys->isMaintenance, $isMaintenanceOn);

        Logger::admin($user->userId, $request->ip(), $isMaintenanceOn ? Action::TURNED_ON_MAINTENANCE : Action::TURNED_OFF_MAINTENANCE);
        return response()->json();
    }
}
