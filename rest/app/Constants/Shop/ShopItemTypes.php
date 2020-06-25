<?php

namespace App\Constants\Shop;

class ShopItemTypes {

    const BADGE = 1;
    const NAME_ICON = 2;
    const NAME_EFFECT = 3;
    const SUBSCRIPTION = 4;

    public static function isUserItem(int $type) {
        return in_array($type, [self::BADGE, self::NAME_ICON, self::NAME_EFFECT]);
    }

    public static function isValid(int $type) {
        return in_array($type, [self::BADGE, self::NAME_ICON, self::NAME_EFFECT, self::SUBSCRIPTION]);
    }
}
