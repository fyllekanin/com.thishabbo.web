<?php

namespace App\Constants\Shop;

class NamePositions {

    const TOP_OUTSIDE = 0;
    const BOTTOM_OUTSIDE = 1;
    const TOP_INSIDE = 2;
    const BOTTOM_INSIDE = 3;

    public static function isValid(int $position) {
        return in_array($position, [self::TOP_OUTSIDE, self::BOTTOM_OUTSIDE, self::TOP_INSIDE, self::BOTTOM_INSIDE]);
    }
}
