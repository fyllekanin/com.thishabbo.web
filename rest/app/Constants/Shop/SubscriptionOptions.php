<?php

namespace App\Constants\Shop;

class SubscriptionOptions {

    const CUSTOM_NAME_COLOR = 1;
    const NAME_POSITION = 2;
    const IS_LISTED = 4;
    const CUSTOM_BAR = 8;

    public static function getAsOptionList() {
        return [
            'canHaveCustomNameColor' => self::CUSTOM_NAME_COLOR,
            'canMoveNamePosition' => self::NAME_POSITION,
            'isListed' => self::IS_LISTED,
            'canHaveCustomBar' => self::CUSTOM_BAR
        ];
    }
}
