<?php

namespace App\Http\Controllers\Usercp;

use App\Constants\LogType;
use App\EloquentModels\User\Follower;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FollowersController extends Controller {

    /**
     * @param  Request  $request
     *
     * @param $followerId
     *
     * @return JsonResponse
     */
    public function approveFollower(Request $request, $followerId) {
        $user = $request->get('auth');
        $follower = Follower::find($followerId);
        Condition::precondition(!$follower, 404, 'Follower data could not be found');
        Condition::precondition($follower->targetId != $user->userId, 400, 'This is not your follow!');

        $follower->isApproved = true;
        $follower->save();

        Logger::user($user->userId, $request->ip(), LogType::APPROVED_FOLLOWER, ['user' => $follower->user->nickname]);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $followerId
     *
     * @return JsonResponse
     */
    public function denyFollower(Request $request, $followerId) {
        $user = $request->get('auth');
        $follower = Follower::find($followerId);
        Condition::precondition(!$follower, 404, 'Follower data could not be found');
        Condition::precondition($follower->targetId != $user->userId, 400, 'This is not your follow!');

        $nickname = $follower->user->nickname;
        $follower->delete();

        Logger::user($user->userId, $request->ip(), LogType::DENIED_FOLLOWER, ['user' => $nickname]);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $followerId
     *
     * @return JsonResponse
     */
    public function removeFollower(Request $request, $followerId) {
        $user = $request->get('auth');
        $follower = Follower::find($followerId);
        Condition::precondition(!$follower, 404, 'Follower data could not be found');
        Condition::precondition($follower->targetId != $user->userId, 400, 'This is not your follow!');

        $nickname = $follower->user->nickname;
        $follower->delete();

        Logger::user($user->userId, $request->ip(), LogType::REMOVED_FOLLOWER, ['user' => $nickname]);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $page
     *
     * @return JsonResponse
     */
    public function getFollowers(Request $request, $page) {
        $user = $request->get('auth');
        $followersSql = Follower::isApproved()->where('targetId', $user->userId);
        $total = PaginationUtil::getTotalPages($followersSql->count('followerId'));

        return response()->json(
            [
                'total' => $total,
                'page' => $page,
                'followers' => $followersSql->take($this->perPage)->skip(PaginationUtil::getOffset($page))->get()->map(
                    function ($item) {
                        return [
                            'followerId' => $item->followerId,
                            'user' => UserHelper::getSlimUser($item->userId),
                            'createdAt' => $item->createdAt->timestamp
                        ];
                    }
                ),
                'awaiting' => Follower::where('isApproved', false)->where('targetId', $user->userId)->get()->map(
                    function ($item) {
                        return [
                            'followerId' => $item->followerId,
                            'user' => UserHelper::getSlimUser($item->userId),
                            'createdAt' => $item->createdAt->timestamp
                        ];
                    }
                )
            ]
        );
    }
}
