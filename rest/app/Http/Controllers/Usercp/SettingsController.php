<?php

namespace App\Http\Controllers\Usercp;

use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Models\User\CustomUserFields;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\Request;

class SettingsController extends Controller {

    /**
     * AccountController constructor.
     */
    public function __construct() {
        parent::__construct();
    }

    public function updateTabs(Request $request) {
        $user = $request->get('auth');
        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $customFields = new CustomUserFields($userData->customFields);

        $customFields->tabs = json_encode($request->input('tabs'));
        $userData->customFields = json_encode($customFields);
        $userData->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_TABS);
        return response()->json();
    }

    public function deleteTab(Request $request, $tabId) {
        $user = $request->get('auth');
        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $customFields = new CustomUserFields($userData->customFields);

        $customFields->tabs = Iterables::filter($customFields->tabs, function ($tab) use ($tabId) {
            return $tab->tabId != $tabId;
        });

        $userData->customFields = json_encode($customFields);
        $userData->save();

        Logger::user($user->userId, $request->ip(), Action::DELETED_TAB);
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

        Logger::user($user->userId, $request->ip(), Action::ADDED_TAB);
        return response()->json();
    }
}
