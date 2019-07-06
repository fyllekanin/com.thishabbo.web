<?php

namespace App\Http\Controllers\Sitecp\Shop;

use App\EloquentModels\Shop\LootBox;
use App\EloquentModels\Shop\ShopItem;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\ShopHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Models\Shop\ShopItemData;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;

class LootBoxesController extends Controller {

    public function createLootBox(Request $request) {
        $user = $request->get('auth');
        $data = (object)$request->input('lootBox');
        $this->validateLootBox($data);

        $lootBox = new LootBox([
            'title' => $data->title,
            'items' => json_encode(array_map(function ($item) {
                return $item['shopItemId'];
            }, $data->items)),
            'boxId' => $data->boxId,
            'credits' => $data->credits
        ]);
        $lootBox->save();

        Logger::sitecp($user->userId, $request->ip(), Action::CREATED_LOOT_BOX, [],
            $lootBox->lootBoxId);
        return response()->json();
    }

    public function updateLootBox(Request $request, $lootBoxId) {
        $user = $request->get('auth');
        $data = (object)$request->input('lootBox');
        $lootBox = LootBox::find($lootBoxId);
        Condition::precondition(!$lootBox, 404, 'No loot box with that ID');
        $this->validateLootBox($data);

        $lootBox->title = $data->title;
        $lootBox->items = json_encode(array_map(function ($item) {
            return $item['shopItemId'];
        }, $data->items));
        $lootBox->boxId = $data->boxId;
        $lootBox->credits = $data->credits;
        $lootBox->save();

        Logger::sitecp($user->userId, $request->ip(), Action::UPDATED_LOOT_BOX, [],
            $lootBox->lootBoxId);
        return response()->json();
    }

    public function deleteLootBox(Request $request, $lootBoxId) {
        $user = $request->get('auth');
        $lootBox = LootBox::find($lootBoxId);
        Condition::precondition(!$lootBox, 404, 'No loot box with that ID');

        $lootBox->isDeleted = true;
        $lootBox->save();

        Logger::sitecp($user->userId, $request->ip(), Action::DELETED_LOOT_BOX, [],
            $lootBox->lootBoxId);
        return response()->json();
    }

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
        $total = DataHelper::getPage($items->count(), 30);

        return response()->json([
            'total' => $total,
            'page' => $page,
            'items' => $items->take($this->perPage)->skip(DataHelper::getOffset($page), 30)->get()->map(function ($item) {
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
            $types->subscription,
            $types->badge
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
                    'type' => $item->type,
                    'data' => new ShopItemData(Value::objectProperty($item, 'data', null))
                ];
            })
        ]);
    }

    private function validateLootBox($lootBox) {
        Condition::precondition(!isset($lootBox->title) || empty($lootBox->title),
            400, 'Title needs to be set');
        Condition::precondition(!is_numeric($lootBox->boxId) || $lootBox->boxId < 1,
            400, 'You need to select a box');
        Condition::precondition(!is_numeric($lootBox->credits) || $lootBox->credits < 1,
            400, 'You need to set a price');
        Condition::precondition(!is_array($lootBox->items) || count($lootBox->items) < 2,
            400, 'You need to select 2 or more items');

        foreach ($lootBox->items as $item) {
            Condition::precondition(ShopItem::where('shopItemId', $item['shopItemId'])->count() == 0,
                404, 'No item with that ID');
        }
    }
}
