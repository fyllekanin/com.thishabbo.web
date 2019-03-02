<?php

namespace App\Http\Controllers\Staff;

use App\EloquentModels\User\Login;
use App\EloquentModels\User\User;
use App\EloquentModels\Log\LogStaff;
use App\Helpers\ConfigHelper;
use App\Helpers\SettingsHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Models\Radio\RadioSettings;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\Request;

class ManagementController extends Controller {
    private $settingKeys;

    public function __construct () {
        parent::__construct();
        $this->settingKeys = ConfigHelper::getKeyConfig();
    }

    /**
     * @return array
     */
    public function getCurrentListeners() {
        $listeners = Iterables::unique($this->getListenersFromServer(), 'hostname');
        return array_map(function($listener) {
            $userId = Login::where('ip', $listener->hostname)->value('userId');
            return [
                'user' => UserHelper::getSlimUser($userId),
                'time' => $listener->connecttime
            ];
        }, $listeners);
    }

    /**
     * Get request for do not hire list
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDoNotHireList () {
        $items = json_decode(SettingsHelper::getSettingValue($this->settingKeys->doNotHire));

        foreach ($items as $item) {
            $item->addedBy = User::where('userId', $item->addedBy)->value('nickname');
        }

        return response()->json([
            'items' => $items
        ]);
    }

    /**
     * Get request for do not hire entry
     *
     * @param $nickname
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDoNotHire ($nickname) {
        $entries = json_decode(SettingsHelper::getSettingValue($this->settingKeys->doNotHire));
        $entryInfo = new \stdClass();

        foreach($entries as $entry){
            if($entry->nickname == $nickname){
                $entryInfo = $entry;
            }
        }

        return response()->json($entryInfo);
    }

    /**
     * Put request for do not hire entry
     *
     * @param Request $request
     * @param         $nickname
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateDoNotHire (Request $request, $nickname) {
        $user = UserHelper::getUserFromRequest($request);

        $information = (object)$request->input('information');
        $oldEntries = json_decode(SettingsHelper::getSettingValue($this->settingKeys->doNotHire));
        $newEntries = [];

        Condition::precondition(!isset($information->nickname), 400, 'Nickname missing');
        Condition::precondition(!isset($information->reason), 400, 'Reason missing');

        foreach ($oldEntries as $entry) {
            if($entry->nickname == $nickname){
                $entry = [
                    'nickname' => $information->nickname,
                    'reason' => $information->reason,
                    'addedBy' => $user->userId,
                    'createdAt' => time()
                ];
            }

            $newEntries[] = $entry;
        }

        SettingsHelper::createOrUpdateSetting($this->settingKeys->doNotHire, json_encode($newEntries));

        Logger::staff($user->userId, $request->ip(), Action::UPDATED_DO_NOT_HIRE, ['nickname' => $information->nickname]);

        return response()->json();
    }

    /**
     * Post request for do not hire entry
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createDoNotHire (Request $request) {
        $user = UserHelper::getUserFromRequest($request);

        $information = (object)$request->input('information');
        $entries = json_decode(SettingsHelper::getSettingValue($this->settingKeys->doNotHire));

        Condition::precondition(!isset($information->nickname), 400, 'Nickname missing');
        Condition::precondition(!isset($information->reason), 400, 'Reason missing');

        $entries[] = [
            'nickname' => $information->nickname,
            'reason' => $information->reason,
            'addedBy' => $user->userId,
            'createdAt' => time()
        ];

        SettingsHelper::createOrUpdateSetting($this->settingKeys->doNotHire, json_encode($entries));

        Logger::staff($user->userId, $request->ip(), Action::CREATED_DO_NOT_HIRE, ['nickname' => $information->nickname]);

        return response()->json();
    }

    /**
     * Delete request for do not hire entry
     *
     * @param $nickname
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteDoNotHire (Request $request, $nickname) {
        $user = UserHelper::getUserFromRequest($request);
        $oldEntries = json_decode(SettingsHelper::getSettingValue($this->settingKeys->doNotHire));

        $entries = Iterables::filter($oldEntries, function($entry) use ($nickname) {
            return $entry->nickname != $nickname;
        });

        SettingsHelper::createOrUpdateSetting($this->settingKeys->doNotHire, json_encode($entries));

        Logger::staff($user->userId, $request->ip(), Action::DELETED_DO_NOT_HIRE, ['nickname' => $nickname]);

        return response()->json();
    }

    private function getListenersFromServer() {
        $radio = new RadioSettings(SettingsHelper::getSettingValue($this->settingKeys->radio));
        $userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36';
        $url = $radio->ip . ':' . $radio->port . '/admin.cgi?sid=1&mode=viewjson&page=3';

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_USERAGENT, $userAgent);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_USERPWD, 'admin:' . $radio->adminPassword);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($curl, CURLOPT_TIMEOUT, 45);

        $data = curl_exec($curl);
        curl_close($curl);
        return json_decode($data);
    }
}
