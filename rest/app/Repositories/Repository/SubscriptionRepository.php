<?php

namespace App\Repositories\Repository;

use App\Repositories\Impl\SubscriptionRepository\SubscriptionDBO;
use App\Repositories\Impl\SubscriptionRepository\UserSubscriptionDBO;
use Illuminate\Support\Collection;

interface SubscriptionRepository {


    /**
     * Get list of all active subscriptions for user with id
     *
     * @param  int  $userId
     *
     * @return Collection of SubscriptionDBO
     */
    public function getActiveSubscriptionsForUserId(int $userId);

    /**
     * Get list of all userIds that has the given subscription id
     *
     * @param  int  $subscriptionId
     *
     * @return Collection of userIds
     */
    public function getUserIdsWithSubscriptionId(int $subscriptionId);

    /**
     * Get the SubscriptionDBO by id
     *
     * @param  int  $subscriptionId
     *
     * @return SubscriptionDBO | null
     */
    public function getSubscriptionWithId(int $subscriptionId);

    /**
     * Give or extend an existing subscription to the provided
     * user.
     *
     * @param  int  $userId  to get the subscription/extension
     * @param  int  $subscriptionId  to give given
     * @param  int  $length  of subscription
     *
     * @return UserSubscriptionDBO
     */
    public function createOrExtendUserSubscription(int $userId, int $subscriptionId, int $length);

    /**
     * Get user subscription by id
     *
     * @param  int  $userSubscriptionId
     *
     * @return UserSubscriptionDBO | null
     */
    public function getUserSubscriptionWithId(int $userSubscriptionId);

    /**
     * Set a new expire date for given user subscription.
     *
     * @param  int  $userSubscriptionId
     * @param  int  $expiresAt
     *
     * @return mixed
     */
    public function setNewSubscriptionExpireDate(int $userSubscriptionId, int $expiresAt);
}
