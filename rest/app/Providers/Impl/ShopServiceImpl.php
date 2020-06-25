<?php

namespace App\Providers\Impl;

use App\Constants\Shop\ShopItemTypes;
use App\EloquentModels\User\UserItem;
use App\Providers\Service\ShopService;
use App\Repositories\Impl\ShopRepository\ShopItemDBO;
use App\Repositories\Repository\ShopRepository;
use App\Repositories\Repository\SubscriptionRepository;

class ShopServiceImpl implements ShopService {
    private $myShopRepository;
    private $mySubscriptionRepository;

    public function __construct(ShopRepository $shopRepository, SubscriptionRepository $subscriptionRepository) {
        $this->myShopRepository = $shopRepository;
        $this->mySubscriptionRepository = $subscriptionRepository;
    }

    public function doUserOwnItem(int $userId, int $shopItemId) {
        $shopItem = $this->myShopRepository->getShopItemWithId($shopItemId);
        $itemId = $this->getItemIdFromShopItem($shopItem);

        return UserItem::where('userId', $userId)
                ->where('type', $shopItem->type)
                ->where('itemid', $itemId)
                ->count() > 0;
    }

    public function giveUserItem(int $userId, int $shopItemId) {
        $shopItem = $this->myShopRepository->getShopItemWithId($shopItemId);
        if (!ShopItemTypes::isUserItem($shopItem->type)) {
            $this->mySubscriptionRepository->createOrExtendUserSubscription(
                $userId,
                $shopItem->getParsedData()->subscriptionId,
                $shopItem->getParsedData()->subscriptionTime
            );
            return;
        }

        $itemId = $this->getItemIdFromShopItem($shopItem);
        $item = new UserItem();
        $item->type = $shopItem->type;
        $item->userId = $userId;
        $item->itemId = $itemId;
        $item->save();
    }

    private function getItemIdFromShopItem(ShopItemDBO $shopItemDBO) {
        switch ($shopItemDBO->type) {
            case ShopItemTypes::BADGE:
                return $shopItemDBO->getParsedData()->badgeId;
                break;
            default:
                return $shopItemDBO->shopItemId;
        }
    }
}
