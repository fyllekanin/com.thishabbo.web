<?php

namespace App\Http\Controllers\Sitecp;

use App\Constants\LogType;
use App\Constants\NotificationTypes;
use App\Constants\Shop\ShopItemTypes;
use App\EloquentModels\Badge;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserItem;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Repositories\Repository\SettingRepository;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BadgesController extends Controller {
    private $mySettingRepository;

    public function __construct(SettingRepository $settingRepository) {
        parent::__construct();
        $this->mySettingRepository = $settingRepository;
    }

    /**
     * @param $badgeId
     *
     * @return JsonResponse
     */
    public function getUsersWithBadge($badgeId) {
        $badge = Badge::find($badgeId);
        Condition::precondition(!$badge, 404, 'Badge do not exist');

        $users = UserItem::badge()->where('itemId', $badgeId)->get()->map(
            function ($userItem) {
                return [
                    'nickname' => $userItem->user->nickname,
                    'userId' => $userItem->userId,
                    'createdAt' => $userItem->createdAt->timestamp
                ];
            }
        );

        return response()->json(
            [
                'users' => $users,
                'availableUsers' => User::get(['nickname', 'userId']),
                'badge' => $badge
            ]
        );
    }

    /**
     * @param  Request  $request
     * @param $badgeId
     *
     * @return JsonResponse
     */
    public function updateUsersWithBadge(Request $request, $badgeId) {
        $user = $request->get('auth');
        $badge = Badge::find($badgeId);
        $userIds = $request->input('userIds');

        Condition::precondition(!$badge, 404, 'Badge do not exist');
        Condition::precondition(!is_array($userIds), 400, 'User ids need to be an array');

        UserItem::badge()->where('itemId', $badgeId)->whereNotIn('userId', $userIds)->delete();
        $this->addBadgeToUsers($userIds, $badgeId);

        Logger::sitecp($user->userId, $request->ip(), LogType::UPDATED_USERS_WITH_BADGE, ['badge' => $badge->name]);
        return response()->json();
    }

    /**
     * Delete request to delete given badge
     *
     * @param  Request  $request
     * @param $badgeId
     *
     * @return JsonResponse
     */
    public function deleteBadge(Request $request, $badgeId) {
        $user = $request->get('auth');
        $badge = Badge::find($badgeId);

        Condition::precondition(!$badge, 404, 'Badge does not exist');
        Condition::precondition($badge->isSystem, 400, 'Can not delete a system badge');

        $badge->isDeleted = 1;
        $badge->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::DELETED_BADGE, ['badge' => $badge->name], $badge->badgeId);

        return response()->json();
    }

    /**
     * Post request to create a new user Badge
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createBadge(Request $request) {
        $user = $request->get('auth');
        $badge = (object) json_decode($request->input('badge'));
        $badgeImage = $request->file('badgeImage');

        Condition::precondition(empty($badge->name), 400, 'A badge needs to have a name!');
        Condition::precondition(empty($badge->description), 400, 'A badge needs to have a description!');
        Condition::precondition($badge->points < 0, 400, 'A badge must have 0 or more points!');
        $nameIsUnique = Badge::withName($badge->name)->count('badgeId') == 0;
        Condition::precondition(!$nameIsUnique, 400, 'Name needs to be unique');

        $request->validate(
            [
                'badgeImage' => 'required|mimes:jpg,jpeg,bmp,png,gif',
            ]
        );

        $badge = new Badge(
            [
                'name' => $badge->name,
                'description' => $badge->description,
                'points' => Value::objectProperty($badge, 'points', 0),
            ]
        );
        $badge->save();

        $fileName = $badge->badgeId.'.gif';
        $target = $this->mySettingRepository->getResourcePath('images/badges');
        $badgeImage->move($target, $fileName);

        Logger::sitecp($user->userId, $request->ip(), LogType::CREATED_BADGE, ['badge' => $badge->name], $badge->badgeId);

        return $this->getBadge($badge->badgeId);
    }

    /**
     * @param  Request  $request
     * @param $badgeId
     *
     * @return JsonResponse
     */
    public function updateBadge(Request $request, $badgeId) {
        $user = $request->get('auth');
        $newBadge = (object) json_decode($request->input('badge'));
        $badgeImage = $request->file('badgeImage');

        $badge = Badge::find($badgeId);
        Condition::precondition(!$badge, 404, 'Badge does not exist');
        Condition::precondition($badge->isSystem, 400, 'Can no update a system defined badge');
        Condition::precondition(empty($newBadge->name), 400, 'A badge needs to have a name!');
        Condition::precondition(empty($newBadge->description), 400, 'A badge needs to have a description!');
        Condition::precondition($newBadge->points < 0, 400, 'A badge must have 0 or more points!');
        $nameIsUnique = Badge::whereRaw('lower(name) LIKE ?', [strtolower($newBadge->name)])
                ->where('badgeId', '!=', $badgeId)
                ->count('badgeId') == 0;
        Condition::precondition(!$nameIsUnique, 400, 'Name needs to be unique');

        if ($badgeImage) {
            $request->validate(
                [
                    'badgeImage' => 'required|mimes:jpg,jpeg,bmp,png,gif',
                ]
            );
        }

        Badge::where('badgeId', $badgeId)->update(
            [
                'name' => $newBadge->name,
                'description' => $newBadge->description,
                'points' => Value::objectProperty($newBadge, 'points', 0),
            ]
        );

        if ($badgeImage) {
            $fileName = $badge->badgeId.'.gif';
            $target = $this->mySettingRepository->getResourcePath('images/badges');
            $badgeImage->move($target, $fileName);
        }

        Logger::sitecp($user->userId, $request->ip(), LogType::UPDATED_BADGE, ['badge' => $badge->name]);
        return $this->getBadge($badgeId);
    }

    /**
     * Get request to fetch resource of given Badge
     *
     * @param $badgeId
     *
     * @return JsonResponse
     */
    public function getBadge($badgeId) {
        $badge = Badge::find($badgeId);
        Condition::precondition(!$badge, 404, 'No badge with that ID exist');

        return response()->json($badge);
    }

    /**
     * Get request to fetch array of all badges
     *
     * @param  Request  $request
     * @param $page
     *
     * @return JsonResponse
     */
    public function getBadges(Request $request, $page) {
        $filter = $request->input('filter');

        $getBadgeSql = Badge::where('name', 'LIKE', Value::getFilterValue($request, $filter))
            ->orderBy('name', 'ASC');

        $total = PaginationUtil::getTotalPages($getBadgeSql->count('badgeId'));
        $badges = $getBadgeSql->take($this->perPage)
            ->skip(PaginationUtil::getOffset($page))
            ->get();

        return response()->json(
            [
                'badges' => $badges,
                'page' => $page,
                'total' => $total
            ]
        );
    }

    private function addBadgeToUsers($userIds, $badgeId) {
        $notifications = [];
        foreach ($userIds as $userId) {
            $haveItem = UserItem::badge()->where('itemId', $badgeId)->where('userId', $userId)->count('userItemId') > 0;
            if ($haveItem) {
                continue;
            }
            $item = new UserItem(
                [
                    'type' => ShopItemTypes::BADGE,
                    'itemId' => $badgeId,
                    'userId' => $userId
                ]
            );
            $item->save();
            $notifications[] = [
                'userId' => $userId,
                'senderId' => 0,
                'type' => NotificationTypes::BADGE,
                'contentId' => $badgeId,
                'createdAt' => time()
            ];
        }
        DB::table('notifications')->insert($notifications);
    }
}
