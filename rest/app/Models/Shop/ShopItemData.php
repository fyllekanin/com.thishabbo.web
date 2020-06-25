<?php

namespace App\Models\Shop;

use App\Utils\Value;
use Exception;

class ShopItemData {
    public $subscriptionTime;
    public $subscriptionId;
    public $badgeId;

    public function __construct($data) {
        try {
            $data = json_decode($data);
        } catch (Exception $exception) {
            $data = (object) [];
        }

        $this->subscriptionTime = Value::objectProperty($data, 'subscriptionTime', 0);
        $this->subscriptionId = Value::objectProperty($data, 'subscriptionId', 0);
        $this->badgeId = Value::objectProperty($data, 'badgeId', 0);
    }
}
