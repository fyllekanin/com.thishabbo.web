<?php

namespace App\Models\Shop;

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

        $this->subscriptionTime = $data->subscriptionTime;
        $this->subscriptionId = $data->subscriptionId;
        $this->badgeId = $data->badgeId;
    }

    public function jsonSerialize() {
        return (object)[
            'subscriptionTime' => $this->subscriptionTime,
            'subscriptionId' => $this->subscriptionId
        ];
    }
}