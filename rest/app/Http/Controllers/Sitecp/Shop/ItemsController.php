<?php

namespace App\Http\Controllers\Sitecp\Shop;

use App\EloquentModels\Shop\ShopItem;
use App\EloquentModels\Shop\Subscription;
use App\Helpers\DataHelper;
use App\Http\Controllers\Controller;
use App\Models\Shop\ShopItemData;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;

class ItemsController extends Controller {

    public function getItem($itemId) {
        $item = ShopItem::find($itemId);

        Condition::precondition($itemId !== 'new' && !$item, 404,
            'No item with that ID exists');

        return response()->json([
            'shopItemId' => Value::objectProperty($item, 'shopItemId', 0),
            'title' => Value::objectProperty($item, 'title', ''),
            'description' => Value::objectProperty($item, 'description', ''),
            'rarity' => Value::objectProperty($item, 'rarity', null),
            'type' => Value::objectProperty($item, 'type', null),
            'data' => new ShopItemData(Value::objectProperty($item, 'data', null)),
            'subscriptions' => Subscription::orderBy('title', 'ASC')->get(['subscriptionId', 'title']),
            'createdAt' => $item ? $item->createdAt->timestamp : 0
        ]);
    }

    public function getItems(Request $request, $page) {
        $title = $request->input('filter');
        $type = $request->input('type');
        $items = ShopItem::orderBy('title', 'ASC');

        if ($title) {
            $items->where('title', 'LIKE', Value::getFilterValue($request, $title));
        }

        if ($type) {
            $items->where('type', $type);
        }

        return response()->json([
            'total' => DataHelper::getPage($items->count()),
            'page' => $page,
            'items' => $items->take($this->perPage)->skip(DataHelper::getOffset($page))->get()->map(function ($item) {
                return [
                    'shopItemId' => $item->shopItemId,
                    'title' => $item->title,
                    'description' => $item->description,
                    'rarity' => $item->rarity,
                    'type' => $item->type
                ];
            })
        ]);
    }
}
