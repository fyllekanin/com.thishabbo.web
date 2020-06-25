<?php

namespace App\Providers\Service;

interface ShopService {

    /**
     * Check if the given user owns the given shop item
     *
     * @param  int  $userId
     * @param  int  $shopItemId
     *
     * @return bool
     */
    public function doUserOwnItem(int $userId, int $shopItemId);

    /**
     * Give the given item to the given user
     *
     * @param  int  $userId
     * @param  int  $shopItemId
     */
    public function giveUserItem(int $userId, int $shopItemId);
}
