<?php

namespace App\Constants;

use ReflectionClass;
use ReflectionException;

class RadioServerTypes {
    const SHOUT_CAST_V1 = 'shoutCastV1';
    const SHOUT_CAST_V2 = 'shoutCastV2';
    const ICE_CAST_V2 = 'iceCastV2';

    public static function isValidType($type) {
        try {
            foreach (self::getAllConstants() as $serverType) {
                if ($serverType == $type) {
                    return true;
                }
            }
            return false;
        } catch (ReflectionException $e) {
            return false;
        }
    }

    /**
     * @return array
     * @throws ReflectionException
     */
    public static function getAllConstants() {
        return (new ReflectionClass(get_class()))->getConstants();
    }
}
