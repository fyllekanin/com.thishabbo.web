<?php

namespace App\Repositories\Repository;

use App\Repositories\Impl\ShopRepository\ShopItemDBO;
use Illuminate\Support\Collection;

interface ShopRepository {


    /**
     * Get all the current loot boxes
     *
     * @return Collection of LootBoxDBO
     */
    public function getLootBoxes();

    /**
     * Get the shop items with given IDs
     *
     * @param  Collection  $ids
     *
     * @return Collection of ShopItemDBO
     */
    public function getShopItems(Collection $ids);

    /**
     * Get the shop item with the given ID
     *
     * @param  int  $shopItemId
     *
     * @return ShopItemDBO
     */
    public function getShopItemWithId(int $shopItemId);
}
