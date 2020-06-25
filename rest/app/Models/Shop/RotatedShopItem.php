<?php

namespace App\Models\Shop;

use App\Utils\Value;
use Exception;

class RotatedShopItem {
    public $shopItemId;
    public $credits;

    public function __construct($data = null) {
        try {
            $data = json_decode($data);
        } catch (Exception $exception) {
            $data = (object) [];
        }

        $this->shopItemId = Value::objectProperty($data, 'shopItemId', 0);
        $this->credits = Value::objectProperty($data, 'credits', 0);
    }
}
