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
    private static $PROXIES = 'proxies';

    public static function getProxies() {
        return Config::get(self::$PROXIES . '.PROXIES');
    }

    public static function getForumConfig () {
        return Config::get(self::$PERMISSIONS . '.FORUM');
    }

    public static function getAdminConfig () {
        return Config::get(self::$PERMISSIONS . '.ADMIN');
    }

    public static function getPostBitConfig () {
        return Config::get(self::$PERMISSIONS . '.POST_BIT_OPTIONS');
    }

    public static function getGroupOptionsConfig () {
        return Config::get(self::$PERMISSIONS . '.GROUP_OPTIONS');
    }

    public static function getForumOptionsConfig () {
        return Config::get(self::$PERMISSIONS . '.FORUM_OPTIONS');
    }

    public static function getStaffConfig () {
        return Config::get(self::$PERMISSIONS . '.STAFF');
    }

    public static function getCategoryTemplatesConfig () {
        return Config::get(self::$TEMPLATES . '.CATEGORY_TEMPLATES');
    }

    public static function getIgnoredNotificationsConfig () {
        return Config::get(self::$SETTINGS . '.IGNORED_NOTIFICATIONS');
    }

    public static function getKeyConfig () {
        return Config::get(self::$SETTINGS . '.KEYS');
    }

    public static function getGameTypesConfig () {
        return Config::get(self::$ARCADE . '.GAME_TYPES');
    }

    public static function getTypesConfig () {
        return Config::get(self::$ITEMS . '.TYPES');
    }
}
