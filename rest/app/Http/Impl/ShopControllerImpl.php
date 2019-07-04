<?php

namespace App\Http\Impl;

use App\EloquentModels\Shop\LootBox;
use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\Shop\UserSubscription;
use App\EloquentModels\User\UserItem;
use App\Helpers\ConfigHelper;
use App\Helpers\ShopHelper;

class ShopControllerImpl {

    public function getSubscriptions($user, $take, $skip) {
        $subscriptions = Subscription::orderBy('createdAt', 'DESC')
            ->take($take)
            ->skip($skip)
            ->whereRaw('(options & ' . ConfigHelper::getSubscriptionOptions()->isListed . ')')
            ->get()
            ->map(function ($subscription) use ($user) {
                $userSubscription = UserSubscription::where('subscriptionId', $subscription->subscriptionId)
                    ->where('userId', $user->userId)
                    ->where('expiresAt', '>', time())
                    ->first();
                return [
                    'subscriptionId' => $subscription->subscriptionId,
                    'title' => $subscription->title,
                    'credits' => $subscription->credits,
                    'pounds' => $subscription->pounds,
                    'options' => [
                        'customNameColor' => $subscription->options & ConfigHelper::getSubscriptionOptions()->canHaveCustomNameColor,
                        'customNamePosition' => $subscription->options & ConfigHelper::getSubscriptionOptions()->canMoveNamePosition,
                        'avatarWidth' => $subscription->avatarWidth,
                        'avatarHeight' => $subscription->avatarHeight
                    ],
                    'expiresAt' => $userSubscription ? $userSubscription->expiresAt : 0
                ];
            });

        return (object)[
            'items' => $subscriptions,
            'total' => Subscription::whereRaw('(options & ' . ConfigHelper::getSubscriptionOptions()->isListed . ')')->count()
        ];
    }

    public function getLootBoxes($user, $take, $skip) {
        $lootBoxes = LootBox::orderBy('createdAt', 'DESC')
            ->take($take)
            ->skip($skip)
            ->get()
            ->map(function ($lootBox) use ($user) {
                return [
                    'lootBoxId' => $lootBox->lootBoxId,
                    'title' => $lootBox->title,
                    'credits' => $lootBox->credits,
                    'boxId' => $lootBox->boxId,
                    'items' => array_map(function ($item) use ($user) {
                        $item['owns'] = UserItem::where('itemId', $item['shopItemId'])
                                ->where('userId', $user->userId)
                                ->where('type', $item['type'])
                                ->count() > 0;
                        return $item;
                    }, ShopHelper::getLootBoxItems($lootBox))
                ];
            });

        return (object)[
            'items' => $lootBoxes,
            'total' => LootBox::count()
        ];
    }
}