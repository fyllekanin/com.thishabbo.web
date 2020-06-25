<?php

namespace App\Http\Controllers\Sitecp\Settings;

use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\Constants\SettingsKeys;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\User\User;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Repositories\Repository\CategoryRepository;
use App\Repositories\Repository\SettingRepository;
use App\Utils\Condition;
use App\Utils\Iterables;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use stdClass;

class BotSettingsController extends Controller {
    private $myBotSettingKeys = [];
    private $mySettingRepository;
    private $myCategoryRepository;

    public function __construct(SettingRepository $settingRepository, CategoryRepository $categoryRepository) {
        parent::__construct();
        $this->mySettingRepository = $settingRepository;
        $this->myCategoryRepository = $categoryRepository;
        $this->myBotSettingKeys = [
            SettingsKeys::BOT_USER_ID,
            SettingsKeys::WELCOME_BOT_MESSAGE,
            SettingsKeys::WELCOME_BOT_CATEGORY_ID,
            SettingsKeys::MULTIPLE_ACCOUNTS_BOT_MESSAGE,
            SettingsKeys::MULTIPLE_ACCOUNTS_BOT_CATEGORY_ID
        ];
    }

    /**
     * Put request to update the settings used for the bot
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function updateBotSettings(Request $request) {
        $user = $request->get('auth');

        foreach ($this->myBotSettingKeys as $key) {
            switch ($key) {
                case SettingsKeys::BOT_USER_ID:
                    $botUser = (object) $request->input('user');
                    $userId = Value::objectProperty($botUser, 'userId', 0);
                    Condition::precondition(!User::find($userId), 400, 'No user with that userId');
                    $this->mySettingRepository->createOrUpdate($key, $userId);
                    break;
                case SettingsKeys::WELCOME_BOT_MESSAGE:
                    Condition::precondition(strlen($request->input('welcomeContent')) < 1, 400, 'Welcome content can not be empty');
                    $this->mySettingRepository->createOrUpdate($key, $request->input('welcomeContent'));
                    break;
                case SettingsKeys::MULTIPLE_ACCOUNTS_BOT_MESSAGE:
                    Condition::precondition(
                        strlen($request->input('multipleAccountsContent')) < 1,
                        400,
                        'Multiple accounts content content can not be empty'
                    );
                    $this->mySettingRepository->createOrUpdate($key, $request->input('multipleAccountsContent'));
                    break;
                case SettingsKeys::WELCOME_BOT_CATEGORY_ID:
                    $category = (object) $request->input('welcomeCategory');
                    $this->mySettingRepository->createOrUpdate($key, Value::objectProperty($category, 'categoryId', 0));
                    break;
                case SettingsKeys::MULTIPLE_ACCOUNTS_BOT_CATEGORY_ID:
                    $category = (object) $request->input('multipleAccountsCategory');
                    $this->mySettingRepository->createOrUpdate($key, Value::objectProperty($category, 'categoryId', 0));
                    break;
            }
        }

        Logger::sitecp($user->userId, $request->ip(), LogType::UPDATED_BOT_SETTINGS);
        return response()->json();
    }

    /**
     * Get request to get the current settings of the bot
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function getBotSettings(Request $request) {
        $user = $request->get('auth');

        $availableCategories = $this->myCategoryRepository
            ->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ);
        $categories = Category::whereIn('categoryId', $availableCategories)
            ->select('categoryId', 'title')
            ->where('parentId', '!=', '-1')
            ->get(['categoryId', 'title']);
        $categories->each(
            function ($category) {
                $category->setAppends([]);
            }
        );

        $botSettings = new stdClass();
        $botSettings->user = User::where('userId', $this->mySettingRepository->getValueOfSetting(SettingsKeys::BOT_USER_ID))
            ->select('userId', 'nickname')->first();

        $botSettings->welcomeContent = $this->mySettingRepository->getValueOfSetting(SettingsKeys::WELCOME_BOT_MESSAGE);
        $botSettings->multipleAccountsContent = $this->mySettingRepository->getValueOfSetting(SettingsKeys::MULTIPLE_ACCOUNTS_BOT_MESSAGE);

        $welcomeCategoryId = $this->mySettingRepository->getValueOfSetting(SettingsKeys::WELCOME_BOT_CATEGORY_ID);
        $botSettings->welcomeCategory = Iterables::find($categories, function ($category) use ($welcomeCategoryId) {
            return $category->categoryId == $welcomeCategoryId;
        });

        $multipleAccountCategoryId = $this->mySettingRepository->getValueOfSetting(SettingsKeys::MULTIPLE_ACCOUNTS_BOT_CATEGORY_ID);
        $botSettings->welcomeCategory = Iterables::find($categories, function ($category) use ($multipleAccountCategoryId) {
            return $category->categoryId == $multipleAccountCategoryId;
        });


        $botSettings->categories = $categories;
        $botSettings->users = User::getQuery()->get(['userId', 'nickname']);

        return response()->json($botSettings);
    }
}
