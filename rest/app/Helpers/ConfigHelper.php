<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Config;

class ConfigHelper {
    // Config files
    private static $PERMISSIONS = 'permissions';
    private static $TEMPLATES = 'templates';
    private static $SETTINGS = 'settings';
    private static $ARCADE = 'arcade';
    private static $ITEMS = 'items';

    public static function getForumConfig() {
        return (object)Config::get(self::$PERMISSIONS . '.FORUM');
    }

    public static function getAdminConfig() {
        return (object)Config::get(self::$PERMISSIONS . '.ADMIN');
    }

    public static function getPostBitConfig() {
        return (object)Config::get(self::$PERMISSIONS . '.POST_BIT_OPTIONS');
    }

    public static function getGroupOptionsConfig() {
        return (object)Config::get(self::$PERMISSIONS . '.GROUP_OPTIONS');
    }

    public static function getForumOptionsConfig() {
        return (object)Config::get(self::$PERMISSIONS . '.FORUM_OPTIONS');
    }

    public static function getStaffConfig() {
        return (object)Config::get(self::$PERMISSIONS . '.STAFF');
    }

    public static function getCategoryTemplatesConfig() {
        return (object)Config::get(self::$TEMPLATES . '.CATEGORY_TEMPLATES');
    }

    public static function getIgnoredNotificationsConfig() {
        return (object)Config::get(self::$SETTINGS . '.IGNORED_NOTIFICATIONS');
    }

    public static function getKeyConfig() {
        return (object)Config::get(self::$SETTINGS . '.KEYS');
    }

    public static function getGameTypesConfig() {
        return (object)Config::get(self::$ARCADE . '.GAME_TYPES');
    }

    public static function getTypesConfig() {
        return (object)Config::get(self::$ITEMS . '.TYPES');
    }
}
