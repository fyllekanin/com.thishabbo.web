<?php

namespace App\Http\Controllers\Usercp;

use App\EloquentModels\User\Follower;
use App\Helpers\DataHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use Illuminate\Http\Request;

class FollowersController extends Controller {

    public function __construct(Request $request) {
        parent::__construct($request);
    }

    /**
     * @param Request $request
     *
     * @param $followerId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function approveFollower(Request $request, $followerId) {
        $follower = Follower::find($followerId);
        Condition::precondition(!$follower, 404, 'Follower data could not be found');
        Condition::precondition($follower->targetId != $this->user->userId, 400, 'This is not your follow!');

        $follower->isApproved = true;
        $follower->save();

        Logger::user($this->user->userId, $request->ip(), Action::APPROVED_FOLLOWER, ['user' => $follower->user->nickname]);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param $followerId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function denyFollower(Request $request, $followerId) {
        $follower = Follower::find($followerId);
        Condition::precondition(!$follower, 404, 'Follower data could not be found');
        Condition::precondition($follower->targetId != $this->user->userId, 400, 'This is not your follow!');

        $nickname = $follower->user->nickname;
        $follower->delete();

        Logger::user($this->user->userId, $request->ip(), Action::DENIED_FOLLOWER, ['user' => $nickname]);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param $followerId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeFollower(Request $request, $followerId) {
        $follower = Follower::find($followerId);
        Condition::precondition(!$follower, 404, 'Follower data could not be found');
        Condition::precondition($follower->targetId != $this->user->userId, 400, 'This is not your follow!');

        $nickname = $follower->user->nickname;
        $follower->delete();

        Logger::user($this->user->userId, $request->ip(), Action::REMOVED_FOLLOWER, ['user' => $nickname]);
        return response()->json();
    }

    /**
     * @param $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFollowers($page) {
        $followersSql = Follower::where('targetId', $this->user->userId)->isApproved();
        $total = DataHelper::getPage($followersSql->count('followerId'));

        return response()->json([
            'total' => $total,
            'page' => $page,
            'followers' => $followersSql->take($this->perPage)->skip($this->getOffset($page))->get()->map(function ($item) {
                return [
                    'followerId' => $item->followerId,
                    'user' => UserHelper::getSlimUser($item->userId),
                    'createdAt' => $item->createdAt->timestamp
                ];
            }),
            'awaiting' => Follower::where('targetId', $this->user->userId)->where('isApproved', false)->get()->map(function ($item) {
                return [
                    'followerId' => $item->followerId,
                    'user' => UserHelper::getSlimUser($item->userId),
                    'createdAt' => $item->createdAt->timestamp
                ];
            })
        ]);
    }
}
