<?php

namespace App\Http\Controllers\Usercp;

use App\Constants\LogType;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\User\CustomUserFields;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\Request;

class SettingsController extends Controller {

    public function updateTabs(Request $request) {
        $user = $request->get('auth');
        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $customFields = new CustomUserFields($userData->customFields);

        $customFields->tabs = $request->input('tabs');
        $userData->customFields = json_encode($customFields);
        $userData->save();

        Logger::user($user->userId, $request->ip(), LogType::UPDATED_TABS);
        return response()->json();
    }

    public function deleteTab(Request $request, $tabId) {
        $user = $request->get('auth');
        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $customFields = new CustomUserFields($userData->customFields);

        $customFields->tabs = Iterables::filter(
            $customFields->tabs,
            function ($tab) use ($tabId) {
                return $tab->tabId != $tabId;
            }
        );

        $userData->customFields = json_encode($customFields);
        $userData->save();

        Logger::user($user->userId, $request->ip(), LogType::DELETED_TAB);
        return response()->json();
    }

    public function createTab(Request $request) {
        $user = $request->get('auth');
        $tab = $request->input('tab');

        Condition::precondition(!isset($tab) || empty($tab), 400, 'Tab can not be empty');

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $customFields = new CustomUserFields($userData->customFields);

        $customFields->tabs[] = $tab;
        $userData->customFields = json_encode($customFields);
        $userData->save();

        Logger::user($user->userId, $request->ip(), LogType::ADDED_TAB);
        return response()->json();
    }
}
