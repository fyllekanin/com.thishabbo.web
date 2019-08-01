<?php

namespace App\Models\Shop;

use App\Utils\Value;

/**
 * @SuppressWarnings(PHPMD.ShortVariable)
 */
class ShopItemData {
    public $subscriptionTime;
    public $subscriptionId;
    public $badgeId;

    public function __construct($data) {
        try {
            $data = json_decode($data);
        } catch (\Exception $exception) {
            $data = (object)[];
        }

        $this->subscriptionTime = Value::objectProperty($data, 'subscriptionTime', 0);
        $this->subscriptionId = Value::objectProperty($data, 'subscriptionId', 0);
        $this->badgeId = Value::objectProperty($data, 'badgeId', 0);
    }

    public function jsonSerialize() {
        return (object)[
            'subscriptionTime' => $this->subscriptionTime,
            'subscriptionId' => $this->subscriptionId
        ];
    }
}