<?php

namespace App\Http\Controllers\Sitecp\User;

use App\Constants\LogType;
use App\Constants\User\UserJobEventType;
use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\Shop\UserSubscription;
use App\EloquentModels\User\User;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Jobs\UserUpdated;
use App\Logger;
use App\Repositories\Repository\SubscriptionRepository;
use App\Utils\Condition;
use Illuminate\Http\Request;

class UserSubscriptionsController extends Controller {
    private $mySubscriptionRepository;

    public function __construct(SubscriptionRepository $subscriptionRepository) {
        parent::__construct();
        $this->mySubscriptionRepository = $subscriptionRepository;
    }

    public function getUserSubscriptions(Request $request, $userId) {
        $user = $request->get('auth');

        Condition::precondition(
            User::where('userId', $userId)->count() == 0,
            404,
            'No user with that ID'
        );
        Condition::precondition(
            !UserHelper::canManageUser($user, $userId),
            400,
            'You are not able to edit this user'
        );

        return response()->json(
            [
                'user' => UserHelper::getSlimUser($userId),
                'userSubscriptions' => UserSubscription::where('userId', $userId)->with(['subscription'])->get()->map(
                    function ($item) {
                        return [
                            'userSubscriptionId' => $item->userSubscriptionId,
                            'title' => $item->subscription->title,
                            'subscriptionId' => $item->subscription->subscriptionId,
                            'createdAt' => $item->createdAt->timestamp,
                            'expiresAt' => $item->expiresAt
                        ];
                    }
                ),
                'subscriptions' => Subscription::orderBy('title', 'ASC')->get(['subscriptionId', 'title'])
            ]
        );
    }

    public function createUserSubscription(Request $request, $userId) {
        $user = $request->get('auth');
        $data = (object) $request->input('data');
        $subscription = $this->mySubscriptionRepository->getSubscriptionWithId($data->subscriptionId);

        Condition::precondition(!$subscription, 404, 'No subscription with that ID');
        Condition::precondition(
            User::where('userId', $userId)->count() == 0,
            404,
            'No user with that ID'
        );
        Condition::precondition(
            !UserHelper::canManageUser($user, $userId),
            400,
            'You are not able to edit this user'
        );
        Condition::precondition(
            $data->expiresAt < time(),
            400,
            'The subscription can not expire before now'
        );

        Condition::precondition(
            UserSubscription::where('userId', $userId)->where('subscriptionId', $data->subscriptionId)->count() > 0,
            400,
            'This user already have this subscription'
        );

        $length = $data->expiresAt - time();
        $userSubscription = $this->mySubscriptionRepository->createOrExtendUserSubscription($userId, $data->subscriptionId, $length);

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::CREATED_USER_SUBSCRIPTION,
            [
                'subscriptionId' => $data->subscriptionId,
                'expiresAt' => $data->expiresAt
            ],
            $userId
        );
        return response()->json(
            [
                'userSubscriptionId' => $userSubscription->userSubscriptionId,
                'title' => $subscription->title,
                'subscriptionId' => $subscription->subscriptionId,
                'createdAt' => $userSubscription->createdAt->timestamp,
                'expiresAt' => $userSubscription->expiresAt
            ]
        );
    }

    public function updateUserSubscription(Request $request, $userSubscriptionId) {
        $user = $request->get('auth');
        $data = (object) $request->input('data');
        $userSubscription = $this->mySubscriptionRepository->getUserSubscriptionWithId($userSubscriptionId);

        Condition::precondition(
            !$userSubscription,
            404,
            'No user subscription with that ID'
        );
        Condition::precondition(
            !UserHelper::canManageUser($user, $userSubscription->userId),
            400,
            'You are not able to edit this user'
        );
        Condition::precondition(
            $data->expiresAt < time(),
            400,
            'The subscription can not expire before now'
        );

        $this->mySubscriptionRepository->setNewSubscriptionExpireDate($userSubscription->userSubscriptionId, $data->expiresAt);
        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_USER_SUBSCRIPTION,
            [
                'subscriptionId' => $userSubscription->subscriptionId,
                'beforeExpiresAt' => $userSubscription->expiresAt,
                'afterExpiresAt' => $data->expiresAt
            ],
            $userSubscription->userId
        );
        return response()->json();
    }

    public function deleteUserSubscription(Request $request, $userSubscriptionId) {
        $user = $request->get('auth');
        $userSubscription = UserSubscription::find($userSubscriptionId);

        Condition::precondition(!$userSubscription, 404, 'No user subscription with that ID');
        Condition::precondition(
            !UserHelper::canManageUser($user, $userSubscription->userId),
            400,
            'You are not able to edit this user'
        );

        $userId = $userSubscription->userId;
        $subscriptionId = $userSubscription->subscriptionId;
        UserUpdated::dispatch($userId, UserJobEventType::CLEAR_SUBSCRIPTION);

        $userSubscription->delete();

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::DELETED_USER_SUBSCRIPTION,
            [
                'subscriptionId' => $subscriptionId
            ],
            $userId
        );
        return response()->json();
    }
}
