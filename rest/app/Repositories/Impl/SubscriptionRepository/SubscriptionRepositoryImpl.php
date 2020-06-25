<?php

namespace App\Repositories\Impl\SettingRepository;

use App\Repositories\Impl\SubscriptionRepository\SubscriptionDBO;
use App\Repositories\Impl\SubscriptionRepository\UserSubscriptionDBO;
use App\Repositories\Repository\SubscriptionRepository;

class SubscriptionRepositoryImpl implements SubscriptionRepository {

    private $mySubscriptionDBO;
    private $myUserSubscriptionDBO;

    public function __construct() {
        $this->mySubscriptionDBO = new SubscriptionDBO();
        $this->myUserSubscriptionDBO = new UserSubscriptionDBO();
    }

    public function getActiveSubscriptionsForUserId(int $userId) {
        $subscriptionIds = $this->myUserSubscriptionDBO->query()
            ->isActive()
            ->forUserId($userId)
            ->pluck('subscriptionId');

        return $this->mySubscriptionDBO->query()->whereInSubscriptionId($subscriptionIds)->get();
    }

    public function getUserIdsWithSubscriptionId(int $subscriptionId) {
        return $this->myUserSubscriptionDBO->query()->isActive()->whereSubscriptionId($subscriptionId)->pluck('userId');
    }

    public function getSubscriptionWithId(int $subscriptionId) {
        return $this->mySubscriptionDBO->query()->find($subscriptionId);
    }

    public function createOrExtendUserSubscription(int $userId, int $subscriptionId, int $length) {
        $item = $this->myUserSubscriptionDBO
            ->query()
            ->isActive()
            ->whereSubscriptionId($subscriptionId)
            ->foruserId($userId)
            ->first();
        if (!$item) {
            $item = $this->myUserSubscriptionDBO->newInstance();
        }
        $item->userId = $userId;
        $item->subscriptionId = $subscriptionId;

        $isExpiringInFuture = $item->expiresAt && is_int($item->expiresAt) && $item->expiresAt > time();
        $item->expiresAt = $isExpiringInFuture ? $item->expiresAt + $length : time() + $length;
        $item->save();
        return $item;
    }

    public function getUserSubscriptionWithId(int $userSubscriptionId) {
        return $this->myUserSubscriptionDBO->query()->find($userSubscriptionId);
    }

    public function setNewSubscriptionExpireDate(int $userSubscriptionId, int $expiresAt) {
        $item = $this->getUserSubscriptionWithId($userSubscriptionId);
        if (!$item) {
            return;
        }
        $item->expiresAt = $expiresAt;
        $item->save();
    }
}
