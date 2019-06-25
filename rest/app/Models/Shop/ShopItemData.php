<?php

namespace App\Models\Shop;

/**
 * @SuppressWarnings(PHPMD.ShortVariable)
 */
class ShopItemData {
    public $subscriptionTime;
    public $subscriptionId;

    public function __construct($data) {
        try {
            $data = json_decode($data);
            $this->subscriptionTime = $data->subscriptionTime;
            $this->subscriptionId = $data->subscriptionId;
        } catch (\Exception $exception) {

        }
    }

    public function jsonSerialize() {
        return (object)[
            'subscriptionTime' => $this->subscriptionTime,
            'subscriptionId' => $this->subscriptionId
        ];
    }
}