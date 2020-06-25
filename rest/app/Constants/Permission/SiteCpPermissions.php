<?php

namespace App\Constants\Permission;

class SiteCpPermissions {

    const CAN_MANAGE_BADGES = 1;
    const CAN_MANAGE_CATEGORIES = 2;
    const CAN_MANAGE_CATEGORY_PERMISSIONS = 4;
    const CAN_MANAGE_GROUPS = 8;
    const CAN_EDIT_WEBSITE_SETTINGS = 16;
    const CAN_MANAGE_SUBSCRIPTIONS = 32;
    const CAN_APPROVE_PUBLIC_GROUPS = 64;
    const CAN_MANAGE_BBCODES = 128;
    const CAN_MANAGE_PREFIXES = 256;
    const CAN_MANAGE_GROUPS_LIST = 512;
    const CAN_EDIT_USER_BASICS = 1024;
    const CAN_EDIT_USER_ADVANCED = 2048;
    const CAN_READ_SERVER_LOGS = 4096;
    const CAN_BAN_USERS = 8192;
    const CAN_MERGE_USERS = 16384;
    const CAN_MANAGE_BETTING = 32768;
    const CAN_MANAGE_CREDITS = 65536;
    const CAN_SEE_IPS = 131072;
    const CAN_MANAGE_INFRACTIONS = 262144;
    const CAN_DO_INFRACTIONS = 524288;
    const CAN_SEE_LOGS = 1048576;
    const CAN_MANAGE_SHOP = 2097152;
    const CAN_PASS_PRIVATE_PROFILES = 4194304;
    const CAN_REMOVE_USERS_ESSENTIALS = 8388608;
    const CAN_MODERATE_VISITOR_MESSAGES = 16777216;
    const CAN_VIEW_STATISTICS = 33554432;
    const CAN_EDIT_USERS_GROUPS = 67108864;
    const CAN_MANAGE_THREAD_TEMPLATES = 134217728;

    public static function getAsOptions() {
        return [
            'canManageBadges' => self::CAN_MANAGE_BADGES,
            'canManageCategories' => self::CAN_MANAGE_CATEGORIES,
            'canManageCategoryPermissions' => self::CAN_MANAGE_CATEGORY_PERMISSIONS,
            'canManageGroups' => self::CAN_MANAGE_GROUPS,
            'canEditWebsiteSettings' => self::CAN_EDIT_WEBSITE_SETTINGS,
            'canManageSubscriptions' => self::CAN_MANAGE_SUBSCRIPTIONS,
            'canApprovePublicGroups' => self::CAN_APPROVE_PUBLIC_GROUPS,
            'canManageBBcodes' => self::CAN_MANAGE_BBCODES,
            'canManagePrefixes' => self::CAN_MANAGE_PREFIXES,
            'canManageGroupsList' => self::CAN_MANAGE_GROUPS_LIST,
            'canEditUsersBasic' => self::CAN_EDIT_USER_BASICS,
            'canEditUsersAdvanced' => self::CAN_EDIT_USER_ADVANCED,
            'canReadServerLogs' => self::CAN_READ_SERVER_LOGS,
            'canBanUsers' => self::CAN_BAN_USERS,
            'canMergeUsers' => self::CAN_MERGE_USERS,
            'canManageBetting' => self::CAN_MANAGE_BETTING,
            'canManageCredits' => self::CAN_MANAGE_CREDITS,
            'canSeeIps' => self::CAN_SEE_IPS,
            'canManageInfractions' => self::CAN_MANAGE_INFRACTIONS,
            'canDoInfractions' => self::CAN_DO_INFRACTIONS,
            'canSeeLogs' => self::CAN_SEE_LOGS,
            'canManageShop' => self::CAN_MANAGE_SHOP,
            'canPassPrivateProfiles' => self::CAN_PASS_PRIVATE_PROFILES,
            'canRemoveUsersEssentials' => self::CAN_REMOVE_USERS_ESSENTIALS,
            'canModerateVisitorMessages' => self::CAN_MODERATE_VISITOR_MESSAGES,
            'canViewStatistics' => self::CAN_VIEW_STATISTICS,
            'canEditUsersGroups' => self::CAN_EDIT_USERS_GROUPS,
            'canManageThreadTemplates' => self::CAN_MANAGE_THREAD_TEMPLATES
        ];
    }
}
