<?php

namespace App\Services;

use App\EloquentModels\Setting;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Http\Controllers\Forum\Thread\ThreadCrudController;

class BotService {
    private $forumService;
    private $validatorService;

    public function __construct(ForumService $forumService, ForumValidatorService $validatorService) {
        $this->forumService = $forumService;
        $this->validatorService = $validatorService;
    }

    /**
     * Posts the welcome thread for the provided user
     *
     * @param $request
     * @param $user
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function triggerWelcomeBot($request, $user) {
        $settingKeys = ConfigHelper::getKeyConfig();
        $welcomeBotKeys = [
            $settingKeys->botUserId,
            $settingKeys->welcomeBotMessage,
            $settingKeys->welcomeBotCategoryId
        ];

        $welcomeBotSettings = (object)[
            'userId' => -1,
            'content' => '',
            'categoryId' => -1
        ];

        foreach (Setting::whereIn('key', $welcomeBotKeys)->get() as $setting) {
            switch ($setting->key) {
                case $settingKeys->botUserId:
                    $welcomeBotSettings->userId = $setting->value;
                    break;
                case $settingKeys->welcomeBotMessage:
                    $welcomeBotSettings->content = $setting->value;
                    break;
                case $settingKeys->welcomeBotCategoryId:
                    $welcomeBotSettings->categoryId = $setting->value;
                    break;
            }
        }

        $botUser = User::find($welcomeBotSettings->userId);
        if (!$botUser) {
            return;
        }

        $threadSkeleton = new \stdClass();
        $threadSkeleton->categoryId = $welcomeBotSettings->categoryId;
        $threadSkeleton->content = str_replace(':nickname:', '[mention]@' . $user->nickname . '[/mention]', $welcomeBotSettings->content);
        $threadSkeleton->title = 'Welcome ' . $user->nickname . '!';

        $threadController = new ThreadCrudController($request, $this->forumService, $this->validatorService);
        $threadController->doThread($botUser, null, $threadSkeleton, $request);
    }
}
