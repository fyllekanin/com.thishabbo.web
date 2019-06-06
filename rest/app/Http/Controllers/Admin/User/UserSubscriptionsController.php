<?php

namespace App\Http\Controllers\Admin\User;

use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\Shop\UserSubscription;
use App\EloquentModels\User\User;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use Illuminate\Http\Request;

class UserSubscriptionsController extends Controller {

    public function __construct(Request $request) {
        parent::__construct($request);
    }

    public function getUserSubscriptions($userId) {
        Condition::precondition(User::where('userId', $userId)->count() == 0, 404,
            'No user with that ID');
        Condition::precondition(!UserHelper::canManageUser($this->user, $userId), 400,
            'You are not able to edit this user');

        return response()->json([
            'user' => UserHelper::getSlimUser($userId),
            'userSubscriptions' => UserSubscription::where('userId', $userId)->with(['subscription'])->get()->map(function ($item) {
                return [
                    'userSubscriptionId' => $item->userSubscriptionId,
                    'title' => $item->subscription->title,
                    'subscriptionId' => $item->subscription->subscriptionId,
                    'createdAt' => $item->createdAt->timestamp,
                    'expiresAt' => $item->expiresAt
                ];
            }),
            'subscriptions' => Subscription::orderBy('title', 'ASC')->get(['subscriptionId', 'title'])
        ]);
    }

    public function createUserSubscription(Request $request, $userId) {
        $data = (object)$request->input('data');

        Condition::precondition(User::where('userId', $userId)->count() == 0, 404,
            'No user with that ID');
        Condition::precondition(!UserHelper::canManageUser($this->user, $userId), 400,
            'You are not able to edit this user');
        $this->validateSubscription($data);

        Condition::precondition(UserSubscription::where('userId', $userId)->where('subscriptionId', $data->subscriptionId)->count() > 0, 400,
            'This user already have this subscription');

        $userSubscription = new UserSubscription([
            'subscriptionId' => $data->subscriptionId,
            'userId' => $userId,
            'expiresAt' => $data->expiresAt
        ]);
        $userSubscription->save();

        Logger::admin($this->user->userId, $request->ip(), Action::CREATED_USER_SUBSCRIPTION);
        return response()->json([
            'userSubscriptionId' => $userSubscription->userSubscriptionId,
            'title' => $userSubscription->subscription->title,
            'subscriptionId' => $userSubscription->subscription->subscriptionId,
            'createdAt' => $userSubscription->createdAt->timestamp,
            'expiresAt' => $userSubscription->expiresAt
        ]);
    }

    public function updateUserSubscription(Request $request, $userSubscriptionId) {
        $data = (object)$request->input('data');
        $userSubscription = UserSubscription::find($userSubscriptionId);

        Condition::precondition(!$userSubscription, 404,
            'No user subscription with that ID');
        Condition::precondition(!UserHelper::canManageUser($this->user, $userSubscription->userId), 400,
            'You are not able to edit this user');
        $data->subscriptionId = $userSubscription->subscriptionId;
        $this->validateSubscription($data);

        $userSubscription->expiresAt = $data->expiresAt;
        $userSubscription->save();

        Logger::admin($this->user->userId, $request->ip(), Action::UPDATED_USER_SUBSCRIPTION);
        return response()->json();
    }

    public function deleteUserSubscription(Request $request, $userSubscriptionId) {
        $userSubscription = UserSubscription::find($userSubscriptionId);

        Condition::precondition(!$userSubscription, 404, 'No user subscription with that ID');
        Condition::precondition(!UserHelper::canManageUser($this->user, $userSubscription->userId), 400,
            'You are not able to edit this user');

        $userSubscription->delete();

        Logger::admin($this->user->userId, $request->ip(), Action::DELETED_USER_SUBSCRIPTION);
        return response()->json();
    }

    private function validateSubscription($subscription) {
        Condition::precondition(Subscription::where('subscriptionId', $subscription->subscriptionId)->count() == 0,
            404, 'No subscription with that ID');
        Condition::precondition($subscription->expiresAt < time(), 400,
            'The subscription can not expire before now');
    }
}
