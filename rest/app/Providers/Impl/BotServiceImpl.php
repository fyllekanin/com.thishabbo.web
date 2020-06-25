<?php

namespace App\Providers\Impl;

use App\Constants\SettingsKeys;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\User\User;
use App\Http\Controllers\Forum\Thread\ThreadCrudController;
use App\Providers\Service\BotService;
use App\Repositories\Repository\SettingRepository;
use stdClass;

class BotServiceImpl implements BotService {
    private $mySettingRepository;
    private $myThreadController;

    public function __construct(SettingRepository $settingRepository, ThreadCrudController $threadController) {
        $this->mySettingRepository = $settingRepository;
        $this->myThreadController = $threadController;
    }

    public function triggerMultipleAccounts($user, $ip, $userIds) {
        $users = User::whereIn('userId', $userIds)->get();
        $botSettings = $this->getMultipleAccountSettings();

        $botUser = User::find($botSettings->userId);
        if (!$botUser || Category::where('categoryId', $botSettings->categoryId)->count() == 0) {
            return;
        }

        $threadSkeleton = new stdClass();
        $threadSkeleton->categoryId = $botSettings->categoryId;
        $threadSkeleton->content = str_replace(':nickname:', '[mention]@'.$user->nickname.'[/mention]', $botSettings->content);
        $threadSkeleton->content = str_replace(':ip:', $ip, $threadSkeleton->content);
        $threadSkeleton->title = 'Multiple Accounts Detection -  '.$user->nickname.'!';
        $nicknames = '';
        foreach ($users as $item) {
            $nicknames = $nicknames.(strlen($nicknames) > 0 ? "\n " : '').$item->nickname;
        }
        $threadSkeleton->content = str_replace(':users:', $nicknames, $threadSkeleton->content);

        $this->myThreadController->doThread($botUser, null, $threadSkeleton, null, true);
    }

    public function triggerWelcomeBot($user) {

        $botUser = User::find(SettingsKeys::BOT_USER_ID);
        if (!$botUser) {
            return;
        }

        $threadSkeleton = new stdClass();
        $threadSkeleton->categoryId = SettingsKeys::WELCOME_BOT_CATEGORY_ID;
        $threadSkeleton->content = str_replace(
            ':nickname:',
            '[mention]@'.$user->nickname.'[/mention]',
            SettingsKeys::WELCOME_BOT_MESSAGE
        );
        $threadSkeleton->title = 'Welcome '.$user->nickname.'!';

        $this->myThreadController->doThread($botUser, null, $threadSkeleton, null);
    }

    private function getWelcomeBotSettings() {
        $keys = [
            SettingsKeys::BOT_USER_ID,
            SettingsKeys::WELCOME_BOT_MESSAGE,
            SettingsKeys::WELCOME_BOT_CATEGORY_ID
        ];

        $botSettings = (object) [
            'userId' => -1,
            'content' => '',
            'categoryId' => -1
        ];
        $botSettings = $this->getSettingValues($keys, $botSettings);
        return $botSettings;
    }

    private function getSettingValues($keys, $settings) {
        foreach ($keys as $key) {
            $value = $this->mySettingRepository->getValueOfSetting($key);
            if (!$value) {
                return $settings;
            }
            switch ($key) {
                case SettingsKeys::BOT_USER_ID:
                    $settings->userId = $value;
                    break;
                case SettingsKeys::MULTIPLE_ACCOUNTS_BOT_MESSAGE:
                    $settings->content = $value;
                    break;
                case SettingsKeys::MULTIPLE_ACCOUNTS_BOT_CATEGORY_ID:
                    $settings->categoryId = $value;
                    break;
            }
        }
        return $settings;
    }

    private function getMultipleAccountSettings() {
        $keys = [
            SettingsKeys::BOT_USER_ID,
            SettingsKeys::MULTIPLE_ACCOUNTS_BOT_MESSAGE,
            SettingsKeys::MULTIPLE_ACCOUNTS_BOT_CATEGORY_ID
        ];

        $botSettings = (object) [
            'userId' => -1,
            'content' => '',
            'categoryId' => -1
        ];
        $botSettings = $this->getSettingValues($keys, $botSettings);
        return $botSettings;
    }
}
