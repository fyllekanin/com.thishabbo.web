<?php

namespace App\Repositories\Impl\ShopRepository;

use App\Repositories\Repository\ShopRepository;
use Illuminate\Support\Collection;

class ShopRepositoryImpl implements ShopRepository {
    private $myLootBoxDBO;
    private $myShopItemDBO;

    public function __construct() {
        $this->myLootBoxDBO = new LootBoxDBO();
        $this->myShopItemDBO = new ShopItemDBO();
    }

    public function getLootBoxes() {
        return $this->myLootBoxDBO->query()->get();
    }

    public function getShopItems(Collection $ids) {
        return $this->myShopItemDBO->query()->whereInShopItemId($ids)->get();
    }

    public function getShopItemWithId(int $shopItemId) {
        return $this->myShopItemDBO->query()->whereShopItemId($shopItemId)->first();
    }
}
