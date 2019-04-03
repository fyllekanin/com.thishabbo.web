<?php

namespace App\Http\Controllers\Usercp;

use App\EloquentModels\CategorySubscription;
use App\EloquentModels\Forum\IgnoredCategory;
use App\EloquentModels\Forum\IgnoredThread;
use App\EloquentModels\Log\LogUser;
use App\EloquentModels\Theme;
use App\EloquentModels\ThreadSubscription;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserData;
use App\Helpers\ConfigHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\AuthService;
use App\Services\CreditsService;
use App\Services\HabboService;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller {
    private $authService;
    private $habboService;
    private $creditsService;

    private $monthAgo;

    /**
     * AccountController constructor.
     *
     * @param AuthService $authService
     * @param HabboService $habboService
     */
    public function __construct (AuthService $authService, HabboService $habboService, CreditsService $creditsService) {
        parent::__construct();
        $this->authService = $authService;
        $this->habboService = $habboService;
        $this->creditsService = $creditsService;
        $this->monthAgo = time() - 2419200;
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getThemes() {
        $user = Cache::get('auth');

        return response()->json(Theme::get()->map(function($item) use ($user) {
            return [
                'themeId' => $item->themeId,
                'title' => $item->title,
                'minified' => $item->minified,
                'isSelected' => $user->theme ? $item->themeId == $user->theme : $item->isDefault
            ];
        }));
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateTheme(Request $request) {
        $themeId = $request->input('themeId');
        $user = Cache::get('auth');
        $theme = Theme::find($themeId);
        Condition::precondition(!$theme, 404, 'No theme with that ID');

        $user->theme = $themeId;
        $user->save();

        Logger::user($user->userId, $request->ip(), Action::SELECTED_THEME, ['theme' => $theme->title]);
        return response()->json();
    }

    /**
     * Get request for fetching users current verified habbo
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHabbo () {
        $user = Cache::get('auth');
        return response()->json([
            'habbo' => $user->habbo
        ]);
    }
    /**
     * Put request to update the habbo, checks motto on habbo API to match
     * with the supplied string used in FE. "thishabbo-{userId}"
     * Validation for one month at least since creation date is in place
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateHabbo (Request $request) {
        $user = Cache::get('auth');
        $requiredMotto = 'thishabbo-' . $user->userId;

        $name = $request->input('habbo');
        Condition::precondition(!$name, 400, 'You did not fill anything in');
        Condition::precondition(User::withHabbo($name)->count() > 0, 400, 'Habbo already taken');

        $habbo = $this->habboService->getHabboByName($name);
        Condition::precondition(!$habbo, 404, 'No habbo with that name');
        Condition::precondition(strtotime($habbo->memberSince) > $this->monthAgo, 400, 'Your habbo is to young!');
        Condition::precondition($habbo->motto != $requiredMotto, 400,
            'Incorrect motto, you current motto is "' . $habbo->motto . '" but it needs to be "' . $requiredMotto . '"');

        $oldHabbo = $user->habbo;
        $user->habbo = $name;
        $user->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_HABBO, ['from' => $oldHabbo, 'to' => $name]);
        return response()->json();
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateNickname(Request $request) {
        $user = Cache::get('auth');
        $nickname = $request->input('nickname');
        $oneWeek = 604800;
        $oneMonth = 2419200;

        $gotTimeout = LogUser::where('action', Action::getAction(Action::CHANGED_NICKNAME))->where('userId', $user->userId)
                ->where('createdAt', '>', (time() - $oneWeek))->count() > 0;
        Condition::precondition($gotTimeout,400, 'You need to wait one week until you can change nickname again');
        Condition::precondition(!$this->creditsService->haveEnoughCredits($user->userId, 300), 400, 'You do not have enough credits');
        Condition::precondition(!isset($nickname) || empty($nickname) || strlen($nickname) < 3, 400,
            'Nickname is not valid');

        $userWithNickname = User::withNickname($nickname)->first();
        if ($userWithNickname) {
            Condition::precondition($userWithNickname->lastActivity > (time() - ($oneMonth * 3)), 400,
                'Nickname is already taken and user is not inactive');
            $userWithNickname->nickname = $this->generateString();
            $userWithNickname->save();
        }

        $this->creditsService->takeCredits($user->userId, 300);
        $oldNickname = $user->nickname;
        $user->nickname = $nickname;
        $user->save();


        Logger::user($user->userId, $request->ip(), Action::CHANGED_NICKNAME, [
            'old' => $oldNickname,
            'new' => $nickname
        ]);

        return response()->json();
    }

    /**
     * @return mixed
     */
    public function getIgnoredThreads() {
        $user = Cache::get('auth');
        return IgnoredThread::where('userId', $user->userId)->get()->map(function($ignoredThread) {
            return [ 'threadId' => $ignoredThread->threadId, 'title' => $ignoredThread->thread->title ];
        });
    }

    /**
     * @return mixed
     */
    public function getIgnoredCategories() {
        $user = Cache::get('auth');
        return IgnoredCategory::where('userId', $user->userId)->get()->map(function($ignoredCategory) {
            return [ 'categoryId' => $ignoredCategory->categoryId, 'title' => $ignoredCategory->category->title ];
        });
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNotificationSettings () {
        $user = Cache::get('auth');

        return response()->json($this->buildIgnoredNotificationTypes($user));
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateNotificationSettings (Request $request) {
        $user = Cache::get('auth');
        $ignoredNotifications = $this->convertIgnoredNotificationTypes($request->input('ignoredNotificationTypes'));

        $user->ignoredNotifications = $ignoredNotifications;
        $user->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_IGNORED_NOTIFICATIONS);
        return response()->json();
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateHomePage (Request $request) {
        $user = Cache::get('auth');
        $homePage = $request->input('homePage');

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $userData->homePage = $homePage;
        $userData->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_HOMEPAGE, ['homepage' => $homePage]);
        return response()->json();
    }

    /**
     * Update request to update the users password, validation for length and being
     * able to type it twice is in place.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePassword (Request $request) {
        $user = Cache::get('auth');
        $password = $request->input('password');
        $repassword = $request->input('repassword');
        $currentPassword = $request->input('currentPassword');

        Condition::precondition(!$password, 400, 'Password needs to be set');
        Condition::precondition(!$repassword, 400, 'Repassword needs to be set');
        Condition::precondition(strlen($password) < 8, 400, 'Password needs to be at least 8 characters long');
        Condition::precondition($password != $repassword, 400, 'Password and repassword needs to be equal');
        Condition::precondition(!Hash::check($currentPassword, $user->password), 400,
            'Incorrect current password');

        User::where('userId', $user->userId)->update([
            'password' => Hash::make($password)
        ]);

        Logger::user($user->userId, $request->ip(), Action::UPDATED_PASSWORD);
        return response()->json();
    }

    /**
     * Get request for fetching users current post bit option
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPostBit () {
        $user = Cache::get('auth');

        return response()->json($this->buildPostBitOptions($user));
    }

    /**
     * Put request to update the users post bit options
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePostBit (Request $request) {
        $user = Cache::get('auth');
        $postBitOptions = $request->input('postBitOptions');
        $userData = UserHelper::getUserDataOrCreate($user->userId);

        $userData->postBit = $this->convertPostBitOptions($postBitOptions);
        $userData->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_POSTBIT);
        return response()->json();
    }

    /**
     * @return mixed
     */
    public function getThreadSubscriptions () {
        $user = Cache::get('auth');

        return ThreadSubscription::where('userId', $user->userId)->get()->map(function($subscription) {
            return [
                'threadId' => $subscription->thread->threadId,
                'title' => $subscription->thread->title
            ];
        });
    }

    /**
     * @return mixed
     */
    public function getCategorySubscriptions () {
        $user = Cache::get('auth');

        return CategorySubscription::where('userId', $user->userId)->get()->map(function($subscription) {
            return [
                'categoryId' => $subscription->category->categoryId,
                'title' => $subscription->category->title
            ];
        });
    }

    /**
     * Get method to convert option names to bitwise numbers
     *
     * @param $postBitOptions
     *
     * @return int
     */
    private function convertPostBitOptions ($postBitOptions) {
        $options = 0;
        $config = ConfigHelper::getPostBitConfig();

        foreach ($postBitOptions as $key => $value) {
            if ($value && isset($config->$key)) {
                $options += $config->$key;
            }
        }
        return $options;
    }

    /**
     * Get method to convert bitwise numbers to names for the front-end
     *
     * @param $user
     *
     * @return array
     */
    private function buildPostBitOptions ($user) {
        $userdata = UserHelper::getUserDataOrCreate($user->userId);
        return UserHelper::getUserPostBit($userdata);
    }


    /**
     * @param $ignoredNotificationTypes
     *
     * @return int
     */
    private function convertIgnoredNotificationTypes ($ignoredNotifications) {
        $options = 0;

        foreach ($ignoredNotifications as $key => $value) {
            if (isset($ignoredNotifications[$key]) && $ignoredNotifications[$key]) {
                $options += $value;
            }
        }
        return $options;
    }

    /**
     * Get method to convert bitwise numbers to names for the front-end
     *
     * @param $user
     *
     * @return array
     */
    private function buildIgnoredNotificationTypes ($user) {
        $obj = [];
        $ignoredNotifications = ConfigHelper::getIgnoredNotificationsConfig();

        foreach ($ignoredNotifications as $key => $value) {
            $obj[$key] = $user->ignoredNotifications & $value;
        }

        return $obj;
    }

    /**
     * Generate random string
     *
     * @return string
     */
    private function generateString () {
        $token = openssl_random_pseudo_bytes(8);
        $token = bin2hex($token);
        return implode('', str_split($token, 4));
    }
}
