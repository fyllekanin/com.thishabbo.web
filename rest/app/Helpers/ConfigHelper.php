<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Config;

class ConfigHelper {

    // Config files
    private static $SETTINGS = 'settings';

    public static function getKeyConfig() {
        return (object) Config::get(self::$SETTINGS.'.KEYS');
    }

    public static function getAccoladeTypes() {
        return Config::get(self::$SETTINGS.'.ACCOLADE_TYPES');
    }

    public static function getTimetable() {
        return Config::get(self::$SETTINGS.'.TIMETABLE');
    }
}
