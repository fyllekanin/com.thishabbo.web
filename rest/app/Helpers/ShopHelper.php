<?php

namespace App\Helpers;

use App\EloquentModels\Shop\ShopItem;
use App\Utils\Iterables;

class ShopHelper {

    public static function getLootBoxItems($lootBox) {
        try {
            $itemIds = json_decode($lootBox->items);
            $items = array_map(function ($itemId) {
                $item = ShopItem::find($itemId);
                return $item ? [
                    'shopItemId' => $itemId,
                    'title' => $item->title,
                    'rarity' => $item->rarity,
                    'type' => $item->type
                ] : null;
            }, $itemIds);
            return Iterables::filter($items, function ($item) {
                return $item != null;
            });
        } catch (\Exception $exception) {
            return [];
        }
    }
}