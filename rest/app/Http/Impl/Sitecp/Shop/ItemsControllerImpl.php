<?php

namespace App\Http\Impl\Sitecp\Shop;

use App\EloquentModels\Badge;
use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserItem;
use App\Helpers\ConfigHelper;
use App\Utils\Condition;
use Illuminate\Http\Request;

class ItemsControllerImpl {

    public function giveCreatorItem($item) {
        $types = ConfigHelper::getTypesConfig();
        if (!in_array($item->type, [$types->nameIcon, $types->nameEffect])) {
            return;
        }

        $userItem = new UserItem([
            'type' => $item->type,
            'userId' => $item->createdBy,
            'itemId' => $item->shopItemId
        ]);
        $userItem->save();
    }

    public function validateBasicItem($data) {
        $types = array_map(function ($type) {
            return $type;
        }, (array)ConfigHelper::getTypesConfig());
        $rarities = array_map(function ($rarity) {
            return $rarity;
        }, (array)ConfigHelper::getRaritiesConfig());

        Condition::precondition(!isset($data->title) || empty($data->title), 400,
            'Title needs to be set!');
        Condition::precondition(!isset($data->description) || empty($data->description), 400,
            'Description needs to be set!');
        Condition::precondition(!isset($data->title) || empty($data->title), 400,
            'Title needs to be set!');
        Condition::precondition(!isset($data->type) || empty($data->type), 400,
            'Type needs to be set!');
        Condition::precondition(!isset($data->rarity) || empty($data->rarity), 400,
            'Rarity needs to be set!');

        Condition::precondition(!in_array($data->type, $types), 400,
            'Type is not a valid type!');
        Condition::precondition(!in_array($data->rarity, $rarities), 400,
            'Rarity is not a valid type!');
        Condition::precondition(isset($data->createdBy) && !empty($data->createdBy) && User::withNickname($data->createdBy)->count() == 0,
            400, 'No user with that nickname!');
    }

    public function validateSpecificItem(Request $request, $data) {
        $types = ConfigHelper::getTypesConfig();
        switch ($data->type) {
            case $types->nameIcon:
                $this->validateNameIcon($request, $data);
                break;
            case $types->nameEffect:
                $this->validateNameEffect($request, $data);
                break;
            case $types->badge:
                $this->validateBadge($data);
                break;
            case $types->subscription:
                $this->validateSubscription($data);
                break;
        }
    }

    public function typeHaveImage($data) {
        $types = ConfigHelper::getTypesConfig();
        return in_array($data->type, [$types->nameIcon, $types->nameEffect]);
    }

    public function uploadImage($request, $shopItemId) {
        $image = $request->file('image');
        $fileName = $shopItemId . '.gif';
        $destination = base_path('/public/rest/resources/images/shop');
        $image->move($destination, $fileName);
    }

    private function validateNameIcon(Request $request, $data) {
        if ($data->createdAt && !$request->has('image')) {
            return;
        }
        Condition::precondition(!$request->has('image'), 400,
            'Image needs to be present!');
        $request->validate([
            'image' => 'required|mimes:jpg,jpeg,bmp,png,gif|dimensions:max_width=16,max_height=16',
        ]);
    }

    private function validateNameEffect(Request $request, $data) {
        if ($data->createdAt && !$request->has('image')) {
            return;
        }
        Condition::precondition(!$request->has('image'), 400,
            'Image needs to be present!');
        $request->validate([
            'image' => 'required|mimes:jpg,jpeg,bmp,png,gif|dimensions:max_width=32,max_height=32',
        ]);
    }

    private function validateBadge($data) {
        Condition::precondition(Badge::where('badgeId', $data->data->badgeId)->count() == 0,
            404, 'No badge with that ID');
    }

    private function validateSubscription($data) {
        Condition::precondition(!is_numeric($data->data->subscriptionTime), 400,
            'Subscription duration is invalid!');
        Condition::precondition(Subscription::where('subscriptionId', $data->data->subscriptionId)->count() == 0,
            404, 'No subscription with that ID!');
    }
}