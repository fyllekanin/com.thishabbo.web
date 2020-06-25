<?php

namespace App\Constants\Shop;

class ShopRarities {

    const COMMON = 80;
    const RARE = 50;
    const EPIC = 30;
    const LEGENDARY = 10;

    public static function isValid(int $rarity) {
        return in_array($rarity, [self::COMMON, self::RARE, self::EPIC, self::LEGENDARY]);
    }
}
