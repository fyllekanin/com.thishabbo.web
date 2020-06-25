<?php

namespace App\Http\Controllers\Sitecp\Shop;

use App\Constants\LogType;
use App\Constants\Shop\ShopItemTypes;
use App\Constants\Shop\ShopRarities;
use App\EloquentModels\Badge;
use App\EloquentModels\Shop\ShopItem;
use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserItem;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Shop\ShopItemData;
use App\Repositories\Repository\SettingRepository;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use App\Utils\Value;
use Exception;
use Illuminate\Http\Request;

class ItemsController extends Controller {
    private $mySettingRepository;

    public function __construct(SettingRepository $settingRepository) {
        parent::__construct();
        $this->mySettingRepository = $settingRepository;
    }

    public function deleteUserItem(Request $request, $userItemId) {
        $user = $request->get('auth');
        $userItem = UserItem::find($userItemId);
        Condition::precondition(!$userItem, 404, 'No user item with that ID');

        $userData = UserHelper::getUserDataOrCreate($userItem->userId);
        $userData->iconId = $userData->iconId == $userItem->itemId ? null : $userData->iconId;
        $userData->effectId = $userData->effectId == $userItem->itemId ? null : $userData->effectId;
        $userData->save();

        $logData = [
            'shopItemId' => $userItem->itemId,
            'userId' => $userItem->userId
        ];
        $userItem->delete();

        Logger::sitecp($user->userId, $request->ip(), LogType::DELETED_USER_ITEM, $logData);
        return response()->json();
    }

    public function createUserItem(Request $request, $itemId) {
        $user = $request->get('auth');
        $nicknames = $request->input('nicknames');
        $shopItem = ShopItem::find($itemId);
        Condition::precondition(!$shopItem, 404, 'No shop item with that ID');
        Condition::precondition(
            !$this->canItemTypeByGiven($shopItem->type), 400,
            'This item can not be given from here!'
        );

        $receiverIds = [];
        $items = [];
        foreach ($nicknames as $nickname) {
            $receiver = User::withNickname($nickname)->first();
            Condition::precondition(!$receiver, 404, 'No user with the nickname '.$nickname);

            $receiverIds[] = $receiver->userId;
            $userItem = new UserItem(
                [
                    'type' => $shopItem->type,
                    'userId' => $receiver->userId,
                    'itemId' => $shopItem->shopItemId,
                ]
            );
            $userItem->save();
            $items[] = [
                'userItemId' => $userItem->userItemId,
                'user' => UserHelper::getSlimUser($userItem->userId),
                'createdAt' => $userItem->createdAt->timestamp
            ];
        }

        Logger::sitecp(
            $user->userId,
            $request->ip(),
            LogType::GAVE_USERS_ITEM,
            ['receiverIds' => $receiverIds, 'shopItemId' => $shopItem->shopItemId],
            $shopItem->shopItemId
        );
        return response()->json($items);
    }

    public function getItemUsers($itemId) {
        $shopItem = ShopItem::find($itemId);
        Condition::precondition(!$shopItem, 404, 'No shop item with that ID');
        $userItems = UserItem::where('itemId', $itemId)->where('type', $shopItem->type)
            ->orderBy('updatedAt', 'DESC')->get();

        return response()->json(
            [
                'itemId' => $shopItem->shopItemId,
                'items' => $userItems->map(
                    function ($userItem) {
                        return [
                            'userItemId' => $userItem->userItemId,
                            'user' => UserHelper::getSlimUser($userItem->userId),
                            'createdAt' => $userItem->createdAt->timestamp
                        ];
                    }
                )
            ]
        );
    }

    public function getBadges(Request $request, $page) {
        $badges = Badge::orderBy('name', 'ASC')->where('isSystem', false);
        $filter = $request->input('filter');

        if ($filter) {
            $badges->where('name', 'LIKE', Value::getFilterValue($request, $filter));
        }
        $total = PaginationUtil::getTotalPages($badges->count());

        return response()->json(
            [
                'total' => $total,
                'page' => $page,
                'items' => $badges->take($this->perPage)->skip(PaginationUtil::getOffset($page))
                    ->get(['badgeId', 'name', 'points', 'updatedAt'])
            ]
        );
    }

    public function deleteItem(Request $request, $shopItemId) {
        $user = $request->get('auth');
        $item = ShopItem::find($shopItemId);
        Condition::precondition(!$item, 404, 'No shop item with that ID');

        $item->isDeleted = 1;
        $item->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::DELETED_SHOP_ITEM, [], $item->shopItemId);
        return response()->json();
    }

    public function updateItem(Request $request, $shopItemId) {
        $user = $request->get('auth');
        $data = json_decode($request->input('data'), false);
        $item = ShopItem::find($shopItemId);

        Condition::precondition(!$item, 404, 'No shop item with that ID');
        Condition::precondition($item->type != $data->type, 400, 'You are not allowed to change the type');
        $this->validateBasicItem($data);
        $this->validateSpecificItem($request, $data);

        $item->title = $data->title;
        $item->description = $data->description;
        $item->rarity = $data->rarity;
        $item->data = json_encode($data->data);
        $item->save();

        Logger::sitecp($user->userId, $request->ip(), LogType::UPDATED_SHOP_ITEM, [], $item->shopItemId);
        return $this->getItem($shopItemId);
    }

    public function createItem(Request $request) {
        $user = $request->get('auth');
        $data = json_decode($request->input('data'), false);

        $this->validateBasicItem($data);
        $this->validateSpecificItem($request, $data);

        $isCreatedByDefined = isset($data->createdBy) && !empty($data->createdBy);
        $item = new ShopItem(
            [
                'title' => $data->title,
                'description' => $data->description,
                'rarity' => $data->rarity,
                'type' => $data->type,
                'data' => json_encode($data->data),
                'createdBy' => $isCreatedByDefined ? User::withNickname($data->createdBy)->value('userId') : 0
            ]
        );
        $item->save();

        if ($this->typeHaveImage($data)) {
            try {
                $this->uploadImage($request, $item->shopItemId);
            } catch (Exception $e) {
                $item->delete();
                Condition::precondition(true, 400, 'Could not upload image');
            }
        }

        if ($item->createdBy > 0) {
            $this->giveCreatorItem($item, $data->data);
        }
        Logger::sitecp($user->userId, $request->ip(), LogType::CREATED_SHOP_ITEM, [], $item->shopItemId);
        return $this->getItem($item->shopItemId);
    }

    public function getItem($itemId) {
        $item = ShopItem::find($itemId);

        Condition::precondition(
            $itemId !== 'new' && !$item, 404,
            'No item with that ID exists'
        );

        return response()->json(
            [
                'shopItemId' => Value::objectProperty($item, 'shopItemId', 0),
                'title' => Value::objectProperty($item, 'title', ''),
                'description' => Value::objectProperty($item, 'description', ''),
                'rarity' => Value::objectProperty($item, 'rarity', null),
                'type' => Value::objectProperty($item, 'type', null),
                'data' => new ShopItemData(Value::objectProperty($item, 'data', null)),
                'subscriptions' => Subscription::orderBy('title', 'ASC')->get(['subscriptionId', 'title']),
                'createdAt' => $item ? $item->createdAt->timestamp : 0,
                'createdBy' => $item && $item->createdBy > 0 ? User::where('userId', $item->createdBy)->value('nickname') : null
            ]
        );
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

        return response()->json(
            [
                'total' => PaginationUtil::getTotalPages($items->count(), $this->bigPerPage),
                'page' => $page,
                'items' => $items->take($this->bigPerPage)->skip(PaginationUtil::getOffset($page, $this->bigPerPage))->get()->map(
                    function ($item) {
                        return [
                            'shopItemId' => $item->shopItemId,
                            'title' => $item->title,
                            'description' => $item->description,
                            'rarity' => $item->rarity,
                            'type' => $item->type,
                            'data' => new ShopItemData(Value::objectProperty($item, 'data', null)),
                        ];
                    }
                )
            ]
        );
    }

    private function canItemTypeByGiven($type) {
        return in_array($type, [ShopItemTypes::NAME_ICON, ShopItemTypes::NAME_EFFECT]);
    }

    private function giveCreatorItem($item, $data) {
        $userItem = new UserItem(
            [
                'type' => $item->type,
                'userId' => $item->createdBy,
                'itemId' => ShopItemTypes::BADGE == $item->type ? $data->badgeId : $item->shopItemId
            ]
        );
        $userItem->save();
    }

    private function validateBasicItem($data) {
        Condition::precondition(
            !isset($data->title) || empty($data->title), 400,
            'Title needs to be set!'
        );
        Condition::precondition(
            !isset($data->description) || empty($data->description), 400,
            'Description needs to be set!'
        );
        Condition::precondition(
            !isset($data->title) || empty($data->title), 400,
            'Title needs to be set!'
        );
        Condition::precondition(
            !isset($data->type) || empty($data->type), 400,
            'Type needs to be set!'
        );
        Condition::precondition(
            !isset($data->rarity) || empty($data->rarity), 400,
            'Rarity needs to be set!'
        );

        Condition::precondition(
            !ShopItemTypes::isValid($data->type), 400,
            'Type is not a valid type!'
        );
        Condition::precondition(
            !ShopRarities::isValid($data->rarity), 400,
            'Rarity is not a valid type!'
        );
        Condition::precondition(
            isset($data->createdBy) && !empty($data->createdBy) && User::withNickname($data->createdBy)->count() == 0,
            400, 'No user with that nickname!'
        );
    }

    private function validateSpecificItem(Request $request, $data) {
        switch ($data->type) {
            case ShopItemTypes::NAME_ICON:
                $this->validateNameIcon($request, $data);
                break;
            case ShopItemTypes::NAME_EFFECT:
                $this->validateNameEffect($request, $data);
                break;
            case ShopItemTypes::BADGE:
                $this->validateBadge($data);
                break;
            case ShopItemTypes::SUBSCRIPTION:
                $this->validateSubscription($data);
                break;
        }
    }

    private function typeHaveImage($data) {
        return in_array($data->type, [ShopItemTypes::NAME_ICON, ShopItemTypes::NAME_EFFECT]);
    }

    public function uploadImage($request, $shopItemId) {
        $image = $request->file('image');
        $fileName = $shopItemId.'.gif';
        $target = $this->mySettingRepository->getResourcePath('images/shop');
        $image->move($target, $fileName);
    }

    private function validateNameIcon(Request $request, $data) {
        if ($data->createdAt && !$request->has('image')) {
            return;
        }
        Condition::precondition(
            !$request->has('image'), 400,
            'Image needs to be present!'
        );
        $request->validate(
            [
                'image' => 'required|mimes:jpg,jpeg,bmp,png,gif|dimensions:max_width=16,max_height=16',
            ], ['image' => 'Given image is not valid']
        );
    }

    private function validateNameEffect(Request $request, $data) {
        if ($data->createdAt && !$request->has('image')) {
            return;
        }
        Condition::precondition(
            !$request->has('image'), 400,
            'Image needs to be present!'
        );
        $request->validate(
            [
                'image' => 'required|mimes:jpg,jpeg,bmp,png,gif|dimensions:max_width=32,max_height=32',
            ], ['image' => 'Given image is not valid']
        );
    }

    private function validateBadge($data) {
        Condition::precondition(
            Badge::where('badgeId', $data->data->badgeId)->count() == 0,
            404, 'No badge with that ID'
        );
    }

    private function validateSubscription($data) {
        Condition::precondition(
            !is_numeric($data->data->subscriptionTime), 400,
            'Subscription duration is invalid!'
        );
        Condition::precondition(
            Subscription::where('subscriptionId', $data->data->subscriptionId)->count() == 0,
            404, 'No subscription with that ID!'
        );
    }
}
