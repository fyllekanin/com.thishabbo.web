<?php

namespace App\Http\Controllers;

use App\EloquentModels\User\Follower;
use App\EloquentModels\User\User;
use App\Factories\Notification\NotificationFactory;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ActivityService;
use App\Services\ForumService;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProfileController extends Controller {

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createFollow(Request $request) {
        $user = Cache::get('auth');
        $userId = $request->input('userId');

        Condition::precondition($user->userId == $userId, 400, 'You can not follow yourself');

        $target = User::find($userId);
        Condition::precondition(!$target, 404, 'No user with that ID');

        $isFollowing = Follower::where('userId', $user->userId)->where('targetId', $userId)->count() > 0;
        Condition::precondition($isFollowing, 400, 'You are already following this user');

        $follow = new Follower([
            'userId' => $user->userId,
            'targetId' => $target->userId,
            'isApproved' => !($target->profile && $target->profile->isPrivate)
        ]);
        $follow->save();

        NotificationFactory::followedUser($follow->targetId, $follow->userId);
        Logger::user($user->userId, $request->ip(), Action::FOLLOWED, [], $target->userId);
        return response()->json($this->getFollowers($target->userId, $user));
    }

    /**
     * @param Request $request
     * @param $userId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteFollow(Request $request, $userId) {
        $user = Cache::get('auth');

        $follow = Follower::where('userId', $user->userId)->where('targetId', $userId)->first();
        Condition::precondition(!$follow, 404, 'You are not following this user');

        $targetId = $follow->targetId;
        $follow->delete();
        Logger::user($user->userId, $request->ip(), Action::UNFOLLOWED, [], $targetId);
        return response()->json($this->getFollowers($targetId, $user));
    }

    /**
     * @param ActivityService $activityService
     * @param ForumService $forumService
     * @param         $nickname
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfile(ActivityService $activityService, ForumService $forumService, $nickname) {
        $user = Cache::get('auth');

        $profile = User::withNickname($nickname)->first();
        Condition::precondition(!$profile, 404, 'No user with that nickname');

        if ($this->isPrivate($user, $profile)) {
            return response()->json([
                'user' => UserHelper::getSlimUser($profile->userId),
                'followers' => $this->getFollowers($profile->userId, $user)
            ]);
        }

        return response()->json([
            'user' => UserHelper::getSlimUser($profile->userId),
            'followers' => $this->getFollowers($profile->userId, $user),
            'youtube' => $profile->profile ? $profile->profile->youtube : null,
            'activities' => $activityService->getLatestActivities($forumService->getAccessibleCategories($user->userId), $profile->userId),
            'stats' => [
                'userId' => $profile->userId,
                'posts' => $profile->posts,
                'threads' => $profile->threads,
                'likes' => $profile->likes,
                'createdAt' => $profile->createdAt->timestamp,
                'lastActivity' => $profile->lastActivity
            ],
            'relations' => !$profile->profile ? [] : [
                'love' => isset($profile->profile->love) ? UserHelper::getSlimUser($profile->profile->love) : null,
                'like' => isset($profile->profile->like) ? UserHelper::getSlimUser($profile->profile->like) : null,
                'hate' => isset($profile->profile->hate) ? UserHelper::getSlimUser($profile->profile->hate) : null
            ]
        ]);
    }

    /**
     * @param $user
     * @param $profile
     *
     * @return bool
     */
    private function isPrivate($user, $profile) {
        if ($user->userId == $profile->userId) {
            return false;
        }

        if (PermissionHelper::haveAdminPermission($user->userId, ConfigHelper::getAdminConfig()->canPassPrivate)) {
            return false;
        }

        if (!$profile->profile || !$profile->profile->isPrivate) {
            return false;
        }

        return Follower::where('userId', $user->userId)->where('targetId', $profile->userId)->isApproved()->count() === 0;
    }

    /**
     * @param $userId - ID of user that own the profile
     * @param $user - ID of user that is logged in / requesting
     *
     * @return array
     */
    private function getFollowers($userId, $user) {
        $following = Follower::where('userId', $user->userId)->where('targetId', $userId)->first();

        return [
            'followers' => Follower::where('targetId', $userId)->inRandomOrder()->take(5)->isApproved()->get()->map(function ($follower) {
                return UserHelper::getSlimUser($follower->userId);
            }),
            'total' => Follower::where('targetId', $userId)->isApproved()->count(),
            'isFollowing' => $following ? true : false,
            'isApproved' => $following ? $following->isApproved : false
        ];
    }
}
