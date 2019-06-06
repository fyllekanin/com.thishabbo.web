<?php

namespace App\Http\Controllers\Admin\Settings;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Setting;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\SettingsHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Utils\Condition;
use App\Utils\Iterables;
use App\Utils\Value;
use Illuminate\Http\Request;

class WelcomeBotController extends Controller {
    private $welcomeBotKeys = [];
    private $settingKeys;

    private $forumService;

    /**
     * WelcomeBotController constructor.
     * Fetch the setting keys and store them in an instance variable
     *
     * @param Request $request
     * @param ForumService $forumService
     */
    public function __construct(Request $request, ForumService $forumService) {
        parent::__construct($request);
        $this->forumService = $forumService;
        $this->settingKeys = ConfigHelper::getKeyConfig();
        $this->welcomeBotKeys = [
            $this->settingKeys->botUserId,
            $this->settingKeys->welcomeBotMessage,
            $this->settingKeys->welcomeBotCategoryId
        ];
    }

    /**
     * Put request to update the settings used for the welcome bot
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateWelcomeBotSettings(Request $request) {
        foreach ($this->welcomeBotKeys as $key) {
            switch ($key) {
                case $this->settingKeys->botUserId:
                    $botUser = (object)$request->input('user');
                    $userId = Value::objectProperty($botUser, 'userId', 0);
                    Condition::precondition(!User::find($userId), 400, 'No user with that userId');
                    SettingsHelper::createOrUpdateSetting($key, $userId);
                    break;
                case $this->settingKeys->welcomeBotMessage:
                    SettingsHelper::createOrUpdateSetting($key, $request->input('content'));
                    break;
                case $this->settingKeys->welcomeBotCategoryId:
                    $category = (object)$request->input('category');
                    SettingsHelper::createOrUpdateSetting($key, Value::objectProperty($category, 'categoryId', 0));
                    break;
            }
        }

        Logger::admin($this->user->userId, $request->ip(), Action::UPDATED_WELCOME_BOT);
        return response()->json();
    }

    /**
     * Get request to get the current settings of the welcome bot
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWelcomeBotSettings() {
        $availableCategories = $this->forumService->getAccessibleCategories($this->user->userId);
        $categories = Category::whereIn('categoryId', $availableCategories)
            ->select('categoryId', 'title')
            ->where('parentId', '!=', '-1')
            ->get(['categoryId', 'title']);
        
        $categories->each(function ($category) {
            $category->setAppends([]);
        });

        $welcomeBot = new \stdClass();
        foreach (Setting::whereIn('key', $this->welcomeBotKeys)->get() as $setting) {
            switch ($setting->key) {
                case $this->settingKeys->botUserId:
                    $welcomeBot->user = User::where('userId', $setting->value)->select('userId', 'nickname')->first();
                    break;
                case $this->settingKeys->welcomeBotMessage:
                    $welcomeBot->content = $setting->value;
                    break;
                case $this->settingKeys->welcomeBotCategoryId:
                    $categoryId = $setting->value;
                    $welcomeBot->category = Iterables::find($categories, function ($category) use ($categoryId) {
                        return $category->categoryId == $categoryId;
                    });
                    break;
            }
        }
        $welcomeBot->categories = $categories;
        $welcomeBot->users = User::getQuery()->get(['userId', 'nickname']);

        return response()->json($welcomeBot);
    }
}
