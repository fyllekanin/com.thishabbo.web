<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Config;

class ConfigHelper {
    // Config files
    private static $PERMISSIONS = 'permissions';
    private static $TEMPLATES = 'templates';
    private static $SETTINGS = 'settings';
    private static $ARCADE = 'arcade';
    private static $SHOP = 'shop';

    public static function getForumPermissions() {
        return (object)Config::get(self::$PERMISSIONS . '.FORUM');
    }

    public static function getSitecpConfig() {
        return (object)Config::get(self::$PERMISSIONS . '.SITECP');
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
        return (object)Config::get(self::$SHOP . '.TYPES');
    }

    public static function getRaritiesConfig() {
        return (object)Config::get(self::$SHOP . '.RARITIES');
    }

    public static function getSubscriptionOptions() {
        return (object)Config::get(self::$SHOP . '.SUBSCRIPTION_OPTIONS');
    }

    public static function getNamePositionOptions() {
        return (object)Config::get(self::$SHOP . '.NAME_POSITIONS');
    }

    public static function getAccoladeTypes() {
        return Config::get(self::$SETTINGS . '.ACCOLADE_TYPES');
    }

    public static function getRegex() {
        return (object)Config::get(self::$SETTINGS . '.REGEX');
    }

    public static function getUserUpdateTypes() {
        return (object)Config::get(self::$SETTINGS . '.USER_UPDATE_TYPES');
    }

    public static function getTimetable() {
        return Config::get(self::$SETTINGS . '.TIMETABLE');
    }

    public static function getGithubSettings() {
        return (object)Config::get(self::$SETTINGS . '.GITHUB');
    }

    public static function getCostSettings() {
        return (object)Config::get(self::$SETTINGS . '.COSTS');
    }
}
