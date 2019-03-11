<?php

namespace App\Http\Controllers\Usercp;

use App\EloquentModels\CategorySubscription;
use App\EloquentModels\Forum\IgnoredCategory;
use App\EloquentModels\Forum\IgnoredThread;
use App\EloquentModels\Log\LogUser;
use App\EloquentModels\ThreadSubscription;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserData;
use App\Helpers\ConfigHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\AuthService;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller {
    private $authService;

    /**
     * AccountController constructor.
     */
    public function __construct (AuthService $authService) {
        parent::__construct();
        $this->authService = $authService;
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateNickname(Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $nickname = $request->input('nickname');
        $oneWeek = 604800;
        $oneMonth = 2419200;

        $gotTimeout = LogUser::where('action', Action::getAction(Action::CHANGED_NICKNAME))->where('userId', $user->userId)
                ->where('createdAt', '>', (time() - $oneWeek))->count() > 0;
        Condition::precondition($gotTimeout,400, 'You need to wait one week until you can change nickname again');
        Condition::precondition($user->userdata->credits < 300, 400, 'You do not have enough credits');
        Condition::precondition(!isset($nickname) || empty($nickname) || strlen($nickname) < 3, 400,
            'Nickname is not valid');

        $userWithNickname = User::withNickname($nickname)->first();
        if ($userWithNickname) {
            Condition::precondition($userWithNickname->lastActivity > (time() - ($oneMonth * 3)), 400,
                'Nickname is already taken and user is not inactive');
            $userWithNickname->nickname = $this->generateString();
            $userWithNickname->save();
        }

        $user->userdata->credits -= 300;
        $user->userdata->save();

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
     * @param Request $request
     *
     * @return mixed
     */
    public function getIgnoredThreads(Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        return IgnoredThread::where('userId', $user->userId)->get()->map(function($ignoredThread) {
            return [ 'threadId' => $ignoredThread->threadId, 'title' => $ignoredThread->thread->title ];
        });
    }

    /**
     * @param Request $request
     *
     * @return mixed
     */
    public function getIgnoredCategories(Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        return IgnoredCategory::where('userId', $user->userId)->get()->map(function($ignoredCategory) {
            return [ 'categoryId' => $ignoredCategory->categoryId, 'title' => $ignoredCategory->category->title ];
        });
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNotificationSettings (Request $request) {
        $user = UserHelper::getUserFromRequest($request);

        return response()->json($this->buildIgnoredNotificationTypes($user));
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateNotificationSettings (Request $request) {
        $user = UserHelper::getUserFromRequest($request);
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
        $user = UserHelper::getUserFromRequest($request);
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
        $user = UserHelper::getUserFromRequest($request);
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
     * Get request for fetching users current post bit options
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPostBit (Request $request) {
        $user = UserHelper::getUserFromRequest($request);

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
        $user = UserHelper::getUserFromRequest($request);
        $postBitOptions = $request->input('postBitOptions');
        $userData = UserHelper::getUserDataOrCreate($user->userId);

        $userData->postBit = $this->convertPostBitOptions($postBitOptions);
        $userData->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_POSTBIT);
        return response()->json();
    }

    /**
     * @param Request $request
     *
     * @return mixed
     */
    public function getThreadSubscriptions (Request $request) {
        $user = UserHelper::getUserFromRequest($request);

        return ThreadSubscription::where('userId', $user->userId)->get()->map(function($subscription) {
            return [
                'threadId' => $subscription->thread->threadId,
                'title' => $subscription->thread->title
            ];
        });
    }

    /**
     * @param Request $request
     *
     * @return mixed
     */
    public function getCategorySubscriptions (Request $request) {
        $user = UserHelper::getUserFromRequest($request);

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
