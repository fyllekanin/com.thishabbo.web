<?php

namespace App\Http\Controllers\Admin;

use App\EloquentModels\Badge;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserItem;
use App\Helpers\ConfigHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Models\Notification\Type;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminBadgesController extends Controller {

    /**
     * @param $badgeId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUsersWithBadge ($badgeId) {
        $badge = Badge::find($badgeId);
        Condition::precondition(!$badge, 404, 'Badge do not exist');

        $users = UserItem::badge()->get()->map(function ($userItem) {
            return [
                'nickname' => $userItem->user->nickname,
                'userId' => $userItem->userId
            ];
        });

        return response()->json([
            'users' => $users,
            'availableUsers' => User::getQuery()->get(['nickname', 'userId']),
            'badge' => $badge
        ]);
    }

    /**
     * @param Request $request
     * @param         $badgeId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateUsersWithBadge (Request $request, $badgeId) {
        $user = UserHelper::getUserFromRequest($request);
        $badge = Badge::find($badgeId);
        $userIds = $request->input('userIds');

        Condition::precondition(!$badge, 404, 'Badge do not exist');
        Condition::precondition(!is_array($userIds), 400, 'User ids need to be an array');

        UserItem::badge()->where('itemId', $badgeId)->whereNotIn('userId', $userIds)->delete();
        $this->addBadgeToUsers($userIds, $badgeId);

        Logger::admin($user->userId, $request->ip(), Action::UPDATED_USERS_WITH_BADGE, ['badge' => $badge->name]);
        return response()->json();
    }

    /**
     * Delete request to delete given badge
     *
     * @param Request $request
     * @param         $badgeId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteBadge (Request $request, $badgeId) {
        $user = UserHelper::getUserFromRequest($request);
        $badge = Badge::find($badgeId);

        Condition::precondition(!$badge, 404, 'Badge does not exist');
        Condition::precondition($badge->isSystem, 400, 'Can not delete a system badge');

        $badge->isDeleted = 1;
        $badge->save();

        Logger::admin($user->userId, $request->ip(), Action::DELETED_BADGE, ['badge' => $badge->name]);

        return response()->json();
    }

    /**
     * Post request to create a new user Badge
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createBadge (Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $badge = (object)json_decode($request->input('badge'));
        $badgeImage = $request->file('badgeImage');

        Condition::precondition(empty($badge->name), 400, 'A badge needs to have a name!');
        Condition::precondition(empty($badge->description), 400, 'A badge needs to have a description!');
        Condition::precondition($badge->points < 0, 400, 'A badge must have 0 or more points!');
        $nameIsUnique = Badge::withName($badge->name)->count() == 0;
        Condition::precondition(!$nameIsUnique, 400, 'Name needs to be unique');

        $this->validate($request, [
            'badgeImage' => 'required|mimes:jpg,jpeg,bmp,png,gif',
        ]);

        $badge = new Badge([
            'name' => $badge->name,
            'description' => $badge->description,
            'points' => $badge->points,
        ]);
        $badge->save();

        $fileName = $badge->badgeId . '.gif';
        $destination = base_path('/public/rest/resources/images/badges');
        $badgeImage->move($destination, $fileName);

        Logger::admin($user->userId, $request->ip(), Action::CREATED_BADGE, ['badge' => $badge->name]);

        return $this->getBadge($request, $badge->badgeId);
    }

    /**
     * @param Request $request
     * @param         $badgeId
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateBadge (Request $request, $badgeId) {
        $user = UserHelper::getUserFromRequest($request);
        $newBadge = (object)json_decode($request->input('badge'));
        $badgeImage = $request->file('badgeImage');

        $badge = Badge::find($badgeId);
        Condition::precondition(!$badge, 404, 'Badge does not exist');
        Condition::precondition($badge->isSystem, 400, 'Can no update a system defined badge');
        Condition::precondition(empty($newBadge->name), 400, 'A badge needs to have a name!');
        Condition::precondition(empty($newBadge->description), 400, 'A badge needs to have a description!');
        Condition::precondition($newBadge->points < 0, 400, 'A badge must have 0 or more points!');
        $nameIsUnique = Badge::whereRaw('lower(name) LIKE ?', [strtolower($newBadge->name)])->where('badgeId', '!=', $badgeId)->count() == 0;
        Condition::precondition(!$nameIsUnique, 400, 'Name needs to be unique');

        if ($badgeImage) {
            $this->validate($request, [
                'badgeImage' => 'required|mimes:jpg,jpeg,bmp,png,gif',
            ]);
        }

        Badge::where('badgeId', $badgeId)->update([
            'name' => $newBadge->name,
            'description' => $newBadge->description,
            'points' => $newBadge->points,
        ]);

        if ($badgeImage) {
            $fileName = $badge->badgeId . '.gif';
            $destination = base_path('/public/rest/resources/images/badges');
            $badgeImage->move($destination, $fileName);
        }

        Logger::admin($user->userId, $request->ip(), Action::UPDATED_BADGE, ['badge' => $badge->name]);

        return $this->getBadge($request, $badgeId);
    }

    /**
     * Get request to fetch resource of given Badge
     *
     * @param $badgeId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBadge ($badgeId) {
        $badge = Badge::find($badgeId);
        Condition::precondition(!$badge, 404, 'No badge with that ID exist');

        return response()->json($badge);
    }

    /**
     * Get request to fetch array of all badges
     *
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBadges (Request $request, $page) {
        $filter = $request->input('filter');

        $getBadgeSql = Badge::where('name', 'LIKE', '%' . $filter . '%')
            ->orderBy('name', 'ASC');

        $badges = $getBadgeSql->take($this->perPage)
            ->skip($this->getOffset($page))
            ->get();

        return response()->json([
            'badges' => $badges,
            'page' => $page,
            'total' => ceil($getBadgeSql->count() / $this->perPage)
        ]);
    }

    private function addBadgeToUsers ($userIds, $badgeId) {
        $notifications = [];
        $itemTypes = ConfigHelper::getTypesConfig();
        foreach ($userIds as $userId) {
            $haveItem = UserItem::badge()->where('itemId', $badgeId)->where('userId', $userId)->count() > 0;
            if ($haveItem) {
                continue;
            }
            $item = new UserItem([
                'type' => $itemTypes->badge->id,
                'itemId' => $badgeId,
                'userId' => $userId
            ]);
            $item->save();
            $notifications[] = [
                'userId' => $userId,
                'senderId' => 0,
                'type' => Type::getType(Type::BADGE),
                'contentId' => $badgeId,
                'createdAt' => time()
            ];
        }
        DB::table('notifications')->insert($notifications);
    }
}
