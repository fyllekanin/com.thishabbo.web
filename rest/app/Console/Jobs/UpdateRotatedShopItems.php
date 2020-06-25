<?php

namespace App\Console\Jobs;

use App\Constants\SettingsKeys;
use App\Constants\Shop\ShopItemTypes;
use App\Models\Shop\RotatedShopItem;
use App\Repositories\Repository\SettingRepository;
use App\Repositories\Repository\ShopRepository;
use Illuminate\Support\Collection;

class UpdateRotatedShopItems {

    private $mySettingRepository;
    private $myShopRepository;

    public function __construct(SettingRepository $settingRepository, ShopRepository $shopRepository) {
        $this->mySettingRepository = $settingRepository;
        $this->myShopRepository = $shopRepository;
    }

    public function init() {
        $lootBoxes = $this->myShopRepository->getLootBoxes();
        $itemTypes = $this->getItemTypesToChoose();
        $itemIds = $this->getAllApplicableItemIds($lootBoxes);
        $items = $this->myShopRepository->getShopItems($itemIds);

        $randomItems = $this->getRandomItems($itemTypes, $items, $lootBoxes);
        $this->mySettingRepository->createOrUpdate(SettingsKeys::ROTATION_SHOP_ITEMS, json_encode($randomItems));
    }

    private function getRandomItems(Collection $itemTypes, Collection $items, Collection $lootBoxes) {
        return $itemTypes->map(
            function ($types) use ($items) {
                $applicableItems = $items->filter(
                    function ($item) use ($types) {
                        return in_array($item->type, $types);
                    }
                );
                return $applicableItems->count() > 0 ? $applicableItems->random() : null;
            }
        )->filter(
            function ($shopItem) {
                return $shopItem != null;
            }
        )->map(
            function ($shopItem) use ($lootBoxes) {
                $lootBox = $lootBoxes->first(
                    function ($lootBox) use ($shopItem) {
                        $items = json_decode($lootBox->items);
                        return in_array($shopItem->shopItemId, $items);
                    }
                );

                $item = new RotatedShopItem();
                $item->shopItemId = $shopItem->shopItemId;
                $item->credits = $lootBox ? $lootBox->credits : 0;
                return $item;
            }
        )->filter(
            function ($item) {
                return $item->credits > 0;
            }
        );
    }

    private function getAllApplicableItemIds(Collection $lootBoxes) {
        return $lootBoxes->map(
            function ($lootBox) {
                return json_decode($lootBox->items);
            }
        )->reduce(
            function (Collection $prev, $curr) {
                return $prev->concat(collect($curr));
            },
            collect()
        )->unique();
    }

    private function getItemTypesToChoose() {
        return collect(
            [
                [ShopItemTypes::NAME_ICON],
                [ShopItemTypes::NAME_ICON, ShopItemTypes::BADGE],
                [ShopItemTypes::NAME_ICON, ShopItemTypes::NAME_EFFECT]
            ]
        );
    }
}
