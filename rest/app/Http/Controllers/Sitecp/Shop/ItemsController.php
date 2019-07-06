<?php

namespace App\Http\Controllers\Sitecp\Shop;

use App\EloquentModels\Badge;
use App\EloquentModels\Shop\ShopItem;
use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\User\User;
use App\Helpers\DataHelper;
use App\Http\Controllers\Controller;
use App\Http\Impl\Sitecp\Shop\ItemsControllerImpl;
use App\Logger;
use App\Models\Logger\Action;
use App\Models\Shop\ShopItemData;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;

class ItemsController extends Controller {
    private $myImpl;

    public function __construct(ItemsControllerImpl $impl) {
        parent::__construct();
        $this->myImpl = $impl;
    }

    public function getBadges(Request $request, $page) {
        $badges = Badge::orderBy('name', 'ASC')->where('isSystem', false);
        $filter = $request->input('filter');

        if ($filter) {
            $badges->where('name', 'LIKE', Value::getFilterValue($request, $filter));
        }
        $total = DataHelper::getPage($badges->count());

        return response()->json([
            'total' => $total,
            'page' => $page,
            'items' => $badges->take($this->perPage)->skip(DataHelper::getOffset($page))
                ->get(['badgeId', 'name', 'points', 'updatedAt'])
        ]);
    }

    public function deleteItem(Request $request, $shopItemId) {
        $user = $request->get('auth');
        $item = ShopItem::find($shopItemId);
        Condition::precondition(!$item, 404, 'No shop item with that ID');

        $item->isDeleted = 1;
        $item->save();

        Logger::sitecp($user->userId, $request->ip(), Action::DELETED_SHOP_ITEM);
        return response()->json();
    }

    public function updateItem(Request $request, $shopItemId) {
        $user = $request->get('auth');
        $data = json_decode($request->input('data'), false);
        $item = ShopItem::find($shopItemId);

        Condition::precondition(!$item, 404, 'No shop item with that ID');
        Condition::precondition($item->type != $data->type, 400, 'You are not allowed to change the type');
        $this->myImpl->validateBasicItem($data);
        $this->myImpl->validateSpecificItem($request, $data);

        $item->title = $data->title;
        $item->description = $data->description;
        $item->rarity = $data->rarity;
        $item->data = json_encode($data->data);
        $item->save();

        Logger::sitecp($user->userId, $request->ip(), Action::UPDATED_SHOP_ITEM);
        return $this->getItem($shopItemId);
    }

    public function createItem(Request $request) {
        $user = $request->get('auth');
        $data = json_decode($request->input('data'), false);

        $this->myImpl->validateBasicItem($data);
        $this->myImpl->validateSpecificItem($request, $data);

        $item = new ShopItem([
            'title' => $data->title,
            'description' => $data->description,
            'rarity' => $data->rarity,
            'type' => $data->type,
            'data' => json_encode($data->data),
            'createdBy' => Value::objectProperty($data, 'createdBy', 0)
        ]);
        $item->save();

        if ($this->myImpl->typeHaveImage($data)) {
            try {
                $this->myImpl->uploadImage($request, $item->shopItemId);
            } catch (\Exception $e) {
                $item->delete();
                Condition::precondition(true, 400, 'Could not upload image');
            }
        }

        if ($item->createdBy > 0) {
            $this->myImpl->giveCreatorItem($item);
        }
        Logger::sitecp($user->userId, $request->ip(), Action::CREATED_SHOP_ITEM);
        return $this->getItem($item->shopItemId);
    }

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
            'createdAt' => $item ? $item->createdAt->timestamp : 0,
            'createdBy' => $item && $item->createdBy > 0 ? User::where('userId', $item->createdBy)->value('nickname') : null
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
                    'type' => $item->type,
                    'data' => new ShopItemData(Value::objectProperty($item, 'data', null)),
                ];
            })
        ]);
    }
}
