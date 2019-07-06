<?php

namespace App\Http\Controllers\Usercp;

use App\EloquentModels\Badge;
use App\EloquentModels\Forum\CategorySubscription;
use App\EloquentModels\Forum\IgnoredCategory;
use App\EloquentModels\Forum\IgnoredThread;
use App\EloquentModels\Forum\ThreadSubscription;
use App\EloquentModels\Log\LogUser;
use App\EloquentModels\Theme;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserItem;
use App\EloquentModels\User\VoucherCode;
use App\Factories\Notification\NotificationView;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\AuthService;
use App\Services\CreditsService;
use App\Services\HabboService;
use App\Services\NotificationService;
use App\Utils\Condition;
use App\Utils\Iterables;
use App\Utils\Value;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller {
    private $authService;
    private $habboService;
    private $creditsService;

    private $threeDaysAgo;

    /**
     * AccountController constructor.
     *
     * @param AuthService $authService
     * @param HabboService $habboService
     * @param CreditsService $creditsService
     */
    public function __construct(AuthService $authService, HabboService $habboService, CreditsService $creditsService) {
        parent::__construct();
        $this->authService = $authService;
        $this->habboService = $habboService;
        $this->creditsService = $creditsService;
        $this->threeDaysAgo = time() - 259200;
    }

    /**
     * @param Request $request
     * @param NotificationService $notificationService
     * @param $page
     *
     * @return array
     */
    public function getNotifications(Request $request, NotificationService $notificationService, $page) {
        $user = $request->get('auth');

        $notificationsSql = DB::table('notifications')
            ->where('userId', $user->userId)
            ->orderBy('createdAt', 'DESC');

        $total = DataHelper::getPage($notificationsSql->count('notificationId'));
        $notifications = $notificationsSql->take($this->perPage)->skip(DataHelper::getOffset($page))->get()->toArray();

        $items = array_map(function ($notification) use ($user) {
            return new NotificationView($notification, $user);
        }, Iterables::filter($notifications, function ($notification) use ($user, $notificationService) {
            return $notificationService->isNotificationValid($notification->contentId, $notification->type);
        }));

        return response()->json([
            'total' => $total,
            'page' => $page,
            'items' => $items
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function claimVoucherCode(Request $request) {
        $user = $request->get('auth');
        $code = $request->input('code');

        $voucherCode = VoucherCode::where('code', $code)->first();
        Condition::precondition(!$voucherCode, 404, 'No voucher code with that code!');
        Condition::precondition(!$voucherCode->isActive, 400, 'The voucher code is not longer active!');

        $voucherCode->isActive = false;
        $voucherCode->save();

        $this->creditsService->giveCredits($user->userId, $voucherCode->value);

        Logger::user($user->userId, $request->ip(), Action::CLAIMED_VOUCHER_CODE, [], $voucherCode->voucherCodeId);
        return response()->json($voucherCode->value);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getThemes(Request $request) {
        $user = $request->get('auth');

        return response()->json(Theme::get()->map(function ($item) use ($user) {
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
        $user = $request->get('auth');
        $themeId = $request->input('themeId');
        $theme = $themeId == 0 ? (object)['title' => 'Default'] : Theme::find($themeId);
        Condition::precondition(!$theme, 404, 'No theme with that ID');

        $user->theme = $themeId;
        $user->save();

        Logger::user($user->userId, $request->ip(), Action::SELECTED_THEME, ['theme' => $theme->title]);
        return response()->json();
    }

    /**
     * Get request for fetching users current verified habbo
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHabbo(Request $request) {
        $user = $request->get('auth');
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
    public function updateHabbo(Request $request) {
        $user = $request->get('auth');
        $requiredMotto = 'thishabbo-' . $user->userId;

        $name = $request->input('habbo');
        Condition::precondition(!$name, 400, 'You did not fill anything in');
        Condition::precondition(User::withHabbo($name)->count('userId') > 0, 400, 'Habbo already taken');

        $habbo = $this->habboService->getHabboByName($name);
        Condition::precondition(!$habbo, 404, 'No habbo with that name');
        Condition::precondition(strtotime($habbo->memberSince) > $this->threeDaysAgo, 400, 'Your habbo is to young!');
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
        $user = $request->get('auth');
        $nickname = $request->input('nickname');
        $oneWeek = 604800;
        $oneMonth = 2419200;

        $gotTimeout = LogUser::where('action', Action::getAction(Action::CHANGED_NICKNAME))->where('userId', $user->userId)
                ->where('createdAt', '>', (time() - $oneWeek))->count('logId') > 0;
        Condition::precondition($gotTimeout, 400, 'You need to wait one week until you can change nickname again');
        Condition::precondition(!$this->creditsService->haveEnoughCredits($user->userId, ConfigHelper::getCostSettings()->nickname), 400, 'You do not have enough credits');
        Condition::precondition(!isset($nickname) || empty($nickname) || strlen($nickname) < 3, 400,
            'Nickname is not valid');

        $userWithNickname = User::withNickname($nickname)->first();
        if ($userWithNickname) {
            Condition::precondition($userWithNickname->lastActivity > (time() - ($oneMonth * 4)), 400,
                'Nickname is already taken and user is not inactive');
            $userWithNickname->nickname = $this->generateString();
            $userWithNickname->save();
        }

        $this->creditsService->takeCredits($user->userId, ConfigHelper::getCostSettings()->nickname);
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
        $user = $request->get('auth');
        return IgnoredThread::where('userId', $user->userId)->get()->map(function ($ignoredThread) {
            return ['threadId' => $ignoredThread->threadId, 'title' => $ignoredThread->thread->title];
        });
    }

    /**
     * @param Request $request
     *
     * @return mixed
     */
    public function getIgnoredCategories(Request $request) {
        $user = $request->get('auth');
        return IgnoredCategory::where('userId', $user->userId)->get()->map(function ($ignoredCategory) {
            return ['categoryId' => $ignoredCategory->categoryId, 'title' => $ignoredCategory->category->title];
        });
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNotificationSettings(Request $request) {
        $user = $request->get('auth');

        return response()->json($this->buildIgnoredNotificationTypes($user));
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateNotificationSettings(Request $request) {
        $user = $request->get('auth');
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
    public function updateHomePage(Request $request) {
        $user = $request->get('auth');
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
    public function updatePassword(Request $request) {
        $user = $request->get('auth');
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
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPostBit(Request $request) {
        $user = $request->get('auth');

        return response()->json([
            'information' => $this->buildPostBitOptions($user),
            'namePosition' => [
                'isAvailable' => UserHelper::hasSubscriptionFeature($user->userId, ConfigHelper::getSubscriptionOptions()->canMoveNamePosition),
                'position' => UserHelper::getUserDataOrCreate($user->userId)->namePosition
            ],
            'barColor' => [
                'isAvailable' => UserHelper::hasSubscriptionFeature($user->userId, ConfigHelper::getSubscriptionOptions()->canHaveCustomBar),
                'color' => Value::objectJsonProperty(UserHelper::getUserDataOrCreate($user->userId), 'barColor', null)
            ]
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAvailableBadges(Request $request) {
        $user = $request->get('auth');
        $availableBadgeIds = UserItem::where('userId', $user->userId)->badge()->pluck('itemId');
        $userdata = UserHelper::getUserDataOrCreate($user->userId);
        $activeBadges = Value::objectJsonProperty($userdata, 'activeBadges', []);

        return response()->json(Badge::whereIn('badgeId', $availableBadgeIds)->get(['badgeId', 'name', 'updatedAt'])->map(function ($badge) use ($activeBadges) {
            $badge->isActive = in_array($badge->badgeId, $activeBadges);
            return $badge;
        }));
    }

    /**
     * Put request to update the users post bit options
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePostBit(Request $request) {
        $user = $request->get('auth');
        $data = json_decode(json_encode($request->input('data')));
        $namePosition = (object)$data->namePosition;
        $barColor = (object)$data->barColor;
        $badgeIds = array_map(function ($badge) {
            return $badge->badgeId;
        }, $data->information->badges);

        Condition::precondition(count($badgeIds) > 3, 400, 'You can not have more then 3 badges selected!');

        Condition::precondition($barColor->isAvailable && !UserHelper::hasSubscriptionFeature($user->userId, ConfigHelper::getSubscriptionOptions()->canHaveCustomBar),
            400, 'You can not have a custom bar');
        Condition::precondition($barColor->isAvailable && !Value::validateHexColors($barColor->color),
            400, 'One or more bar colors are invalid');
        Condition::precondition($namePosition->isAvailable && !UserHelper::hasSubscriptionFeature($user->userId, ConfigHelper::getSubscriptionOptions()->canMoveNamePosition),
            400, 'You can not choose name position');
        $position = Iterables::find((array)ConfigHelper::getNamePositionOptions(), function ($position) use ($namePosition) {
            return $position == $namePosition->position;
        });
        Condition::precondition($namePosition->isAvailable && !$position, 400, 'Not a valid position');

        $userData = UserHelper::getUserDataOrCreate($user->userId);
        $userData->postBit = $this->convertPostBitOptions($data->information);
        $userData->namePosition = $namePosition->position;
        $userData->barColor = json_encode($barColor->color);
        $userData->activeBadges = json_encode($badgeIds);
        $userData->save();

        Logger::user($user->userId, $request->ip(), Action::UPDATED_POSTBIT);
        return response()->json();
    }

    /**
     * @param Request $request
     *
     * @return mixed
     */
    public function getThreadSubscriptions(Request $request) {
        $user = $request->get('auth');

        return ThreadSubscription::where('userId', $user->userId)->get()->map(function ($subscription) {
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
    public function getCategorySubscriptions(Request $request) {
        $user = $request->get('auth');

        return CategorySubscription::where('userId', $user->userId)->get()->map(function ($subscription) {
            return [
                'categoryId' => $subscription->category->categoryId,
                'title' => $subscription->category->title
            ];
        });
    }

    /**
     * Returns the statistics for UserCP dashboard
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDashboardStatistics(Request $request) {
        $user = $request->get('auth');
        return response()->json([
            'userId' => $user->userId,
            'registerTimestamp' => $user->createdAt->timestamp,
            'itemsOwned' => UserItem::where('userId', $user->userId)->count(),
            'likes' => $user->likes
        ]);
    }

    /**
     * Get method to convert option names to bitwise numbers
     *
     * @param $postBitOptions
     *
     * @return int
     */
    private function convertPostBitOptions($postBitOptions) {
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
    private function buildPostBitOptions($user) {
        $userdata = UserHelper::getUserDataOrCreate($user->userId);
        return UserHelper::getUserPostBit($userdata);
    }


    /**
     * @param $ignoredNotifications
     *
     * @return int
     */
    private function convertIgnoredNotificationTypes($ignoredNotifications) {
        $options = 0;
        $configOptions = ConfigHelper::getIgnoredNotificationsConfig();

        foreach ($ignoredNotifications as $key => $value) {
            if (isset($ignoredNotifications[$key]) && $value) {
                $options += $configOptions->$key;
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
    private function buildIgnoredNotificationTypes($user) {
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
    private function generateString() {
        $token = openssl_random_pseudo_bytes(8);
        $token = bin2hex($token);
        return implode('', str_split($token, 4));
    }
}
