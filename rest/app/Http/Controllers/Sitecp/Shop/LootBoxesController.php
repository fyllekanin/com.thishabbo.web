<?php

namespace App\Http\Controllers\Sitecp\Shop;

use App\EloquentModels\Shop\LootBox;
use App\EloquentModels\Shop\ShopItem;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\ShopHelper;
use App\Http\Controllers\Controller;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;

class LootBoxesController extends Controller {

    public function getItem($lootBoxId) {
        $lootBox = null;

        if ($lootBoxId == 'new') {
            $lootBox = (object)[
                'title' => null,
                'lootBoxId' => null,
                'boxId' => 1,
                'credits' => 0,
                'items' => ''
            ];
        } else {
            $lootBox = LootBox::find($lootBoxId);
            Condition::precondition(!$lootBox, 404, 'No loot box with that ID');
        }

        return response()->json([
            'lootBoxId' => $lootBox->lootBoxId,
            'title' => $lootBox->title,
            'boxId' => $lootBox->boxId,
            'credits' => $lootBox->credits,
            'items' => ShopHelper::getLootBoxItems($lootBox),
            'createdAt' => $lootBoxId != 'new' ? $lootBox->createdAt->timestamp : null
        ]);
    }

    public function getItems(Request $request, $page) {
        $title = $request->input('filter');
        $items = LootBox::orderBy('title', 'ASC');

        if ($title) {
            $items->where('title', 'LIKE', Value::getFilterValue($request, $title));
        }
        $total = DataHelper::getPage($items->count());

        return response()->json([
            'total' => $total,
            'page' => $page,
            'items' => $items->take($this->perPage)->skip(DataHelper::getOffset($page))->get()->map(function ($item) {
                $items = json_decode($item->items);

                return [
                    'lootBoxId' => $item->lootBoxId,
                    'title' => $item->title,
                    'items' => count($items)
                ];
            })
        ]);
    }

    public function getShopItems(Request $request, $page) {
        $title = $request->input('title');
        $type = $request->input('type');
        $rarity = $request->input('rarity');
        $itemIds = explode(',', $request->input('itemIds'));

        $types = ConfigHelper::getTypesConfig();
        $items = ShopItem::orderBy('title', 'ASC')->whereNotIn('shopItemId', $itemIds)->whereIn('type', [
            $types->nameIcon,
            $types->nameEffect,
            $types->subscription
        ]);

        if ($title) {
            $items->where('title', 'LIKE', Value::getFilterValue($request, $title));
        }

        if ($type) {
            $items->where('type', $type);
        }

        if ($rarity) {
            $items->where('rarity', $rarity);
        }
        $total = DataHelper::getPage($items->count());

        return response()->json([
            'total' => $total,
            'page' => $page,
            'items' => $items->take($this->perPage)->skip(DataHelper::getOffset($page))->get()->map(function ($item) {
                return [
                    'shopItemId' => $item->shopItemId,
                    'title' => $item->title,
                    'rarity' => $item->rarity,
                    'type' => $item->type
                ];
            })
        ]);
    }
}
