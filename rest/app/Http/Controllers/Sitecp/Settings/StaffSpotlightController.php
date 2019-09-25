<?php

namespace App\Http\Controllers\Sitecp\Settings;

use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\SettingsHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffSpotlightController extends Controller {
    private $botKeys = [];
    private $settingKeys;

    /**
     * StaffSpotlightController constructor.
     * Fetch the setting keys and store them in an instance variable
     */
    public function __construct() {
        parent::__construct();
        $this->settingKeys = ConfigHelper::getKeyConfig();
        $this->botKeys = [
            $this->settingKeys->botUserId,
            $this->settingKeys->welcomeBotMessage,
            $this->settingKeys->welcomeBotCategoryId
        ];
    }

    /**
     * Get method to fetch the current motm
     *
     * @return JsonResponse
     */
    public function getMemberOfTheMonth() {
        $motm = json_decode(SettingsHelper::getSettingValue($this->settingKeys->memberOfTheMonth));

        return response()->json([
            'member' => Value::objectProperty($motm, 'member', null),
            'photo' => Value::objectProperty($motm, 'photo', null),
            'month' => Value::objectProperty($motm, 'month', null)
        ]);
    }

    /**
     * Post request for updating the member of the month
     *
     * @param Request $request
     *
     * @return JsonResponse
     */

    public function updateMemberOfTheMonth(Request $request) {
        $user = $request->get('auth');
        $information = (object)$request->input('information');

        foreach ($information as $key => $value) {
            Condition::precondition(!isset($value) || empty($value), 400, $key . ' is missing');
        }

        Condition::precondition(!empty($information->member) && User::withNickname($information->member)->count('userId') == 0,
            404, 'No member with that nickname');
        Condition::precondition(!empty($information->photo) && User::withNickname($information->photo)->count('userId') == 0,
            404, 'No staff with that nickname');

        $newInformation = [
            'member' => $information->member,
            'photo' => $information->photo,
            'month' => $information->month,
            'year' => date('Y')
        ];

        SettingsHelper::createOrUpdateSetting($this->settingKeys->memberOfTheMonth, json_encode($newInformation));

        Logger::sitecp($user->userId, $request->ip(), Action::UPDATED_MEMBER_OF_THE_MONTH);
        return response()->json();
    }

    /**
     * Get method to fetch the current sotw
     *
     * @return JsonResponse
     */
    public function getStaffOfTheWeek() {
        $sotw = json_decode(SettingsHelper::getSettingValue($this->settingKeys->staffOfTheWeek));

        $returnedSOTW = [];

        foreach ($sotw as $key => $value) {
            $returnedSOTW[$key] = User::where('userId', $value)->value('nickname');
        }

        return response()->json($returnedSOTW);
    }

    /**
     * Post request for updating the staff of the week
     *
     * @param Request $request
     *
     * @return JsonResponse
     */

    public function updateStaffOfTheWeek(Request $request) {
        $user = $request->get('auth');
        $information = (object)$request->input('information');

        $newInformation = [
            'globalManagement' => $information->globalManagement,
            'europeManagement' => $information->europeManagement,
            'oceaniaManagement' => $information->oceaniaManagement,
            'northAmericanManagement' => $information->northAmericanManagement,
            'europeRadio' => $information->europeRadio,
            'oceaniaRadio' => $information->oceaniaRadio,
            'northAmericanRadio' => $information->northAmericanRadio,
            'europeEvents' => $information->europeEvents,
            'oceaniaEvents' => $information->oceaniaEvents,
            'northAmericanEvents' => $information->northAmericanEvents,
            'moderation' => $information->moderation,
            'media' => $information->media,
            'quests' => $information->quests,
            'graphics' => $information->graphics,
            'audioProducer' => $information->audioProducer,
            'communityEvents' => $information->communityEvents,
            'builder' => $information->builder
        ];

        foreach ($newInformation as $key => $value) {
            if (empty($value)) {
                $newInformation[$key] = null;
                continue;
            }
            $userExists = User::withNickname($value)->first();

            Condition::precondition(!$userExists, 404, 'No user with the name ' . $value);

            $newInformation[$key] = $userExists->userId;
        }

        SettingsHelper::createOrUpdateSetting($this->settingKeys->staffOfTheWeek, json_encode($newInformation));

        Logger::sitecp($user->userId, $request->ip(), Action::UPDATED_STAFF_OF_THE_WEEK);

        return response()->json();
    }
}
