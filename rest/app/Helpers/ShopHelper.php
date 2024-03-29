<?php

namespace App\Helpers;

use App\EloquentModels\Shop\ShopItem;
use App\Models\Shop\ShopItemData;
use App\Utils\Iterables;
use App\Utils\Value;
use Exception;

class ShopHelper {


    public static function getLootBoxItems($lootBox) {
        try {
            $itemIds = json_decode($lootBox->items);
            $items = array_map(
                function ($itemId) {
                    $item = ShopItem::find($itemId);
                    return $item ? [
                        'shopItemId' => $itemId,
                        'title' => $item->title,
                        'rarity' => $item->rarity,
                        'type' => $item->type,
                        'data' => new ShopItemData(Value::objectProperty($item, 'data', null))
                    ] : null;
                },
                $itemIds
            );
            return Iterables::filter(
                $items,
                function ($item) {
                    return $item != null;
                }
            );
        } catch (Exception $exception) {
            return [];
        }
    }

    public static function getLootBoxItem($lootBox) {
        $items = self::getLootBoxItems($lootBox);
        $percentageList = [];
        foreach ($items as $item) {
            for ($i = 0; $i < $item['rarity']; $i++) {
                $percentageList[] = $item['shopItemId'];
            }
        }
        shuffle($percentageList);
        $key = array_rand($percentageList);
        $shopItem = ShopItem::find($percentageList[$key]);
        if (!$shopItem) {
            $itemIds = Value::objectJsonProperty($lootBox, 'items', []);
            $itemIds = Iterables::filter(
                $itemIds,
                function ($itemId) use ($shopItem) {
                    return $itemId != $shopItem->shopItemId;
                }
            );
            $lootBox->items = json_encode($itemIds);
            $lootBox->save();
            return self::getLootBoxItem($lootBox);
        }
        return $shopItem;
    }
}
